import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import type { UserProfile } from '@/lib/types';
import bcrypt from 'bcryptjs';
import type { User as NextAuthUser } from 'next-auth'; // To avoid conflict with our UserProfile

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const client = await clientPromise;
        const db = client.db();
        const usersCollection = db.collection('users'); // NextAuth adapter's user collection

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // Ensure user.hashedPassword exists. Users signed up via Google won't have it.
        if (!user.hashedPassword) {
            throw new Error("This account was created using a social login. Please sign in with Google.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }
        
        // Return user object that NextAuth expects
        // The adapter handles the full user object structure.
        // We need to ensure the returned object is compatible.
        // The adapter's findUserByEmail should return the correct structure.
        // For authorize, we return a subset that will be merged by NextAuth.
        return {
          id: user._id.toString(), // Important: convert ObjectId to string
          email: user.email,
          name: user.name,
          image: user.image,
        } as NextAuthUser; // Cast to NextAuthUser type
      }
    })
  ],
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Custom error page for auth errors
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (user.id && user.email) {
        const db = (await clientPromise).db();
        const userProfilesCollection = db.collection<UserProfile>('userProfiles');
        
        let userProfile = await userProfilesCollection.findOne({ userId: user.id });

        if (!userProfile) {
          const newUserProfile: UserProfile = {
            userId: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
          };
          await userProfilesCollection.insertOne(newUserProfile);
        } else if (!userProfile.name && user.name) {
            await userProfilesCollection.updateOne(
                { userId: user.id },
                { $set: { name: user.name } }
            );
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise), 
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        if (!user.hashedPassword) {
            throw new Error("This account was created using a social login. Please sign in with Google.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);

        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }
        
        // Return user object that will be used in JWT callback
        return {
          id: user._id.toString(), 
          email: user.email,
          name: user.name,
          image: user.image,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt', // Changed from 'database' to 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // The 'user' object is available on initial sign-in
      // Persist the user ID from the database into the token
      if (account && user?.id) {
        token.id = user.id;
        // token.name, token.email, token.picture are usually populated by default
      }
      return token;
    },
    async session({ session, token }) {
      // The 'token' object is the decoded JWT from the 'jwt' callback
      // Assign the user ID from the token to the session.user object
      if (token?.id && session.user) {
        session.user.id = token.id;
        // session.user.name, email, image are typically populated from token by default
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (user.id && user.email) {
        const db = (await clientPromise).db();
        const userProfilesCollection = db.collection('userProfiles');
        
        let userProfile = await userProfilesCollection.findOne({ userId: user.id });

        if (!userProfile) {
          const newUserProfile = {
            userId: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            // Initialize other fields if necessary
          };
          await userProfilesCollection.insertOne(newUserProfile);
        } else if (!userProfile.name && user.name) {
            // If profile exists but name is missing, update it (e.g. after Google sign-in)
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

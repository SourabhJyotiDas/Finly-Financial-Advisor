import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import type { UserProfile } from '@/lib/types'; // Ensure UserProfile is correctly typed

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: 'database', // Using database strategy for session management
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    // error: '/auth/error', // Optional: custom error page
  },
  callbacks: {
    async session({ session, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // This event is triggered after a successful sign-in.
      // We can ensure a user profile exists here.
      // Note: `user` object comes from the adapter (MongoDB user document)
      if (user.id && user.email) {
        const db = (await clientPromise).db();
        const userProfilesCollection = db.collection<UserProfile>('userProfiles');
        
        let userProfile = await userProfilesCollection.findOne({ userId: user.id });

        if (!userProfile) {
          // Create a new profile if one doesn't exist
          const newUserProfile: UserProfile = {
            userId: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            // income: undefined, // Default values, let settings page handle this
            // financialGoals: 'Set your financial goals in Settings.', // Default
          };
          await userProfilesCollection.insertOne(newUserProfile);
        } else if (!userProfile.name && user.name) {
          // Update name if it was missing and Google provides it
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

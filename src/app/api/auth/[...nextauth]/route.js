import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/user';

export const authOptions = {
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email.");
        }

        if (!user.password) {
          throw new Error("This account was created using a social login. Please sign in with Google.");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }

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
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },


  callbacks: {
    async jwt({ token, user, account }) {
      console.log("-------> jwt comes first",user)
      if (account && user?._id) {
        token.id = user._id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        console.log("-------> session comes second",session.user)
        await connectToDatabase();
        let user = await User.findOne({ email: session.user?.email });
        session.user.id = user._id
     }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user?.email) {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {

          console.log("existingUser--->", existingUser)

          await User.create({
            name: user.name || user.email.split('@')[0],
            email: user.email,
            image: user.image,
            provider: 'google',
          });
        }
      }
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

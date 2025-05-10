import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id: string;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   * Also used by the `authorize` callback in `CredentialsProvider`.
   */
  interface User extends DefaultUser {
    id: string; // Ensure id is always present and is a string
    hashedPassword?: string; // For users registered with email/password
  }
}

// This is for the JWT callback, if you use JWT strategy (not used here with 'database' strategy)
// declare module "next-auth/jwt" {
//   interface JWT {
//     id?: string;
//     hashedPassword?: string;
//   }
// }

<<<<<<< HEAD
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
// import { saltAndHashPassword } from "@/utils/password";
=======
import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/user";
>>>>>>> 3446c28164d4dfde3ffa9a54a79847da661e415f

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string;
      /** The user's role. */
      role: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
<<<<<<< HEAD
  providers: [
    Google,
    // Credentials({
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   credentials: {
    //     email: {},
    //     password: {},
    //   },
    //   authorize: async (credentials) => {
    //     let user = null;

    //     // logic to salt and hash password
    //     const pwHash = saltAndHashPassword(credentials.password);

    //     // logic to verify if the user exists
    //     user = await getUserFromDb(credentials.email, pwHash);

    //     if (!user) {
    //       // No user found, so this is their first attempt to login
    //       // Optionally, this is also the place you could do a user registration
    //       throw new Error("Invalid credentials.");
    //     }

    //     // return user object with their profile data
    //     return user;
    //   },
    // }),
  ],
});
=======
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(), //year/month/day
        },
      });
    },
  },

  callbacks: {
    async signIn({ user, account }) {
      //allow OAuth without email verification

      if (account?.provider !== "credentials") {
        return true;
      }
      if (!user.id) {
        return false;
      }
      const existingUser = await getUserById(user.id);

      //Prevent sign in without email verification
      if (!existingUser?.emailVerified) {
        return false;
      }

      //TODO: Add 2FA check
      return true;
    },

    async session({ session, token }) {
      //Add id to session
      if (token.sub) {
        session.user.id = token.sub;
      }
      console.log("sessionToken", token);

      if (token.role && session.user) {
        if (typeof token.role === "string") {
          session.user.role = token.role;
        }
      }
      // session.user.address = "123 Fake St";

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await getUserById(token.sub);
      if (!existingUser) {
        return token;
      }
      token.role = existingUser.role;

      return token;
    },
  },
  ...authConfig,
});
>>>>>>> 3446c28164d4dfde3ffa9a54a79847da661e415f

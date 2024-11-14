import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/data/user";

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

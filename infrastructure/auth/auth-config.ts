import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../database/prisma";
import { sendPasswordResetEmail } from "../email/password-reset";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      const displayName = [
        (user as any).firstName,
        (user as any).lastName,
      ]
        .filter(Boolean)
        .join(' ')
        .trim() || undefined;

      await sendPasswordResetEmail({
        email: user.email,
        userName: displayName,
        resetUrl: url,
      });
    },
    resetPasswordTokenExpiresIn: 60 * 60,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CLIENT",
        required: false,
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      company: {
        type: "string",
        required: false,
      },
      isActive: {
        type: "boolean",
        defaultValue: true,
        required: false,
      },
      lastLoginAt: {
        type: "date",
        required: false,
      },
    },
  },
  advanced: {
    database: {
      generateId: () => {
        // Generate UUID v4
        return crypto.randomUUID();
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

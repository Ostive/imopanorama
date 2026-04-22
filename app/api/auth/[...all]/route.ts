import { auth } from "@/infrastructure/auth/auth-config";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { logger } from "@/infrastructure/logger/logger";

const handlers = toNextJsHandler(auth);

// Wrap POST to log sign-in attempts and update lastLoginAt
const originalPOST = handlers.POST;
export const POST = async (req: NextRequest) => {
  const url = new URL(req.url);

  if (url.pathname.includes('/sign-in/email')) {
    try {
      const body = await req.clone().json();
      logger.debug('🔐 Server received sign-in request', {
        email: body.email,
        hasPassword: !!body.password,
      });

      // Call the original handler
      const response = await originalPOST(req);

      // If login was successful (status 200), update lastLoginAt
      if (response.status === 200 && body.email) {
        try {
          await prisma.user.update({
            where: { email: body.email },
            data: { lastLoginAt: new Date() }
          });
          logger.info('✅ Updated lastLoginAt for user:', body.email);
        } catch (error) {
          logger.error('❌ Failed to update lastLoginAt:', error);
          // Don't fail the login if lastLoginAt update fails
        }
      }

      return response;
    } catch (e) {
      logger.error('Error in sign-in handler:', e);
      // Fallback to original handler
      return originalPOST(req);
    }
  }

  return originalPOST(req);
};

export const { GET } = handlers;

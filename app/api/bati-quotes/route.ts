/**
 * @module api/bati-quotes
 * @description BatiPanorama quote requests (public submission + admin listing).
 *
 * | Method | Auth       | Description                          |
 * |--------|------------|--------------------------------------|
 * | GET    | Admin      | List all quote requests              |
 * | POST   | Public *   | Submit a new quote request           |
 *
 * \* If the user is authenticated, their ID is attached to the quote.
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiQuoteRepository } from '@/infrastructure/database/repositories';
import { requireAdmin, requireAuth } from '@/infrastructure/auth/auth-guard';
import { validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { rateLimit } from '@/infrastructure/middleware/rate-limit';
import { logger } from '@/infrastructure/logger/logger';

/** Fields to expose when including the related user. */
const USER_SELECT = { select: { id: true, firstName: true, lastName: true, email: true } } as const;

// ---------------------------------------------------------------------------
// GET /api/bati-quotes  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const quotes = await batiQuoteRepository.findMany({
    include: { user: USER_SELECT },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ quotes });
});

// ---------------------------------------------------------------------------
// POST /api/bati-quotes
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const limited = await rateLimit(request, { scope: 'bati-quotes:post', limit: 3, windowMs: 60_000 });
  if (limited) return limited;

  const body = await request.json();

  const { BatipanoramaContactFormDataSchema } = await import('@/features/batipanorama/schemas/batipanorama.schema');
  const validation = BatipanoramaContactFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'La demande de devis contient des champs invalides');
  }

  const data = validation.data;

  // Attach user ID when the caller is authenticated (best-effort)
  let userId: string | undefined;
  try {
    const authResult = await requireAuth(request);
    if (authResult.authorized && authResult.session) {
      userId = authResult.session.user.id;
    }
  } catch {
    logger.debug('User not authenticated – creating quote without userId');
  }

  const quote = await batiQuoteRepository.create(
    {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      projectType: data.projectType.trim(),
      budget: data.budget.trim(),
      location: data.location.trim(),
      message: data.message.trim(),
      userId,
    },
    { user: USER_SELECT },
  );

  return NextResponse.json(quote, { status: 201 });
});

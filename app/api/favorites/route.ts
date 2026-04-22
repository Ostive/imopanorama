/**
 * @module api/favorites
 * @description Retrieve the current user's favourited properties.
 *
 * | Method | Auth       | Description                          |
 * |--------|------------|--------------------------------------|
 * | GET    | Logged-in  | List the user's favourite properties  |
 */

import { NextResponse } from 'next/server';
import { favoritesServerService } from '@/features/favorites/server/favorites.service';
import { requireAuth } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/favorites
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: Request) => {
  const { authorized, session, errorResponse } = await requireAuth(request);
  if (!authorized || !session) return errorResponse!;

  const favorites = await favoritesServerService.getByUserId(session.user.id);
  return NextResponse.json({ favorites });
});

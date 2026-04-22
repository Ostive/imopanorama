/**
 * @module api/favorites/[propertyId]
 * @description Add or remove a property from the user's favourites.
 *
 * | Method | Auth       | Description                          |
 * |--------|------------|--------------------------------------|
 * | PUT    | Logged-in  | Add a property to favourites         |
 * | DELETE | Logged-in  | Remove a property from favourites    |
 */

import { NextResponse } from 'next/server';
import { favoritesServerService } from '@/features/favorites/server/favorites.service';
import { requireAuth } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// PUT /api/favorites/[propertyId]
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: Request,
  context?: { params: Promise<{ propertyId: string }> },
) => {
  const { authorized, session, errorResponse } = await requireAuth(request);
  if (!authorized || !session) return errorResponse!;

  const propertyId = await extractParam(context, 'propertyId');
  const favorite = await favoritesServerService.add(session.user.id, propertyId);

  return NextResponse.json({ favorite, message: 'Ajouté aux favoris' });
});

// ---------------------------------------------------------------------------
// DELETE /api/favorites/[propertyId]
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: Request,
  context?: { params: Promise<{ propertyId: string }> },
) => {
  const { authorized, session, errorResponse } = await requireAuth(request);
  if (!authorized || !session) return errorResponse!;

  const propertyId = await extractParam(context, 'propertyId');
  await favoritesServerService.remove(session.user.id, propertyId);

  return NextResponse.json({ message: 'Retiré des favoris' });
});

/**
 * @module api/bati-quotes/[id]
 * @description Admin endpoints for individual quote management.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | PATCH  | Admin  | Mark a quote as read                 |
 * | DELETE | Admin  | Delete a quote                       |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiQuoteRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, extractParam } from '@/infrastructure/middleware/api-handler';

/** Fields to expose when including the related user. */
const USER_SELECT = { select: { id: true, firstName: true, lastName: true, email: true } } as const;

// ---------------------------------------------------------------------------
// PATCH /api/bati-quotes/[id]  (admin only – mark as read)
// ---------------------------------------------------------------------------

export const PATCH = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const quote = await batiQuoteRepository.update(id, { isRead: true }, { user: USER_SELECT });

  return NextResponse.json(quote);
});

// ---------------------------------------------------------------------------
// DELETE /api/bati-quotes/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await batiQuoteRepository.delete(id);

  return NextResponse.json({ success: true });
});

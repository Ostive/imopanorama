/**
 * @module api/contacts/count
 * @description Returns aggregated contact statistics (admin only).
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | Fetch contact stats (total, unread)  |
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/features/contacts/services/contactService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/contacts/count  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const stats = await ContactService.getContactStats();
  return NextResponse.json(stats);
});

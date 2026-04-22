/**
 * @module api/contacts/user
 * @description Retrieve the current user's own contact submissions.
 *
 * | Method | Auth       | Description                              |
 * |--------|------------|------------------------------------------|
 * | GET    | Logged-in  | List the user's contact history           |
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/features/contacts/services/contactService';
import { requireAuth } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/contacts/user
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, session, errorResponse } = await requireAuth(request);
  if (!authorized || !session) return errorResponse!;

  const sp = request.nextUrl.searchParams;

  const result = await ContactService.getContacts({
    page: parseInt(sp.get('page') || '1', 10),
    limit: parseInt(sp.get('limit') || '20', 10),
    filter: { userId: session.user.id },
    sort: 'date_desc',
  });

  return NextResponse.json(result);
});

/**
 * @module api/contacts
 * @description Contact form submissions (public) and admin listing.
 *
 * | Method | Auth       | Description                              |
 * |--------|------------|------------------------------------------|
 * | POST   | Public *   | Submit a contact form                    |
 * | GET    | Admin      | List contacts with search and filters    |
 *
 * \* If the user is authenticated, their ID is attached to the contact.
 */

import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/features/contacts/services/contactService';
import { ContactSearchParams } from '@/features/contacts/types/contacts.types';
import { requireAdmin, requireAuth } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// POST /api/contacts
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();

  const { ContactFormDataSchema } = await import('@/features/contacts/schemas/contacts.schema');
  const validation = ContactFormDataSchema.safeParse(body);

  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validation.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { success: false, error: 'Validation error', fieldErrors },
      { status: 400 },
    );
  }

  const data = validation.data;

  // Attach the caller's user ID when authenticated
  const authResult = await requireAuth(request);
  if (authResult.authorized && authResult.session) {
    data.userId = authResult.session.user.id;
  }

  const contact = await ContactService.createContact(data);
  return NextResponse.json(contact, { status: 201 });
});

// ---------------------------------------------------------------------------
// GET /api/contacts  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const sp = request.nextUrl.searchParams;
  const status = sp.get('status');

  const params: ContactSearchParams = {
    page: parseInt(sp.get('page') || '1', 10),
    limit: parseInt(sp.get('limit') || '20', 10),
    filter: {
      search: sp.get('search') || undefined,
      isRead: status === 'read' ? true : status === 'unread' ? false : undefined,
    },
  };

  const result = await ContactService.getContacts(params);
  return NextResponse.json(result);
});

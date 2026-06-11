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
import { ContactSearchParams, LeadPriority, LeadStatus } from '@/features/contacts/types/contacts.types';
import { requireAdmin, requireAuth } from '@/infrastructure/auth/auth-guard';
import { boundedIntParam, parseEnumParam, validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { rateLimit } from '@/infrastructure/middleware/rate-limit';

// ---------------------------------------------------------------------------
// POST /api/contacts
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const limited = await rateLimit(request, { scope: 'contacts:post', limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const [body, { ContactFormDataSchema }] = await Promise.all([
    request.json(),
    import('@/features/contacts/schemas/contacts.schema'),
  ]);
  const validation = ContactFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'Le formulaire de contact contient des champs invalides');
  }

  const data = validation.data;

  if (data.website || data.url) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  data.email = data.email.toLowerCase();

  // Attach the caller's user ID when authenticated, but keep public forms usable.
  try {
    const authResult = await requireAuth(request);
    if (authResult.authorized && authResult.session) {
      data.userId = authResult.session.user.id;
    }
  } catch {
    // Public contact forms do not require a session.
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
  const isReadParam = sp.get('isRead');
  const leadStatus = parseLeadStatus(sp.get('leadStatus'));
  const leadPriority = parseLeadPriority(sp.get('leadPriority'));

  const params: ContactSearchParams = {
    page: boundedIntParam(sp, 'page', 1, 1, 10000),
    limit: boundedIntParam(sp, 'limit', 20, 1, 100),
    filter: {
      search: sp.get('search') || undefined,
      isRead: status === 'read' ? true : status === 'unread' ? false : isReadParam === 'true' ? true : isReadParam === 'false' ? false : undefined,
      leadStatus,
      leadPriority,
    },
  };

  const result = await ContactService.getContacts(params);
  return NextResponse.json(result);
});

function parseLeadStatus(value: string | null): LeadStatus | undefined {
  const allowed: LeadStatus[] = ['NEW', 'TO_CONTACT', 'CONTACTED', 'VISIT_SCHEDULED', 'VISIT_DONE', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED'];
  return parseEnumParam(value, allowed);
}

function parseLeadPriority(value: string | null): LeadPriority | undefined {
  const allowed: LeadPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
  return parseEnumParam(value, allowed);
}

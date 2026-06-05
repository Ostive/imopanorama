import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/features/contacts/services/contactService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const { id } = await context.params;
  const contact = await ContactService.markAsRead(id);
  return NextResponse.json(contact);
});

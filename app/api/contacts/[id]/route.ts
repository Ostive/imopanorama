import { NextRequest, NextResponse } from 'next/server';
import { ContactService } from '@/features/contacts/services/contactService';
import { ContactCrmUpdateSchema } from '@/features/contacts/schemas/contacts.schema';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const { id } = await context.params;
  const body = await request.json();
  const validation = ContactCrmUpdateSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'La mise a jour CRM contient des champs invalides');
  }

  const contact = await ContactService.updateCrm(id, validation.data);
  return NextResponse.json(contact);
});

export const DELETE = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const { id } = await context.params;
  await ContactService.deleteContact(id);
  return NextResponse.json({ success: true });
});

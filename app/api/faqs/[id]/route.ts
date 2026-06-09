/**
 * @module api/faqs/[id]
 * @description Single-FAQ CRUD endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Retrieve an FAQ by ID                |
 * | PUT    | Admin  | Update an FAQ                        |
 * | DELETE | Admin  | Delete an FAQ                        |
 */

import { NextRequest, NextResponse } from 'next/server';
import { faqsServerService } from '@/features/faqs/server/faqs.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam, validationError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/faqs/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const faq = await faqsServerService.getById(id);

  if (!faq) return apiError('FAQ non trouvée', 404);

  return NextResponse.json(faq);
});

// ---------------------------------------------------------------------------
// PUT /api/faqs/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [id, body, { FaqFormDataSchema }] = await Promise.all([
    extractParam(context, 'id'),
    request.json(),
    import('@/features/faqs/schemas/faqs.schema'),
  ]);
  const validation = FaqFormDataSchema.partial().safeParse(body);
  if (!validation.success) {
    return validationError(validation.error.issues, 'La mise a jour de la FAQ contient des champs invalides');
  }

  const updatedFaq = await faqsServerService.update(id, validation.data);

  if (!updatedFaq) return apiError('FAQ non trouvée', 404);

  return NextResponse.json(updatedFaq);
});

// ---------------------------------------------------------------------------
// DELETE /api/faqs/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const deleted = await faqsServerService.remove(id);

  if (!deleted) return apiError('FAQ non trouvée', 404);

  return NextResponse.json({ success: true });
});

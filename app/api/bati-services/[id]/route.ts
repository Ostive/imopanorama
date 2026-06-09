/**
 * @module api/bati-services/[id]
 * @description Single BatiPanorama service CRUD endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Retrieve a service by ID             |
 * | PUT    | Admin  | Update a service                     |
 * | DELETE | Admin  | Delete a service                     |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiServiceRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam, validationError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-services/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const service = await batiServiceRepository.findUnique(id);

  if (!service) return apiError('Service introuvable', 404);

  return NextResponse.json({ success: true, service });
});

// ---------------------------------------------------------------------------
// PUT /api/bati-services/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [id, body, { BatiServiceFormDataSchema }] = await Promise.all([
    extractParam(context, 'id'),
    request.json(),
    import('@/features/batipanorama/schemas/batipanorama.schema'),
  ]);
  const validation = BatiServiceFormDataSchema.partial().safeParse(body);
  if (!validation.success) {
    return validationError(validation.error.issues, 'La mise a jour du service contient des champs invalides');
  }

  const service = await batiServiceRepository.update(id, validation.data);
  return NextResponse.json({ success: true, service });
});

// ---------------------------------------------------------------------------
// DELETE /api/bati-services/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await batiServiceRepository.delete(id);

  return NextResponse.json({ success: true, message: 'Service supprimé avec succès' });
});

/**
 * @module api/bati-process/[id]
 * @description Single process step CRUD endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Retrieve a process step by ID        |
 * | PUT    | Admin  | Update a process step                |
 * | DELETE | Admin  | Delete a process step                |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiProcessRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam, validationError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-process/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const processStep = await batiProcessRepository.findUnique(id);

  if (!processStep) return apiError('Étape introuvable', 404);

  return NextResponse.json({ success: true, step: processStep });
});

// ---------------------------------------------------------------------------
// PUT /api/bati-process/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const body = await request.json();

  const { BatiProcessStepFormDataSchema } = await import('@/features/batipanorama/schemas/batipanorama.schema');
  const validation = BatiProcessStepFormDataSchema.partial().safeParse(body);
  if (!validation.success) {
    return validationError(validation.error.issues, 'La mise a jour de l etape contient des champs invalides');
  }

  const processStep = await batiProcessRepository.update(id, validation.data);
  return NextResponse.json({ success: true, step: processStep });
});

// ---------------------------------------------------------------------------
// DELETE /api/bati-process/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await batiProcessRepository.delete(id);

  return NextResponse.json({ success: true, message: 'Étape supprimée avec succès' });
});

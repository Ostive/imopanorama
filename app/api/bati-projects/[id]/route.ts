/**
 * @module api/bati-projects/[id]
 * @description Single BatiPanorama project CRUD endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Retrieve a project by ID             |
 * | PUT    | Admin  | Update a project                     |
 * | DELETE | Admin  | Delete a project                     |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiProjectRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam, validationError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-projects/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const project = await batiProjectRepository.findUnique(id);

  if (!project) return apiError('Projet introuvable', 404);

  return NextResponse.json({ success: true, project });
});

// ---------------------------------------------------------------------------
// PUT /api/bati-projects/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const body = await request.json();
  const { BatiProjectFormDataSchema } = await import('@/features/batipanorama/schemas/batipanorama.schema');
  const validation = BatiProjectFormDataSchema.partial().safeParse(body);
  if (!validation.success) {
    return validationError(validation.error.issues, 'La mise a jour du projet contient des champs invalides');
  }

  const project = await batiProjectRepository.update(id, validation.data);
  return NextResponse.json({ success: true, project });
});

// ---------------------------------------------------------------------------
// DELETE /api/bati-projects/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await batiProjectRepository.delete(id);

  return NextResponse.json({ success: true, message: 'Projet supprimé avec succès' });
});

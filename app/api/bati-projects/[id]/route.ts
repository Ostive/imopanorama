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
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a partial update object from the request body,
 * only including fields that are explicitly provided.
 */
function buildProjectUpdate(body: Record<string, unknown>): Record<string, unknown> {
  const update: Record<string, unknown> = {};

  const directFields = [
    'title', 'description', 'location', 'category',
    'duration', 'budget', 'images', 'coverImage', 'status',
  ];

  for (const field of directFields) {
    if (body[field] !== undefined) update[field] = body[field];
  }

  // Fields requiring type coercion
  if (body.surface !== undefined) {
    update.surface = body.surface ? parseFloat(String(body.surface)) : null;
  }
  if (body.isPublished !== undefined) update.isPublished = body.isPublished;
  if (body.order !== undefined) update.order = parseInt(String(body.order), 10);

  return update;
}

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
  const data = buildProjectUpdate(body);

  const project = await batiProjectRepository.update(id, data);
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

/**
 * @module api/properties/[id]
 * @description Single-property endpoints (read, update, delete).
 *
 * | Method | Auth     | Description                          |
 * |--------|----------|--------------------------------------|
 * | GET    | Public   | Retrieve a property by ID            |
 * | PUT    | Staff    | Update a property                    |
 * | DELETE | Admin    | Delete a property                    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertiesServerService } from '@/features/properties/server/properties.service';
import { requireStaff, requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/properties/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const userAgent = request.headers.get('user-agent') || '';
  const property = await propertiesServerService.getById(id, userAgent);

  if (!property) {
    return apiError('Propriété non trouvée', 404);
  }

  return NextResponse.json({ success: true, data: property });
});

// ---------------------------------------------------------------------------
// PUT /api/properties/[id]  (staff only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const body = await request.json();

  // Partial validation with Zod
  const { PropertyFormDataSchema } = await import('@/features/properties/schemas/properties.schema');
  const validation = PropertyFormDataSchema.partial().safeParse(body);

  if (!validation.success) {
    return apiError('Erreur de validation');
  }

  // Keep only defined fields for the update
  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(validation.data)) {
    if (value !== undefined) updateData[key] = value;
  }

  const property = await propertiesServerService.update(id, updateData);

  if (!property) {
    return apiError('Propriété non trouvée', 404);
  }

  return NextResponse.json({ success: true, data: property });
});

// ---------------------------------------------------------------------------
// DELETE /api/properties/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const deleted = await propertiesServerService.remove(id);

  if (!deleted) {
    return apiError('Propriété non trouvée', 404);
  }

  return NextResponse.json({ success: true, message: 'Propriété supprimée avec succès' });
});

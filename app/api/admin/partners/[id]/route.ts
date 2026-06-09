/**
 * @module api/admin/partners/[id]
 * @description Admin CRUD for a single partner by ID.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | PUT    | Admin  | Update a partner                     |
 * | DELETE | Admin  | Delete a partner                     |
 */

import { NextRequest, NextResponse } from 'next/server';
import { partnerRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// PUT /api/admin/partners/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [id, body] = await Promise.all([
    extractParam(context, 'id'),
    request.json(),
  ]);

  const partner = await partnerRepository.update(id, {
    name: body.name,
    logo: body.logo,
    website: body.website || null,
    description: body.description || null,
    order: body.order,
    isActive: body.isActive,
  });

  return NextResponse.json(partner);
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/partners/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await partnerRepository.delete(id);

  return NextResponse.json({ success: true });
});

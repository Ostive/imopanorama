/**
 * @module api/admin/partners
 * @description Admin endpoints for partner management.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | List all partners (ordered)          |
 * | POST   | Admin  | Create a new partner                 |
 */

import { NextRequest, NextResponse } from 'next/server';
import { partnerRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/admin/partners  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const partners = await partnerRepository.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(partners);
});

// ---------------------------------------------------------------------------
// POST /api/admin/partners  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { name, logo, website, description, order, isActive } = body;

  if (!name || !logo) {
    return apiError('Le nom et le logo sont requis');
  }

  const partner = await partnerRepository.create({
    name,
    logo,
    website: website || null,
    description: description || null,
    order: order || 0,
    isActive: isActive ?? true,
  });

  return NextResponse.json(partner, { status: 201 });
});

/**
 * @module api/bati-services
 * @description BatiPanorama service catalogue endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | List all active services             |
 * | POST   | Admin  | Create a new service                 |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiServiceRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-services
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async () => {
  const services = await batiServiceRepository.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  return NextResponse.json({ success: true, services });
});

// ---------------------------------------------------------------------------
// POST /api/bati-services  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [body, { BatiServiceFormDataSchema }] = await Promise.all([
    request.json(),
    import('@/features/batipanorama/schemas/batipanorama.schema'),
  ]);
  const validation = BatiServiceFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'Le service contient des champs invalides');
  }

  const { title, description, icon, features, isActive, order } = validation.data;
  const service = await batiServiceRepository.create({
    title,
    description,
    icon,
    features,
    isActive,
    order,
  });

  return NextResponse.json({ success: true, service });
});

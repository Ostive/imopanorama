/**
 * @module api/properties
 * @description CRUD endpoints for property listings.
 *
 * | Method | Auth     | Description                          |
 * |--------|----------|--------------------------------------|
 * | GET    | Public   | List properties with filters & pagination |
 * | POST   | Staff    | Create a new property                |
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertiesServerService } from '@/features/properties/server/properties.service';
import { requireStaff } from '@/infrastructure/auth/auth-guard';
import { boundedIntParam, validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { cached, invalidateCache } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse numeric search-param or return `undefined`. */
function numParam(sp: URLSearchParams, key: string): number | undefined {
  const v = sp.get(key);
  return v ? parseFloat(v) : undefined;
}

/** Parse integer search-param or return `undefined`. */
function intParam(sp: URLSearchParams, key: string): number | undefined {
  const v = sp.get(key);
  return v ? parseInt(v, 10) : undefined;
}

// ---------------------------------------------------------------------------
// GET /api/properties
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const sp = request.nextUrl.searchParams;

  const params = {
    page: boundedIntParam(sp, 'page', 1, 1, 10000),
    limit: boundedIntParam(sp, 'limit', 12, 1, 1000),
    sort: sp.get('sort') || undefined,
    view: (sp.get('view') || 'list') as 'list' | 'full',
    filter: {
      ids: sp.get('ids')?.split(',').map(id => id.trim()).filter(Boolean).slice(0, 20) || undefined,
      propertyType: sp.get('propertyType') || undefined,
      transactionType: sp.get('transactionType') || undefined,
      country: sp.get('country') || undefined,
      region: sp.get('region') || undefined,
      city: sp.get('city') || undefined,
      status: sp.get('status') || undefined,
      minPrice: numParam(sp, 'minPrice'),
      maxPrice: numParam(sp, 'maxPrice'),
      minSize: numParam(sp, 'minSize'),
      maxSize: numParam(sp, 'maxSize'),
      minBedrooms: intParam(sp, 'minBedrooms'),
      maxBedrooms: intParam(sp, 'maxBedrooms'),
      minBathrooms: intParam(sp, 'minBathrooms'),
      minRooms: intParam(sp, 'minRooms'),
      minFloor: intParam(sp, 'minFloor'),
      maxFloor: intParam(sp, 'maxFloor'),
      minYearBuilt: intParam(sp, 'minYearBuilt'),
      maxYearBuilt: intParam(sp, 'maxYearBuilt'),
      condition: sp.get('condition') || undefined,
      isFeatured: sp.get('isFeatured') ? sp.get('isFeatured') === 'true' : undefined,
      amenities: sp.get('amenities')?.split(',').filter(Boolean) || undefined,
      features: sp.get('features')?.split(',').filter(Boolean) || undefined,
      search: sp.get('search') || undefined,
    },
  };

  const key = `properties:${sp.toString()}`;
  const result = await cached(key, () => propertiesServerService.list(params), 60);

  return NextResponse.json({ success: true, ...result });
});

// ---------------------------------------------------------------------------
// POST /api/properties  (staff only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, session, errorResponse } = await requireStaff(request);
  if (!authorized || !session) return errorResponse!;

  const body = await request.json();

  // Validate with Zod schema
  const { PropertyFormDataSchema } = await import('@/features/properties/schemas/properties.schema');
  const validation = PropertyFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'La propriete contient des champs invalides');
  }

  const property = await propertiesServerService.create({
    ...validation.data,
    ownerId: session.user.id,
  });

  await invalidateCache('properties:*');

  return NextResponse.json({ success: true, data: property });
});

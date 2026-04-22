/**
 * @module api/search
 * @description Semantic property search powered by Qdrant vector database.
 *
 * | Method | Auth   | Description                                      |
 * |--------|--------|--------------------------------------------------|
 * | GET    | Public | Search properties with text query and filters     |
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchProperties, SearchFilters } from '@/infrastructure/search/qdrant/search';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { cached } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely parse a numeric search-param, returning `undefined` when absent. */
function numParam(sp: URLSearchParams, key: string): number | undefined {
  const v = sp.get(key);
  return v ? parseFloat(v) : undefined;
}

// ---------------------------------------------------------------------------
// GET /api/search
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const sp = request.nextUrl.searchParams;

  const query = sp.get('q') || '';
  const limit = parseInt(sp.get('limit') || '10', 10);
  const offset = parseInt(sp.get('offset') || '0', 10);

  if (!query) {
    return apiError('Query parameter "q" is required');
  }

  // Build filter object from search params
  const filters: SearchFilters = {
    ...(sp.get('city') && { city: sp.get('city')! }),
    ...(sp.get('type') && { type: sp.get('type')! }),
    ...(sp.get('status') && { status: sp.get('status')! }),
    minPrice: numParam(sp, 'minPrice'),
    maxPrice: numParam(sp, 'maxPrice'),
    minSize: numParam(sp, 'minSize'),
    maxSize: numParam(sp, 'maxSize'),
  };

  // Geo-location filter (all three params required)
  const lat = sp.get('lat');
  const lon = sp.get('lon');
  const radius = sp.get('radius');

  if (lat && lon && radius) {
    filters.geoLocation = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      radius: parseFloat(radius),
    };
  }

  // Search results are cached for 30 s
  const key = `search:${sp.toString()}`;
  const results = await cached(key, () => searchProperties(query, filters, { limit, offset }), 30);

  return NextResponse.json({ success: true, ...results });
});

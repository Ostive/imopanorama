/**
 * @module api/properties/[id]/similar
 * @description Returns properties similar to the given one, based on
 * city, property type, transaction type, and price range.
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | GET    | Public | Fetch up to N similar properties          |
 *
 * ## Query parameters
 * | Param | Default | Description               |
 * |-------|---------|---------------------------|
 * | limit | 4       | Max number of results     |
 */

import { NextRequest, NextResponse } from 'next/server';
import { propertiesServerService } from '@/features/properties/server/properties.service';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';
import { cached } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// GET /api/properties/[id]/similar
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '4', 10);

  // Cache for 5 minutes — similar properties rarely change
  const key = `properties:${id}:similar:${limit}`;
  const similar = await cached(key, () => propertiesServerService.getSimilar(id, limit), 300);

  if (!similar) {
    return apiError('Propriété non trouvée', 404);
  }

  return NextResponse.json({ success: true, data: similar });
});

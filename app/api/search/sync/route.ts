/**
 * @module api/search/sync
 * @description Trigger Qdrant vector sync for properties.
 *
 * | Method | Auth   | Description                                      |
 * |--------|--------|--------------------------------------------------|
 * | POST   | Public | Sync a single property or all properties to Qdrant|
 */

import { NextRequest, NextResponse } from 'next/server';
import { initializeQdrantCollection } from '@/infrastructure/search/qdrant/setup';
import { syncAllPropertiesToQdrant, syncPropertyToQdrant } from '@/infrastructure/search/qdrant/sync';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// POST /api/search/sync
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json().catch(() => ({}));
  const { propertyId } = body;

  // Ensure the Qdrant collection exists before syncing
  await initializeQdrantCollection();

  if (propertyId) {
    await syncPropertyToQdrant(propertyId);
    return NextResponse.json({
      success: true,
      message: `Property ${propertyId} synced successfully`,
    });
  }

  // Full sync of all properties
  const result = await syncAllPropertiesToQdrant();
  return NextResponse.json({
    success: true,
    message: 'All properties synced successfully',
    ...result,
  });
});

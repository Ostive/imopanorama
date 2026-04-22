/**
 * @module api/partners
 * @description Public endpoint to retrieve active partners.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | List all active partners (cached)    |
 */

import { NextResponse } from 'next/server';
import { partnerRepository } from '@/infrastructure/database/repositories';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { cached } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// GET /api/partners
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async () => {
  const partners = await cached(
    'partners:active',
    () => partnerRepository.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    300,
  );

  return NextResponse.json(partners);
});

/**
 * @module api/health
 * @description Lightweight production health endpoint for uptime monitors.
 */

import { NextResponse } from 'next/server';

import { isDatabaseConnectionReady } from '@/infrastructure/database/prisma';

export const dynamic = 'force-dynamic';

const startedAt = Date.now();

export async function GET() {
  const databaseReady = await isDatabaseConnectionReady();
  const status = databaseReady ? 200 : 503;

  return NextResponse.json(
    {
      status: databaseReady ? 'ok' : 'degraded',
      service: 'imopanorama',
      database: databaseReady ? 'ready' : 'unavailable',
      uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
      checkedAt: new Date().toISOString(),
    },
    { status }
  );
}

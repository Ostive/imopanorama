/**
 * @module api/docs
 * @description Redirects to the OpenAPI / Swagger JSON specification.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Redirect to `/swagger.json`          |
 */

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// GET /api/docs
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const url = new URL('/swagger.json', request.url);
  return NextResponse.redirect(url);
}

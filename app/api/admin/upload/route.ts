/**
 * @module api/admin/upload
 * @description Proxy layer that forwards upload requests to `/api/upload`.
 * Exists to provide a convenient admin-namespaced endpoint; all actual
 * upload logic (auth, validation, CDN interaction) happens in `/api/upload`.
 *
 * | Method | Auth   | Description                                  |
 * |--------|--------|----------------------------------------------|
 * | POST   | Staff  | Upload a single image (proxied)              |
 * | PUT    | Staff  | Upload multiple images (proxied)             |
 * | GET    | Staff  | List images in a directory (proxied)         |
 * | DELETE | Staff  | Delete an image (proxied)                    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// Internal proxy helper
// ---------------------------------------------------------------------------

/**
 * Forward the incoming request to the canonical `/api/upload` endpoint.
 *
 * @param targetPath - The base path on the same origin to forward to.
 * @param original   - The original incoming request.
 * @param method     - HTTP method override (defaults to the original method).
 */
async function forwardRequest(
  targetPath: string,
  original: NextRequest,
  method?: string,
): Promise<NextResponse> {
  const url = new URL(original.url);
  const targetFullUrl = `${url.origin}${targetPath}${url.search}`;

  const init: RequestInit = {
    method: method || original.method,
    headers: { cookie: original.headers.get('cookie') || '' },
  };

  // Forward body for write methods
  if (['POST', 'PUT'].includes(init.method || '')) {
    init.body = await original.formData();
  }

  const response = await fetch(targetFullUrl, init);
  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, { status: response.status });
}

// ---------------------------------------------------------------------------
// Route handlers (all delegate to /api/upload)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) =>
  forwardRequest('/api/upload', request),
);

export const PUT = withErrorHandler(async (request: NextRequest) =>
  forwardRequest('/api/upload', request, 'PUT'),
);

export const GET = withErrorHandler(async (request: NextRequest) =>
  forwardRequest('/api/upload', request, 'GET'),
);

export const DELETE = withErrorHandler(async (request: NextRequest) =>
  forwardRequest('/api/upload', request, 'DELETE'),
);

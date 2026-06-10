/**
 * @module api/upload
 * @description File upload, listing, and deletion via BunnyCDN storage.
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | POST   | Staff  | Upload a single file                     |
 * | PUT    | Staff  | Upload multiple files (batch)            |
 * | GET    | Staff  | List files in a storage directory         |
 * | DELETE | Staff  | Delete a file by path                    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { bunnyCdnConfig } from '@/shared/config/bunnycdn';
import { requireStaff } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { logger } from '@/infrastructure/logger/logger';
import { sanitizeStorageDirectory, sanitizeStoragePath, stripStorageBaseUrl } from '@/shared/utils/storagePath';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** MIME types accepted for upload. */
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;

/** Maximum file size in bytes (10 MB). */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Validate and return the required BunnyCDN config or throw. */
function requireConfig() {
  const { storageZoneName, apiKey, hostname, pullZoneUrl } = bunnyCdnConfig;
  if (!storageZoneName || !apiKey) throw new Error('BunnyCDN configuration missing: BUNNYCDN_STORAGE_ZONE_NAME or BUNNYCDN_API_KEY');
  if (!hostname) throw new Error('BunnyCDN configuration missing: hostname');
  if (!pullZoneUrl) throw new Error('BunnyCDN configuration missing: pullZoneUrl');
  return { storageZoneName, apiKey, hostname, pullZoneUrl };
}

/** Generate a unique storage path under `directory` for the given `fileName`. */
function buildPath(directory: string, fileName: string): string {
  const ext = (fileName.split('.').pop() || 'jpg').toLowerCase();
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const dir = sanitizeStorageDirectory(directory);
  return `${dir}${unique}`.replace(/\/+/g, '/');
}

/** Check that a `File` passes the type/size constraints. */
function isValidFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number]) && file.size <= MAX_FILE_SIZE;
}

/** Upload a single file buffer to BunnyCDN. */
async function uploadToStorage(
  buffer: ArrayBuffer,
  fullPath: string,
  config: ReturnType<typeof requireConfig>,
): Promise<void> {
  const apiUrl = `https://${config.hostname}/${config.storageZoneName}${fullPath}`;
  const res = await fetch(apiUrl, {
    method: 'PUT',
    headers: { AccessKey: config.apiKey, 'Content-Type': 'application/octet-stream' },
    body: buffer,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`BunnyCDN upload failed ${res.status}: ${text}`);
  }
}

// ---------------------------------------------------------------------------
// POST /api/upload  (single file)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const config = requireConfig();
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const directory = sanitizeStorageDirectory((formData.get('folder') as string) || '/images/');

  if (!file) return apiError('Aucun fichier fourni');
  if (!ALLOWED_TYPES.includes(file.type as typeof ALLOWED_TYPES[number])) return apiError('Type de fichier non autorisé');
  if (file.size > MAX_FILE_SIZE) return apiError('Fichier trop volumineux (max 10 Mo)');

  const fullPath = buildPath(directory, file.name);
  await uploadToStorage(await file.arrayBuffer(), fullPath, config);

  return NextResponse.json(
    { success: true, data: { url: `${config.pullZoneUrl}${fullPath}`, path: fullPath } },
    { status: 201 },
  );
});

// ---------------------------------------------------------------------------
// PUT /api/upload  (batch upload)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const config = requireConfig();
  const formData = await request.formData();
  const files = formData.getAll('files') as File[];
  const directory = sanitizeStorageDirectory((formData.get('folder') as string) || '/images/');

  if (!files.length) return apiError('Aucun fichier fourni');

  const uploadedResults = await Promise.all(
    files.map(async (file) => {
      if (!isValidFile(file)) return null;

        const fullPath = buildPath(directory, file.name);
        try {
          await uploadToStorage(await file.arrayBuffer(), fullPath, config);
          return `${config.pullZoneUrl}${fullPath}`;
        } catch (err) {
          logger.error(`Error uploading file ${file.name}`, err);
          return null;
        }
      })
  );
  const uploadedUrls = uploadedResults.filter(Boolean) as string[];

  return NextResponse.json({ success: true, urls: uploadedUrls }, { status: 201 });
});

// ---------------------------------------------------------------------------
// GET /api/upload  (list directory)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const config = requireConfig();
  const dir = sanitizeStorageDirectory(request.nextUrl.searchParams.get('path') || '/images/');

  const apiUrl = `https://${config.hostname}/${config.storageZoneName}${dir}`;
  const res = await fetch(apiUrl, { method: 'GET', headers: { AccessKey: config.apiKey } });

  if (res.status === 404) return NextResponse.json({ success: true, data: [] });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`BunnyCDN list failed ${res.status}: ${text}`);
  }

  const items = await res.json();
  return NextResponse.json({ success: true, data: items, pullZoneUrl: config.pullZoneUrl });
});

// ---------------------------------------------------------------------------
// DELETE /api/upload  (delete file)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const config = requireConfig();
  const input = request.nextUrl.searchParams.get('path');

  if (!input) return apiError('Paramètre path requis');

  const relativePath = sanitizeStoragePath(stripStorageBaseUrl(input, config.pullZoneUrl));

  const apiUrl = `https://${config.hostname}/${config.storageZoneName}${relativePath}`;
  const res = await fetch(apiUrl, { method: 'DELETE', headers: { AccessKey: config.apiKey } });

  if (res.status === 404) return NextResponse.json({ success: true });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`BunnyCDN delete failed ${res.status}: ${text}`);
  }

  return NextResponse.json({ success: true });
});

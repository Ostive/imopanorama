/**
 * @module api/admin/images
 * @description Admin endpoints for image management via BunnyCDN.
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | GET    | Staff  | List files in a BunnyCDN directory        |
 * | POST   | Staff  | Perform an action (e.g. create directory)|
 * | DELETE | Staff  | Delete a file from BunnyCDN              |
 */

import { NextRequest, NextResponse } from 'next/server';
import { bunnyCdnService } from '@/features/upload/services/bunnyCdnService';
import { requireStaff } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { logger } from '@/infrastructure/logger/logger';

// ---------------------------------------------------------------------------
// GET /api/admin/images  (staff only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const path = request.nextUrl.searchParams.get('path') || '/images/';

  if (!process.env.BUNNYCDN_API_KEY || !process.env.BUNNYCDN_STORAGE_ZONE_NAME) {
    return apiError('Configuration BunnyCDN manquante.', 500);
  }

  let files = await bunnyCdnService.listFiles(path);

  // Normalise inconsistent property casing from the BunnyCDN SDK
  if (files.length > 0 && files[0].IsDirectory === undefined && files[0].isDirectory !== undefined) {
    files = files.map(file => ({
      ...file,
      IsDirectory: file.isDirectory,
      ObjectName: file.objectName || file.name || file.ObjectName,
    }));
  }

  return NextResponse.json({ files });
});

// ---------------------------------------------------------------------------
// POST /api/admin/images  (staff only – actions)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { action, path } = body;

  if (action === 'createDirectory') {
    if (!path) return apiError('Chemin non spécifié');

    const success = await bunnyCdnService.createDirectory(path);
    logger.info('[Images] Répertoire créé:', path);
    return NextResponse.json({ success });
  }

  return apiError('Action non supportée');
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/images  (staff only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const filePath = request.nextUrl.searchParams.get('path');
  if (!filePath) return apiError('Chemin du fichier non spécifié');

  const success = await bunnyCdnService.deleteFile(filePath);
  logger.info('[Images] Fichier supprimé:', filePath);

  return NextResponse.json({ success });
});

/**
 * @module api/admin/images
 * @description Admin endpoints for image management via BunnyCDN.
 */

import { NextRequest, NextResponse } from 'next/server';
import { bunnyCdnService } from '@/features/upload/services/bunnyCdnService';
import { requireStaff } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { logger } from '@/infrastructure/logger/logger';
import { bunnyCdnConfig } from '@/shared/config/bunnycdn';
import { sanitizeStorageDirectory, sanitizeStoragePath, stripStorageBaseUrl } from '@/shared/utils/storagePath';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const path = sanitizeStorageDirectory(request.nextUrl.searchParams.get('path') || '/images/');

  if (!process.env.BUNNYCDN_API_KEY || !process.env.BUNNYCDN_STORAGE_ZONE_NAME) {
    return apiError('Configuration BunnyCDN manquante.', 500);
  }

  let files = await bunnyCdnService.listFiles(path);

  if (files.length > 0 && files[0].IsDirectory === undefined && files[0].isDirectory !== undefined) {
    files = files.map(file => ({
      ...file,
      IsDirectory: file.isDirectory,
      ObjectName: file.objectName || file.name || file.ObjectName,
    }));
  }

  return NextResponse.json({ files });
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { action, path } = body;

  if (action === 'createDirectory') {
    if (!path) return apiError('Chemin non specifie');

    const safePath = sanitizeStorageDirectory(path);
    const success = await bunnyCdnService.createDirectory(safePath);
    logger.info('[Images] Repertoire cree:', safePath);
    return NextResponse.json({ success });
  }

  return apiError('Action non supportee');
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireStaff(request);
  if (!authorized) return errorResponse!;

  const filePath = request.nextUrl.searchParams.get('path');
  if (!filePath) return apiError('Chemin du fichier non specifie');

  const safePath = sanitizeStoragePath(stripStorageBaseUrl(filePath, bunnyCdnConfig.pullZoneUrl));
  const success = await bunnyCdnService.deleteFile(safePath);
  logger.info('[Images] Fichier supprime:', safePath);

  return NextResponse.json({ success });
});

/**
 * @module api/settings
 * @description Application settings CRUD endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Retrieve settings by key or category |
 * | PUT    | Admin  | Save / update settings               |
 * | DELETE | Admin  | Delete a setting by key              |
 */

import { NextRequest, NextResponse } from 'next/server';
import { settingsServerService } from '@/features/settings/server/settings.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { cached, invalidateCache } from '@/infrastructure/cache';

// Default settings returned when the DB is too slow or unavailable
const DEFAULT_SETTINGS = { success: true, settings: {} };
const DB_TIMEOUT_MS = 3000;

/** Wraps a fetcher with a hard timeout — returns null on timeout. */
async function withTimeout<T>(fn: () => Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    fn(),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

// ---------------------------------------------------------------------------
// GET /api/settings
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const sp = request.nextUrl.searchParams;
  const key = sp.get('key');
  const category = sp.get('category');

  // Fetch a single setting by key
  if (key) {
    const setting = await withTimeout(
      () => cached(`settings:${key}`, () => settingsServerService.getByKey(key), 600),
      DB_TIMEOUT_MS,
    );

    if (!setting) {
      return apiError('Setting not found', 404);
    }

    return NextResponse.json({
      success: true,
      setting: { key: setting.key, value: setting.value, category: setting.category },
    });
  }

  // Fetch all settings (optionally filtered by category)
  const cacheKey = `settings:all:${category || 'all'}`;
  const settings = await withTimeout(
    () => cached(cacheKey, () => settingsServerService.getAll(category || undefined), 600),
    DB_TIMEOUT_MS,
  );

  // Return empty settings on timeout so the UI uses its defaults
  if (settings === null) {
    return NextResponse.json(DEFAULT_SETTINGS);
  }

  return NextResponse.json({ success: true, settings });
});

// ---------------------------------------------------------------------------
// PUT /api/settings  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { settings } = body;

  if (!settings || typeof settings !== 'object') {
    return apiError('Invalid settings data');
  }

  const saved = await settingsServerService.save(settings);
  await invalidateCache('settings:*');

  return NextResponse.json({ success: true, message: 'Settings saved successfully', settings: saved });
});

// ---------------------------------------------------------------------------
// DELETE /api/settings  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const key = request.nextUrl.searchParams.get('key');

  if (!key) {
    return apiError('Key is required');
  }

  const deleted = await settingsServerService.remove(key);
  if (!deleted) {
    return apiError('Setting not found', 404);
  }

  await invalidateCache('settings:*');
  return NextResponse.json({ success: true, message: 'Setting deleted successfully' });
});

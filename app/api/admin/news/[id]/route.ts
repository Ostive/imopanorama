/**
 * @module api/admin/news/[id]
 * @description Admin CRUD for a single news article by ID.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | Retrieve an article by ID            |
 * | PUT    | Admin  | Update an article                    |
 * | DELETE | Admin  | Delete an article                    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/features/news/services/newsService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/admin/news/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const news = await newsService.getNewsById(id);

  if (!news) return apiError('Actualité non trouvée', 404);

  return NextResponse.json(news);
});

// ---------------------------------------------------------------------------
// PUT /api/admin/news/[id]
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const data = await request.json();

  const existing = await newsService.getNewsById(id);
  if (!existing) return apiError('Actualité non trouvée', 404);

  const updatedNews = await newsService.updateNews(id, data);
  return NextResponse.json(updatedNews);
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/news/[id]
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');

  const existing = await newsService.getNewsById(id);
  if (!existing) return apiError('Actualité non trouvée', 404);

  await newsService.deleteNews(id);
  return NextResponse.json({ success: true });
});

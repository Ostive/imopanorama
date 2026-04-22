/**
 * @module api/news/id/[id]
 * @description CRUD endpoints for a single news article by database ID.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Fetch an article by ID               |
 * | PUT    | Admin  | Update an article                    |
 * | DELETE | Admin  | Delete an article                    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/features/news/services/newsService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/news/id/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const id = await extractParam(context, 'id');
  const news = await newsService.getNewsById(id);

  if (!news) return apiError('Actualité non trouvée', 404);

  return NextResponse.json(news);
});

// ---------------------------------------------------------------------------
// PUT /api/news/id/[id]  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const body = await request.json();

  const { NewsFormDataSchema } = await import('@/features/news/schemas/news.schema');
  const validation = NewsFormDataSchema.partial().safeParse(body);

  if (!validation.success) {
    return apiError('Erreur de validation');
  }

  const updatedNews = await newsService.updateNews(id, validation.data);
  return NextResponse.json(updatedNews);
});

// ---------------------------------------------------------------------------
// DELETE /api/news/id/[id]  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  await newsService.deleteNews(id);

  return NextResponse.json({ success: true });
});

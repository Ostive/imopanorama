/**
 * @module api/admin/news
 * @description Admin endpoints for news management with pagination.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | List news with search, filter, pagination |
 * | POST   | Admin  | Create a new news article            |
 */

import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/features/news/services/newsService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/admin/news  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const sp = request.nextUrl.searchParams;
  const page = parseInt(sp.get('page') || '1', 10);
  const limit = parseInt(sp.get('limit') || '10', 10);
  const category = sp.get('category') || undefined;
  const search = sp.get('search') || undefined;
  const isPublishedParam = sp.get('isPublished');
  const isPublished = isPublishedParam === null ? undefined : isPublishedParam === 'true';

  // Fetch all news (including unpublished) then apply filters in-memory
  let filteredNews = await newsService.getAllNews(true);

  if (category) filteredNews = filteredNews.filter(n => n.category === category);
  if (isPublished !== undefined) filteredNews = filteredNews.filter(n => n.isPublished === isPublished);

  if (search) {
    const q = search.toLowerCase();
    filteredNews = filteredNews.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.slug.toLowerCase().includes(q) ||
      n.excerpt?.toLowerCase().includes(q),
    );
  }

  const total = filteredNews.length;
  const paginatedNews = filteredNews.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ data: paginatedNews, total, page, limit });
});

// ---------------------------------------------------------------------------
// POST /api/admin/news  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, session, errorResponse } = await requireAdmin(request);
  if (!authorized || !session) return errorResponse!;

  const data = await request.json();

  if (!data.title || !data.content) {
    return apiError('Le titre et le contenu sont requis');
  }

  const news = await newsService.createNews({ ...data, authorId: session.user.id });
  return NextResponse.json(news, { status: 201 });
});

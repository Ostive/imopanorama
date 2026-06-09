/**
 * @module api/news
 * @description Public news endpoints (list & create).
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | GET    | Public | List / search / filter news articles     |
 * | POST   | Admin  | Create a new news article                |
 */

import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/features/news/services/newsService';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { boundedIntParam, validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { cached, invalidateCache } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// GET /api/news
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const sp = request.nextUrl.searchParams;
  const category = sp.get('category');
  const limit = sp.get('limit');
  const search = sp.get('search');

  const key = `news:${sp.toString()}`;
  const news = await cached(key, async () => {
    if (search) return newsService.searchNews(search);
    if (category) return newsService.getNewsByCategory(category as Parameters<typeof newsService.getNewsByCategory>[0]);
    if (limit) return newsService.getRecentNews(boundedIntParam(sp, 'limit', 6, 1, 50));
    return newsService.getAllNews();
  }, 120);

  return NextResponse.json(news);
});

// ---------------------------------------------------------------------------
// POST /api/news  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, session, errorResponse } = await requireAdmin(request);
  if (!authorized || !session) return errorResponse!;

  const [body, { NewsFormDataSchema }] = await Promise.all([
    request.json(),
    import('@/features/news/schemas/news.schema'),
  ]);
  const validation = NewsFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'L actualite contient des champs invalides');
  }

  const news = await newsService.createNews({
    ...validation.data,
    authorId: session.user.id,
  });

  await invalidateCache('news:*');
  return NextResponse.json(news, { status: 201 });
});

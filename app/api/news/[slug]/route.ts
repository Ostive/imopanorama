/**
 * @module api/news/[slug]
 * @description Retrieve a single published news article by its URL slug.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | Fetch a published article by slug    |
 */

import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/features/news/services/newsService';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/news/[slug]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ slug: string }> },
) => {
  const slug = await extractParam(context, 'slug');
  const news = await newsService.getNewsBySlug(slug);

  if (!news) {
    return apiError('Actualité non trouvée', 404);
  }

  // Only expose published articles through the public endpoint
  if (!news.isPublished) {
    return apiError('Actualité non disponible', 404);
  }

  return NextResponse.json(news);
});

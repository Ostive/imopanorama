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
import { boundedIntParam, parseEnumParam, validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { NewsCategory } from '@prisma/client';

// ---------------------------------------------------------------------------
// GET /api/admin/news  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const sp = request.nextUrl.searchParams;
  const page = boundedIntParam(sp, 'page', 1, 1, 10000);
  const limit = boundedIntParam(sp, 'limit', 10, 1, 100);
  const category = sp.get('category') || undefined;
  const search = sp.get('search') || undefined;
  const isPublishedParam = sp.get('isPublished');
  const isPublished = isPublishedParam === null ? undefined : isPublishedParam === 'true';

  const result = await newsService.listNews({
    page,
    limit,
    includeUnpublished: true,
    category: parseNewsCategory(category),
    isPublished,
    search,
  });

  return NextResponse.json(result);
});

// ---------------------------------------------------------------------------
// POST /api/admin/news  (admin only)
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

  const news = await newsService.createNews({ ...validation.data, authorId: session.user.id });
  return NextResponse.json(news, { status: 201 });
});

function parseNewsCategory(value?: string): NewsCategory | undefined {
  const allowed: NewsCategory[] = ['GENERAL', 'IMMOBILIER', 'CONSTRUCTION', 'EVENEMENT', 'ENTREPRISE'];
  return parseEnumParam(value || null, allowed);
}

/**
 * @module api/faqs
 * @description FAQ list & creation endpoints.
 *
 * | Method | Auth   | Description                              |
 * |--------|--------|------------------------------------------|
 * | GET    | Public | List FAQs with pagination and filters    |
 * | POST   | Admin  | Create a new FAQ entry                   |
 */

import { NextRequest, NextResponse } from 'next/server';
import { faqsServerService } from '@/features/faqs/server/faqs.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { boundedIntParam, validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { cached, invalidateCache } from '@/infrastructure/cache';

// ---------------------------------------------------------------------------
// GET /api/faqs
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const sp = request.nextUrl.searchParams;
  const isActiveParam = sp.get('isActive');

  const params = {
    page: boundedIntParam(sp, 'page', 1, 1, 10000),
    limit: boundedIntParam(sp, 'limit', 10, 1, 100),
    category: sp.get('category') || undefined,
    isActive: isActiveParam === 'true' ? true : isActiveParam === 'false' ? false : undefined,
    search: sp.get('search') || undefined,
  };

  const key = `faqs:${sp.toString()}`;
  const result = await cached(key, () => faqsServerService.list(params), 300);

  return NextResponse.json(result);
});

// ---------------------------------------------------------------------------
// POST /api/faqs  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [body, { FaqFormDataSchema }] = await Promise.all([
    request.json(),
    import('@/features/faqs/schemas/faqs.schema'),
  ]);
  const validation = FaqFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'La FAQ contient des champs invalides');
  }

  const newFaq = await faqsServerService.create(validation.data);
  await invalidateCache('faqs:*');

  return NextResponse.json(newFaq, { status: 201 });
});

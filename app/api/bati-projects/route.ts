/**
 * @module api/bati-projects
 * @description BatiPanorama project gallery endpoints.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | List projects (optionally published)  |
 * | POST   | Admin  | Create a new project                 |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiProjectRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { validationError, withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-projects
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const published = request.nextUrl.searchParams.get('published');
  const where = published === 'true' ? { isPublished: true } : {};

  const projects = await batiProjectRepository.findMany({
    where,
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json({ success: true, projects });
});

// ---------------------------------------------------------------------------
// POST /api/bati-projects  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const [body, { BatiProjectFormDataSchema }] = await Promise.all([
    request.json(),
    import('@/features/batipanorama/schemas/batipanorama.schema'),
  ]);
  const validation = BatiProjectFormDataSchema.safeParse(body);

  if (!validation.success) {
    return validationError(validation.error.issues, 'Le projet contient des champs invalides');
  }

  const {
    title, description, location, category, surface,
    duration, budget, images, coverImage, status, isPublished, order,
  } = validation.data;

  const project = await batiProjectRepository.create({
    title,
    description,
    location,
    category,
    surface,
    duration,
    budget,
    images: images || [],
    coverImage,
    status,
    isPublished,
    order,
  });

  return NextResponse.json({ success: true, project });
});

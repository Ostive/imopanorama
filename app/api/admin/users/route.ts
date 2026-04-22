/**
 * @module api/admin/users
 * @description Admin endpoints for user management with pagination and search.
 *
 * | Method | Auth   | Description                                  |
 * |--------|--------|----------------------------------------------|
 * | GET    | Admin  | List users with search, filter, pagination   |
 * | PUT    | Admin  | Update a user by userId in body               |
 * | DELETE | Admin  | Delete a user by userId in query params       |
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';
import { logger } from '@/infrastructure/logger/logger';

/** Projection used for user queries – excludes password hash. */
const USER_SELECT = {
  id: true, email: true, firstName: true, lastName: true, role: true,
  phone: true, company: true, isActive: true, createdAt: true, updatedAt: true, lastLoginAt: true,
} as const;

// ---------------------------------------------------------------------------
// GET /api/admin/users  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const sp = request.nextUrl.searchParams;
  const page = parseInt(sp.get('page') || '1', 10);
  const limit = parseInt(sp.get('limit') || '10', 10);
  const role = sp.get('role');
  const isActiveParam = sp.get('isActive');
  const search = sp.get('search');

  // Build Prisma where clause dynamically
  const where: Record<string, unknown> = {};
  if (role) where.role = role.toUpperCase();
  if (isActiveParam !== null) where.isActive = isActiveParam === 'true';
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ];
  }

  const total = await userRepository.count(where);
  const users = await userRepository.findMany({
    where,
    select: USER_SELECT,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  logger.info(`${users.length} utilisateurs récupérés sur ${total} total`);

  return NextResponse.json({
    data: users, total, page, limit,
    totalPages: Math.ceil(total / limit),
  });
});

// ---------------------------------------------------------------------------
// PUT /api/admin/users  (admin only)
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { userId, ...updateData } = body;

  if (!userId) {
    return apiError('ID utilisateur requis');
  }

  const updatedUser = await userRepository.update(userId, updateData);
  logger.info('Utilisateur mis à jour:', updatedUser.id);

  return NextResponse.json(updatedUser);
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/users  (admin only)
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const { authorized, session, errorResponse } = await requireAdmin(request);
  if (!authorized || !session) return errorResponse!;

  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return apiError('ID utilisateur requis');
  }

  // Prevent self-deletion
  if (userId === session.user.id) {
    return apiError('Vous ne pouvez pas supprimer votre propre compte');
  }

  await userRepository.delete(userId);
  logger.info('Utilisateur supprimé:', userId);

  return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès' });
});

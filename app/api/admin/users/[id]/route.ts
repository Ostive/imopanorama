/**
 * @module api/admin/users/[id]
 * @description Admin CRUD for a single user by ID.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | Retrieve a user by ID                |
 * | PUT    | Admin  | Update a user                        |
 * | DELETE | Admin  | Delete a user                        |
 */

import { NextRequest, NextResponse } from 'next/server';
import { userRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';
import { logger } from '@/infrastructure/logger/logger';

/** Projection used for user queries – excludes password hash. */
const USER_SELECT = {
  id: true, email: true, firstName: true, lastName: true, role: true,
  phone: true, company: true, isActive: true, createdAt: true, updatedAt: true, lastLoginAt: true,
} as const;

// ---------------------------------------------------------------------------
// GET /api/admin/users/[id]
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const user = await userRepository.findUnique(id, USER_SELECT);

  if (!user) return apiError('Utilisateur introuvable', 404);

  return NextResponse.json(user);
});

// ---------------------------------------------------------------------------
// PUT /api/admin/users/[id]
// ---------------------------------------------------------------------------

export const PUT = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const id = await extractParam(context, 'id');
  const body = await request.json();

  // Build a partial update from the request body
  const updateData: Record<string, unknown> = {};

  if (body.name) {
    const nameParts = body.name.trim().split(' ');
    updateData.firstName = nameParts[0];
    updateData.lastName = nameParts.slice(1).join(' ') || '';
  }
  if (body.email) updateData.email = body.email;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.role) updateData.role = body.role.toUpperCase();
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const updatedUser = await userRepository.update(id, updateData);
  logger.info('Utilisateur mis à jour:', updatedUser.id);

  return NextResponse.json(updatedUser);
});

// ---------------------------------------------------------------------------
// DELETE /api/admin/users/[id]
// ---------------------------------------------------------------------------

export const DELETE = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, session, errorResponse } = await requireAdmin(request);
  if (!authorized || !session) return errorResponse!;

  const id = await extractParam(context, 'id');

  // Prevent self-deletion
  if (id === session.user.id) {
    return apiError('Vous ne pouvez pas supprimer votre propre compte');
  }

  await userRepository.delete(id);
  logger.info('Utilisateur supprimé:', id);

  return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès' });
});

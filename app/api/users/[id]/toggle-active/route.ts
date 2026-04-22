/**
 * @module api/users/[id]/toggle-active
 * @description Toggle the active/inactive status of a user account.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | POST   | Admin  | Activate or deactivate a user        |
 */

import { NextRequest, NextResponse } from 'next/server';
import { usersServerService } from '@/features/users/server/users.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError, extractParam } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// POST /api/users/[id]/toggle-active  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (
  request: NextRequest,
  context?: { params: Promise<{ id: string }> },
) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const userId = await extractParam(context, 'id');

  // Verify the user exists
  const user = await usersServerService.getById(userId);
  if (!user) {
    return apiError('Utilisateur non trouvé', 404);
  }

  // Prevent deactivation of admin accounts
  const role = (user.role as string).toLowerCase();
  if (role === 'admin' || role === 'super_admin') {
    return apiError('Impossible de désactiver un compte administrateur', 403);
  }

  const result = await usersServerService.toggleActive(userId);

  return NextResponse.json({
    message: `L'utilisateur a été ${result?.isActive ? 'activé' : 'désactivé'} avec succès`,
    user: result,
  });
});

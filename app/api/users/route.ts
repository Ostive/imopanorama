/**
 * @module api/users
 * @description Admin endpoint to list all users.
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Admin  | Retrieve the complete user list      |
 */

import { NextRequest, NextResponse } from 'next/server';
import { usersServerService } from '@/features/users/server/users.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/users  (admin only)
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const users = await usersServerService.list();
  return NextResponse.json(users);
});

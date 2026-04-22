/**
 * @module api/bati-process
 * @description BatiPanorama process steps (the step-by-step workflow).
 *
 * | Method | Auth   | Description                          |
 * |--------|--------|--------------------------------------|
 * | GET    | Public | List all active process steps        |
 * | POST   | Admin  | Create a new process step            |
 */

import { NextRequest, NextResponse } from 'next/server';
import { batiProcessRepository } from '@/infrastructure/database/repositories';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler';

// ---------------------------------------------------------------------------
// GET /api/bati-process
// ---------------------------------------------------------------------------

export const GET = withErrorHandler(async () => {
  const steps = await batiProcessRepository.findMany({
    where: { isActive: true },
    orderBy: { step: 'asc' },
  });

  return NextResponse.json({ success: true, steps });
});

// ---------------------------------------------------------------------------
// POST /api/bati-process  (admin only)
// ---------------------------------------------------------------------------

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const body = await request.json();
  const { title, description, step, icon, duration, isActive } = body;

  if (!title || !description || step === undefined) {
    return apiError('Champs requis manquants');
  }

  const processStep = await batiProcessRepository.create({
    title,
    description,
    step: parseInt(step, 10),
    icon: icon || '📋',
    duration,
    isActive: isActive ?? true,
  });

  return NextResponse.json({ success: true, step: processStep });
});

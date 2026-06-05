import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/features/notifications/server/notifications.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export const PATCH = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const { id } = await context.params;
  const notification = await NotificationService.markAsRead(id);
  return NextResponse.json(notification);
});

export const DELETE = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const { id } = await context.params;
  await NotificationService.delete(id);
  return NextResponse.json({ success: true });
});

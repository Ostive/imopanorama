import { NextResponse } from 'next/server';
import { NotificationService } from '@/features/notifications/server/notifications.service';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';

export const GET = withErrorHandler(async () => {
  const { authorized, errorResponse } = await requireAdmin();
  if (!authorized) return errorResponse!;

  const unread = await NotificationService.countUnread();
  return NextResponse.json({ unread });
});

import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/features/notifications/server/notifications.service';
import { NotificationPriority, NotificationType } from '@/features/notifications/types';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { boundedIntParam, parseEnumParam, withErrorHandler } from '@/infrastructure/middleware/api-handler';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const sp = request.nextUrl.searchParams;
  const result = await NotificationService.list({
    page: boundedIntParam(sp, 'page', 1, 1, 10000),
    limit: boundedIntParam(sp, 'limit', 20, 1, 100),
    unreadOnly: sp.get('unreadOnly') === 'true',
    type: parseNotificationType(sp.get('type')),
    priority: parseNotificationPriority(sp.get('priority')),
  });

  return NextResponse.json(result);
});

export const PATCH = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const body = await request.json().catch(() => ({}));
  if (body.action === 'mark-all-read') {
    const result = await NotificationService.markAllAsRead();
    return NextResponse.json({ success: true, count: result.count });
  }

  return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
});

function parseNotificationType(value: string | null): NotificationType | undefined {
  const allowed: NotificationType[] = ['CONTACT_CREATED', 'PROPERTY_CONTACT_CREATED', 'VISIT_REQUESTED', 'CRM_FOLLOW_UP', 'PROPERTY_CREATED', 'SYSTEM'];
  return parseEnumParam(value, allowed);
}

function parseNotificationPriority(value: string | null): NotificationPriority | undefined {
  const allowed: NotificationPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];
  return parseEnumParam(value, allowed);
}

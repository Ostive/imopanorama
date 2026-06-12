import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/infrastructure/auth/auth-guard';
import { withErrorHandler } from '@/infrastructure/middleware/api-handler';
import { prisma } from '@/infrastructure/database/prisma';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request);
  if (!authorized) return errorResponse!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const [
    totalProperties,
    propertiesThisMonth,
    totalUsers,
    usersThisWeek,
    totalContacts,
    contactsToday,
    unreadContacts,
    recentProperties,
    recentUsers,
    recentContacts,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek } } }),
    prisma.contact.count(),
    prisma.contact.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.contact.count({ where: { isRead: false } }),
    prisma.property.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, createdAt: true, status: true },
    }),
    prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true },
    }),
    prisma.contact.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { id: true, firstName: true, lastName: true, email: true, createdAt: true, isRead: true },
    }),
  ]);

  return NextResponse.json({
    stats: {
      properties: { total: totalProperties, thisMonth: propertiesThisMonth },
      users: { total: totalUsers, thisWeek: usersThisWeek },
      contacts: { total: totalContacts, today: contactsToday, unread: unreadContacts },
    },
    recentActivity: {
      properties: recentProperties,
      users: recentUsers,
      contacts: recentContacts,
    },
  });
});

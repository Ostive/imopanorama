import { prisma } from '@/infrastructure/database/prisma';
import type { NotificationPriority, NotificationSearchParams, NotificationType } from '@/features/notifications/types';

type CreateNotificationData = {
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  targetUrl?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  recipientId?: string | null;
};

export class NotificationService {
  static async create(data: CreateNotificationData) {
    return prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority ?? 'NORMAL',
        targetUrl: data.targetUrl,
        entityType: data.entityType,
        entityId: data.entityId,
        recipientId: data.recipientId,
      },
    });
  }

  static async list(params: NotificationSearchParams = {}) {
    const page = params.page ?? 1;
    const limit = params.limit ?? 20;
    const where = {
      ...(params.unreadOnly ? { isRead: false } : {}),
      ...(params.type ? { type: params.type } : {}),
      ...(params.priority ? { priority: params.priority } : {}),
    };

    const [notifications, total, unread] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { isRead: false } }),
    ]);

    return {
      notifications,
      total,
      unread,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async countUnread() {
    return prisma.notification.count({ where: { isRead: false } });
  }

  static async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async markAllAsRead() {
    return prisma.notification.updateMany({
      where: { isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  static async delete(id: string) {
    return prisma.notification.delete({ where: { id } });
  }

  static async createContactNotification(args: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    propertyTitle?: string | null;
    isVisitRequest?: boolean;
  }) {
    const clientName = `${args.firstName} ${args.lastName}`.trim();
    const title = args.isVisitRequest
      ? `Demande de visite - ${clientName}`
      : args.propertyTitle
        ? `Demande sur un bien - ${clientName}`
        : `Nouveau contact - ${clientName}`;

    return this.create({
      type: args.isVisitRequest ? 'VISIT_REQUESTED' : args.propertyTitle ? 'PROPERTY_CONTACT_CREATED' : 'CONTACT_CREATED',
      title,
      message: args.propertyTitle
        ? `${clientName} (${args.email}) s'interesse a "${args.propertyTitle}". ${args.message}`
        : `${clientName} (${args.email}) a envoye un message. ${args.message}`,
      priority: args.isVisitRequest ? 'HIGH' : 'NORMAL',
      targetUrl: '/admin/contacts',
      entityType: args.propertyTitle ? 'PropertyContact' : 'Contact',
      entityId: args.id,
    });
  }
}

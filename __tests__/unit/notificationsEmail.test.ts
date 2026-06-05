import { beforeEach, describe, expect, it, vi } from 'vitest';

const prismaMock = vi.hoisted(() => ({
  notification: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  },
}));

const repositoryMocks = vi.hoisted(() => ({
  contactRepository: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
  },
  propertyContactRepository: {
    create: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    findUnique: vi.fn(),
  },
}));

const emailMocks = vi.hoisted(() => ({
  sendGenericContactConfirmation: vi.fn(),
  sendGenericContactNotificationToAdmin: vi.fn(),
  sendPropertyContactConfirmation: vi.fn(),
  sendPropertyContactNotificationToAdmin: vi.fn(),
}));

vi.mock('@/infrastructure/database/prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('@/infrastructure/database/repositories', () => repositoryMocks);

vi.mock('@/infrastructure/email', () => emailMocks);

vi.mock('@/infrastructure/logger/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('notifications and email dispatch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.notification.create.mockResolvedValue({ id: 'notification-1' });
    emailMocks.sendGenericContactConfirmation.mockResolvedValue({ success: true, messageId: 'mail-1' });
    emailMocks.sendGenericContactNotificationToAdmin.mockResolvedValue({ success: true, messageId: 'mail-2' });
    emailMocks.sendPropertyContactConfirmation.mockResolvedValue({ success: true, messageId: 'mail-3' });
    emailMocks.sendPropertyContactNotificationToAdmin.mockResolvedValue({ success: true, messageId: 'mail-4' });
  });

  it('creates an internal notification for a visit request', async () => {
    const { NotificationService } = await import('@/features/notifications/server/notifications.service');

    await NotificationService.createContactNotification({
      id: 'contact-1',
      firstName: 'Lova',
      lastName: 'Rakoto',
      email: 'lova@example.com',
      message: 'Je veux faire une visite demain.',
      propertyTitle: 'Villa Ambatobe',
      isVisitRequest: true,
    });

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'VISIT_REQUESTED',
        priority: 'HIGH',
        targetUrl: '/admin/contacts',
        entityType: 'PropertyContact',
        entityId: 'contact-1',
      }),
    });
  });

  it('sends confirmation/admin emails and creates notification for a generic contact', async () => {
    repositoryMocks.contactRepository.create.mockResolvedValue({
      id: 'contact-1',
      firstName: 'Lova',
      lastName: 'Rakoto',
      email: 'lova@example.com',
      phone: '+261341234567',
      message: 'Je souhaite vendre un terrain a Antananarivo.',
      createdAt: new Date(),
      isRead: false,
      userId: null,
      user: null,
    });

    const { ContactService } = await import('@/features/contacts/services/contactService');

    const result = await ContactService.createContact({
      firstName: 'Lova',
      lastName: 'Rakoto',
      email: 'lova@example.com',
      phone: '+261341234567',
      message: 'Je souhaite vendre un terrain a Antananarivo.',
    });

    expect(result.id).toBe('contact-1');
    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'CONTACT_CREATED',
        priority: 'NORMAL',
      }),
    });
    expect(emailMocks.sendGenericContactConfirmation).toHaveBeenCalledWith(expect.objectContaining({
      clientEmail: 'lova@example.com',
    }));
    expect(emailMocks.sendGenericContactNotificationToAdmin).toHaveBeenCalledWith(expect.objectContaining({
      clientName: 'Lova Rakoto',
    }));
  });

  it('sends property contact emails and creates a property notification', async () => {
    repositoryMocks.propertyContactRepository.create.mockResolvedValue({
      id: 'property-contact-1',
      firstName: 'Miora',
      lastName: 'Rabe',
      email: 'miora@example.com',
      phone: '+261321234567',
      message: 'Je voudrais visiter cette propriete.',
      createdAt: new Date(),
      isRead: false,
      userId: null,
      propertyId: 'property-1',
      user: null,
      property: {
        id: 'property-1',
        title: 'Villa Ambatobe',
        city: 'Antananarivo',
        price: 850000000,
      },
    });

    const { ContactService } = await import('@/features/contacts/services/contactService');

    await ContactService.createContact({
      firstName: 'Miora',
      lastName: 'Rabe',
      email: 'miora@example.com',
      phone: '+261321234567',
      message: 'Je voudrais visiter cette propriete.',
      propertyId: 'property-1',
    });

    expect(prismaMock.notification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'VISIT_REQUESTED',
        priority: 'HIGH',
        entityType: 'PropertyContact',
      }),
    });
    expect(emailMocks.sendPropertyContactConfirmation).toHaveBeenCalledWith(expect.objectContaining({
      propertyTitle: 'Villa Ambatobe',
      clientEmail: 'miora@example.com',
    }));
    expect(emailMocks.sendPropertyContactNotificationToAdmin).toHaveBeenCalledWith(expect.objectContaining({
      propertyId: 'property-1',
    }));
  });
});

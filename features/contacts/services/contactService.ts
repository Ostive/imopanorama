import { contactRepository, propertyContactRepository } from '@/infrastructure/database/repositories';
import { Contact, ContactCrmUpdateData, ContactFormData, ContactSearchParams, ContactStats } from '@/features/contacts/types/contacts.types';
import { logger } from '@/infrastructure/logger/logger';
import {
  sendPropertyContactConfirmation,
  sendPropertyContactNotificationToAdmin,
  sendGenericContactConfirmation,
  sendGenericContactNotificationToAdmin,
} from '@/infrastructure/email';
import { NotificationService } from '@/features/notifications/server/notifications.service';
import type { Contact as PrismaContact, PropertyContact as PrismaPropertyContact, User as PrismaUser, Property as PrismaProperty } from '@prisma/client';

// Typed results when including relations
type PropertyContactWithRelations = PrismaPropertyContact & { user?: PrismaUser | null; property?: PrismaProperty | null };
type ContactWithRelations = PrismaContact & { user?: PrismaUser | null };

// Combined type for internal handling
type AnyContact = ContactWithRelations | PropertyContactWithRelations;

function toNullableDate(value: string | null | undefined) {
  if (value === undefined) return undefined;
  if (!value) return null;
  return new Date(value);
}

// Helper to transform Prisma contacts to the unified Contact type
function transformContact(contact: AnyContact): Contact {
  const isPropertyContact = 'propertyId' in contact;

  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    message: contact.message,
    createdAt: contact.createdAt,
    isRead: contact.isRead,
    leadStatus: (contact as any).leadStatus ?? 'NEW',
    leadPriority: (contact as any).leadPriority ?? 'NORMAL',
    assignedAgentId: (contact as any).assignedAgentId ?? null,
    nextFollowUpAt: (contact as any).nextFollowUpAt ?? null,
    scheduledVisitAt: (contact as any).scheduledVisitAt ?? null,
    visitOutcome: (contact as any).visitOutcome ?? null,
    internalNotes: (contact as any).internalNotes ?? null,
    userId: contact.userId,
    // Property specific fields
    propertyId: isPropertyContact ? (contact as PrismaPropertyContact).propertyId : null,
    property: isPropertyContact && (contact as any).property ? {
      id: (contact as any).property.id,
      title: (contact as any).property.title,
      city: (contact as any).property.city,
      price: (contact as any).property.price.toString(), // Ensure string
    } : null,
    user: contact.user ? {
      id: contact.user.id,
      firstName: contact.user.firstName || '',
      lastName: contact.user.lastName || '',
      email: contact.user.email,
    } : null,
  };
}

export class ContactService {
  /**
   * Créer un nouveau contact (Générique ou Propriété)
   */
  static async createContact(data: ContactFormData): Promise<Contact> {
    let result: Contact;

    if (data.propertyId) {
      // 1. Create PropertyContact
      const contact = await propertyContactRepository.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          message: data.message,
          userId: data.userId,
          propertyId: data.propertyId,
        },
        { user: true, property: true },
      ) as PropertyContactWithRelations;

      result = transformContact(contact);

      try {
        const isVisitRequest = /visite|rendez-vous|rdv/i.test(contact.message);
        await NotificationService.createContactNotification({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          message: contact.message,
          propertyTitle: contact.property?.title,
          isVisitRequest,
        });
      } catch (error) {
        logger.error('Failed to create property contact notification', { error, contactId: contact.id });
      }

      // 2. Send Emails
      try {
        const emailData = {
          propertyTitle: contact.property?.title ?? '',
          propertyId: contact.property?.id ?? contact.propertyId,
          propertyPrice: contact.property?.price?.toString() ?? '',
          propertyLocation: contact.property?.city ?? '',
          clientName: `${contact.firstName} ${contact.lastName}`,
          clientEmail: contact.email,
          clientPhone: contact.phone || 'Non renseigné',
          message: contact.message,
        };

        await Promise.allSettled([
          sendPropertyContactConfirmation(emailData),
          sendPropertyContactNotificationToAdmin(emailData),
        ]);
      } catch (error) {
        logger.error('Failed to send contact emails', { error, contactId: contact.id });
        // Don't fail the request if email fails
      }

    } else {
      // 1. Create Generic Contact
      const contact = await contactRepository.create(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          message: data.message,
          userId: data.userId,
        },
        { user: true },
      ) as ContactWithRelations;

      result = transformContact(contact);

      try {
        await NotificationService.createContactNotification({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          message: contact.message,
        });
      } catch (error) {
        logger.error('Failed to create generic contact notification', { error, contactId: contact.id });
      }

      // Send confirmation + admin notification for generic contact
      try {
        await Promise.allSettled([
          sendGenericContactConfirmation({
            clientName: `${contact.firstName} ${contact.lastName}`,
            clientEmail: contact.email,
            clientPhone: contact.phone || '',
            message: contact.message,
          }),
          sendGenericContactNotificationToAdmin({
            clientName: `${contact.firstName} ${contact.lastName}`,
            clientEmail: contact.email,
            clientPhone: contact.phone || '',
            message: contact.message,
          }),
        ]);
      } catch (error) {
        logger.error('Failed to send generic contact emails', { error, contactId: contact.id });
      }
    }

    return result;
  }

  /**
   * Récupérer tous les contacts (fusionnés)
   */
  static async getContacts(params: ContactSearchParams = {}): Promise<{
    contacts: Contact[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      filter = {},
      page = 1,
      limit = 20,
      sort = 'date_desc'
    } = params;

    const skip = (page - 1) * limit;

    // Filters
    const whereGeneric: any = {};
    const whereProperty: any = {};

    if (filter.isRead !== undefined) {
      whereGeneric.isRead = filter.isRead;
      whereProperty.isRead = filter.isRead;
    }
    if (filter.leadStatus) {
      whereGeneric.leadStatus = filter.leadStatus;
      whereProperty.leadStatus = filter.leadStatus;
    }
    if (filter.leadPriority) {
      whereGeneric.leadPriority = filter.leadPriority;
      whereProperty.leadPriority = filter.leadPriority;
    }
    if (filter.userId) {
      whereGeneric.userId = filter.userId;
      whereProperty.userId = filter.userId;
    }
    if (filter.search) {
      const searchCondition = {
        OR: [
          { firstName: { contains: filter.search, mode: 'insensitive' } },
          { lastName: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
          { message: { contains: filter.search, mode: 'insensitive' } },
        ]
      };
      whereGeneric.OR = searchCondition.OR;
      whereProperty.OR = searchCondition.OR;
    }

    // Determine sort
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'date_asc') orderBy = { createdAt: 'asc' };
    // Name sorting is harder across tables, defaulting to date for mixed lists or handling in memory

    const queryTake = skip + limit;

    // Fetch enough from each source to merge and paginate without loading the
    // whole inbox. For a mixed feed sorted by date, skip + limit per table is
    // sufficient to compute the requested page after merging.
    const [genericContacts, propertyContacts, totalGeneric, totalProperty] = await Promise.all([
      contactRepository.findMany({ where: whereGeneric, include: { user: true }, orderBy, take: queryTake }),
      propertyContactRepository.findMany({ where: whereProperty, include: { user: true, property: true }, orderBy, take: queryTake }),
      contactRepository.count(whereGeneric),
      propertyContactRepository.count(whereProperty),
    ]);

    // Merge and Sort
    const allContacts: AnyContact[] = [...genericContacts as ContactWithRelations[], ...propertyContacts as PropertyContactWithRelations[]];
    allContacts.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sort === 'date_asc' ? dateA - dateB : dateB - dateA;
    });

    // Pagination (In-Memory)
    const paginatedContacts = allContacts.slice(skip, skip + limit);
    const total = totalGeneric + totalProperty;
    const totalPages = Math.ceil(total / limit);

    return {
      contacts: paginatedContacts.map(transformContact),
      total,
      page,
      totalPages,
    };
  }

  /**
   * Récupérer un contact par ID (cherche dans les deux tables)
   */
  static async getContactById(id: string): Promise<Contact | null> {
    // Try PropertyContact first (most likely given recent migration focus)
    const propertyContact = await propertyContactRepository.findUnique(id, { user: true, property: true });

    if (propertyContact) return transformContact(propertyContact as PropertyContactWithRelations);

    // Try Generic Contact
    const contact = await contactRepository.findUnique(id, { user: true });

    return contact ? transformContact(contact as ContactWithRelations) : null;
  }

  /**
   * Marquer comme lu
   */
  static async markAsRead(id: string): Promise<Contact> {
    try {
      const contact = await propertyContactRepository.update(id, { isRead: true }, { user: true, property: true });
      return transformContact(contact as PropertyContactWithRelations);
    } catch {
      // Fallback
      const contact = await contactRepository.update(id, { isRead: true }, { user: true });
      return transformContact(contact as ContactWithRelations);
    }
  }

  /**
   * Marquer comme non lu
   */
  static async markAsUnread(id: string): Promise<Contact> {
    try {
      const contact = await propertyContactRepository.update(id, { isRead: false }, { user: true, property: true });
      return transformContact(contact as PropertyContactWithRelations);
    } catch {
      // Fallback
      const contact = await contactRepository.update(id, { isRead: false }, { user: true });
      return transformContact(contact as ContactWithRelations);
    }
  }

  static async updateCrm(id: string, data: ContactCrmUpdateData): Promise<Contact> {
    const updateData: Record<string, unknown> = {};

    if (data.isRead !== undefined) updateData.isRead = data.isRead;
    if (data.leadStatus !== undefined) updateData.leadStatus = data.leadStatus;
    if (data.leadPriority !== undefined) updateData.leadPriority = data.leadPriority;
    if (data.assignedAgentId !== undefined) updateData.assignedAgentId = data.assignedAgentId || null;
    if (data.nextFollowUpAt !== undefined) updateData.nextFollowUpAt = toNullableDate(data.nextFollowUpAt);
    if (data.scheduledVisitAt !== undefined) updateData.scheduledVisitAt = toNullableDate(data.scheduledVisitAt);
    if (data.visitOutcome !== undefined) updateData.visitOutcome = data.visitOutcome || null;
    if (data.internalNotes !== undefined) updateData.internalNotes = data.internalNotes || null;

    try {
      const contact = await propertyContactRepository.update(id, updateData, { user: true, property: true });
      return transformContact(contact as PropertyContactWithRelations);
    } catch {
      const contact = await contactRepository.update(id, updateData, { user: true });
      return transformContact(contact as ContactWithRelations);
    }
  }

  /**
   * Supprimer
   */
  static async deleteContact(id: string): Promise<void> {
    try {
      await propertyContactRepository.delete(id);
    } catch {
      await contactRepository.delete(id);
    }
  }

  /**
   * Statistiques
   */
  static async getContactStats(): Promise<ContactStats> {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      genTotal, genUnread, genToday, genWeek,
      propTotal, propUnread, propToday, propWeek
    ] = await Promise.all([
      contactRepository.count(),
      contactRepository.count({ isRead: false }),
      contactRepository.count({ createdAt: { gte: today } }),
      contactRepository.count({ createdAt: { gte: thisWeek } }),
      propertyContactRepository.count(),
      propertyContactRepository.count({ isRead: false }),
      propertyContactRepository.count({ createdAt: { gte: today } }),
      propertyContactRepository.count({ createdAt: { gte: thisWeek } }),
    ]);

    return {
      total: genTotal + propTotal,
      unread: genUnread + propUnread,
      today: genToday + propToday,
      thisWeek: genWeek + propWeek,
    };
  }
}

export type NotificationType =
  | 'CONTACT_CREATED'
  | 'PROPERTY_CONTACT_CREATED'
  | 'VISIT_REQUESTED'
  | 'CRM_FOLLOW_UP'
  | 'PROPERTY_CREATED'
  | 'SYSTEM';

export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  targetUrl: string | null;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  readAt: Date | string | null;
  recipientId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NotificationSearchParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
}

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  CONTACT_CREATED: 'Nouveau contact',
  PROPERTY_CONTACT_CREATED: 'Demande bien',
  VISIT_REQUESTED: 'Demande de visite',
  CRM_FOLLOW_UP: 'Relance CRM',
  PROPERTY_CREATED: 'Nouveau bien',
  SYSTEM: 'Systeme',
};

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  LOW: 'Basse',
  NORMAL: 'Normale',
  HIGH: 'Haute',
  URGENT: 'Urgente',
};

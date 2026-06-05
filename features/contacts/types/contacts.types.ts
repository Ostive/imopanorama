export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    message: string;
    createdAt: Date;
    isRead: boolean;
    leadStatus: LeadStatus;
    leadPriority: LeadPriority;
    assignedAgentId: string | null;
    nextFollowUpAt: Date | string | null;
    scheduledVisitAt: Date | string | null;
    visitOutcome: string | null;
    internalNotes: string | null;
    propertyId: string | null;
    userId: string | null;
    property?: {
        id: string;
        title: string;
        city: string;
        price: number | string;
    } | null;
    user?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
}

export type LeadStatus =
    | 'NEW'
    | 'TO_CONTACT'
    | 'CONTACTED'
    | 'VISIT_SCHEDULED'
    | 'VISIT_DONE'
    | 'NEGOTIATION'
    | 'WON'
    | 'LOST'
    | 'ARCHIVED';

export type LeadPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
    NEW: 'Nouveau',
    TO_CONTACT: 'A contacter',
    CONTACTED: 'Contacte',
    VISIT_SCHEDULED: 'Visite planifiee',
    VISIT_DONE: 'Visite faite',
    NEGOTIATION: 'Negociation',
    WON: 'Converti',
    LOST: 'Perdu',
    ARCHIVED: 'Archive',
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
    LOW: 'Basse',
    NORMAL: 'Normale',
    HIGH: 'Haute',
    URGENT: 'Urgente',
};

export interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
    propertyId?: string;
    userId?: string;
    website?: string;
    url?: string;
    recaptchaToken?: string;
}

export interface ContactFilter {
    isRead?: boolean;
    leadStatus?: LeadStatus;
    leadPriority?: LeadPriority;
    propertyId?: string;
    userId?: string;
    search?: string;
}

export interface ContactCrmUpdateData {
    isRead?: boolean;
    leadStatus?: LeadStatus;
    leadPriority?: LeadPriority;
    assignedAgentId?: string | null;
    nextFollowUpAt?: string | null;
    scheduledVisitAt?: string | null;
    visitOutcome?: string | null;
    internalNotes?: string | null;
}

export interface ContactSearchParams {
    filter?: ContactFilter;
    page?: number;
    limit?: number;
    sort?: 'date_desc' | 'date_asc' | 'name_asc' | 'name_desc';
}

export interface ContactStats {
    total: number;
    unread: number;
    today: number;
    thisWeek: number;
}

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    message: string;
    createdAt: Date;
    isRead: boolean;
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
    propertyId?: string;
    userId?: string;
    search?: string;
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

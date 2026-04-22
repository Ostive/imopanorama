import { z } from 'zod';

export const ContactSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().nullable().optional(),
    message: z.string(),
    createdAt: z.date().or(z.string()),
    isRead: z.boolean(),
});

export const ContactSourceEnum = z.enum(['contact', 'seller', 'estimation', 'newsletter']);
export type ContactSource = z.infer<typeof ContactSourceEnum>;

export const ContactFormDataSchema = z.object({
    firstName: z.string().trim().min(2, 'Le prénom doit contenir au moins 2 caractères').max(60),
    lastName: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(60),
    email: z.string().trim().email('Email invalide'),
    phone: z.string().trim().max(30).optional().or(z.literal('')),
    message: z.string().trim().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
    propertyId: z.string().optional(),
    userId: z.string().optional(),
    source: ContactSourceEnum.optional(),
    website: z.string().optional(),
    url: z.string().optional(),
    recaptchaToken: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormDataSchema>;

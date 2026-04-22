import { z } from 'zod';

export const FaqSchema = z.object({
    id: z.string(),
    question: z.string().min(1, 'La question est requise'),
    answer: z.string().min(1, 'La réponse est requise'),
    category: z.string().min(1, 'La catégorie est requise'),
    order: z.number().int(),
    isActive: z.boolean(),
    createdAt: z.date().or(z.string()), // Accept string from API
    updatedAt: z.date().or(z.string()),
});

export const FaqFormDataSchema = z.object({
    question: z.string().min(1, 'La question est requise'),
    answer: z.string().min(1, 'La réponse est requise'),
    category: z.string().min(1, 'La catégorie est requise'),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
});

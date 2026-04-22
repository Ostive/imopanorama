import { z } from 'zod';

export const NewsAuthorSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
});

export const NewsFormDataSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    content: z.string().min(1, 'Le contenu est requis'),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    images: z.array(z.string()).optional(),
    category: z.enum(['GENERAL', 'IMMOBILIER', 'CONSTRUCTION', 'EVENEMENT', 'ENTREPRISE']).optional().default('GENERAL'),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional().default(false),
    slug: z.string().optional(),
});

export const NewsItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string().optional(),
    excerpt: z.string().nullable(),
    coverImage: z.string().nullable(),
    images: z.array(z.string()).optional(),
    category: z.string(),
    tags: z.array(z.string()).optional(),
    publishedAt: z.string(),
    author: NewsAuthorSchema,
});

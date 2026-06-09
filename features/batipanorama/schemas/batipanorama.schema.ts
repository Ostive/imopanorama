import { z } from 'zod';

export const ProjectSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    category: z.string(),
    surface: z.number().optional(),
    duration: z.string().optional(),
    budget: z.string().optional(),
    coverImage: z.string().optional(),
    images: z.array(z.string()),
    status: z.string().optional(),
    client: z.string().optional(),
    year: z.number().optional(),
    tags: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
});

export const BatiProjectFormDataSchema = z.object({
    title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
    description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
    location: z.string().min(1, 'La localisation est requise'),
    category: z.string().min(1, 'La catégorie est requise'),
    surface: z.union([z.string(), z.number()]).optional().transform(val => val ? Number(val) : null),
    duration: z.string().optional(),
    budget: z.string().optional(),
    images: z.array(z.string()).min(1, 'Au moins une image est requise'),
    coverImage: z.string().min(1, "L'image de couverture est requise"),
    status: z.enum(['IN_PROGRESS', 'COMPLETED', 'PLANNED']).default('COMPLETED'),
    isPublished: z.boolean().default(true),
    order: z.union([z.string(), z.number()]).optional().default(0).transform(val => Number(val)),
    client: z.string().optional(),
    year: z.union([z.string(), z.number()]).optional().transform(val => val ? Number(val) : null),
    tags: z.array(z.string()).optional().default([]),
    features: z.array(z.string()).optional().default([]),
});

export const BatiServiceSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
    features: z.array(z.string()),
    isActive: z.boolean(),
    order: z.number(),
});

export const BatiServiceFormDataSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
    icon: z.string().optional().default('🏗️'),
    features: z.array(z.string()).optional().default([]),
    isActive: z.boolean().optional().default(true),
    order: z.union([z.string(), z.number()]).optional().default(0).transform(val => Number(val)),
});

export const BatiProcessStepFormDataSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
    step: z.union([z.string(), z.number()]).transform(val => Number(val)),
    icon: z.string().optional().default('📋'),
    duration: z.string().optional(),
    isActive: z.boolean().optional().default(true),
});

export const BatipanoramaContactFormDataSchema = z.object({
    firstName: z.string().min(1, 'Le prénom est requis'),
    lastName: z.string().min(1, 'Le nom est requis'),
    email: z.email('Email invalide'),
    phone: z.string().min(1, 'Le téléphone est requis'),
    projectType: z.string().min(1, 'Le type de projet est requis'),
    budget: z.string().min(1, 'Le budget est requis'),
    location: z.string().min(1, 'La localisation est requise'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

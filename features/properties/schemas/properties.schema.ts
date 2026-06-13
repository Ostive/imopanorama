import { z } from 'zod';

export const PropertySchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().nullable().optional(),
    propertyType: z.enum([
        'TERRAIN_RESIDENTIAL', 'TERRAIN_COMMERCIAL', 'TERRAIN_AGRICULTURAL', 'TERRAIN_INDUSTRIAL',
        'VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE',
        'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT',
        'OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'
    ], { message: 'Le type de propriété est requis' }),
    transactionType: z.enum(['SALE', 'RENT', 'SEASONAL_RENT'], { message: 'Le type de transaction est requis' }),
    location: z.string().min(1, 'La localisation est requise'),
    city: z.string().min(1, 'La ville est requise'),
    country: z.string().min(2, 'Le pays est requis').default('MG'),
    region: z.string().nullable().optional(),
    district: z.string().nullable().optional(),
    commune: z.string().nullable().optional(),
    fokontany: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    zipCode: z.string().nullable().optional(),
    coordinates: z.any().optional(), // Json type in Prisma

    // Pricing
    price: z.number().min(0, 'Le prix doit être positif'),
    pricePerM2: z.number().nullable().optional(),
    rentPrice: z.number().nullable().optional(),
    currency: z.string().default('MGA'),

    // Size & Dimensions
    totalSize: z.number().min(0, 'La surface totale doit être positive'),
    livingSize: z.number().nullable().optional(),
    landSize: z.number().nullable().optional(),

    // Property Details
    bedrooms: z.number().int().nullable().optional(),
    bathrooms: z.number().int().nullable().optional(),
    rooms: z.number().int().nullable().optional(),
    floors: z.number().int().nullable().optional(),
    floor: z.number().int().nullable().optional(),
    yearBuilt: z.number().int().nullable().optional(),
    condition: z.enum(['NEW', 'EXCELLENT', 'GOOD', 'TO_RENOVATE', 'UNDER_CONSTRUCTION'], { message: 'État invalide' }).nullable().optional(),

    // Features & Amenities
    features: z.array(z.string()),
    amenities: z.array(z.string()),

    // Media
    images: z.array(z.string()),
    coverImage: z.string().nullable().optional(),
    virtualTour: z.string().nullable().optional(),
    videoUrl: z.string().nullable().optional(),

    // Status & Visibility
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'DRAFT', 'ARCHIVED'], { message: 'Le statut est requis' }),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    allowVisitScheduling: z.boolean(),
    views: z.number(),

    // References & Metadata
    reference: z.string().nullable().optional(),
    legalStatus: z.enum(['TITLED', 'CADASTRAL', 'UNTITLED', 'LONG_TERM_LEASE', 'CO_OWNERSHIP', 'COMPANY_OWNED', 'OTHER']).nullable().optional(),
    documentStatus: z.enum(['UNKNOWN', 'PENDING', 'PARTIAL', 'VERIFIED']).optional().default('UNKNOWN'),
    isVerified: z.boolean().optional().default(false),
    energyClass: z.string().nullable().optional(),
    emissions: z.string().nullable().optional(),
    taxFonciere: z.number().nullable().optional(),
    charges: z.number().nullable().optional(),

    // Relations
    ownerId: z.string().nullable().optional(),

    // Timestamps
    createdAt: z.date().or(z.string()),
    updatedAt: z.date().or(z.string()),
    publishedAt: z.date().or(z.string()).nullable().optional(),
});

// Schema for creating/updating separate from the full database entity
export const PropertyFormDataSchema = PropertySchema.omit({
    id: true,
    views: true,
    createdAt: true,
    updatedAt: true,
    publishedAt: true,
    ownerId: true, // Typically handled by auth session
}).extend({
    // Make some fields optional for form input if the database handles defaults
    status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED', 'DRAFT', 'ARCHIVED'], { message: 'Le statut est requis' }).optional().default('AVAILABLE'),
    isFeatured: z.boolean().optional().default(false),
    isPublished: z.boolean().optional().default(true),
    allowVisitScheduling: z.boolean().optional().default(false),
    // Allow numbers to be passed as strings (form data) and transformed
    // Reject empty strings for required fields
    price: z.union([z.number(), z.string()])
        .refine(val => val !== '' && val !== undefined, { message: 'Le prix est requis' })
        .transform(val => Number(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'Le prix doit être supérieur à 0' }),
    totalSize: z.union([z.number(), z.string()])
        .refine(val => val !== '' && val !== undefined, { message: 'La surface totale est requise' })
        .transform(val => Number(val))
        .refine(val => !isNaN(val) && val > 0, { message: 'La surface totale doit être supérieure à 0' }),
    pricePerM2: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    rentPrice: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    livingSize: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    landSize: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    bedrooms: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    bathrooms: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    rooms: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    floors: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    floor: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    yearBuilt: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    taxFonciere: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
    charges: z.union([z.number(), z.string(), z.null()]).optional().transform(val => val ? Number(val) : null),
});

export type Property = z.infer<typeof PropertySchema>;
export type PropertyFormData = z.infer<typeof PropertyFormDataSchema>;

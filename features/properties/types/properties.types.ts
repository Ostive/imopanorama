export type PropertyType =
    // Terrains
    | 'TERRAIN_RESIDENTIAL'
    | 'TERRAIN_COMMERCIAL'
    | 'TERRAIN_AGRICULTURAL'
    | 'TERRAIN_INDUSTRIAL'
    // Maisons & Villas
    | 'VILLA'
    | 'HOUSE'
    | 'TOWNHOUSE'
    | 'COUNTRY_HOUSE'
    // Appartements
    | 'APARTMENT'
    | 'STUDIO'
    | 'PENTHOUSE'
    | 'DUPLEX'
    | 'LOFT'
    // Commercial
    | 'OFFICE'
    | 'SHOP'
    | 'WAREHOUSE'
    | 'BUILDING'
    | 'HOTEL'
    | 'RESTAURANT';

export type TransactionType = 'SALE' | 'RENT' | 'SEASONAL_RENT';

export type PropertyCondition = 'NEW' | 'EXCELLENT' | 'GOOD' | 'TO_RENOVATE' | 'UNDER_CONSTRUCTION';

export type PropertyStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'RENTED' | 'DRAFT' | 'ARCHIVED';

export type PropertyLegalStatus =
    | 'TITLED'
    | 'CADASTRAL'
    | 'UNTITLED'
    | 'LONG_TERM_LEASE'
    | 'CO_OWNERSHIP'
    | 'COMPANY_OWNED'
    | 'OTHER';

export type PropertyDocumentStatus = 'UNKNOWN' | 'PENDING' | 'PARTIAL' | 'VERIFIED';

export interface Property {
    id: string;
    title: string;
    description?: string;
    propertyType: PropertyType;
    transactionType: TransactionType;

    // Location
    location: string;
    city: string;
    country?: string;
    region?: string;
    district?: string;
    commune?: string;
    fokontany?: string;
    address?: string;
    zipCode?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };

    // Pricing
    price: number;
    pricePerM2?: number;
    rentPrice?: number;
    currency: string;

    // Size & Dimensions
    totalSize: number;
    livingSize?: number;
    landSize?: number;

    // Property Details
    bedrooms?: number;
    bathrooms?: number;
    rooms?: number;
    floors?: number;
    floor?: number;
    yearBuilt?: number;
    condition?: PropertyCondition;

    // Features & Amenities
    features: string[];
    amenities: string[];

    // Media
    images: string[];
    coverImage?: string;
    virtualTour?: string;
    videoUrl?: string;

    // Status & Visibility
    status: PropertyStatus;
    isFeatured: boolean;
    isPublished: boolean;
    allowVisitScheduling: boolean;
    views: number;

    // References & Metadata
    reference?: string;
    legalStatus?: PropertyLegalStatus;
    documentStatus?: PropertyDocumentStatus;
    isVerified?: boolean;
    energyClass?: string;
    emissions?: string;
    taxFonciere?: number;
    charges?: number;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;

    // Owner
    ownerId?: string;
}

export interface PropertyFilter {
    propertyType?: PropertyType | PropertyType[];
    transactionType?: TransactionType;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    status?: PropertyStatus;
    isFeatured?: boolean;
    search?: string;
    amenities?: string[];
    condition?: PropertyCondition;
}

export interface PropertySearchParams {
    page?: number;
    limit?: number;
    sort?:
    | 'price_asc'
    | 'price_desc'
    | 'size_asc'
    | 'size_desc'
    | 'date_desc'
    | 'date_asc'
    | 'views_desc';
    filter?: PropertyFilter;
}

export interface PropertyStats {
    totalProperties: number;
    availableProperties: number;
    soldProperties: number;
    totalValue: number;
    averagePrice: number;
    byType: Record<PropertyType, number>;
    byCity: Record<string, number>;
}

// Helper type guards
export const isTerrainType = (type: PropertyType): boolean => {
    return type.startsWith('TERRAIN_');
};

export const PROPERTY_LEGAL_STATUS_LABELS: Record<PropertyLegalStatus, string> = {
    TITLED: 'TitrÃ©',
    CADASTRAL: 'CadastrÃ©',
    UNTITLED: 'Non titrÃ©',
    LONG_TERM_LEASE: 'Bail long terme',
    CO_OWNERSHIP: 'CopropriÃ©tÃ©',
    COMPANY_OWNED: 'DÃ©tenu par sociÃ©tÃ©',
    OTHER: 'Autre',
};

export const PROPERTY_DOCUMENT_STATUS_LABELS: Record<PropertyDocumentStatus, string> = {
    UNKNOWN: 'Non renseignÃ©',
    PENDING: 'En vÃ©rification',
    PARTIAL: 'Documents partiels',
    VERIFIED: 'Documents vÃ©rifiÃ©s',
};

const isResidentialType = (type: PropertyType): boolean => {
    return ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE', 'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'].includes(type);
};

export const isCommercialType = (type: PropertyType): boolean => {
    return ['OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'].includes(type);
};

// Property type labels for display
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    // Terrains
    TERRAIN_RESIDENTIAL: 'Terrain Résidentiel',
    TERRAIN_COMMERCIAL: 'Terrain Commercial',
    TERRAIN_AGRICULTURAL: 'Terrain Agricole',
    TERRAIN_INDUSTRIAL: 'Terrain Industriel',
    // Maisons & Villas
    VILLA: 'Villa',
    HOUSE: 'Maison',
    TOWNHOUSE: 'Maison de Ville',
    COUNTRY_HOUSE: 'Maison de Campagne',
    // Appartements
    APARTMENT: 'Appartement',
    STUDIO: 'Studio',
    PENTHOUSE: 'Penthouse',
    DUPLEX: 'Duplex',
    LOFT: 'Loft',
    // Commercial
    OFFICE: 'Bureau',
    SHOP: 'Commerce',
    WAREHOUSE: 'Entrepôt',
    BUILDING: 'Immeuble',
    HOTEL: 'Hôtel',
    RESTAURANT: 'Restaurant',
};

// Transaction type labels
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    SALE: 'Vente',
    RENT: 'Location',
    SEASONAL_RENT: 'Location Saisonnière',
};

// Property condition labels
export const PROPERTY_CONDITION_LABELS: Record<PropertyCondition, string> = {
    NEW: 'Neuf',
    EXCELLENT: 'Excellent État',
    GOOD: 'Bon État',
    TO_RENOVATE: 'À Rénover',
    UNDER_CONSTRUCTION: 'En Construction',
};

// Property status labels
export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
    AVAILABLE: 'Disponible',
    RESERVED: 'Réservé',
    SOLD: 'Vendu',
    RENTED: 'Loué',
    DRAFT: 'Brouillon',
    ARCHIVED: 'Archivé',
};

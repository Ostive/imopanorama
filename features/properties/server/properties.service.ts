import { propertyRepository } from '@/infrastructure/database/repositories';
import { logger } from '@/infrastructure/logger/logger';
import {
  scheduleEmbeddingSync,
  updateAffectsEmbedding,
  generateEmbedding,
  searchPropertyIdsByEmbedding,
} from '@/infrastructure/search/embeddings';
import { PropertyType, TransactionType, PropertyStatus, PropertyCondition, PropertyLegalStatus, PropertyDocumentStatus, Prisma } from '@prisma/client';

/* ─── Types ────────────────────────────────────────────────── */

interface PropertyListParams {
  page?: number;
  limit?: number;
  sort?: string;
  view?: 'list' | 'full';
  filter?: {
    ids?: string[];
    propertyType?: string;
    transactionType?: string;
    country?: string;
    region?: string;
    city?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    minRooms?: number;
    minFloor?: number;
    maxFloor?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
    condition?: string;
    isFeatured?: boolean;
    amenities?: string[];
    features?: string[];
    search?: string;
  };
}

interface PropertyListResult {
  data: unknown[];
  total: number;
  page: number;
  totalPages: number;
  statusCounts?: Record<string, number>;
}

interface CreatePropertyData {
  title: string;
  description?: string | null;
  propertyType: PropertyType;
  transactionType: TransactionType;
  location: string;
  city: string;
  country?: string;
  region?: string | null;
  district?: string | null;
  commune?: string | null;
  fokontany?: string | null;
  address?: string | null;
  zipCode?: string | null;
  coordinates?: Prisma.InputJsonValue;
  price: number;
  pricePerM2?: number | null;
  rentPrice?: number | null;
  currency?: string;
  totalSize: number;
  livingSize?: number | null;
  landSize?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  rooms?: number | null;
  floors?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  condition?: PropertyCondition | null;
  features?: string[];
  amenities?: string[];
  images?: string[];
  coverImage?: string | null;
  virtualTour?: string | null;
  videoUrl?: string | null;
  status?: PropertyStatus;
  isFeatured?: boolean;
  isPublished?: boolean;
  reference?: string | null;
  legalStatus?: PropertyLegalStatus | null;
  documentStatus?: PropertyDocumentStatus;
  isVerified?: boolean;
  energyClass?: string | null;
  emissions?: string | null;
  taxFonciere?: number | null;
  charges?: number | null;
  ownerId: string;
}

/* ─── Select fields ────────────────────────────────────────── */

const LIST_SELECT = {
  id: true,
  title: true,
  propertyType: true,
  transactionType: true,
  city: true,
  country: true,
  region: true,
  district: true,
  commune: true,
  fokontany: true,
  location: true,
  price: true,
  pricePerM2: true,
  currency: true,
  totalSize: true,
  bedrooms: true,
  bathrooms: true,
  coverImage: true,
  images: true,
  status: true,
  legalStatus: true,
  documentStatus: true,
  isVerified: true,
  isFeatured: true,
  coordinates: true,
  createdAt: true,
  updatedAt: true,
  views: true,
  description: true,
  amenities: true,
  features: true,
} as const;

/* ─── Bot detection ────────────────────────────────────────── */

const BOT_PATTERNS = /bot|crawl|spider|slurp|baiduspider|yandex|sogou|duckduckbot|semrush|ahrefs|mj12bot|dotbot|petalbot|bytespider|gptbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|discordbot|preview/i;

/* ─── Service ──────────────────────────────────────────────── */

export const propertiesServerService = {
  /**
   * Liste les propriétés avec filtres, tri et pagination
   */
  async list(params: PropertyListParams = {}): Promise<PropertyListResult> {
    const {
      page = 1,
      limit = 12,
      sort: rawSort,
      view = 'list',
      filter = {},
    } = params;

    const skip = (page - 1) * limit;
    const where: Prisma.PropertyWhereInput = {};

    // Public views: only published, non-draft
    if (view !== 'full') {
      where.isPublished = true;
      where.status = { not: 'DRAFT' };
    }

    // Filters
    if (filter.ids && filter.ids.length > 0) {
      where.id = { in: filter.ids };
    }
    if (filter.propertyType) {
      const types = filter.propertyType.split(',') as PropertyType[];
      where.propertyType = { in: types };
    }
    if (filter.transactionType) {
      const types = filter.transactionType.split(',') as TransactionType[];
      where.transactionType = types.length === 1 ? types[0] : { in: types };
    }
    if (filter.country) {
      where.country = filter.country.toUpperCase();
    }
    if (filter.region) {
      where.region = { contains: filter.region, mode: 'insensitive' };
    }
    if (filter.city) {
      where.city = { contains: filter.city, mode: 'insensitive' };
    }
    if (filter.status) {
      const statuses = filter.status.split(',') as PropertyStatus[];
      where.status = statuses.length === 1 ? statuses[0] : { in: statuses };
    }
    if (filter.minPrice || filter.maxPrice) {
      where.price = {};
      if (filter.minPrice) where.price.gte = filter.minPrice;
      if (filter.maxPrice) where.price.lte = filter.maxPrice;
    }
    if (filter.minSize || filter.maxSize) {
      where.totalSize = {};
      if (filter.minSize) where.totalSize.gte = filter.minSize;
      if (filter.maxSize) where.totalSize.lte = filter.maxSize;
    }
    if (filter.minBedrooms || filter.maxBedrooms) {
      where.bedrooms = {};
      if (filter.minBedrooms) where.bedrooms.gte = filter.minBedrooms;
      if (filter.maxBedrooms) where.bedrooms.lte = filter.maxBedrooms;
    }
    if (filter.minBathrooms) {
      where.bathrooms = { gte: filter.minBathrooms };
    }
    if (filter.minRooms) {
      where.rooms = { gte: filter.minRooms };
    }
    if (filter.minFloor !== undefined || filter.maxFloor !== undefined) {
      where.floor = {};
      if (filter.minFloor !== undefined) where.floor.gte = filter.minFloor;
      if (filter.maxFloor !== undefined) where.floor.lte = filter.maxFloor;
    }
    if (filter.minYearBuilt || filter.maxYearBuilt) {
      where.yearBuilt = {};
      if (filter.minYearBuilt) where.yearBuilt.gte = filter.minYearBuilt;
      if (filter.maxYearBuilt) where.yearBuilt.lte = filter.maxYearBuilt;
    }
    if (filter.condition) {
      const conditions = filter.condition.split(',') as PropertyCondition[];
      where.condition = conditions.length === 1 ? conditions[0] : { in: conditions };
    }
    if (filter.isFeatured !== undefined) {
      where.isFeatured = filter.isFeatured;
    }
    if (filter.amenities && filter.amenities.length > 0) {
      where.amenities = { hasEvery: filter.amenities };
    }
    if (filter.features && filter.features.length > 0) {
      where.features = { hasEvery: filter.features };
    }

    // Search: pgvector semantic search with text fallback.
    // - If embeddings work → restrict to matching IDs, sorted by similarity when sort=relevance.
    // - If embeddings unavailable → fall back to ILIKE on title/description/location/city.
    const sort = rawSort || (filter.search ? 'relevance' : 'date_desc');
    let semanticIds: string[] | null = null;

    if (filter.search) {
      const queryVec = await generateEmbedding(filter.search);
      if (queryVec) {
        const hits = await searchPropertyIdsByEmbedding(queryVec, 60).catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Unknown error';
          logger.warn(`pgvector search failed, falling back to text (${message})`);
          return [];
        });
        if (hits.length > 0) {
          semanticIds = hits.map(h => h.id);
        }
      }

      if (semanticIds && semanticIds.length > 0) {
        where.id = { in: semanticIds };
      } else {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
          { location: { contains: filter.search, mode: 'insensitive' } },
          { city: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
    }

    // Order
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'size_asc': orderBy = { totalSize: 'asc' }; break;
      case 'size_desc': orderBy = { totalSize: 'desc' }; break;
      case 'date_asc': orderBy = { createdAt: 'asc' }; break;
      case 'title_asc': orderBy = { title: 'asc' }; break;
      case 'title_desc': orderBy = { title: 'desc' }; break;
      case 'city_asc': orderBy = { city: 'asc' }; break;
      case 'city_desc': orderBy = { city: 'desc' }; break;
      case 'views_desc': orderBy = { views: 'desc' }; break;
      case 'relevance':
      case 'date_desc':
      default: orderBy = { createdAt: 'desc' }; break;
    }

    const select = view === 'list' ? LIST_SELECT : undefined;

    // Relevance ordering: preserve the pgvector-ranked order of semanticIds.
    if (sort === 'relevance' && semanticIds && semanticIds.length > 0) {
      const allMatches = await propertyRepository.findMany({ where, select });
      const rank = new Map(semanticIds.map((id, i) => [id, i]));
      allMatches.sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
      const total = allMatches.length;
      return {
        data: allMatches.slice(skip, skip + limit),
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }

    // Standard query + status counts in parallel
    const [{ data: properties, total }, statusCounts] = await Promise.all([
      propertyRepository.findManyWithCount({
        where, orderBy, skip, take: limit, select,
      }),
      view === 'full' ? Promise.all([
        propertyRepository.count({ status: 'AVAILABLE' }),
        propertyRepository.count({ status: 'RESERVED' }),
        propertyRepository.count({ status: 'SOLD' }),
        propertyRepository.count({ status: 'RENTED' }),
        propertyRepository.count({ status: 'DRAFT' }),
      ]).then(([available, reserved, sold, rented, draft]) => ({
        available, reserved, sold, rented, draft,
      })) : Promise.resolve(undefined),
    ]);

    const data = filter.ids && filter.ids.length > 0
      ? [...properties].sort((a, b) => filter.ids!.indexOf(a.id) - filter.ids!.indexOf(b.id))
      : properties;

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      ...(statusCounts && { statusCounts }),
    };
  },

  /**
   * Récupère une propriété par ID avec incrémentation des vues
   */
  async getById(id: string, userAgent?: string) {
    const property = await propertyRepository.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!property) return null;

    // Incrémenter les vues sauf pour les bots
    if (userAgent && !BOT_PATTERNS.test(userAgent)) {
      await propertyRepository.update(id, { views: { increment: 1 } })
        .catch(err => logger.warn('Failed to increment views:', err));
    }

    return property;
  },

  /**
   * Crée une propriété
   */
  async create(data: CreatePropertyData) {
    const created = await propertyRepository.create({
      title: data.title,
      description: data.description,
      propertyType: data.propertyType,
      transactionType: data.transactionType,
      location: data.location,
      city: data.city,
      country: data.country,
      region: data.region,
      district: data.district,
      commune: data.commune,
      fokontany: data.fokontany,
      address: data.address,
      zipCode: data.zipCode,
      coordinates: data.coordinates,
      price: data.price,
      pricePerM2: data.pricePerM2,
      rentPrice: data.rentPrice,
      currency: data.currency,
      totalSize: data.totalSize,
      livingSize: data.livingSize,
      landSize: data.landSize,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      rooms: data.rooms,
      floors: data.floors,
      floor: data.floor,
      yearBuilt: data.yearBuilt,
      condition: data.condition,
      features: data.features,
      amenities: data.amenities,
      images: data.images,
      coverImage: data.coverImage,
      virtualTour: data.virtualTour,
      videoUrl: data.videoUrl,
      status: data.status,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      reference: data.reference,
      legalStatus: data.legalStatus,
      documentStatus: data.documentStatus,
      isVerified: data.isVerified,
      energyClass: data.energyClass,
      emissions: data.emissions,
      taxFonciere: data.taxFonciere,
      charges: data.charges,
      ownerId: data.ownerId,
      publishedAt: data.isPublished ? new Date() : null,
    });

    scheduleEmbeddingSync(created.id);
    return created;
  },

  /**
   * Met à jour une propriété
   */
  async update(id: string, data: Record<string, unknown>) {
    const existing = await propertyRepository.findUnique({ where: { id } });
    if (!existing) return null;

    const updateData: Record<string, unknown> = { ...data };

    // Gérer publishedAt
    if (data.isPublished === true && !existing.isPublished) {
      updateData.publishedAt = new Date();
    } else if (data.isPublished === false && existing.isPublished) {
      updateData.publishedAt = null;
    }

    const updated = await propertyRepository.update(id, updateData);

    if (updateAffectsEmbedding(updateData)) {
      scheduleEmbeddingSync(id);
    }
    return updated;
  },

  /**
   * Récupère des propriétés similaires à celle donnée.
   *
   * Critères de similarité (par ordre de priorité) :
   * 1. Même ville
   * 2. Même type de bien (ou de la même catégorie : résidentiel, terrain, commercial)
   * 3. Même type de transaction (vente / location)
   * 4. Prix dans une fourchette de ±30 %
   *
   * Retourne au maximum `limit` résultats, excluant la propriété source.
   */
  async getSimilar(id: string, limit = 4) {
    // 1. Récupérer la propriété de référence
    const source = await propertyRepository.findUnique({ where: { id } });
    if (!source) return [];

    const priceMargin = source.price * 0.3;
    const minPrice = Math.max(0, source.price - priceMargin);
    const maxPrice = source.price + priceMargin;

    // Déterminer la catégorie du bien pour élargir si nécessaire
    const categoryTypes = getCategoryTypes(source.propertyType);

    // 2. Requête : même ville + même catégorie + prix similaire
    const candidates = await propertyRepository.findMany({
      where: {
        id: { not: id },
        isPublished: true,
        status: { not: 'DRAFT' },
        OR: [
          // Priorité haute : même ville + même type + prix similaire
          {
            city: source.city,
            propertyType: source.propertyType,
            transactionType: source.transactionType,
            price: { gte: minPrice, lte: maxPrice },
          },
          // Priorité moyenne : même ville + même catégorie
          {
            city: source.city,
            propertyType: { in: categoryTypes },
            transactionType: source.transactionType,
          },
          // Priorité basse : même type de bien partout
          {
            propertyType: source.propertyType,
            transactionType: source.transactionType,
            price: { gte: minPrice, lte: maxPrice },
          },
        ],
      },
      select: LIST_SELECT,
      take: limit * 3, // surdimensionner pour scorer ensuite
      orderBy: { createdAt: 'desc' },
    });

    // 3. Scorer et trier par pertinence
    const scored = candidates.map((candidate) => {
      let score = 0;
      if (candidate.city === source.city) score += 4;
      if (candidate.propertyType === source.propertyType) score += 3;
      if (candidate.transactionType === source.transactionType) score += 2;
      if (candidate.price >= minPrice && candidate.price <= maxPrice) score += 2;
      if (candidate.bedrooms && source.bedrooms && candidate.bedrooms === source.bedrooms) score += 1;
      return { ...candidate, _score: score };
    });

    scored.sort((a, b) => b._score - a._score);

    // 4. Retourner les meilleurs résultats (sans le score interne)
    return scored.slice(0, limit).map(({ _score, ...rest }) => rest);
  },

  /**
   * Supprime une propriété
   */
  async remove(id: string): Promise<boolean> {
    const exists = await propertyRepository.exists(id);
    if (!exists) return false;
    await propertyRepository.delete(id);
    return true;
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Résidentiel types */
const RESIDENTIAL_TYPES: PropertyType[] = ['VILLA', 'HOUSE', 'TOWNHOUSE', 'COUNTRY_HOUSE', 'APARTMENT', 'STUDIO', 'PENTHOUSE', 'DUPLEX', 'LOFT'];
/** Terrain types */
const TERRAIN_TYPES: PropertyType[] = ['TERRAIN_RESIDENTIAL', 'TERRAIN_COMMERCIAL', 'TERRAIN_AGRICULTURAL', 'TERRAIN_INDUSTRIAL'];
/** Commercial types */
const COMMERCIAL_TYPES: PropertyType[] = ['OFFICE', 'SHOP', 'WAREHOUSE', 'BUILDING', 'HOTEL', 'RESTAURANT'];

/**
 * Retourne les types de biens de la même catégorie que le type donné.
 * Permet d'élargir la recherche de similaires au-delà du type exact.
 */
function getCategoryTypes(type: PropertyType): PropertyType[] {
  if (RESIDENTIAL_TYPES.includes(type)) return RESIDENTIAL_TYPES;
  if (TERRAIN_TYPES.includes(type)) return TERRAIN_TYPES;
  if (COMMERCIAL_TYPES.includes(type)) return COMMERCIAL_TYPES;
  return [type];
}

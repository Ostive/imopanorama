import { qdrantClient, COLLECTION_NAME } from './client';
import { generateEmbedding } from './embeddings';

export interface SearchFilters {
  city?: string;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  // Geo-search: find properties within radius (km) of coordinates
  geoLocation?: {
    lat: number;
    lon: number;
    radius: number; // in kilometers
  };
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
}

/**
 * Search properties using semantic search + filters
 */
export async function searchProperties(
  query: string,
  filters?: SearchFilters,
  options?: SearchOptions
) {
  try {
    const { limit = 10, offset = 0 } = options || {};

    // Check if Qdrant is available before proceeding
    try {
      await qdrantClient.getCollections();
    } catch (connectionError: any) {
      if (connectionError.code === 'ECONNREFUSED' || connectionError.cause?.code === 'ECONNREFUSED') {
        console.error('❌ Qdrant connection refused - Docker instance may be down');
        throw new Error('QDRANT_UNAVAILABLE: Qdrant vector database is not accessible. Please ensure Docker is running and Qdrant container is started.');
      }
      throw connectionError;
    }

    // Generate embedding for search query
    const queryEmbedding = await generateEmbedding(query);

    // Build Qdrant filter
    const qdrantFilter: any = {
      must: [],
    };

    // Add filters
    if (filters?.city) {
      qdrantFilter.must.push({
        key: 'city',
        match: { value: filters.city },
      });
    }

    if (filters?.type) {
      qdrantFilter.must.push({
        key: 'type',
        match: { value: filters.type },
      });
    }

    if (filters?.status) {
      qdrantFilter.must.push({
        key: 'status',
        match: { value: filters.status },
      });
    }

    // Price range
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      const priceFilter: any = { key: 'price', range: {} };
      if (filters.minPrice !== undefined) priceFilter.range.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) priceFilter.range.lte = filters.maxPrice;
      qdrantFilter.must.push(priceFilter);
    }

    // Size range
    if (filters?.minSize !== undefined || filters?.maxSize !== undefined) {
      const sizeFilter: any = { key: 'size', range: {} };
      if (filters.minSize !== undefined) sizeFilter.range.gte = filters.minSize;
      if (filters.maxSize !== undefined) sizeFilter.range.lte = filters.maxSize;
      qdrantFilter.must.push(sizeFilter);
    }

    // Geo-location filter (properties within radius)
    if (filters?.geoLocation) {
      qdrantFilter.must.push({
        key: 'coordinates',
        geo_radius: {
          center: {
            lat: filters.geoLocation.lat,
            lon: filters.geoLocation.lon,
          },
          radius: filters.geoLocation.radius * 1000, // Convert km to meters
        },
      });
    }

    // Search in Qdrant
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      filter: qdrantFilter.must.length > 0 ? qdrantFilter : undefined,
      limit,
      offset,
      with_payload: true,
      with_vector: false,
    });

    // Transform results
    const results = searchResult.map((result) => ({
      id: result.id as string,
      score: result.score,
      property: result.payload,
    }));

    return {
      results,
      total: results.length,
      query,
      filters,
    };
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

/**
 * Find similar properties (recommendations)
 */
export async function findSimilarProperties(
  propertyId: string,
  limit: number = 5
) {
  try {
    // Get the property's vector from Qdrant
    const property = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [propertyId],
      with_vector: true,
    });

    if (!property || property.length === 0) {
      throw new Error(`Property ${propertyId} not found in Qdrant`);
    }

    const vector = property[0].vector as number[];

    // Search for similar properties
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector,
      limit: limit + 1, // +1 to exclude the property itself
      with_payload: true,
      with_vector: false,
      filter: {
        must_not: [
          {
            key: 'id',
            match: { value: propertyId },
          },
        ],
      },
    });

    return searchResult.map((result) => ({
      id: result.id as string,
      score: result.score,
      property: result.payload,
    }));
  } catch (error) {
    console.error('Error finding similar properties:', error);
    throw error;
  }
}

/**
 * Get properties near a location
 */
export async function getPropertiesByLocation(
  lat: number,
  lon: number,
  radiusKm: number = 10,
  limit: number = 10
) {
  try {
    const scrollResult = await qdrantClient.scroll(COLLECTION_NAME, {
      filter: {
        must: [
          {
            key: 'coordinates',
            geo_radius: {
              center: { lat, lon },
              radius: radiusKm * 1000, // Convert to meters
            },
          },
        ],
      },
      limit,
      with_payload: true,
      with_vector: false,
    });

    return scrollResult.points.map((point) => ({
      id: point.id as string,
      property: point.payload,
    }));
  } catch (error) {
    console.error('Error getting properties by location:', error);
    throw error;
  }
}

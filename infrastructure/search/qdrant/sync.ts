import { prisma } from '@/infrastructure/database/prisma';
import { qdrantClient, COLLECTION_NAME } from './client';
import { generateEmbedding, createPropertySearchText } from './embeddings';

/**
 * Sync a single property to Qdrant
 */
export async function syncPropertyToQdrant(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new Error(`Property ${propertyId} not found`);
    }

    // Create searchable text
    const searchText = createPropertySearchText(property);

    // Generate embedding
    const embedding = await generateEmbedding(searchText);

    // Prepare coordinates
    const coordinates = property.coordinates as any;
    const geoPoint = coordinates?.lat && coordinates?.lng
      ? { lat: coordinates.lat, lon: coordinates.lng }
      : null;

    // Upsert to Qdrant
    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: propertyId,
          vector: embedding,
          payload: {
            id: property.id,
            title: property.title,
            description: property.description,
            location: property.location,
            city: property.city,
            type: property.propertyType,
            status: property.status,
            price: property.price,
            pricePerM2: property.pricePerM2,
            size: property.totalSize,
            features: property.features,
            amenities: property.amenities,
            images: property.images,
            coordinates: geoPoint,
            createdAt: property.createdAt.toISOString(),
            updatedAt: property.updatedAt.toISOString(),
          },
        },
      ],
    });

    console.log(`✅ Synced property ${propertyId} to Qdrant`);
  } catch (error) {
    console.error(`Error syncing property ${propertyId}:`, error);
    throw error;
  }
}

/**
 * Sync all properties from PostgreSQL to Qdrant
 */
export async function syncAllPropertiesToQdrant() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        isPublished: true,
        status: {
          in: ['AVAILABLE', 'RESERVED'], // Don't sync sold/archived properties
        },
      },
    });

    console.log(`📊 Found ${properties.length} properties to sync`);

    let synced = 0;
    let failed = 0;

    for (const property of properties) {
      try {
        await syncPropertyToQdrant(property.id);
        synced++;
      } catch (error) {
        console.error(`Failed to sync property ${property.id}:`, error);
        failed++;
      }
    }

    console.log(`✅ Sync complete: ${synced} synced, ${failed} failed`);
    return { synced, failed, total: properties.length };
  } catch (error) {
    console.error('Error syncing all properties:', error);
    throw error;
  }
}

/**
 * Delete a property from Qdrant
 */
export async function deletePropertyFromQdrant(propertyId: string) {
  try {
    await qdrantClient.delete(COLLECTION_NAME, {
      wait: true,
      points: [propertyId],
    });

    console.log(`✅ Deleted property ${propertyId} from Qdrant`);
  } catch (error) {
    console.error(`Error deleting property ${propertyId}:`, error);
    throw error;
  }
}

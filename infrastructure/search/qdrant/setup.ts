import { qdrantClient, COLLECTION_NAME, VECTOR_SIZE } from './client';

/**
 * Initialize Qdrant collection for terrains
 */
export async function initializeQdrantCollection() {
  try {
    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === COLLECTION_NAME
    );

    if (collectionExists) {
      console.log(`✅ Collection "${COLLECTION_NAME}" already exists`);
      return;
    }

    // Create collection
    await qdrantClient.createCollection(COLLECTION_NAME, {
      vectors: {
        size: VECTOR_SIZE,
        distance: 'Cosine', // Cosine similarity for embeddings
      },
      optimizers_config: {
        default_segment_number: 2,
      },
      replication_factor: 1,
    });

    // Create payload indexes for filtering
    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'city',
      field_schema: 'keyword',
    });

    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'type',
      field_schema: 'keyword',
    });

    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'status',
      field_schema: 'keyword',
    });

    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'price',
      field_schema: 'float',
    });

    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'size',
      field_schema: 'float',
    });

    // Create geo index for location-based search
    await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
      field_name: 'coordinates',
      field_schema: 'geo',
    });

    console.log(`✅ Collection "${COLLECTION_NAME}" created successfully`);
  } catch (error) {
    console.error('Error initializing Qdrant collection:', error);
    throw error;
  }
}

/**
 * Delete collection (useful for reset)
 */
export async function deleteQdrantCollection() {
  try {
    await qdrantClient.deleteCollection(COLLECTION_NAME);
    console.log(`✅ Collection "${COLLECTION_NAME}" deleted`);
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
}

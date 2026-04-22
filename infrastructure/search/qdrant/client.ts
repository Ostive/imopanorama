import { QdrantClient } from '@qdrant/js-client-rest';

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
  checkCompatibility: false, // Skip version check during build
});

export const COLLECTION_NAME = 'properties';
export const VECTOR_SIZE = 384; // Hugging Face all-MiniLM-L6-v2 dimension (FREE!)

import { HfInference } from '@huggingface/inference';

// FREE Hugging Face API (no cost!)
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// FREE model for embeddings - Multilingual is better for French content
const EMBEDDING_MODEL = process.env.HUGGINGFACE_EMBEDDING_MODEL || 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2';

/**
 * Generate embeddings for text using FREE Hugging Face
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await hf.featureExtraction({
      model: EMBEDDING_MODEL,
      inputs: text,
    });

    // Response is already an array of numbers
    return response as number[];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const embeddings = await Promise.all(
      texts.map(text => generateEmbedding(text))
    );
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Helper to translate property types for better headers
 */
function formatPropertyType(type: string): string {
  const map: Record<string, string> = {
    'TERRAIN_RESIDENTIAL': 'Terrain Résidentiel',
    'TERRAIN_COMMERCIAL': 'Terrain Commercial',
    'TERRAIN_AGRICULTURAL': 'Terrain Agricole',
    'TERRAIN_INDUSTRIAL': 'Terrain Industriel',
    'VILLA': 'Villa',
    'HOUSE': 'Maison',
    'APARTMENT': 'Appartement',
    'OFFICE': 'Bureau',
    'SHOP': 'Local Commercial',
  };
  return map[type] || type.replace(/_/g, ' ').toLowerCase();
}

/**
 * Create searchable text from property data
 * ENHANCED: Uses structured format for better semantic understanding
 */
export function createPropertySearchText(property: {
  title: string;
  description?: string | null;
  location: string;
  city: string;
  propertyType: string;
  features: string[];
  amenities: string[];
}): string {
  // We create a "Semantic Document" that describes the property naturally
  const typeNatural = formatPropertyType(property.propertyType);

  // Simplifed structure to prioritize keywords over sentence structure
  const parts = [
    // Highest priority: Title and Location (keywords)
    property.title,
    `${formatPropertyType(property.propertyType)} à ${property.city} ${property.location}`,

    // Medium priority: Description
    property.description || '',

    // Keywords
    property.features.join(' '),
    property.amenities.join(' ')
  ];

  return parts.filter(Boolean).join('. ');
}

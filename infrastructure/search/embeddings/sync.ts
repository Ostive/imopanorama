import { prisma } from '@/infrastructure/database/prisma'
import { logger } from '@/infrastructure/logger/logger'
import { buildEmbeddingText } from './text-builder'
import { generateEmbedding } from './openai'
import { updatePropertyEmbedding } from './repository'

/**
 * Property fields that contribute to the embedding text.
 * If a property update doesn't touch any of these, we skip re-embedding.
 */
const EMBEDDABLE_FIELDS = new Set([
  'title', 'description',
  'propertyType', 'transactionType',
  'city', 'location', 'address',
  'totalSize', 'livingSize', 'landSize',
  'bedrooms', 'bathrooms', 'rooms', 'floor',
  'yearBuilt', 'condition',
  'amenities', 'features',
])

/**
 * Generates and stores the embedding for a property.
 * Swallows errors (logs them) — the property write itself must not fail
 * because semantic search is degraded.
 */
async function syncPropertyEmbedding(propertyId: string): Promise<void> {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) return

    const text = buildEmbeddingText(property)
    const vec = await generateEmbedding(text)
    if (vec) {
      await updatePropertyEmbedding(propertyId, vec)
      logger.debug(`Embedding synced for property ${propertyId}`)
    }
  } catch (err) {
    logger.warn(`Failed to sync embedding for property ${propertyId}`, {
      err: (err as Error).message,
    })
  }
}

/**
 * Schedules a non-blocking embedding sync. Use after create/update when you
 * don't want to delay the HTTP response on the OpenAI round-trip.
 */
export function scheduleEmbeddingSync(propertyId: string): void {
  void syncPropertyEmbedding(propertyId)
}

/**
 * Returns true if any of the updated fields would change the embedding text.
 */
export function updateAffectsEmbedding(updateData: Record<string, unknown>): boolean {
  for (const key of Object.keys(updateData)) {
    if (EMBEDDABLE_FIELDS.has(key)) return true
  }
  return false
}

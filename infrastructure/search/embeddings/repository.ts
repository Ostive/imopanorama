import { prisma } from '@/infrastructure/database/prisma'
import { logger } from '@/infrastructure/logger/logger'

/**
 * Serializes a JS number[] to the pgvector text format `[1.23,4.56,...]`.
 */
function vectorLiteral(v: number[]): string {
  return `[${v.join(',')}]`
}

/**
 * Writes the embedding for a property. No-op (with warning) if the vector is empty.
 */
export async function updatePropertyEmbedding(
  propertyId: string,
  vector: number[]
): Promise<void> {
  if (!vector || vector.length === 0) {
    logger.warn(`Skipped embedding update for ${propertyId}: empty vector`)
    return
  }
  const literal = vectorLiteral(vector)
  await prisma.$executeRaw`
    UPDATE "Property"
    SET "embedding" = ${literal}::vector
    WHERE "id" = ${propertyId}
  `
}

async function clearPropertyEmbedding(propertyId: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE "Property"
    SET "embedding" = NULL
    WHERE "id" = ${propertyId}
  `
}

export interface VectorSearchHit {
  id: string
  score: number // 1 - cosine_distance, so 1.0 = identical
}

/**
 * Returns property IDs ranked by cosine similarity to the query vector.
 * Only matches published, non-DRAFT properties that actually have an embedding.
 */
export async function searchPropertyIdsByEmbedding(
  queryVector: number[],
  limit = 60
): Promise<VectorSearchHit[]> {
  if (!queryVector || queryVector.length === 0) return []
  const literal = vectorLiteral(queryVector)

  const rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
    SELECT
      "id",
      ("embedding" <=> ${literal}::vector) AS distance
    FROM "Property"
    WHERE "embedding" IS NOT NULL
      AND "isPublished" = true
      AND "status" <> 'DRAFT'
    ORDER BY "embedding" <=> ${literal}::vector
    LIMIT ${limit}
  `

  return rows.map(r => ({
    id: r.id,
    score: 1 - Number(r.distance),
  }))
}

/**
 * Lists property IDs that don't have an embedding yet — used by the backfill script.
 */
async function listPropertiesWithoutEmbedding(limit = 500): Promise<string[]> {
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id"
    FROM "Property"
    WHERE "embedding" IS NULL
    ORDER BY "createdAt" ASC
    LIMIT ${limit}
  `
  return rows.map(r => r.id)
}

/**
 * Reusable property-embedding (re)index logic.
 *
 * Two modes:
 * - `'missing'`: only rows whose embedding IS NULL (cheap, default after migrations / new props).
 * - `'force'`:   re-embed every row (expensive, costs OpenAI tokens).
 *
 * Used by:
 * - scripts/backfill-embeddings.ts (CLI)
 * - app/api/admin/search/reindex/route.ts (admin UI button)
 *
 * Returns counters + reports progress via the optional `onProgress` callback,
 * so the API endpoint can keep a job-status object up to date for polling.
 */

import { prisma } from '@/infrastructure/database/prisma'
import { logger } from '@/infrastructure/logger/logger'
import { buildEmbeddingText } from './text-builder'
import { generateEmbeddingsBatch } from './openai'
import { updatePropertyEmbedding } from './repository'

export type ReindexMode = 'missing' | 'force'

export interface ReindexProgress {
  processed: number
  succeeded: number
  failed: number
  total: number
}

export interface ReindexResult extends ReindexProgress {
  durationMs: number
  mode: ReindexMode
}

const BATCH_SIZE = 50

async function fetchTotal(mode: ReindexMode): Promise<number> {
  if (mode === 'force') {
    const rows = await prisma.$queryRaw<Array<{ n: bigint }>>`SELECT COUNT(*) AS n FROM "Property"`
    return Number(rows[0]?.n ?? 0)
  }
  const rows = await prisma.$queryRaw<Array<{ n: bigint }>>`
    SELECT COUNT(*) AS n FROM "Property" WHERE "embedding" IS NULL
  `
  return Number(rows[0]?.n ?? 0)
}

/**
 * Fetches one batch of property IDs to (re)index.
 *
 * - `'missing'` uses `WHERE embedding IS NULL` and shrinks naturally as rows are filled.
 * - `'force'` paginates by id cursor (stable across batches even though embedding rewrites don't drop rows).
 */
async function fetchBatch(mode: ReindexMode, cursor: string | null): Promise<string[]> {
  if (mode === 'force') {
    const rows = cursor
      ? await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "Property" WHERE "id" > ${cursor}
          ORDER BY "id" ASC LIMIT ${BATCH_SIZE}
        `
      : await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "Property"
          ORDER BY "id" ASC LIMIT ${BATCH_SIZE}
        `
    return rows.map(r => r.id)
  }
  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "Property" WHERE "embedding" IS NULL
    ORDER BY "id" ASC LIMIT ${BATCH_SIZE}
  `
  return rows.map(r => r.id)
}

/**
 * (Re)index every property matching `mode`.
 * Calls `onProgress` after each batch so the caller can publish status.
 */
export async function reindexPropertyEmbeddings(
  mode: ReindexMode,
  onProgress?: (p: ReindexProgress) => void
): Promise<ReindexResult> {
  const startedAt = Date.now()
  const total = await fetchTotal(mode)

  let processed = 0
  let succeeded = 0
  let failed = 0
  let cursor: string | null = null

  while (true) {
    const ids = await fetchBatch(mode, cursor)
    if (ids.length === 0) break

    const properties = await prisma.property.findMany({ where: { id: { in: ids } } })
    const texts = properties.map(p => buildEmbeddingText(p))
    const vectors = await generateEmbeddingsBatch(texts)

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      const vec = vectors[i]
      if (vec) {
        try {
          await updatePropertyEmbedding(property.id, vec)
          succeeded++
        } catch (err) {
          failed++
          logger.warn(`Reindex ${property.id} failed`, { err: (err as Error).message })
        }
      } else {
        failed++
      }
      processed++
    }

    onProgress?.({ processed, succeeded, failed, total })

    if (mode === 'force') {
      cursor = ids[ids.length - 1]
      if (ids.length < BATCH_SIZE) break
    } else if (ids.length < BATCH_SIZE) {
      break
    }
  }

  return { processed, succeeded, failed, total, mode, durationMs: Date.now() - startedAt }
}

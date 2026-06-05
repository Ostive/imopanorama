/**
 * Backfill pgvector embeddings for properties that don't have one yet.
 *
 * Usage:
 *   npx ts-node scripts/backfill-embeddings.ts
 *   npx ts-node scripts/backfill-embeddings.ts --force   # re-embed everything
 *
 * Requires OPENAI_API_KEY in the environment.
 */

import 'dotenv/config'
import { prisma } from '../infrastructure/database/prisma'
import {
  buildEmbeddingText,
  generateEmbeddingsBatch,
  updatePropertyEmbedding,
} from '../infrastructure/search/embeddings'

const BATCH_SIZE = 50
const force = process.argv.includes('--force')

/**
 * Fetches a batch of property IDs needing embedding.
 * - default: rows whose embedding IS NULL (so completed rows drop out naturally).
 * - --force: cursor-paginated over all rows.
 */
async function fetchBatch(cursor: string | null): Promise<string[]> {
  if (force) {
    const rows = cursor
      ? await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "Property"
          WHERE "id" > ${cursor}
          ORDER BY "id" ASC
          LIMIT ${BATCH_SIZE}
        `
      : await prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id" FROM "Property"
          ORDER BY "id" ASC
          LIMIT ${BATCH_SIZE}
        `
    return rows.map(r => r.id)
  }

  const rows = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT "id" FROM "Property"
    WHERE "embedding" IS NULL
    ORDER BY "id" ASC
    LIMIT ${BATCH_SIZE}
  `
  return rows.map(r => r.id)
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set. Aborting.')
    process.exit(1)
  }

  console.log('===============================')
  console.log('  Backfill pgvector embeddings')
  console.log(`  Mode: ${force ? 'FORCE (re-embed all)' : 'missing only'}`)
  console.log('===============================')

  let processed = 0
  let succeeded = 0
  let failed = 0
  let cursor: string | null = null

  while (true) {
    const ids = await fetchBatch(cursor)
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
          console.error(`  ✗ ${property.id}: ${(err as Error).message}`)
        }
      } else {
        failed++
        console.error(`  ✗ ${property.id}: no vector returned`)
      }
      processed++
    }

    console.log(`  ${processed} processed (${succeeded} ok, ${failed} failed)`)

    if (force) {
      cursor = ids[ids.length - 1]
      if (ids.length < BATCH_SIZE) break
    } else if (ids.length < BATCH_SIZE) {
      break
    }
  }

  console.log('===============================')
  console.log(`  Done: ${succeeded} succeeded, ${failed} failed (${processed} total)`)
  console.log('===============================')

  await prisma.$disconnect()
}

main().catch(async err => {
  console.error('Fatal error:', err)
  await prisma.$disconnect()
  process.exit(1)
})

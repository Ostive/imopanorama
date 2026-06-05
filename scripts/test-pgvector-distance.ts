import 'dotenv/config'
import { prisma } from '../infrastructure/database/prisma'
import { searchPropertyIdsByEmbedding } from '../infrastructure/search/embeddings/repository'
import { EMBEDDING_DIMENSIONS } from '../infrastructure/search/embeddings/openai'

async function main() {
  // 1) Combien de Property ont une embedding ?
  const counts = await prisma.$queryRaw<Array<{ total: bigint; with_emb: bigint; without_emb: bigint }>>`
    SELECT
      COUNT(*) AS total,
      COUNT("embedding") AS with_emb,
      COUNT(*) FILTER (WHERE "embedding" IS NULL) AS without_emb
    FROM "Property"
  `
  console.log('Property embedding coverage:')
  console.table(
    counts.map(r => ({
      total: Number(r.total),
      with_embedding: Number(r.with_emb),
      without_embedding: Number(r.without_emb),
    }))
  )

  // 2) Échantillon de quelques embeddings (juste pour confirmer qu'elles existent)
  const sample = await prisma.$queryRaw<Array<{ id: string; dims: number | null }>>`
    SELECT "id", CASE WHEN "embedding" IS NULL THEN NULL ELSE vector_dims("embedding") END AS dims
    FROM "Property"
    ORDER BY "createdAt" DESC
    LIMIT 5
  `
  console.log('\nSample (id, vector dims):')
  console.table(sample)

  // 3) Test brut : opérateur <=> (cosine distance) avec un vecteur factice (zéro sauf [0]=1)
  //    Ne renvoie pas du sens, mais vérifie que l'opérateur et l'index marchent.
  const fake = new Array(EMBEDDING_DIMENSIONS).fill(0)
  fake[0] = 1
  const literal = `[${fake.join(',')}]`

  console.log('\nRaw <=> query against fake unit vector (top 5 by cosine distance)…')
  const rows = await prisma.$queryRaw<Array<{ id: string; distance: number }>>`
    SELECT "id", ("embedding" <=> ${literal}::vector) AS distance
    FROM "Property"
    WHERE "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${literal}::vector
    LIMIT 5
  `
  console.table(
    rows.map(r => ({
      id: r.id.slice(0, 8) + '…',
      distance: Number(r.distance).toFixed(6),
      similarity: (1 - Number(r.distance)).toFixed(6),
    }))
  )

  // 4) EXPLAIN — confirme que l'index HNSW est utilisé
  const plan = await prisma.$queryRaw<Array<{ 'QUERY PLAN': string }>>`
    EXPLAIN (FORMAT TEXT)
    SELECT "id"
    FROM "Property"
    WHERE "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${literal}::vector
    LIMIT 5
  `
  console.log('\nEXPLAIN:')
  for (const row of plan) console.log('  ' + row['QUERY PLAN'])

  // 5) Test via le helper applicatif (même chemin que l'API)
  console.log('\nVia searchPropertyIdsByEmbedding(fakeVec, 5):')
  const hits = await searchPropertyIdsByEmbedding(fake, 5)
  console.table(
    hits.map(h => ({ id: h.id.slice(0, 8) + '…', score: Number(h.score).toFixed(6) }))
  )

  await prisma.$disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })

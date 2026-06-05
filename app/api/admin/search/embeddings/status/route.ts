/**
 * @module api/admin/search/embeddings/status
 * @description Admin-only embedding coverage stats: total / with / without embeddings,
 * plus a quick pgvector extension health check.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/infrastructure/auth/auth-guard'
import { withErrorHandler } from '@/infrastructure/middleware/api-handler'
import { prisma } from '@/infrastructure/database/prisma'
import { EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from '@/infrastructure/search/embeddings'

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request)
  if (!authorized) return errorResponse!

  const coverageRows = await prisma.$queryRaw<Array<{ total: bigint; with_emb: bigint }>>`
    SELECT COUNT(*) AS total, COUNT("embedding") AS with_emb FROM "Property"
  `
  const total = Number(coverageRows[0]?.total ?? 0)
  const withEmbedding = Number(coverageRows[0]?.with_emb ?? 0)

  const extRows = await prisma.$queryRaw<Array<{ extversion: string | null }>>`
    SELECT extversion FROM pg_extension WHERE extname = 'vector'
  `
  const pgvectorVersion = extRows[0]?.extversion ?? null

  return NextResponse.json({
    success: true,
    coverage: {
      total,
      withEmbedding,
      withoutEmbedding: total - withEmbedding,
      percent: total === 0 ? 0 : Math.round((withEmbedding / total) * 100),
    },
    pgvector: {
      installed: Boolean(pgvectorVersion),
      version: pgvectorVersion,
    },
    embedding: {
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY),
    },
  })
})

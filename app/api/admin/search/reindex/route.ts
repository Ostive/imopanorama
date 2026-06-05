/**
 * @module api/admin/search/reindex
 * @description Admin-only endpoints to (re)index property embeddings (pgvector).
 *
 * | Method | Description                                                                            |
 * |--------|----------------------------------------------------------------------------------------|
 * | POST   | Start a reindex job. Body: `{ mode: 'missing' | 'force' }`. Returns 202 + initial state.|
 * | GET    | Current job state (status, progress, last run). Used by the admin UI polling loop.     |
 *
 * Job state is held in-memory in a module singleton — a single PM2 process is assumed.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/infrastructure/auth/auth-guard'
import { withErrorHandler, apiError } from '@/infrastructure/middleware/api-handler'
import { logger } from '@/infrastructure/logger/logger'
import {
  startReindexJob,
  getReindexJobState,
  isReindexRunning,
  type ReindexMode,
} from '@/infrastructure/search/embeddings'

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse, session } = await requireAdmin(request)
  if (!authorized) return errorResponse!

  if (!process.env.OPENAI_API_KEY) {
    return apiError("OPENAI_API_KEY n'est pas configurée sur le serveur.", 503)
  }

  if (isReindexRunning()) {
    return apiError('Un job de réindexation est déjà en cours.', 409)
  }

  const body = (await request.json().catch(() => ({}))) as { mode?: string }
  const mode: ReindexMode = body.mode === 'force' ? 'force' : 'missing'

  const state = startReindexJob(mode)
  logger.info(`Reindex job started by ${session?.user.email} (mode=${mode})`)

  return NextResponse.json({ success: true, job: state }, { status: 202 })
})

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { authorized, errorResponse } = await requireAdmin(request)
  if (!authorized) return errorResponse!
  return NextResponse.json({ success: true, job: getReindexJobState() })
})

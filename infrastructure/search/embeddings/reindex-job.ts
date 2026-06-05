/**
 * In-memory tracker for the singleton reindex job.
 *
 * Single Next.js process (PM2 cluster size = 1) → a module-level singleton is enough.
 * If the app ever scales to multiple instances, swap this for Redis-backed state.
 */

import { reindexPropertyEmbeddings, type ReindexMode, type ReindexProgress } from './reindex'
import { logger } from '@/infrastructure/logger/logger'

export type JobStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface JobState extends ReindexProgress {
  status: JobStatus
  mode: ReindexMode | null
  startedAt: string | null
  finishedAt: string | null
  durationMs: number | null
  error: string | null
}

const initial: JobState = {
  status: 'idle',
  mode: null,
  processed: 0,
  succeeded: 0,
  failed: 0,
  total: 0,
  startedAt: null,
  finishedAt: null,
  durationMs: null,
  error: null,
}

let state: JobState = { ...initial }

export function getReindexJobState(): JobState {
  return { ...state }
}

export function isReindexRunning(): boolean {
  return state.status === 'running'
}

/**
 * Kicks off a reindex in the background.
 *
 * Returns immediately with a snapshot of the initial running state.
 * Throws if a job is already running — the caller should poll `getReindexJobState`
 * (or call `isReindexRunning` first) to avoid a 409.
 */
export function startReindexJob(mode: ReindexMode): JobState {
  if (state.status === 'running') {
    throw new Error('A reindex job is already running')
  }

  state = {
    ...initial,
    status: 'running',
    mode,
    startedAt: new Date().toISOString(),
  }

  // Fire and forget — caller doesn't await the work, polls instead.
  void (async () => {
    try {
      const result = await reindexPropertyEmbeddings(mode, p => {
        state = { ...state, ...p }
      })
      state = {
        ...state,
        status: 'completed',
        processed: result.processed,
        succeeded: result.succeeded,
        failed: result.failed,
        total: result.total,
        finishedAt: new Date().toISOString(),
        durationMs: result.durationMs,
      }
      logger.info('Reindex job completed', result)
    } catch (err) {
      state = {
        ...state,
        status: 'failed',
        finishedAt: new Date().toISOString(),
        durationMs: state.startedAt ? Date.now() - new Date(state.startedAt).getTime() : null,
        error: (err as Error).message,
      }
      logger.error('Reindex job failed', err)
    }
  })()

  return { ...state }
}

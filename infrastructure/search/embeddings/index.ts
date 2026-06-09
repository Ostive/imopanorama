export {
  generateEmbedding,
  generateEmbeddingsBatch,
  EMBEDDING_MODEL,
  EMBEDDING_DIMENSIONS,
} from './openai'
export { buildEmbeddingText, type EmbeddingTextSource } from './text-builder'
export {
  updatePropertyEmbedding,
  searchPropertyIdsByEmbedding,
  type VectorSearchHit,
} from './repository'
export {
  scheduleEmbeddingSync,
  updateAffectsEmbedding,
} from './sync'
export {
  reindexPropertyEmbeddings,
  type ReindexMode,
  type ReindexProgress,
  type ReindexResult,
} from './reindex'
export {
  getReindexJobState,
  isReindexRunning,
  startReindexJob,
  type JobState,
  type JobStatus,
} from './reindex-job'

-- Ensure pgvector is enabled in this database (idempotent — usually already done by docker/postgres/init/01-extensions.sql).
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column for semantic search (pgvector)
-- Dimensions = 1536 (matches OpenAI text-embedding-3-small)
-- Nullable so existing rows remain valid until backfilled.
ALTER TABLE "Property" ADD COLUMN "embedding" vector(1536);

-- HNSW index for fast cosine-similarity search.
-- Uses vector_cosine_ops because we'll query with the `<=>` operator.
-- m=16, ef_construction=64 are the pgvector defaults — fine for our catalog size.
CREATE INDEX "Property_embedding_hnsw_idx"
  ON "Property"
  USING hnsw ("embedding" vector_cosine_ops);

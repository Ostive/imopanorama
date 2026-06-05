import OpenAI from 'openai'
import { logger } from '@/infrastructure/logger/logger'

export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const EMBEDDING_DIMENSIONS = 1536

let _client: OpenAI | null = null

function getClient(): OpenAI {
  if (_client) return _client
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set')
  }
  _client = new OpenAI({ apiKey })
  return _client
}

/**
 * Generates an embedding vector for a single text input.
 * Returns null on failure — callers should decide how to handle missing embeddings.
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  const input = text.trim()
  if (!input) return null

  try {
    const res = await getClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input,
    })
    return res.data[0]?.embedding ?? null
  } catch (err) {
    logger.warn('OpenAI embedding generation failed', { err: (err as Error).message })
    return null
  }
}

/**
 * Batch variant — OpenAI accepts up to 2048 inputs per request.
 * Returns an array aligned 1:1 with inputs; a slot is null if the API rejected it.
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<(number[] | null)[]> {
  if (texts.length === 0) return []
  const cleaned = texts.map(t => t.trim())

  try {
    const res = await getClient().embeddings.create({
      model: EMBEDDING_MODEL,
      input: cleaned.map(t => t || ' '),
    })
    return cleaned.map((t, i) => (t ? res.data[i]?.embedding ?? null : null))
  } catch (err) {
    logger.warn('OpenAI batch embedding failed', { err: (err as Error).message, batch: texts.length })
    return texts.map(() => null)
  }
}

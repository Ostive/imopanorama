/**
 * @module infrastructure/cache
 * @description Redis-backed caching layer with graceful degradation.
 *
 * When Redis is unavailable the `cached()` helper transparently falls back to
 * calling the `fetcher` directly, ensuring the application remains functional
 * (just without caching).
 *
 * ## Usage
 * ```ts
 * import { cached, invalidateCache } from '@/infrastructure/cache';
 *
 * const data = await cached('myKey', () => fetchExpensiveData(), 120);
 * await invalidateCache('myKey');
 * ```
 */

import { redis, isRedisAvailable } from './redis';

/** Default time-to-live in seconds when none is provided. */
const DEFAULT_TTL = 60;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return cached data for `key`, or invoke `fetcher` and store the result.
 *
 * @param key     - Redis cache key.
 * @param fetcher - Async function that produces the data when the cache misses.
 * @param ttl     - Time-to-live in seconds (default `60`).
 * @returns The (possibly cached) data of type `T`.
 */
export async function cached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  // Skip Redis entirely if unavailable — go straight to fetcher
  if (!redis || !isRedisAvailable()) return fetcher();

  // Attempt to read from cache
  try {
    const raw = await redis.get(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // Redis down – proceed to fetcher
  }

  const data = await fetcher();

  // Attempt to write to cache
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  } catch {
    // Redis down – ignore
  }

  return data;
}

/**
 * Invalidate a single cache key **or** a glob pattern (e.g. `"news:*"`).
 *
 * @param pattern - Exact key or glob pattern to invalidate.
 */
export async function invalidateCache(pattern: string): Promise<void> {
  if (!redis || !isRedisAvailable()) return;
  try {
    if (pattern.includes('*')) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) await redis.del(...keys);
    } else {
      await redis.del(pattern);
    }
  } catch {
    // Redis down – ignore
  }
}

/**
 * Build a cache key from multiple segments, filtering out falsy values.
 *
 * @example
 * ```ts
 * cacheKey('properties', page, status); // "properties:1:active"
 * ```
 */
export function cacheKey(...parts: (string | number | undefined)[]): string {
  return parts.filter(Boolean).join(':');
}

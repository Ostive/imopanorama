import { NextResponse } from 'next/server';
import { logger } from '@/infrastructure/logger/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Per-IP sliding-window bucket. */
interface RateLimitEntry {
  /** Number of requests received inside the current window. */
  count: number;
  /** Unix-ms timestamp at which the window resets. */
  resetTime: number;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Maximum requests allowed per IP inside `TIME_WINDOW_MS`. */
const MAX_REQUESTS = 5;

/** Sliding window duration in milliseconds (1 minute). */
const TIME_WINDOW_MS = 60 * 1_000;

/** Purge expired entries when the store exceeds this size. */
const CLEANUP_THRESHOLD = 100;

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

/**
 * Simple in-memory rate-limit store keyed by client IP.
 *
 * > ⚠️ In a multi-instance / serverless deployment this should be replaced
 * > with a shared store (e.g. Redis) to ensure consistent enforcement.
 */
const store = new Map<string, RateLimitEntry>();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * IP-based rate limiter for form-submission endpoints.
 *
 * Call at the **top** of a route handler:
 * ```ts
 * export const POST = withErrorHandler(async (req) => {
 *   const limited = rateLimiter(req);
 *   if (limited) return limited;           // 429 response
 *   // … handle request normally
 * });
 * ```
 *
 * @returns A `429` JSON response if the limit is exceeded, or `null` to
 *          indicate the request may proceed.
 */
export function rateLimiter(request: Request): NextResponse | null {
  const ip = extractClientIp(request);
  const now = Date.now();

  // Reset or initialise bucket
  const entry = store.get(ip);
  if (!entry || entry.resetTime < now) {
    store.set(ip, { count: 1, resetTime: now + TIME_WINDOW_MS });
    return null;
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`);

    // Periodic cleanup to prevent unbounded memory growth
    if (store.size > CLEANUP_THRESHOLD) purgeExpired();

    return NextResponse.json(
      { success: false, error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
      { status: 429 },
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/** Best-effort extraction of the originating client IP. */
function extractClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

/** Remove all entries whose window has already expired. */
function purgeExpired(): void {
  const now = Date.now();
  for (const [ip, entry] of store) {
    if (entry.resetTime < now) store.delete(ip);
  }
}

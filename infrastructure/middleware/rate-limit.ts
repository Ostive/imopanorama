import { NextRequest, NextResponse } from 'next/server';

import { isRedisAvailable, redis } from '@/infrastructure/cache/redis';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientKey(request: NextRequest, scope: string): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  return `${scope}:${ip}`;
}

export async function rateLimit(
  request: NextRequest,
  options: { scope: string; limit: number; windowMs: number }
): Promise<NextResponse | null> {
  const now = Date.now();
  const key = getClientKey(request, options.scope);

  if (redis && isRedisAvailable()) {
    try {
      const redisKey = `rate-limit:${key}`;
      const count = await redis.incr(redisKey);

      if (count === 1) {
        await redis.pexpire(redisKey, options.windowMs);
      }

      if (count <= options.limit) return null;

      const ttl = await redis.pttl(redisKey);
      const retryAfter = Math.max(1, Math.ceil(ttl / 1000));

      return NextResponse.json(
        { success: false, error: 'Trop de requetes. Reessayez plus tard.' },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    } catch {
      // Fall back to in-memory limiting if Redis is temporarily unavailable.
    }
  }

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  current.count += 1;
  if (current.count <= options.limit) return null;

  const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  return NextResponse.json(
    { success: false, error: 'Trop de requetes. Reessayez plus tard.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  );
}

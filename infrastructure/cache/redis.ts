import Redis from "ioredis";

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
  redisDisabled: boolean;
};

// Once Redis fails too many times we mark it as disabled for the process
// lifetime so cached() goes straight to the DB fetcher with zero delay.
let consecutiveErrors = 0;
const MAX_ERRORS = 3;

function createRedisClient(): Redis | null {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  const client = new Redis(url, {
    maxRetriesPerRequest: 0,   // never retry a command — fail immediately
    retryStrategy(times) {
      if (times >= 2) return null; // stop background reconnect after 2 attempts
      return 1000;
    },
    lazyConnect: false,        // connect eagerly so status is known immediately
    connectTimeout: 1500,
    commandTimeout: 1500,
    enableOfflineQueue: false, // reject commands instantly when not connected
  });

  client.on("error", () => {
    consecutiveErrors++;
    if (consecutiveErrors >= MAX_ERRORS && !globalForRedis.redisDisabled) {
      globalForRedis.redisDisabled = true;
      console.warn("[Redis] Disabled after repeated connection failures. Falling back to direct DB calls.");
      client.disconnect();
    }
  });

  client.on("connect", () => {
    consecutiveErrors = 0;
    globalForRedis.redisDisabled = false;
    console.log("[Redis] Connected");
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/** Returns true when Redis is connected and usable right now. */
export function isRedisAvailable(): boolean {
  if (!redis || globalForRedis.redisDisabled) return false;
  // 'ready' is the only state where commands actually succeed immediately.
  // Any other state (connecting, reconnecting, wait, close, end) means we
  // should bypass Redis and go straight to the DB.
  return redis.status === 'ready';
}

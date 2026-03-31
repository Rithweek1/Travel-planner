/**
 * Rate Limiter — dual mode:
 *  - Development / no Redis: in-memory (resets on restart, single instance only)
 *  - Production with Upstash: persistent Redis-backed (survives deploys, multi-instance safe)
 *
 * To enable Redis rate limiting:
 *  1. Create a free Upstash Redis DB at https://upstash.com
 *  2. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to .env.local
 *  3. Run: npm install @upstash/ratelimit @upstash/redis
 */

// ── In-memory fallback ─────────────────────────────────────────────────────
const WINDOW_MS = 60_000;      // 1 minute
const MAX_REQUESTS = 5;        // 5 itineraries per minute per IP

type Entry = { count: number; resetAt: number };
const store = new Map<string, Entry>();

function inMemoryCheck(ip: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: MAX_REQUESTS - entry.count };
}

// ── Upstash Redis (when env vars are set) ─────────────────────────────────
async function redisCheck(ip: string): Promise<{ success: boolean; remaining: number }> {
  try {
    // Dynamic import so the app still starts if this package isn't installed yet
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(MAX_REQUESTS, "1 m"),
      analytics: true,
      prefix: "voyagr:ratelimit",
    });

    const result = await ratelimit.limit(ip);
    return { success: result.success, remaining: result.remaining };
  } catch {
    // If Redis is unavailable, fall back gracefully to in-memory
    console.warn("[Voyagr] Upstash Redis unavailable, falling back to in-memory rate limit");
    return inMemoryCheck(ip);
  }
}

// ── Public API ─────────────────────────────────────────────────────────────
export async function checkRateLimit(
  ip: string
): Promise<{ success: boolean; remaining: number }> {
  const hasRedis =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  return hasRedis ? redisCheck(ip) : inMemoryCheck(ip);
}

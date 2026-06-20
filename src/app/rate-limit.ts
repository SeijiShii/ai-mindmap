/**
 * SEC-004 / O27 rate limiting for the high-frequency AI endpoints
 * (/api/structure, /api/expand). Injectable (O35) so the full request path is
 * testable without a real distributed store; the in-memory implementation ships
 * for single-instance/dev, and production can swap a RateLimiter backed by
 * Upstash etc. via env without touching the handlers. Defends in depth with the
 * existing token quota (§4.6.2): quota bounds cost, rate limit bounds frequency.
 */

export interface RateLimiter {
  /** Records a hit for `key` and returns true if it now exceeds `max` within `windowMs`. */
  check(key: string, max: number, windowMs: number, now: number): boolean;
}

/** Sliding-window limiter. Entries outside the window are dropped (GC) on each check. */
export function createMemoryRateLimiter(): RateLimiter {
  const hits = new Map<string, number[]>();
  return {
    check(key, max, windowMs, now) {
      const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      arr.push(now);
      hits.set(key, arr);
      return arr.length > max;
    },
  };
}

/** Client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export interface RateLimitConfig {
  ownerMax: number;
  ownerWindowMs: number;
  ipMax: number;
  ipWindowMs: number;
}

/** Conservative defaults; tunable via env at release (論点-001 と同様 .env/定数で可変). */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  ownerMax: 30,
  ownerWindowMs: 60_000,
  ipMax: 60,
  ipWindowMs: 60_000,
};

export type RateLimitedFn = (ownerId: string, req: Request) => Promise<boolean>;

/** Composes owner-scoped + IP-scoped limits; blocked if either exceeds (二重防御). */
export function makeRateLimited(
  limiter: RateLimiter,
  now: () => number,
  cfg: RateLimitConfig = DEFAULT_RATE_LIMIT,
): RateLimitedFn {
  return async (ownerId, req) => {
    const t = now();
    const ownerBlocked = limiter.check(
      `owner:${ownerId}`,
      cfg.ownerMax,
      cfg.ownerWindowMs,
      t,
    );
    const ipBlocked = limiter.check(
      `ip:${clientIp(req)}`,
      cfg.ipMax,
      cfg.ipWindowMs,
      t,
    );
    return ownerBlocked || ipBlocked;
  };
}

/** Shared 429 response with Retry-After for the AI endpoints. */
export function tooManyRequests(retryAfterSec = 60): Response {
  return new Response(
    JSON.stringify({ error: "rate_limited", retryAfter: retryAfterSec }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(retryAfterSec),
      },
    },
  );
}

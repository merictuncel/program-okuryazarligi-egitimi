/**
 * Basit bellek içi rate limit (tek process).
 * cPanel/cluster için WAF veya Redis tercih edilmelidir.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function getRateLimitStatus(
  key: string,
  limit = 8,
  _windowMs = 15 * 60 * 1000,
): { ok: boolean; retryAfterSec?: number; remaining: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    return { ok: true, remaining: limit };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((current.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  return { ok: true, remaining: limit - current.count };
}

export function rateLimit(
  key: string,
  limit = 8,
  windowMs = 15 * 60 * 1000,
): { ok: boolean; retryAfterSec?: number } {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  current.count += 1;
  buckets.set(key, current);
  return { ok: true };
}

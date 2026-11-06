const hits = new Map<string, number[]>();

/** Sliding-window limiter. In-memory = per instance. Use Upstash/Redis for a global limit in production. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return false;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) hits.forEach((v, k) => v.every((t) => now - t >= windowMs) && hits.delete(k));
  return true;
}

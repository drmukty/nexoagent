type Entry = { exp: number; val: unknown };
const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

/** In-memory TTL cache with in-flight de-duplication. Per server instance; swap for Redis/Upstash at scale. */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  if (ttlMs > 0) {
    const hit = store.get(key);
    if (hit && hit.exp > Date.now()) return hit.val as T;
  }
  const pending = inflight.get(key);
  if (pending) return pending as Promise<T>;
  const p = fn()
    .then((val) => {
      if (ttlMs > 0) {
        store.set(key, { exp: Date.now() + ttlMs, val });
        if (store.size > 500) {
          const now = Date.now();
          store.forEach((v, k) => v.exp < now && store.delete(k));
        }
      }
      return val;
    })
    .finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

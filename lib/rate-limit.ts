type Entry = { count: number; windowStart: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LIMIT = 5; // requests per window

const store = new Map<string, Entry>();

export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: LIMIT - 1, reset: now + WINDOW_MS };
  }

  if (now - entry.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: LIMIT - 1, reset: now + WINDOW_MS };
  }

  if (entry.count >= LIMIT) {
    return { limited: true, remaining: 0, reset: entry.windowStart + WINDOW_MS };
  }

  entry.count += 1;
  store.set(key, entry);
  return { limited: false, remaining: LIMIT - entry.count, reset: entry.windowStart + WINDOW_MS };
}

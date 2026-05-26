// Represents the rate limit state for a specific key (e.g., an IP address)
type Entry = { count: number; windowStart: number };

// The time window in milliseconds
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
// The maximum number of requests allowed per time window
const LIMIT = 5; // requests per window

// In-memory store to keep track of request counts per key.
// Note: This state will be reset if the server restarts or on serverless cold starts.
const store = new Map<string, Entry>();

/**
 * Checks if a given key has exceeded the rate limit.
 * @param key - The unique identifier to rate limit by (usually an IP address).
 * @returns An object containing the limit status, remaining requests, and reset time.
 */
export function checkRateLimit(key: string) {
  const now = Date.now();
  const entry = store.get(key);

  // If this is the first request for the key, initialize its entry
  if (!entry) {
    store.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: LIMIT - 1, reset: now + WINDOW_MS };
  }

  // If the time window has expired, reset the count and start a new window
  if (now - entry.windowStart > WINDOW_MS) {
    store.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: LIMIT - 1, reset: now + WINDOW_MS };
  }

  // If the key has reached the maximum allowed requests within the active window, block it
  if (entry.count >= LIMIT) {
    return { limited: true, remaining: 0, reset: entry.windowStart + WINDOW_MS };
  }

  // Otherwise, increment the request count and allow the request
  entry.count += 1;
  store.set(key, entry);
  return { limited: false, remaining: LIMIT - entry.count, reset: entry.windowStart + WINDOW_MS };
}

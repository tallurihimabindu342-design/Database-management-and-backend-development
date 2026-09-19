/**
 * Simple in-memory TTL cache, keyed by a string (e.g. "lat,lon").
 * This avoids re-fetching weather/AQI/WHO/Gemini for the same location
 * within the TTL window — directly reduces external API usage and cost.
 *
 * For a multi-instance production deployment you'd swap this for Redis,
 * but for a single-instance resume/portfolio deployment this is the
 * correct, simple choice — no need for infrastructure you don't need yet.
 */

const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.data;
}

export function setCached(key, data, ttlMs) {
  store.set(key, {
    data,
    expiresAt: Date.now() + ttlMs,
  });
}

export function clearCache() {
  store.clear();
}

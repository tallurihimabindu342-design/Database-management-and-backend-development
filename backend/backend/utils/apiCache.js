const cache = new Map();

export function getCached(key) {
  const entry = cache.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

export function setCached(key, data, ttl = 10 * 60 * 1000) {
  cache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });
}

export function clearCache(key) {
  cache.delete(key);
}

export function clearAllCache() {
  cache.clear();
}
export const MAX_CACHE_SIZE = 1000;

export function addToCache<T>(cache: Map<string, T>, key: string, value: T) {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    if (firstKey !== undefined) cache.delete(firstKey);
  }
  cache.set(key, value);
}

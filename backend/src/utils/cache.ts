import NodeCache from 'node-cache';

// Cache for 5 minutes by default
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const getCache = <T>(key: string): T | undefined => {
  return cache.get<T>(key);
};

export const setCache = <T>(key: string, value: T, ttl?: number): boolean => {
  return cache.set(key, value, ttl || 300);
};

export const deleteCache = (key: string): number => {
  return cache.del(key);
};

export const clearCache = (): void => {
  cache.flushAll();
};

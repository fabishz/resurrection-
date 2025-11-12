import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCacheClient, generateCacheKey, closeCacheClient } from '@/lib/cache/redis-client';
import { checkRateLimit, resetRateLimit } from '@/lib/cache/rate-limiter';

describe('Redis Client', () => {
  let cache: ReturnType<typeof getCacheClient>;

  beforeEach(() => {
    cache = getCacheClient();
  });

  afterEach(async () => {
    await closeCacheClient();
  });

  describe('Basic Operations', () => {
    it('should set and get values', async () => {
      await cache.set('test-key', 'test-value');
      const value = await cache.get('test-key');

      expect(value).toBe('test-value');
    });

    it('should return null for non-existent keys', async () => {
      const value = await cache.get('non-existent-key');

      expect(value).toBeNull();
    });

    it('should delete keys', async () => {
      await cache.set('test-key', 'test-value');
      await cache.del('test-key');
      const value = await cache.get('test-key');

      expect(value).toBeNull();
    });

    it('should check if key exists', async () => {
      await cache.set('test-key', 'test-value');

      const exists = await cache.exists('test-key');
      const notExists = await cache.exists('non-existent');

      expect(exists).toBe(true);
      expect(notExists).toBe(false);
    });
  });

  describe('TTL Support', () => {
    it('should set TTL on keys', async () => {
      await cache.set('test-key', 'test-value', 60);
      const ttl = await cache.ttl('test-key');

      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThanOrEqual(60);
    });

    it('should expire keys after TTL', async () => {
      await cache.set('test-key', 'test-value', 1);

      // Wait for expiration
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const value = await cache.get('test-key');
      expect(value).toBeNull();
    });

    it('should return -1 for keys without expiration', async () => {
      await cache.set('test-key', 'test-value');
      const ttl = await cache.ttl('test-key');

      expect(ttl).toBe(-1);
    });

    it('should return -2 for non-existent keys', async () => {
      const ttl = await cache.ttl('non-existent');

      expect(ttl).toBe(-2);
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate consistent keys for same input', () => {
      const key1 = generateCacheKey('prefix', 'content');
      const key2 = generateCacheKey('prefix', 'content');

      expect(key1).toBe(key2);
    });

    it('should generate different keys for different inputs', () => {
      const key1 = generateCacheKey('prefix', 'content1');
      const key2 = generateCacheKey('prefix', 'content2');

      expect(key1).not.toBe(key2);
    });

    it('should include prefix in key', () => {
      const key = generateCacheKey('myprefix', 'content');

      expect(key).toContain('myprefix:');
    });
  });
});

describe('Rate Limiter', () => {
  beforeEach(async () => {
    // Reset rate limits before each test
    await resetRateLimit('test-key');
  });

  afterEach(async () => {
    await closeCacheClient();
  });

  describe('Rate Limit Checking', () => {
    it('should allow requests within limit', async () => {
      const result = await checkRateLimit('test-key', {
        maxRequests: 5,
        windowMs: 60000,
      });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block requests exceeding limit', async () => {
      const config = { maxRequests: 3, windowMs: 60000 };

      // Make 3 requests (should all succeed)
      await checkRateLimit('test-key', config);
      await checkRateLimit('test-key', config);
      await checkRateLimit('test-key', config);

      // 4th request should be blocked
      const result = await checkRateLimit('test-key', config);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });

    it('should track remaining requests', async () => {
      const config = { maxRequests: 5, windowMs: 60000 };

      const result1 = await checkRateLimit('test-key', config);
      const result2 = await checkRateLimit('test-key', config);
      const result3 = await checkRateLimit('test-key', config);

      expect(result1.remaining).toBe(4);
      expect(result2.remaining).toBe(3);
      expect(result3.remaining).toBe(2);
    });

    it('should reset after window expires', async () => {
      const config = { maxRequests: 2, windowMs: 1000 };

      // Use up the limit
      await checkRateLimit('test-key', config);
      await checkRateLimit('test-key', config);

      // Should be blocked
      const blocked = await checkRateLimit('test-key', config);
      expect(blocked.allowed).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 1100));

      // Should be allowed again
      const allowed = await checkRateLimit('test-key', config);
      expect(allowed.allowed).toBe(true);
    });

    it('should use custom key prefix', async () => {
      const result = await checkRateLimit('test-key', {
        maxRequests: 5,
        windowMs: 60000,
        keyPrefix: 'custom',
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('Rate Limit Reset', () => {
    it('should reset rate limit for key', async () => {
      const config = { maxRequests: 2, windowMs: 60000 };

      // Use up the limit
      await checkRateLimit('test-key', config);
      await checkRateLimit('test-key', config);

      // Should be blocked
      const blocked = await checkRateLimit('test-key', config);
      expect(blocked.allowed).toBe(false);

      // Reset
      await resetRateLimit('test-key');

      // Should be allowed again
      const allowed = await checkRateLimit('test-key', config);
      expect(allowed.allowed).toBe(true);
    });
  });
});

/**
 * Redis Client with Mock Implementation
 * Provides caching interface with automatic fallback to in-memory cache
 */

import { createClient, RedisClientType } from 'redis';

export interface CacheClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
  disconnect(): Promise<void>;
}

/**
 * Mock Redis implementation for local development
 * Uses in-memory Map with TTL support
 */
class MockRedisClient implements CacheClient {
  private store = new Map<string, { value: string; expiresAt: number | null }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000);

    console.log('[Cache] Using mock Redis (in-memory cache)');
  }

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + ttl * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async ttl(key: string): Promise<number> {
    const entry = this.store.get(key);

    if (!entry) {
      return -2; // Key doesn't exist
    }

    if (!entry.expiresAt) {
      return -1; // No expiration
    }

    const remaining = Math.floor((entry.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async disconnect(): Promise<void> {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Cache] Cleaned up ${cleaned} expired entries`);
    }
  }

  getStats() {
    return {
      size: this.store.size,
      keys: Array.from(this.store.keys()),
    };
  }
}

/**
 * Real Redis client wrapper
 */
class RealRedisClient implements CacheClient {
  private client: RedisClientType;
  private connected = false;

  constructor(url: string) {
    this.client = createClient({ url });

    this.client.on('error', (err) => {
      console.error('[Cache] Redis error:', err);
    });

    this.client.on('connect', () => {
      console.log('[Cache] Connected to Redis');
      this.connected = true;
    });

    this.client.on('disconnect', () => {
      console.log('[Cache] Disconnected from Redis');
      this.connected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.connected) {
      await this.client.connect();
    }
  }

  async get(key: string): Promise<string | null> {
    await this.connect();
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.connect();
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.connect();
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    await this.connect();
    const result = await this.client.exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    await this.connect();
    return await this.client.ttl(key);
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.client.disconnect();
    }
  }
}

/**
 * Cache client singleton
 */
let cacheClient: CacheClient | null = null;

/**
 * Get or create cache client
 */
export function getCacheClient(): CacheClient {
  if (cacheClient) {
    return cacheClient;
  }

  const redisUrl = process.env.REDIS_URL;
  const useRealRedis = redisUrl && process.env.NODE_ENV === 'production';

  if (useRealRedis) {
    console.log('[Cache] Initializing Redis client');
    cacheClient = new RealRedisClient(redisUrl);
  } else {
    console.log('[Cache] Initializing mock Redis (in-memory)');
    cacheClient = new MockRedisClient();
  }

  return cacheClient;
}

/**
 * Close cache client connection
 */
export async function closeCacheClient(): Promise<void> {
  if (cacheClient) {
    await cacheClient.disconnect();
    cacheClient = null;
  }
}

/**
 * Generate cache key for content
 */
export function generateCacheKey(prefix: string, content: string): string {
  const crypto = require('crypto');
  const hash = crypto.createHash('md5').update(content).digest('hex');
  return `${prefix}:${hash}`;
}

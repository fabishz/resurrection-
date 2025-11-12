/**
 * Rate Limiter
 * Protects against excessive API calls with sliding window algorithm
 */

import { getCacheClient } from './redis-client';

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
}

/**
 * Check rate limit for a key
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const cache = getCacheClient();
  const cacheKey = `${config.keyPrefix || 'ratelimit'}:${key}`;

  try {
    // Get current count
    const currentStr = await cache.get(cacheKey);
    const current = currentStr ? parseInt(currentStr, 10) : 0;

    // Get TTL
    const ttl = await cache.ttl(cacheKey);
    const resetAt = ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + config.windowMs;

    // Check if limit exceeded
    if (current >= config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt,
        retryAfter: Math.ceil(ttl > 0 ? ttl : config.windowMs / 1000),
      };
    }

    // Increment counter
    const newCount = current + 1;
    const windowSeconds = Math.ceil(config.windowMs / 1000);

    if (current === 0) {
      // First request in window
      await cache.set(cacheKey, newCount.toString(), windowSeconds);
    } else {
      // Subsequent request - preserve existing TTL
      await cache.set(cacheKey, newCount.toString(), ttl > 0 ? ttl : windowSeconds);
    }

    return {
      allowed: true,
      remaining: config.maxRequests - newCount,
      resetAt,
    };
  } catch (error) {
    console.error('[RateLimit] Error checking rate limit:', error);
    // On error, allow the request (fail open)
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: Date.now() + config.windowMs,
    };
  }
}

/**
 * Rate limit decorator for async functions
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  config: RateLimitConfig,
  getKey: (...args: Parameters<T>) => string
): T {
  return (async (...args: Parameters<T>) => {
    const key = getKey(...args);
    const result = await checkRateLimit(key, config);

    if (!result.allowed) {
      const error = new Error('Rate limit exceeded');
      (error as any).code = 'RATE_LIMIT_EXCEEDED';
      (error as any).retryAfter = result.retryAfter;
      (error as any).resetAt = result.resetAt;
      throw error;
    }

    return await fn(...args);
  }) as T;
}

/**
 * Reset rate limit for a key
 */
export async function resetRateLimit(key: string, keyPrefix = 'ratelimit'): Promise<void> {
  const cache = getCacheClient();
  const cacheKey = `${keyPrefix}:${key}`;
  await cache.del(cacheKey);
}

/**
 * Get current rate limit status
 */
export async function getRateLimitStatus(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const cache = getCacheClient();
  const cacheKey = `${config.keyPrefix || 'ratelimit'}:${key}`;

  const currentStr = await cache.get(cacheKey);
  const current = currentStr ? parseInt(currentStr, 10) : 0;
  const ttl = await cache.ttl(cacheKey);
  const resetAt = ttl > 0 ? Date.now() + ttl * 1000 : Date.now() + config.windowMs;

  return {
    allowed: current < config.maxRequests,
    remaining: Math.max(0, config.maxRequests - current),
    resetAt,
    retryAfter: ttl > 0 ? ttl : undefined,
  };
}

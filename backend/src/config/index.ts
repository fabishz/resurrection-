/**
 * Configuration Management
 * Centralized configuration with validation
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  env: z.enum(['development', 'production', 'test']).default('development'),
  port: z.coerce.number().default(4000),
  host: z.string().default('0.0.0.0'),
  
  cors: z.object({
    origins: z.string().transform((val) => val.split(',')),
  }),
  
  database: z.object({
    url: z.string(),
  }),
  
  redis: z.object({
    url: z.string(),
    ttl: z.coerce.number().default(900),
  }),
  
  openai: z.object({
    apiKey: z.string().optional(),
    model: z.string().default('gpt-4o-mini'),
    maxTokens: z.coerce.number().default(500),
  }),
  
  rateLimit: z.object({
    max: z.coerce.number().default(100),
    window: z.coerce.number().default(60000),
  }),
  
  feed: z.object({
    userAgent: z.string().default('RSS-Renaissance/1.0'),
    timeout: z.coerce.number().default(30000),
    maxRetries: z.coerce.number().default(3),
  }),
  
  cron: z.object({
    feedRefresh: z.string().default('*/30 * * * *'),
    cacheCleanup: z.string().default('0 */6 * * *'),
  }),
  
  logging: z.object({
    level: z.string().default('info'),
    pretty: z.coerce.boolean().default(true),
  }),
});

const rawConfig = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  
  cors: {
    origins: process.env.CORS_ORIGINS || 'http://localhost:3000',
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/rss_renaissance',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: process.env.REDIS_TTL,
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL,
    maxTokens: process.env.OPENAI_MAX_TOKENS,
  },
  
  rateLimit: {
    max: process.env.RATE_LIMIT_MAX,
    window: process.env.RATE_LIMIT_WINDOW,
  },
  
  feed: {
    userAgent: process.env.FEED_USER_AGENT,
    timeout: process.env.FEED_TIMEOUT,
    maxRetries: process.env.FEED_MAX_RETRIES,
  },
  
  cron: {
    feedRefresh: process.env.CRON_FEED_REFRESH,
    cacheCleanup: process.env.CRON_CACHE_CLEANUP,
  },
  
  logging: {
    level: process.env.LOG_LEVEL,
    pretty: process.env.LOG_PRETTY,
  },
};

export const config = configSchema.parse(rawConfig);

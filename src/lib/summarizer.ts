/**
 * AI Summarization Service
 * Provides interface to MCP OpenAI server for article summarization
 * Includes Redis caching and rate limiting
 */

import { getCacheClient, generateCacheKey } from './cache/redis-client';
import { checkRateLimit } from './cache/rate-limiter';

export interface SummaryResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  categories: string[];
  processingTime: number;
  cached?: boolean;
  cacheKey?: string;
}

export interface SummarizerOptions {
  maxLength?: number;
  extractKeyPoints?: boolean;
  analyzeSentiment?: boolean;
  categorize?: boolean;
}

/**
 * Mock summarizer for offline development
 * Returns deterministic summaries based on content hash
 */
export async function summarizeWithMock(
  content: string,
  title?: string,
  options: SummarizerOptions = {}
): Promise<SummaryResult> {
  const startTime = Date.now();

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Generate deterministic summary based on content length
  const wordCount = content.split(/\s+/).length;
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const firstSentence = sentences[0]?.trim() || 'No content available';
  const secondSentence = sentences[1]?.trim() || '';

  const summary =
    wordCount > 100
      ? `${firstSentence}. ${secondSentence}`.slice(0, options.maxLength || 200)
      : firstSentence;

  // Extract mock key points (first 3 sentences)
  const keyPoints = options.extractKeyPoints
    ? sentences.slice(0, 3).map((s) => s.trim())
    : [];

  // Mock sentiment analysis based on content
  const sentiment: 'positive' | 'negative' | 'neutral' = options.analyzeSentiment
    ? content.toLowerCase().includes('success') ||
      content.toLowerCase().includes('great') ||
      content.toLowerCase().includes('excellent')
      ? 'positive'
      : content.toLowerCase().includes('fail') ||
        content.toLowerCase().includes('bad') ||
        content.toLowerCase().includes('terrible')
      ? 'negative'
      : 'neutral'
    : 'neutral';

  // Mock categorization based on keywords
  const categories: string[] = options.categorize
    ? [
        content.toLowerCase().includes('tech') ||
        content.toLowerCase().includes('software') ||
        content.toLowerCase().includes('ai')
          ? 'Tech'
          : content.toLowerCase().includes('business') ||
            content.toLowerCase().includes('market')
          ? 'Business'
          : content.toLowerCase().includes('science') ||
            content.toLowerCase().includes('research')
          ? 'Science'
          : 'Other',
      ]
    : [];

  const processingTime = Date.now() - startTime;

  return {
    summary,
    keyPoints,
    sentiment,
    categories,
    processingTime,
  };
}

/**
 * Summarize content with caching and rate limiting
 * Main entry point for summarization
 */
export async function summarize(
  content: string,
  title?: string,
  options: SummarizerOptions = {}
): Promise<SummaryResult> {
  const startTime = Date.now();

  // Generate cache key from content
  const cacheKey = generateCacheKey('summary', content);

  try {
    // Check cache first
    const cached = await getCachedSummary(cacheKey);
    if (cached) {
      console.log('[Summarizer] Cache hit:', cacheKey);
      return {
        ...cached,
        cached: true,
        cacheKey,
        processingTime: Date.now() - startTime,
      };
    }

    console.log('[Summarizer] Cache miss, generating summary');

    // Check rate limit
    const rateLimitKey = 'summarize:global';
    const rateLimit = await checkRateLimit(rateLimitKey, {
      maxRequests: parseInt(process.env.SUMMARIZER_RATE_LIMIT || '100', 10),
      windowMs: parseInt(process.env.SUMMARIZER_RATE_WINDOW_MS || '3600000', 10), // 1 hour
      keyPrefix: 'ratelimit:summarizer',
    });

    if (!rateLimit.allowed) {
      const error = new Error('Rate limit exceeded for summarization');
      (error as any).code = 'RATE_LIMIT_EXCEEDED';
      (error as any).retryAfter = rateLimit.retryAfter;
      throw error;
    }

    console.log(`[Summarizer] Rate limit: ${rateLimit.remaining} requests remaining`);

    // Generate summary
    const result = await summarizeWithMCP(content, title, options);

    // Cache the result
    await cacheSummary(cacheKey, result);

    return {
      ...result,
      cached: false,
      cacheKey,
    };
  } catch (error) {
    console.error('[Summarizer] Error:', error);
    throw error;
  }
}

/**
 * Get cached summary
 */
async function getCachedSummary(cacheKey: string): Promise<SummaryResult | null> {
  try {
    const cache = getCacheClient();
    const cached = await cache.get(cacheKey);

    if (!cached) {
      return null;
    }

    return JSON.parse(cached) as SummaryResult;
  } catch (error) {
    console.error('[Summarizer] Error reading from cache:', error);
    return null;
  }
}

/**
 * Cache summary result
 */
async function cacheSummary(cacheKey: string, result: SummaryResult): Promise<void> {
  try {
    const cache = getCacheClient();
    const ttl = parseInt(process.env.SUMMARY_CACHE_TTL || '0', 10); // 0 = never expire

    await cache.set(cacheKey, JSON.stringify(result), ttl || undefined);

    console.log(`[Summarizer] Cached summary with key: ${cacheKey}${ttl ? ` (TTL: ${ttl}s)` : ' (no expiration)'}`);
  } catch (error) {
    console.error('[Summarizer] Error writing to cache:', error);
    // Don't throw - caching failure shouldn't break summarization
  }
}

/**
 * Summarize content using MCP OpenAI server
 * Falls back to mock if MCP is unavailable
 */
async function summarizeWithMCP(
  content: string,
  title?: string,
  options: SummarizerOptions = {}
): Promise<SummaryResult> {
  const startTime = Date.now();

  try {
    // Check if we're in development mode or MCP is disabled
    const useMock = process.env.NODE_ENV === 'development' || !process.env.OPENAI_API_KEY;

    if (useMock) {
      console.log('[Summarizer] Using mock summarizer (MCP not configured)');
      return await summarizeWithMock(content, title, options);
    }

    // TODO: Implement actual MCP OpenAI integration
    // This will be implemented when MCP servers are configured
    // For now, use mock implementation

    console.log('[Summarizer] MCP integration not yet implemented, using mock');
    return await summarizeWithMock(content, title, options);

    // Future MCP implementation:
    /*
    const response = await fetch('http://localhost:3001/mcp/openai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        title,
        maxTokens: options.maxLength || 500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`MCP request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      summary: data.summary,
      keyPoints: data.keyPoints || [],
      sentiment: data.sentiment || 'neutral',
      categories: data.categories || [],
      processingTime: Date.now() - startTime,
    };
    */
  } catch (error) {
    console.error('[Summarizer] Error calling MCP, falling back to mock:', error);
    return await summarizeWithMock(content, title, options);
  }
}

/**
 * Batch summarize multiple articles
 * Processes in parallel with rate limiting and caching
 */
export async function batchSummarize(
  articles: Array<{ id: string; content: string; title?: string }>,
  options: SummarizerOptions = {}
): Promise<Map<string, SummaryResult>> {
  const results = new Map<string, SummaryResult>();

  // Process in batches of 5 to avoid rate limiting
  const batchSize = parseInt(process.env.SUMMARIZER_BATCH_SIZE || '5', 10);

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);

    const batchResults = await Promise.all(
      batch.map(async (article) => {
        try {
          const result = await summarize(article.content, article.title, options);
          return { id: article.id, result };
        } catch (error) {
          console.error(`[Summarizer] Failed to summarize article ${article.id}:`, error);
          return {
            id: article.id,
            result: {
              summary: 'Summary unavailable',
              keyPoints: [],
              sentiment: 'neutral' as const,
              categories: [],
              processingTime: 0,
              cached: false,
            },
          };
        }
      })
    );

    batchResults.forEach(({ id, result }) => {
      results.set(id, result);
    });

    // Small delay between batches
    if (i + batchSize < articles.length) {
      const delayMs = parseInt(process.env.SUMMARIZER_BATCH_DELAY_MS || '100', 10);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return results;
}

/**
 * Clear cached summary
 */
export async function clearCachedSummary(content: string): Promise<void> {
  const cacheKey = generateCacheKey('summary', content);
  const cache = getCacheClient();
  await cache.del(cacheKey);
  console.log(`[Summarizer] Cleared cache for key: ${cacheKey}`);
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  enabled: boolean;
  type: 'redis' | 'mock';
  ttl: number;
}> {
  return {
    enabled: true,
    type: process.env.REDIS_URL && process.env.NODE_ENV === 'production' ? 'redis' : 'mock',
    ttl: parseInt(process.env.SUMMARY_CACHE_TTL || '0', 10),
  };
}

/**
 * Estimate cost of summarization
 * Based on OpenAI GPT-4o-mini pricing
 */
export function estimateCost(contentLength: number): number {
  // Rough estimate: ~750 words = 1000 tokens
  const estimatedTokens = Math.ceil(contentLength / 750) * 1000;
  // GPT-4o-mini: $0.002 per 1K tokens
  const costPer1KTokens = 0.002;
  return (estimatedTokens / 1000) * costPer1KTokens;
}

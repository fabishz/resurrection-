import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  summarize,
  summarizeWithMock,
  batchSummarize,
  estimateCost,
  clearCachedSummary,
} from '@/lib/summarizer';
import { getCacheClient, closeCacheClient } from '@/lib/cache/redis-client';

describe('Summarizer', () => {
  beforeEach(() => {
    // Clear cache before each test
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await closeCacheClient();
  });

  describe('summarizeWithMock', () => {
    it('should generate a summary from content', async () => {
      const content =
        'This is a test article about technology. It discusses various aspects of software development. The article covers best practices and modern techniques.';

      const result = await summarizeWithMock(content, 'Test Article');

      expect(result.summary).toBeTruthy();
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('should extract key points when requested', async () => {
      const content =
        'First point about technology. Second point about development. Third point about testing. Fourth point about deployment.';

      const result = await summarizeWithMock(content, 'Test Article', {
        extractKeyPoints: true,
      });

      expect(result.keyPoints).toBeDefined();
      expect(result.keyPoints.length).toBeGreaterThan(0);
      expect(result.keyPoints.length).toBeLessThanOrEqual(3);
    });

    it('should analyze sentiment when requested', async () => {
      const positiveContent = 'This is a great success story about excellent achievements.';
      const negativeContent = 'This is a terrible failure with bad outcomes.';
      const neutralContent = 'This is a report about the current situation.';

      const positiveResult = await summarizeWithMock(positiveContent, 'Positive', {
        analyzeSentiment: true,
      });
      const negativeResult = await summarizeWithMock(negativeContent, 'Negative', {
        analyzeSentiment: true,
      });
      const neutralResult = await summarizeWithMock(neutralContent, 'Neutral', {
        analyzeSentiment: true,
      });

      expect(positiveResult.sentiment).toBe('positive');
      expect(negativeResult.sentiment).toBe('negative');
      expect(neutralResult.sentiment).toBe('neutral');
    });

    it('should categorize content when requested', async () => {
      const techContent = 'This article discusses AI and software development technologies.';

      const result = await summarizeWithMock(techContent, 'Tech Article', {
        categorize: true,
      });

      expect(result.categories).toBeDefined();
      expect(result.categories.length).toBeGreaterThan(0);
      expect(result.categories).toContain('Tech');
    });

    it('should respect maxLength option', async () => {
      const longContent = 'A'.repeat(1000);

      const result = await summarizeWithMock(longContent, 'Long Article', {
        maxLength: 100,
      });

      expect(result.summary.length).toBeLessThanOrEqual(100);
    });

    it('should handle short content', async () => {
      const shortContent = 'Short article.';

      const result = await summarizeWithMock(shortContent);

      expect(result.summary).toBe('Short article');
    });
  });

  describe('summarize with caching', () => {
    const testContent = 'This is test content for caching. It should be cached after first call.';

    it('should cache summary on first call (cache miss)', async () => {
      const result = await summarize(testContent, 'Test Article');

      expect(result.summary).toBeTruthy();
      expect(result.cached).toBe(false);
      expect(result.cacheKey).toBeTruthy();
    });

    it('should return cached summary on second call (cache hit)', async () => {
      // First call - cache miss
      const result1 = await summarize(testContent, 'Test Article');
      expect(result1.cached).toBe(false);

      // Second call - cache hit
      const result2 = await summarize(testContent, 'Test Article');
      expect(result2.cached).toBe(true);
      expect(result2.summary).toBe(result1.summary);
      expect(result2.cacheKey).toBe(result1.cacheKey);
    });

    it('should generate new summary for different content', async () => {
      const content1 = 'First article content';
      const content2 = 'Second article content';

      const result1 = await summarize(content1);
      const result2 = await summarize(content2);

      expect(result1.cacheKey).not.toBe(result2.cacheKey);
      expect(result1.summary).not.toBe(result2.summary);
    });

    it('should clear cached summary', async () => {
      // Cache a summary
      const result1 = await summarize(testContent);
      expect(result1.cached).toBe(false);

      // Verify it's cached
      const result2 = await summarize(testContent);
      expect(result2.cached).toBe(true);

      // Clear cache
      await clearCachedSummary(testContent);

      // Should be cache miss again
      const result3 = await summarize(testContent);
      expect(result3.cached).toBe(false);
    });
  });

  describe('batchSummarize', () => {
    it('should summarize multiple articles', async () => {
      const articles = [
        { id: '1', content: 'First article content about technology.', title: 'Article 1' },
        { id: '2', content: 'Second article content about business.', title: 'Article 2' },
        { id: '3', content: 'Third article content about science.', title: 'Article 3' },
      ];

      const results = await batchSummarize(articles);

      expect(results.size).toBe(3);
      expect(results.get('1')).toBeDefined();
      expect(results.get('2')).toBeDefined();
      expect(results.get('3')).toBeDefined();
    });

    it('should handle empty array', async () => {
      const results = await batchSummarize([]);

      expect(results.size).toBe(0);
    });

    it('should handle errors gracefully', async () => {
      const articles = [{ id: '1', content: '', title: 'Empty' }];

      const results = await batchSummarize(articles);

      expect(results.size).toBe(1);
      expect(results.get('1')).toBeDefined();
    });

    it('should use cache for duplicate content', async () => {
      const articles = [
        { id: '1', content: 'Same content', title: 'Article 1' },
        { id: '2', content: 'Same content', title: 'Article 2' },
      ];

      const results = await batchSummarize(articles);

      expect(results.size).toBe(2);
      const result1 = results.get('1');
      const result2 = results.get('2');

      // Second one should be cached
      expect(result2?.cached).toBe(true);
    });
  });

  describe('estimateCost', () => {
    it('should estimate cost for short content', () => {
      const cost = estimateCost(100);

      expect(cost).toBeGreaterThan(0);
      expect(cost).toBeLessThan(0.01);
    });

    it('should estimate cost for long content', () => {
      const cost = estimateCost(10000);

      expect(cost).toBeGreaterThan(0);
    });

    it('should return 0 for empty content', () => {
      const cost = estimateCost(0);

      expect(cost).toBe(0);
    });
  });
});

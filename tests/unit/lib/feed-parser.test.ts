import { describe, it, expect } from 'vitest';
import {
  validateFeedUrl,
  generateId,
  normalizeContent,
  extractExcerpt,
} from '@/lib/feed-parser';

describe('Feed Parser', () => {
  describe('validateFeedUrl', () => {
    it('should validate correct HTTP URLs', () => {
      const result = validateFeedUrl('http://example.com/feed.xml');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should validate correct HTTPS URLs', () => {
      const result = validateFeedUrl('https://example.com/feed.xml');

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-HTTP protocols', () => {
      const result = validateFeedUrl('ftp://example.com/feed.xml');

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject invalid URLs', () => {
      const result = validateFeedUrl('not-a-url');

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject empty strings', () => {
      const result = validateFeedUrl('');

      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('generateId', () => {
    it('should generate consistent IDs for same input', () => {
      const input = 'test-string';
      const id1 = generateId(input);
      const id2 = generateId(input);

      expect(id1).toBe(id2);
    });

    it('should generate different IDs for different inputs', () => {
      const id1 = generateId('input1');
      const id2 = generateId('input2');

      expect(id1).not.toBe(id2);
    });

    it('should generate 16-character IDs', () => {
      const id = generateId('test');

      expect(id.length).toBe(16);
    });

    it('should handle empty strings', () => {
      const id = generateId('');

      expect(id).toBeTruthy();
      expect(id.length).toBe(16);
    });
  });

  describe('normalizeContent', () => {
    it('should remove HTML tags', () => {
      const html = '<p>This is <strong>bold</strong> text</p>';
      const result = normalizeContent(html);

      expect(result).toBe('This is bold text');
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should decode HTML entities', () => {
      const html = 'This &amp; that &lt;test&gt; &quot;quote&quot;';
      const result = normalizeContent(html);

      expect(result).toBe('This & that <test> "quote"');
    });

    it('should remove extra whitespace', () => {
      const html = 'This   has    extra     spaces';
      const result = normalizeContent(html);

      expect(result).toBe('This has extra spaces');
    });

    it('should handle mixed HTML and entities', () => {
      const html = '<p>Test &amp; <strong>bold</strong>&nbsp;text</p>';
      const result = normalizeContent(html);

      expect(result).toBe('Test & bold text');
    });

    it('should handle empty strings', () => {
      const result = normalizeContent('');

      expect(result).toBe('');
    });
  });

  describe('extractExcerpt', () => {
    it('should return full text if shorter than maxLength', () => {
      const text = 'Short text.';
      const result = extractExcerpt(text, 100);

      expect(result).toBe('Short text.');
    });

    it('should truncate at sentence boundary', () => {
      const text = 'First sentence. Second sentence. Third sentence.';
      const result = extractExcerpt(text, 30);

      expect(result).toBe('First sentence.');
    });

    it('should truncate at word boundary if no sentence boundary', () => {
      const text = 'This is a very long text without any sentence boundaries at all';
      const result = extractExcerpt(text, 20);

      expect(result).toContain('...');
      expect(result.length).toBeLessThanOrEqual(23); // 20 + '...'
    });

    it('should handle text with question marks', () => {
      const text = 'Is this a question? Yes it is. More text here.';
      const result = extractExcerpt(text, 25);

      expect(result).toBe('Is this a question?');
    });

    it('should handle text with exclamation marks', () => {
      const text = 'This is exciting! More text here. Even more.';
      const result = extractExcerpt(text, 25);

      expect(result).toBe('This is exciting!');
    });

    it('should use default maxLength of 200', () => {
      const text = 'A'.repeat(300);
      const result = extractExcerpt(text);

      expect(result.length).toBeLessThanOrEqual(203); // 200 + '...'
    });
  });
});

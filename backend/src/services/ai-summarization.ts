/**
 * AI Summarization Service - OpenAI integration for article summarization
 */

import OpenAI from 'openai';
import type { Logger } from 'pino';
import type { SummaryResponse } from '../types/api';

export class AISummarizationService {
  private openai: OpenAI;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor(
    private logger: Logger,
    config: {
      apiKey: string;
      model: string;
      maxTokens: number;
      temperature: number;
    }
  ) {
    this.openai = new OpenAI({ apiKey: config.apiKey });
    this.model = config.model;
    this.maxTokens = config.maxTokens;
    this.temperature = config.temperature;
  }

  /**
   * Generate AI summary for an article
   */
  async summarizeArticle(article: {
    title: string;
    description?: string;
    content?: string;
  }): Promise<Omit<SummaryResponse, 'id' | 'createdAt'>> {
    const startTime = Date.now();

    try {
      // Prepare content for summarization
      const contentToSummarize = this.prepareContent(article);

      if (!contentToSummarize) {
        throw new Error('No content available to summarize');
      }

      this.logger.info({ title: article.title }, 'Generating AI summary');

      // Call OpenAI API
      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that summarizes articles. Provide:
1. A concise summary (2-3 sentences)
2. 3-5 key points as bullet points
3. Overall sentiment (POSITIVE, NEGATIVE, or NEUTRAL)
4. 2-3 relevant categories/tags

Format your response as JSON:
{
  "summary": "...",
  "keyPoints": ["...", "..."],
  "sentiment": "POSITIVE|NEGATIVE|NEUTRAL",
  "categories": ["...", "..."]
}`,
          },
          {
            role: 'user',
            content: `Summarize this article:\n\nTitle: ${article.title}\n\nContent: ${contentToSummarize}`,
          },
        ],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse response
      const parsed = JSON.parse(response);
      const processingTime = Date.now() - startTime;

      // Calculate cost (approximate)
      const inputTokens = completion.usage?.prompt_tokens || 0;
      const outputTokens = completion.usage?.completion_tokens || 0;
      const cost = this.calculateCost(inputTokens, outputTokens);

      this.logger.info({
        title: article.title,
        processingTime,
        tokens: completion.usage?.total_tokens,
        cost,
      }, 'AI summary generated successfully');

      return {
        content: parsed.summary,
        keyPoints: parsed.keyPoints || [],
        sentiment: this.normalizeSentiment(parsed.sentiment),
        categories: parsed.categories || [],
        confidence: 0.85, // Default confidence
        model: this.model,
        tokens: completion.usage?.total_tokens,
        processingTime,
        cost,
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error({
        error: (error as Error).message,
        title: article.title,
        processingTime,
      }, 'AI summarization failed');

      // Return fallback summary
      return this.generateFallbackSummary(article, processingTime);
    }
  }

  /**
   * Batch summarize multiple articles
   */
  async summarizeBatch(articles: Array<{
    id: string;
    title: string;
    description?: string;
    content?: string;
  }>): Promise<Map<string, Omit<SummaryResponse, 'id' | 'createdAt'>>> {
    const results = new Map<string, Omit<SummaryResponse, 'id' | 'createdAt'>>();

    // Process in parallel with concurrency limit
    const concurrency = 3;
    for (let i = 0; i < articles.length; i += concurrency) {
      const batch = articles.slice(i, i + concurrency);
      const summaries = await Promise.allSettled(
        batch.map((article) => this.summarizeArticle(article))
      );

      summaries.forEach((result, index) => {
        const article = batch[index];
        if (!article) return;

        if (result.status === 'fulfilled') {
          results.set(article.id, result.value);
        } else {
          this.logger.error({
            articleId: article.id,
            error: result.reason,
          }, 'Batch summarization failed for article');
        }
      });

      // Rate limiting delay between batches
      if (i + concurrency < articles.length) {
        await this.sleep(1000);
      }
    }

    return results;
  }

  /**
   * Prepare content for summarization (truncate if too long)
   */
  private prepareContent(article: {
    title: string;
    description?: string;
    content?: string;
  }): string {
    const maxChars = 4000; // Limit to avoid token limits
    const content = article.content || article.description || '';
    
    if (content.length <= maxChars) {
      return content;
    }

    // Truncate and add ellipsis
    return content.substring(0, maxChars) + '...';
  }

  /**
   * Generate fallback summary when AI fails
   */
  private generateFallbackSummary(
    article: {
      title: string;
      description?: string;
      content?: string;
    },
    processingTime: number
  ): Omit<SummaryResponse, 'id' | 'createdAt'> {
    const content = article.description || article.content || '';
    const truncated = content.length > 200 ? content.substring(0, 200) + '...' : content;

    return {
      content: truncated || 'No summary available.',
      keyPoints: [],
      sentiment: 'NEUTRAL',
      categories: [],
      confidence: 0.0,
      model: 'fallback',
      tokens: 0,
      processingTime,
      cost: 0,
    };
  }

  /**
   * Normalize sentiment value
   */
  private normalizeSentiment(sentiment: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    const normalized = sentiment.toUpperCase();
    if (normalized === 'POSITIVE' || normalized === 'NEGATIVE' || normalized === 'NEUTRAL') {
      return normalized as 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    }
    return 'NEUTRAL';
  }

  /**
   * Calculate approximate cost based on token usage
   * Pricing for gpt-4o-mini: $0.150 / 1M input tokens, $0.600 / 1M output tokens
   */
  private calculateCost(inputTokens: number, outputTokens: number): number {
    const inputCost = (inputTokens / 1_000_000) * 0.15;
    const outputCost = (outputTokens / 1_000_000) * 0.6;
    return inputCost + outputCost;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Check if OpenAI API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.openai.models.list();
      return true;
    } catch {
      return false;
    }
  }
}

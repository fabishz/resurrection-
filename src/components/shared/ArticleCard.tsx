/**
 * Article Card Component with AI Summary
 * Displays article with expandable AI-generated summary
 */

'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import { summarizeArticleById } from '@/lib/api-client';

interface ArticleCardProps {
  article: {
    id: string;
    feedId: string;
    title: string;
    link: string;
    content: string;
    contentSnippet: string;
    pubDate: string;
    author?: string;
    categories?: string[];
    feedTitle: string;
    feedUrl: string;
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);

  const handleToggleSummary = async () => {
    if (!showSummary && !summary) {
      // Fetch summary
      try {
        setLoadingSummary(true);
        setSummaryError(null);
        const response = await summarizeArticleById(article.id);
        setSummary(response.summary);
        setKeyPoints(response.keyPoints || []);
        setShowSummary(true);
      } catch (err) {
        console.error('Failed to generate summary:', err);
        setSummaryError(err instanceof Error ? err.message : 'Failed to generate summary');
      } finally {
        setLoadingSummary(false);
      }
    } else {
      setShowSummary(!showSummary);
    }
  };

  return (
    <Card className="bg-neutral-800 border-neutral-700 hover:shadow-xl hover:shadow-neutral-900/50 transition-all duration-300">
      <div className="flex-1 min-w-0">
        {/* Article Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-white hover:text-halloween-orange transition-colors flex-1"
          >
            {article.title}
          </a>
          {article.categories && article.categories.length > 0 && (
            <Badge variant="purple" className="flex-shrink-0">
              {article.categories[0]}
            </Badge>
          )}
        </div>

        {/* Article Snippet */}
        <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
          {article.contentSnippet}
        </p>

        {/* AI Summary Section */}
        {showSummary && summary && (
          <div className="mb-3 p-4 bg-neutral-900/50 rounded-lg border border-neutral-600">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="sparkles" size="sm" className="text-halloween-purple" />
              <span className="text-xs font-semibold text-halloween-purple uppercase tracking-wide">
                AI Summary
              </span>
            </div>
            <p className="text-sm text-neutral-300 mb-3">{summary}</p>
            {keyPoints && keyPoints.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-neutral-400 mb-2">Key Points:</p>
                <ul className="space-y-1">
                  {keyPoints.map((point, index) => (
                    <li key={index} className="text-xs text-neutral-400 flex items-start gap-2">
                      <span className="text-halloween-orange mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Summary Error */}
        {summaryError && (
          <div className="mb-3 p-3 bg-red-900/20 rounded-lg border border-red-700">
            <p className="text-xs text-red-300">{summaryError}</p>
          </div>
        )}

        {/* Article Footer */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="font-medium text-neutral-300">{article.feedTitle}</span>
            <span>•</span>
            <time dateTime={article.pubDate}>
              {new Date(article.pubDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
            {article.author && (
              <>
                <span>•</span>
                <span className="text-neutral-400">{article.author}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* AI Summary Button */}
            <button
              onClick={handleToggleSummary}
              disabled={loadingSummary}
              className="flex items-center gap-1 text-halloween-purple hover:text-halloween-orange transition-colors font-medium disabled:opacity-50"
            >
              {loadingSummary ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Summarizing...</span>
                </>
              ) : (
                <>
                  <Icon name="sparkles" size="sm" />
                  <span>{showSummary ? 'Hide' : 'Summarize'}</span>
                </>
              )}
            </button>

            {/* Read Article Link */}
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
            >
              Read →
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

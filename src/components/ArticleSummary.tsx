'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Article {
  id: string;
  title: string;
  link: string;
  contentSnippet: string;
}

interface ArticleSummaryProps {
  article: Article;
}

interface Summary {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  categories: string[];
}

export default function ArticleSummary({ article }: ArticleSummaryProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [article.id]);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: article.contentSnippet,
          title: article.title,
          maxLength: 200,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();

      if (data.success) {
        setSummary({
          summary: data.summary,
          keyPoints: data.keyPoints || [],
          sentiment: data.sentiment || 'neutral',
          categories: data.categories || [],
        });
      } else {
        throw new Error(data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-halloween-green';
      case 'negative':
        return 'text-halloween-blood';
      default:
        return 'text-neutral-500 dark:text-neutral-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😟';
      default:
        return '😐';
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800"
    >
      <div className="p-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-halloween-orange border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Generating AI summary...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                  Failed to generate summary
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                <button
                  onClick={fetchSummary}
                  className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Summary Content */}
        {summary && !loading && !error && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Summary Text */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-halloween-purple"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  AI Summary
                </h4>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {summary.summary}
              </p>
            </div>

            {/* Key Points */}
            {summary.keyPoints.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-4 h-4 text-halloween-orange"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                    Key Points
                  </h4>
                </div>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <span className="text-halloween-orange mt-1">•</span>
                      <span>{point}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              {/* Sentiment */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{getSentimentIcon(summary.sentiment)}</span>
                <span className={`text-xs font-medium ${getSentimentColor(summary.sentiment)}`}>
                  {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)}
                </span>
              </div>

              {/* Categories */}
              {summary.categories.length > 0 && (
                <div className="flex items-center gap-2">
                  {summary.categories.map((category, index) => (
                    <span
                      key={index}
                      className="badge badge-purple text-xs"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Read Full Article */}
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-halloween-purple hover:text-halloween-orange transition-colors"
            >
              Read full article
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
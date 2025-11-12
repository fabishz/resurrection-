'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleSummary from './ArticleSummary';

interface Article {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
}

interface Feed {
  id: string;
  name: string;
  url: string;
  unreadCount: number;
  category: string;
  favicon: string;
  articles?: Article[];
}

interface FeedItemProps {
  feed: Feed;
}

export default function FeedItem({ feed }: FeedItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
      setSelectedArticle(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(selectedArticle?.id === article.id ? null : article);
  };

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      {/* Feed Header */}
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full text-left p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150 group"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${feed.name} feed`}
      >
        <div className="flex items-center gap-3">
          {/* Favicon */}
          <div className="text-2xl flex-shrink-0">{feed.favicon}</div>

          {/* Feed info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-50 truncate group-hover:text-halloween-purple transition-colors duration-150">
                {feed.name}
              </h3>
              {feed.unreadCount > 0 && (
                <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-halloween-orange text-white">
                  {feed.unreadCount > 99 ? '99+' : feed.unreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {feed.category}
            </p>
          </div>

          {/* Expand/Collapse indicator */}
          <motion.svg
            className="w-4 h-4 text-neutral-400 dark:text-neutral-600 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </motion.svg>
        </div>
      </button>

      {/* Expanded Articles */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
              {feed.articles && feed.articles.length > 0 ? (
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {feed.articles.map((article) => (
                    <div key={article.id}>
                      <button
                        onClick={() => handleArticleClick(article)}
                        className="w-full text-left p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
                        aria-expanded={selectedArticle?.id === article.id}
                        aria-label={`${selectedArticle?.id === article.id ? 'Hide' : 'Show'} summary for ${article.title}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 mt-2 rounded-full bg-halloween-orange flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-50 mb-1 line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {new Date(article.pubDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Article Summary */}
                      <AnimatePresence>
                        {selectedArticle?.id === article.id && (
                          <ArticleSummary article={article} />
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No articles available
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

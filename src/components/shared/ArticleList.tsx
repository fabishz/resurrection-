'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// This will be replaced with real data from API
const mockArticles = [
  {
    id: '1',
    title: 'Getting Started with RSS Renaissance',
    excerpt: 'Learn how to add your first RSS feed and start enjoying AI-powered article summaries.',
    feedName: 'RSS Renaissance Blog',
    pubDate: new Date().toISOString(),
    isRead: false,
    category: 'Tutorial',
  },
];

export default function ArticleList() {
  const [articles] = useState(mockArticles);
  const [loading] = useState(false);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-50">
            No Articles Yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Add your first RSS feed to start reading articles. We'll automatically fetch, deduplicate, and summarize content for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-halloween-orange hover:bg-halloween-purple text-white rounded-xl font-medium transition-colors duration-300">
              Add Your First Feed
            </button>
            <button className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-50 rounded-xl font-medium transition-colors duration-300">
              Browse Popular Feeds
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
          Recent Articles
        </h2>
        <div className="flex items-center gap-2">
          <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 transition-colors">
            Mark all as read
          </button>
        </div>
      </div>

      {articles.map((article) => (
        <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-4">
            {!article.isRead && (
              <div className="w-2 h-2 mt-2 rounded-full bg-halloween-orange flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 hover:text-halloween-orange dark:hover:text-halloween-orange transition-colors cursor-pointer">
                  {article.title}
                </h3>
                <Badge variant="purple" className="flex-shrink-0">
                  {article.category}
                </Badge>
              </div>
              
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-500">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{article.feedName}</span>
                  <span>•</span>
                  <time dateTime={article.pubDate}>
                    {new Date(article.pubDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="hover:text-halloween-orange transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button className="hover:text-halloween-purple transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

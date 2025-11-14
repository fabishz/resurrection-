'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import { getAllArticles } from '@/lib/api-client';

interface Article {
  id: string;
  feedId: string;
  title: string;
  link: string;
  contentSnippet: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  feedTitle: string;
  feedUrl: string;
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllArticles(20, 0);
        setArticles(response.articles);
      } catch (err) {
        console.error('Failed to load articles:', err);
        setError(err instanceof Error ? err.message : 'Failed to load articles');
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  if (loading) {
    return (
      <Card className="bg-neutral-800 border-neutral-700">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-neutral-800 border-neutral-700">
        <div className="text-center py-12">
          <Icon name="warning" size="xl" className="text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2 text-white">
            Failed to Load Articles
          </h3>
          <p className="text-neutral-400 mb-6">{error}</p>
        </div>
      </Card>
    );
  }

  if (articles.length === 0) {
    return (
      <Card className="bg-neutral-800 border-neutral-700">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2 text-white">
            No Articles Yet
          </h3>
          <p className="text-neutral-400 mb-6 max-w-md mx-auto">
            Add your first RSS feed to start reading articles. We'll automatically fetch, deduplicate, and summarize content for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/feeds"
              className="px-6 py-3 bg-halloween-orange hover:bg-halloween-purple text-white rounded-xl font-medium transition-colors duration-300"
            >
              Add Your First Feed
            </Link>
            <Link
              href="/discover"
              className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl font-medium transition-colors duration-300"
            >
              Browse Popular Feeds
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id} className="bg-neutral-800 border-neutral-700 hover:shadow-xl hover:shadow-neutral-900/50 transition-all duration-300 hover:-translate-y-1">
          <div className="flex-1 min-w-0">
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
            
            <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
              {article.contentSnippet}
            </p>
            
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
        </Card>
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import ArticleCard from './ArticleCard';
import { getAllArticles } from '@/lib/api-client';

interface Article {
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
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

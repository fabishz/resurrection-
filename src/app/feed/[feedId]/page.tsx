/**
 * Feed Details Page
 * Shows all articles from a specific feed with AI summaries
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Icon from '@/components/ui/Icon';
import ArticleCard from '@/components/shared/ArticleCard';
import { getFeedWithArticles } from '@/lib/api-client';

interface FeedDetails {
  id: string;
  url: string;
  title: string;
  description?: string;
  link?: string;
  lastFetched: string;
  itemCount: number;
}

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
}

export default function FeedDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const feedId = params.feedId as string;

  const [feed, setFeed] = useState<FeedDetails | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeedDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get feed details with articles
        const response = await getFeedWithArticles(feedId);
        setFeed(response.feed);
        setArticles(response.articles);
      } catch (err) {
        console.error('Failed to load feed details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load feed details');
      } finally {
        setLoading(false);
      }
    };

    if (feedId) {
      loadFeedDetails();
    }
  }, [feedId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <Card className="bg-neutral-800 border-neutral-700">
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !feed) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-900">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <Card className="bg-neutral-800 border-neutral-700">
            <div className="text-center py-12">
              <Icon name="warning" size="xl" className="text-red-400 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2 text-white">
                Feed Not Found
              </h3>
              <p className="text-neutral-400 mb-6">{error || 'The requested feed could not be found.'}</p>
              <button
                onClick={() => router.push('/feeds')}
                className="px-6 py-3 bg-halloween-orange hover:bg-halloween-purple text-white rounded-xl font-medium transition-colors"
              >
                Back to Feeds
              </button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Feed Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-12 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-7xl">
          <button
            onClick={() => router.push('/feeds')}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feeds
          </button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3 text-white">
                {feed.title}
              </h1>
              {feed.description && (
                <p className="text-lg text-neutral-300 mb-4">
                  {feed.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-neutral-400">
                <a
                  href={feed.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-halloween-orange transition-colors"
                >
                  {feed.url}
                </a>
                <span>•</span>
                <span>
                  Last updated: {new Date(feed.lastFetched).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
            <Badge variant="orange" className="text-lg px-4 py-2">
              {articles.length} articles
            </Badge>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {articles.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">
                All Articles
              </h2>
              <p className="text-sm text-neutral-400">
                Click "Summarize" on any article to get an AI-generated summary
              </p>
            </div>
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={{
                  ...article,
                  feedTitle: feed.title,
                  feedUrl: feed.url,
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-neutral-800 border-neutral-700">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                No Articles Yet
              </h3>
              <p className="text-neutral-400">
                This feed doesn't have any articles yet. Check back later!
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

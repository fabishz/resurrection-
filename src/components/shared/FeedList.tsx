'use client';

import { useState } from 'react';
import FeedItem from './FeedItem';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// TODO: Replace with real data from API
const initialFeeds = [
  {
    id: '1',
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    unreadCount: 3,
    category: 'Tech',
    favicon: '🚀',
    articles: [
      {
        id: 'tc1',
        title: 'AI Startup Raises $100M in Series B Funding',
        link: 'https://techcrunch.com/article1',
        pubDate: new Date().toISOString(),
        contentSnippet:
          'A promising AI startup focused on natural language processing has secured $100 million in Series B funding. The company plans to use the funds to expand its team and accelerate product development. Industry experts believe this technology could revolutionize how businesses interact with customers.',
      },
      {
        id: 'tc2',
        title: 'New Framework Promises 10x Faster Web Development',
        link: 'https://techcrunch.com/article2',
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        contentSnippet:
          'Developers are excited about a new web framework that claims to make building applications 10 times faster. The framework uses innovative compilation techniques and provides excellent developer experience. Early adopters report significant productivity gains and cleaner code.',
      },
      {
        id: 'tc3',
        title: 'Cybersecurity Threats Increase by 40% This Year',
        link: 'https://techcrunch.com/article3',
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        contentSnippet:
          'A new report shows that cybersecurity threats have increased by 40% compared to last year. Companies are urged to strengthen their security measures and invest in employee training. The most common attack vectors include phishing, ransomware, and supply chain vulnerabilities.',
      },
    ],
  },
  {
    id: '2',
    name: 'Hacker News',
    url: 'https://news.ycombinator.com/rss',
    unreadCount: 5,
    category: 'Tech',
    favicon: '📰',
    articles: [
      {
        id: 'hn1',
        title: 'Show HN: I Built a Tool to Visualize Git Repositories',
        link: 'https://news.ycombinator.com/item1',
        pubDate: new Date().toISOString(),
        contentSnippet:
          'After struggling to understand complex git histories, I built a visualization tool that makes it easy to see branch relationships and commit patterns. The tool is open source and works with any git repository. It has already helped hundreds of developers better understand their codebases.',
      },
      {
        id: 'hn2',
        title: 'The Hidden Costs of Microservices Architecture',
        link: 'https://news.ycombinator.com/item2',
        pubDate: new Date(Date.now() - 43200000).toISOString(),
        contentSnippet:
          'While microservices offer many benefits, they also come with hidden costs that are often overlooked. These include increased operational complexity, network latency, and debugging challenges. Teams should carefully consider whether the benefits outweigh these costs for their specific use case.',
      },
    ],
  },
  {
    id: '3',
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    unreadCount: 2,
    category: 'Tech',
    favicon: '⚡',
    articles: [
      {
        id: 'tv1',
        title: 'Apple Announces New MacBook Pro with M4 Chip',
        link: 'https://theverge.com/article1',
        pubDate: new Date().toISOString(),
        contentSnippet:
          'Apple has unveiled its latest MacBook Pro featuring the powerful M4 chip. The new model offers significant performance improvements and better battery life. Pre-orders start next week with shipping expected in early December.',
      },
    ],
  },
];

export default function FeedList() {
  const [feeds] = useState(initialFeeds);
  const totalUnread = feeds.reduce((acc, feed) => acc + feed.unreadCount, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          Your Feeds
        </h2>
        <Badge variant="orange">{totalUnread} unread</Badge>
      </div>

      <div className="space-y-3">
        {feeds.length > 0 ? (
          feeds.map((feed) => <FeedItem key={feed.id} feed={feed} />)
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No feeds yet. Add your first feed to get started!
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <Button variant="ghost" className="w-full text-sm">
          <span className="flex items-center justify-center gap-2">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Feed
          </span>
        </Button>
      </div>
    </Card>
  );
}

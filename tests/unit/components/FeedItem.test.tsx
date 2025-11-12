import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedItem from '@/components/FeedItem';

// Mock Framer Motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock ArticleSummary component
vi.mock('@/components/ArticleSummary', () => ({
  default: ({ article }: any) => (
    <div data-testid="article-summary">Summary for {article.title}</div>
  ),
}));

describe('FeedItem', () => {
  const mockFeed = {
    id: 'test-feed-1',
    name: 'Test Feed',
    url: 'https://example.com/feed',
    unreadCount: 5,
    category: 'Tech',
    favicon: '🚀',
    articles: [
      {
        id: 'article-1',
        title: 'Test Article 1',
        link: 'https://example.com/article1',
        pubDate: new Date().toISOString(),
        contentSnippet: 'This is test article 1 content',
      },
      {
        id: 'article-2',
        title: 'Test Article 2',
        link: 'https://example.com/article2',
        pubDate: new Date().toISOString(),
        contentSnippet: 'This is test article 2 content',
      },
    ],
  };

  describe('Rendering', () => {
    it('should render feed name and favicon', () => {
      render(<FeedItem feed={mockFeed} />);

      expect(screen.getByText('Test Feed')).toBeInTheDocument();
      expect(screen.getByText('🚀')).toBeInTheDocument();
    });

    it('should render unread count badge', () => {
      render(<FeedItem feed={mockFeed} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('should render category', () => {
      render(<FeedItem feed={mockFeed} />);

      expect(screen.getByText('Tech')).toBeInTheDocument();
    });

    it('should not render unread badge when count is 0', () => {
      const feedWithNoUnread = { ...mockFeed, unreadCount: 0 };
      render(<FeedItem feed={feedWithNoUnread} />);

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('should render 99+ for counts over 99', () => {
      const feedWithManyUnread = { ...mockFeed, unreadCount: 150 };
      render(<FeedItem feed={feedWithManyUnread} />);

      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse', () => {
    it('should be collapsed by default', () => {
      render(<FeedItem feed={mockFeed} />);

      expect(screen.queryByText('Test Article 1')).not.toBeInTheDocument();
    });

    it('should expand when clicked', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.getByText('Test Article 2')).toBeInTheDocument();
      });
    });

    it('should collapse when clicked again', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });

      // Expand
      await user.click(button);
      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Collapse
      await user.click(button);
      await waitFor(() => {
        expect(screen.queryByText('Test Article 1')).not.toBeInTheDocument();
      });
    });

    it('should update aria-expanded attribute', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });

      expect(button).toHaveAttribute('aria-expanded', 'false');

      await user.click(button);

      await waitFor(() => {
        expect(button).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should expand on Enter key', async () => {
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      button.focus();

      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });
    });

    it('should expand on Space key', async () => {
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      button.focus();

      fireEvent.keyDown(button, { key: ' ', code: 'Space' });

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });
    });

    it('should not expand on other keys', async () => {
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      button.focus();

      fireEvent.keyDown(button, { key: 'a', code: 'KeyA' });

      expect(screen.queryByText('Test Article 1')).not.toBeInTheDocument();
    });
  });

  describe('Article Selection', () => {
    it('should show summary when article is clicked', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      // Expand feed first
      const expandButton = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Click article
      const articleButton = screen.getByRole('button', { name: /show summary for test article 1/i });
      await user.click(articleButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-summary')).toBeInTheDocument();
        expect(screen.getByText('Summary for Test Article 1')).toBeInTheDocument();
      });
    });

    it('should hide summary when article is clicked again', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      // Expand feed
      const expandButton = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Click article to show summary
      const articleButton = screen.getByRole('button', { name: /show summary for test article 1/i });
      await user.click(articleButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-summary')).toBeInTheDocument();
      });

      // Click again to hide
      await user.click(articleButton);

      await waitFor(() => {
        expect(screen.queryByTestId('article-summary')).not.toBeInTheDocument();
      });
    });

    it('should switch between articles', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      // Expand feed
      const expandButton = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      // Click first article
      const article1Button = screen.getByRole('button', { name: /show summary for test article 1/i });
      await user.click(article1Button);

      await waitFor(() => {
        expect(screen.getByText('Summary for Test Article 1')).toBeInTheDocument();
      });

      // Click second article
      const article2Button = screen.getByRole('button', { name: /show summary for test article 2/i });
      await user.click(article2Button);

      await waitFor(() => {
        expect(screen.getByText('Summary for Test Article 2')).toBeInTheDocument();
        expect(screen.queryByText('Summary for Test Article 1')).not.toBeInTheDocument();
      });
    });

    it('should clear selected article when feed is collapsed', async () => {
      const user = userEvent.setup();
      render(<FeedItem feed={mockFeed} />);

      // Expand and select article
      const expandButton = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
      });

      const articleButton = screen.getByRole('button', { name: /show summary for test article 1/i });
      await user.click(articleButton);

      await waitFor(() => {
        expect(screen.getByTestId('article-summary')).toBeInTheDocument();
      });

      // Collapse feed
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.queryByTestId('article-summary')).not.toBeInTheDocument();
      });

      // Expand again - summary should not be shown
      await user.click(expandButton);

      await waitFor(() => {
        expect(screen.getByText('Test Article 1')).toBeInTheDocument();
        expect(screen.queryByTestId('article-summary')).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no articles', async () => {
      const user = userEvent.setup();
      const feedWithNoArticles = { ...mockFeed, articles: [] };
      render(<FeedItem feed={feedWithNoArticles} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('No articles available')).toBeInTheDocument();
      });
    });

    it('should show empty message when articles is undefined', async () => {
      const user = userEvent.setup();
      const feedWithNoArticles = { ...mockFeed, articles: undefined };
      render(<FeedItem feed={feedWithNoArticles} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('No articles available')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      expect(button).toHaveAttribute('aria-expanded');
      expect(button).toHaveAttribute('aria-label');
    });

    it('should be keyboard accessible', () => {
      render(<FeedItem feed={mockFeed} />);

      const button = screen.getByRole('button', { name: /expand test feed/i });
      button.focus();

      expect(document.activeElement).toBe(button);
    });
  });
});

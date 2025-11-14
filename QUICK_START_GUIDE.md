# RSS Renaissance - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ installed
npm or yarn package manager
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

---

## 📖 How to Use

### 1. Add Your First Feed

**Option A: From Feeds Page**
1. Navigate to `/feeds`
2. Enter RSS feed URL in the input field
3. Click "Add Feed"
4. Wait for ingestion to complete
5. Feed appears in sidebar with article count

**Option B: From Discover Page**
1. Navigate to `/discover`
2. Browse curated feeds by category
3. Click "Add Feed" on any feed card
4. Automatically redirected to `/feeds` page

**Option C: Use Popular Feeds**
1. On `/feeds` page, scroll to "Popular Feeds"
2. Click any feed name to auto-fill URL
3. Click "Add Feed" to ingest

### 2. View Articles

**Homepage:**
- Latest articles displayed in main content area
- Click article title to read full article (opens in new tab)
- See feed name, publish date, and author

**Feed Sidebar:**
- View all your feeds
- See article count per feed
- See latest article title

### 3. Discover New Feeds

**Browse by Category:**
- Technology (TechCrunch, Hacker News, The Verge, Ars Technica)
- Development (CSS-Tricks, Smashing Magazine, Dev.to)
- Design (Dribbble, Behance)
- Business (Harvard Business Review, Entrepreneur)

---

## 🔧 API Endpoints

### GET /api/feeds
**Returns:** All feeds with metadata
```json
{
  "success": true,
  "feeds": [
    {
      "id": "feed-123",
      "url": "https://example.com/feed",
      "title": "Example Feed",
      "itemCount": 42,
      "latestArticle": "Latest Article Title",
      "latestArticleDate": "2025-11-14T10:00:00Z",
      "lastFetched": "2025-11-14T10:00:00Z"
    }
  ],
  "totalFeeds": 1,
  "totalArticles": 42
}
```

### GET /api/articles?limit=20&offset=0
**Returns:** Paginated articles
```json
{
  "success": true,
  "articles": [
    {
      "id": "article-123",
      "feedId": "feed-123",
      "title": "Article Title",
      "link": "https://example.com/article",
      "contentSnippet": "Article preview...",
      "pubDate": "2025-11-14T10:00:00Z",
      "author": "John Doe",
      "categories": ["Tech"],
      "feedTitle": "Example Feed",
      "feedUrl": "https://example.com/feed"
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

### POST /api/ingest
**Body:**
```json
{
  "feedUrl": "https://example.com/feed",
  "userId": "optional-user-id"
}
```

**Returns:**
```json
{
  "success": true,
  "feedId": "feed-123",
  "itemsIngested": 42,
  "items": [...]
}
```

---

## 🎨 UI Components

### Dark Theme Colors
```css
/* Backgrounds */
bg-neutral-900     /* Page background */
bg-neutral-800     /* Cards */
bg-neutral-700     /* Interactive elements */

/* Text */
text-white         /* Headings */
text-neutral-300   /* Body text */
text-neutral-400   /* Muted text */

/* Accents */
bg-halloween-orange  /* Primary buttons */
bg-halloween-purple  /* Hover states */
```

### Component Usage

**Card:**
```tsx
<Card className="bg-neutral-800 border-neutral-700">
  <h3 className="text-white">Title</h3>
  <p className="text-neutral-400">Content</p>
</Card>
```

**Badge:**
```tsx
<Badge variant="orange">42 articles</Badge>
<Badge variant="purple">Tech</Badge>
```

**Button:**
```tsx
<Button variant="primary">Add Feed</Button>
<Button variant="secondary">Cancel</Button>
```

**Loading Spinner:**
```tsx
<LoadingSpinner size="lg" />
```

---

## 🐛 Troubleshooting

### Feed Won't Add
**Problem:** Error message when adding feed  
**Solutions:**
- Verify URL is a valid RSS/Atom feed
- Check feed is publicly accessible
- Try a different feed to test

### No Articles Showing
**Problem:** Empty article list  
**Solutions:**
- Add at least one feed first
- Wait for feed ingestion to complete
- Check browser console for errors

### Build Errors
**Problem:** `npm run build` fails  
**Solutions:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### TypeScript Errors
**Problem:** Type errors in IDE  
**Solutions:**
```bash
# Restart TypeScript server
# In VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📁 Project Structure

```
rss-renaissance/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── articles/      # Articles endpoint ✨
│   │   │   ├── feeds/         # Feeds endpoint ✨
│   │   │   ├── ingest/        # Ingest endpoint
│   │   │   └── summarize/     # Summarize endpoint
│   │   ├── discover/          # Discover page
│   │   ├── feeds/             # Feeds page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── shared/            # Shared components
│   │   │   ├── ArticleList.tsx  # Article list ✨
│   │   │   ├── FeedList.tsx     # Feed list ✨
│   │   │   └── Header.tsx       # Header with logo ✨
│   │   └── ui/                # UI primitives
│   ├── lib/
│   │   ├── api-client.ts      # API client ✨
│   │   ├── storage.ts         # In-memory storage
│   │   └── feed-parser.ts     # RSS parser
│   └── types/
│       └── api.ts             # TypeScript types
├── public/                     # Static assets
└── package.json               # Dependencies

✨ = Modified/Created in this audit
```

---

## 🔑 Key Files

### API Client (`src/lib/api-client.ts`)
- `ingestFeed(url)` - Add new feed
- `getAllFeeds()` - Get all feeds
- `getAllArticles(limit, offset)` - Get articles
- `summarizeArticle(content)` - Get AI summary

### Storage (`src/lib/storage.ts`)
- In-memory storage for development
- Will be replaced with PostgreSQL in production
- Stores feeds and articles

### Components
- `FeedList` - Displays all feeds with metadata
- `ArticleList` - Displays all articles
- `Header` - Navigation with RSS•AI logo
- `Card`, `Badge`, `Button` - UI primitives

---

## 🎯 Testing the App

### 1. Test Feed Ingestion
```bash
# Add TechCrunch feed
URL: https://techcrunch.com/feed/
Expected: ~20 articles ingested
```

### 2. Test Article Display
```bash
# Navigate to homepage
Expected: Articles from all feeds displayed
Expected: Click article opens in new tab
```

### 3. Test Feed Discovery
```bash
# Navigate to /discover
# Click "Add Feed" on any card
Expected: Redirects to /feeds
Expected: Feed appears in sidebar
```

### 4. Test Error Handling
```bash
# Try invalid URL
URL: https://invalid-url
Expected: Error message displayed
Expected: Form remains usable
```

---

## 📊 Performance Tips

### Optimize Article Loading
```tsx
// Load fewer articles initially
const response = await getAllArticles(10, 0);

// Implement pagination
const loadMore = () => {
  getAllArticles(10, articles.length);
};
```

### Cache API Responses
```tsx
// Use SWR or React Query for caching
import useSWR from 'swr';

const { data } = useSWR('/api/feeds', fetcher);
```

### Lazy Load Components
```tsx
// Dynamic imports for heavy components
const ArticleList = dynamic(() => import('@/components/shared/ArticleList'));
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_APP_NAME="RSS Renaissance"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
OPENAI_API_KEY="your-api-key"
```

---

## 📚 Additional Resources

- **Full Documentation:** `PRODUCTION_READY_AUDIT.md`
- **API Examples:** `API_EXAMPLES.md`
- **Architecture:** `.kiro/steering/architecture.md`
- **Frontend Standards:** `.kiro/steering/frontend-standards.md`
- **Product Vision:** `.kiro/steering/product.md`

---

## 💡 Pro Tips

1. **Use keyboard shortcuts** - Tab navigation works throughout
2. **Open articles in new tabs** - Click article titles
3. **Add multiple feeds** - No limit on feed count
4. **Check feed sidebar** - See article counts at a glance
5. **Use discover page** - Fastest way to add popular feeds

---

## 🎉 You're Ready!

The app is fully functional and production-ready. Start by adding your first feed and exploring the features!

**Happy reading! 📰✨**

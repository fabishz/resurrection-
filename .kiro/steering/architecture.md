# Architecture Decisions & Rationale

## Core Architecture Principles

1. **Offline-First**: App must work without internet after initial load
2. **Privacy-First**: No user tracking, all data local by default
3. **Performance-First**: Sub-2-second page loads, 60fps scrolling
4. **Cost-Conscious**: Minimize AI API calls through aggressive caching

## Technology Stack Decisions

### Next.js 16 App Router
**Why**: Server components reduce client bundle, built-in API routes eliminate separate backend, Vercel deployment is trivial.
**Trade-off**: Learning curve for App Router, but worth it for performance.

### PostgreSQL + Prisma
**Why**: Relational data (feeds → articles → categories), Prisma provides type-safe queries and migrations.
**Alternative Considered**: MongoDB (rejected—relationships are core to our model).

### IndexedDB for Client Storage
**Why**: Stores full articles offline (500MB+ quota), faster than localStorage, supports complex queries.
**Implementation**: Use Dexie.js wrapper for cleaner API.

### Redis for Caching
**Why**: Cache AI summaries (expensive to regenerate), feed responses (reduce external requests), API responses.
**Cost**: Upstash free tier (10K requests/day) sufficient for MVP.

### OpenAI API for AI
**Why**: Best-in-class summarization quality, reliable API, reasonable pricing ($0.002/1K tokens).
**Cost Control**: Batch process articles, cache aggressively, use GPT-4o-mini for summaries.
**Fallback**: Use article excerpt if API fails or quota exceeded.

## Data Flow Architecture

```
User Request → Next.js API Route → Prisma → PostgreSQL
                    ↓
              Redis Cache (check first)
                    ↓
         External RSS Feed (if cache miss)
                    ↓
         AI Summarization (batched)
                    ↓
         IndexedDB (client-side cache)
```

## Key Architectural Patterns

### Background Job Processing
**Pattern**: Cron job triggers feed refresh every 15 minutes.
**Implementation**: Vercel Cron (free tier) or BullMQ if self-hosting.
**Rationale**: Keeps feeds fresh without user waiting, handles rate limiting.

### Deduplication Strategy
**Pattern**: Hash-based + similarity scoring.
**Implementation**: 
1. Normalize URLs (remove tracking params)
2. Generate content hash (MD5 of cleaned content)
3. Calculate title similarity (Levenshtein distance)
4. Merge if hash match OR similarity > 85%
**Rationale**: Catches exact duplicates (hash) and near-duplicates (similarity).

### Caching Layers
1. **Browser Cache**: Static assets (images, CSS, JS)
2. **IndexedDB**: Full article content for offline reading
3. **Redis**: API responses, AI summaries, feed data (15min TTL)
4. **CDN**: Vercel Edge Network for global distribution
**Rationale**: Multi-layer caching minimizes database hits and external API calls.

### State Management
**Pattern**: Zustand for global state (feeds, articles, preferences).
**Rationale**: Simpler than Redux, TypeScript-friendly, minimal boilerplate.
**Alternative Considered**: React Context (rejected—performance issues with frequent updates).

## Security Decisions

### Content Security Policy
**Rule**: Strict CSP headers to prevent XSS.
**Implementation**: `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; img-src * data:;`

### Feed Proxying
**Rule**: Never fetch feeds directly from client.
**Rationale**: Hides user subscriptions from feed providers, prevents CORS issues, enables caching.

### Input Sanitization
**Rule**: Sanitize all HTML content from feeds using DOMPurify.
**Rationale**: Prevents XSS attacks from malicious feed content.

## Performance Optimizations

### Virtual Scrolling
**Implementation**: Use react-window for article lists.
**Rationale**: Render only visible items, handle 10K+ articles without lag.

### Image Optimization
**Implementation**: Next.js Image component with lazy loading.
**Rationale**: Reduces bandwidth, improves perceived performance.

### Code Splitting
**Implementation**: Dynamic imports for heavy components (AI settings, analytics).
**Rationale**: Reduces initial bundle size, faster first paint.

## Scalability Considerations

### Database Indexing
**Indexes**: 
- `articles(feed_id, published_at)` for feed queries
- `articles(content_hash)` for deduplication
- `articles(title)` for search (GIN index for full-text)

### Rate Limiting
**Implementation**: 100 requests/minute per user, 10 requests/minute per feed.
**Rationale**: Prevents abuse, respects feed provider limits.

### Horizontal Scaling
**Strategy**: Stateless API routes enable easy horizontal scaling on Vercel.
**Database**: Connection pooling (PgBouncer) for high concurrency.

## Monitoring & Observability

**Error Tracking**: Sentry for frontend and API errors.
**Performance**: Vercel Analytics for Web Vitals.
**Logging**: Structured JSON logs with correlation IDs.
**Alerts**: Slack notifications for critical errors (feed fetch failures, AI quota exceeded).

## Decision Log

| Decision | Date | Rationale |
|----------|------|-----------|
| Use Next.js over Vite | 2025-11-11 | Built-in API routes, better SEO, Vercel integration |
| PostgreSQL over MongoDB | 2025-11-11 | Relational data model, better for deduplication queries |
| OpenAI over local models | 2025-11-11 | Quality > cost for MVP, can switch later |
| Zustand over Redux | 2025-11-11 | Simpler API, less boilerplate, sufficient for our needs |

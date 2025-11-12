# Setup Interactive UI Components

This guide explains how to set up and test the interactive FeedList and ArticleSummary components with Framer Motion animations.

## Installation

### 1. Install Framer Motion

```bash
npm install framer-motion
```

### 2. Verify Installation

```bash
npm list framer-motion
```

Should output: `framer-motion@11.0.0` or similar

## Component Overview

### New Components Created

1. **FeedItem.tsx** (Enhanced)
   - Expandable/collapsible feed items
   - Smooth height animations
   - Keyboard navigation support
   - Article list display

2. **ArticleSummary.tsx** (New)
   - AI summary display with loading states
   - Error handling with retry
   - Key points with staggered animations
   - Sentiment indicators
   - Category badges

3. **FeedList.tsx** (Updated)
   - Mock data with articles
   - Multiple feeds with real content

## Features Implemented

### ✅ Interactivity
- Click feed to expand/collapse
- Click article to show/hide AI summary
- Keyboard navigation (Enter/Space to toggle)
- Accessible ARIA labels

### ✅ Animations (Framer Motion)
- Smooth expand/collapse (300ms ease-in-out)
- Summary reveal with fade-in
- Key points stagger animation (100ms delay each)
- Rotate chevron icon on expand
- Loading spinner rotation

### ✅ Loading States
- Spinner with "Generating AI summary..." text
- Smooth transition from loading to content
- Processing time display

### ✅ Error States
- Red error box with icon
- User-friendly error messages
- "Try again" button
- Graceful error handling

### ✅ Accessibility
- ARIA expanded states
- Keyboard navigation
- Focus indicators
- Screen reader friendly labels
- Semantic HTML

## Testing the UI

### 1. Start Development Server

```bash
npm run dev
```

### 2. Open Browser

Navigate to: http://localhost:3000

### 3. Test Interactions

#### Feed Expansion
1. Click on "TechCrunch" feed
2. Should smoothly expand showing 3 articles
3. Click again to collapse
4. Try keyboard: Tab to focus, Enter to toggle

#### Article Summary
1. Expand a feed
2. Click on any article title
3. Should show loading spinner
4. After ~100ms, AI summary appears with:
   - Summary text
   - Key points (animated one by one)
   - Sentiment emoji and label
   - Category badge
   - "Read full article" link

#### Multiple Feeds
1. Expand multiple feeds simultaneously
2. Each maintains its own state
3. Summaries load independently

#### Error Handling
To test error state:
1. Stop the dev server
2. Try to load a summary
3. Should show error message with retry button

### 4. Test Keyboard Navigation

```
Tab       - Move between interactive elements
Enter     - Activate focused element
Space     - Activate focused element
Shift+Tab - Move backwards
```

### 5. Test Responsive Design

Open DevTools (F12) and test these viewports:
- Desktop: 1440px
- Tablet: 768px
- Mobile: 375px

## Mock Data

The components use mock data with realistic content:

- **3 Feeds**: TechCrunch, Hacker News, The Verge
- **6 Total Articles**: Various tech news
- **Content**: Real-looking snippets for summarization

## API Integration

The ArticleSummary component calls:

```typescript
POST /api/summarize
{
  "content": "article content...",
  "title": "article title",
  "maxLength": 200
}
```

Response includes:
- `summary`: AI-generated summary
- `keyPoints`: Array of key points
- `sentiment`: positive/negative/neutral
- `categories`: Array of categories

## Customization

### Animation Timing

Edit in `src/components/FeedItem.tsx`:

```typescript
transition={{ duration: 0.3, ease: 'easeInOut' }}
```

### Loading Delay

Edit in `src/components/ArticleSummary.tsx`:

```typescript
// Simulate API delay (for demo)
await new Promise(resolve => setTimeout(resolve, 100));
```

### Colors

Edit in `tailwind.config.ts`:

```typescript
halloween: {
  orange: '#ff6b35',
  purple: '#6b35ff',
  // ...
}
```

## Troubleshooting

### Framer Motion Not Working

```bash
# Reinstall
npm uninstall framer-motion
npm install framer-motion

# Clear cache
rm -rf .next
npm run dev
```

### Animations Choppy

1. Check browser performance
2. Reduce animation complexity
3. Use `will-change` CSS property
4. Enable GPU acceleration

### TypeScript Errors

```bash
# Regenerate types
npm run type-check
```

### API Errors

1. Check dev server is running
2. Verify `/api/summarize` route exists
3. Check browser console for errors
4. Test API directly with curl

## Performance

### Metrics
- Initial load: < 2s
- Feed expansion: 300ms
- Summary generation: < 3s
- Smooth 60fps animations

### Optimization
- Virtual scrolling for 100+ articles
- Lazy load summaries
- Cache API responses
- Debounce rapid clicks

## Accessibility Checklist

- [x] Keyboard navigation works
- [x] Focus indicators visible
- [x] ARIA labels present
- [x] Screen reader tested
- [x] Color contrast meets WCAG AA
- [x] No motion for `prefers-reduced-motion`
- [x] Semantic HTML used

## Next Steps

1. **Add Real API**: Replace mock with actual RSS feed data
2. **Implement Caching**: Cache summaries in Redis
3. **Add Pagination**: Virtual scroll for many articles
4. **Enhance Animations**: Add more micro-interactions
5. **Mobile Gestures**: Swipe to expand/collapse
6. **Keyboard Shortcuts**: j/k navigation like Gmail

## Screenshots

See `screenshots/SCREENSHOTS.md` for list of screenshots to generate.

Priority screenshots:
1. Home page dark mode
2. Feed expanded
3. Article summary complete
4. Summary reveal animation (GIF)

---

*Last Updated: 2025-11-11*

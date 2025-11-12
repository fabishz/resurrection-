# RSS Renaissance - Screenshot Placeholders

This document lists the screenshots to be generated for documentation and demo purposes.

## UI Screenshots

### 1. `01-home-dark-mode.png`
**Description**: Home page in dark mode showing the feed list sidebar and main content area
**Elements to capture**:
- Header with RSS Renaissance logo and theme toggle
- Feed list sidebar with 3 feeds (TechCrunch, Hacker News, The Verge)
- Unread count badges
- Main content area with welcome message
- Dark mode Halloween theme colors (midnight background, orange accents)

### 2. `02-feed-expanded.png`
**Description**: Feed item expanded showing article list
**Elements to capture**:
- TechCrunch feed expanded
- 3 articles visible with titles and dates
- Orange dot indicators for unread articles
- Smooth expand/collapse animation (capture mid-animation if possible)
- Hover state on one article

### 3. `03-article-summary-loading.png`
**Description**: Article clicked, showing loading state for AI summary
**Elements to capture**:
- Article title highlighted
- Loading spinner with "Generating AI summary..." text
- Orange spinning animation
- Rest of UI in context

### 4. `04-article-summary-complete.png`
**Description**: AI summary fully loaded and displayed
**Elements to capture**:
- Complete AI summary text (2-3 sentences)
- Key points section with bullet list (3 items)
- Sentiment indicator (emoji + text)
- Category badges (purple)
- "Read full article" link with external icon
- Smooth reveal animation complete

### 5. `05-article-summary-error.png`
**Description**: Error state when summary generation fails
**Elements to capture**:
- Red error box with warning icon
- Error message: "Failed to generate summary"
- "Try again" button
- Error styling consistent with theme

### 6. `06-multiple-feeds-expanded.png`
**Description**: Multiple feeds expanded simultaneously
**Elements to capture**:
- 2 feeds expanded (TechCrunch and Hacker News)
- Different articles visible in each
- One article with summary shown
- Demonstrates scalability of UI

### 7. `07-light-mode.png`
**Description**: Same view as screenshot 4 but in light mode
**Elements to capture**:
- Light background with fog color
- Proper contrast for all text
- Halloween theme colors adapted for light mode
- Theme toggle showing sun icon

### 8. `08-mobile-view.png`
**Description**: Mobile responsive view (375px width)
**Elements to capture**:
- Collapsed sidebar (if applicable)
- Feed list stacked vertically
- Article summary readable on small screen
- Touch-friendly button sizes

### 9. `09-keyboard-navigation.png`
**Description**: Focus states for keyboard navigation
**Elements to capture**:
- Visible focus ring on feed item
- Purple focus indicator
- Demonstrates accessibility

### 10. `10-hover-states.png`
**Description**: Various hover states
**Elements to capture**:
- Feed item hover (purple text)
- Article hover (background change)
- Button hover (color transition)
- Link hover (orange color)

## Animation Screenshots

### 11. `11-expand-animation-sequence.gif`
**Description**: Animated GIF showing feed expansion
**Frames to capture**:
- Frame 1: Feed collapsed
- Frame 2-4: Expansion animation (height growing)
- Frame 5: Fully expanded with articles visible
- Duration: ~300ms

### 12. `12-summary-reveal-animation.gif`
**Description**: Animated GIF showing summary reveal
**Frames to capture**:
- Frame 1: Article clicked, loading spinner appears
- Frame 2-3: Loading state
- Frame 4-6: Summary fades in with slide-up animation
- Frame 7: Key points appear one by one
- Duration: ~500ms

### 13. `13-theme-toggle-animation.gif`
**Description**: Animated GIF showing theme switch
**Frames to capture**:
- Frame 1: Dark mode
- Frame 2-3: Transition (colors changing)
- Frame 4: Light mode
- Duration: ~200ms

## Technical Screenshots

### 14. `14-api-response-summary.png`
**Description**: Browser DevTools showing API response
**Elements to capture**:
- Network tab with POST /api/summarize request
- Response JSON with summary, keyPoints, sentiment, categories
- Status 200 OK
- Response time

### 15. `15-console-logs.png`
**Description**: Browser console showing summarizer logs
**Elements to capture**:
- "[Summarizer] Cache miss, generating summary"
- "[Summarizer] Generated summary in Xms"
- "[Summarizer] Cached summary with key: ..."
- No errors

### 16. `16-lighthouse-score.png`
**Description**: Lighthouse audit results
**Elements to capture**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 90+

## Comparison Screenshots

### 17. `17-before-after-deduplication.png`
**Description**: Side-by-side comparison showing deduplication
**Left side**: 10 articles with duplicates
**Right side**: 6 unique articles after deduplication
**Highlight**: Duplicate articles merged

### 18. `18-with-without-summary.png`
**Description**: Side-by-side comparison
**Left side**: Article with just title and date
**Right side**: Same article with AI summary and key points
**Highlight**: Value of AI summarization

## Error States

### 19. `19-rate-limit-error.png`
**Description**: Rate limit exceeded error
**Elements to capture**:
- Error message: "Rate limit exceeded"
- Retry after time displayed
- User-friendly explanation

### 20. `20-network-error.png`
**Description**: Network/offline error
**Elements to capture**:
- Offline indicator
- Cached content still visible
- "Retry" button

## Instructions for Screenshot Generation

1. **Setup**:
   - Run `npm run dev`
   - Open http://localhost:3000
   - Use browser DevTools device toolbar for mobile views

2. **Dark Mode** (default):
   - Screenshots 1-6, 8-16 should be in dark mode
   - Use midnight background (#0a0a14)

3. **Light Mode**:
   - Screenshot 7 only
   - Toggle theme using sun/moon button

4. **Browser**:
   - Use Chrome or Firefox
   - Window size: 1440x900 for desktop
   - Device: iPhone 12 Pro (375x812) for mobile

5. **Capture Tool**:
   - macOS: Cmd+Shift+4
   - Windows: Snipping Tool
   - Linux: gnome-screenshot or flameshot

6. **Annotations**:
   - Use red arrows/boxes to highlight key features
   - Add text labels where helpful
   - Keep annotations minimal and clear

7. **File Format**:
   - PNG for static screenshots (lossless)
   - GIF for animations (< 5MB)
   - Optimize with ImageOptim or similar

8. **Naming Convention**:
   - Use provided filenames exactly
   - All lowercase
   - Hyphens for spaces
   - Sequential numbering

## Priority Order

**High Priority** (for MVP demo):
1. `01-home-dark-mode.png`
2. `02-feed-expanded.png`
3. `04-article-summary-complete.png`
4. `12-summary-reveal-animation.gif`

**Medium Priority** (for documentation):
5. `03-article-summary-loading.png`
6. `05-article-summary-error.png`
7. `07-light-mode.png`
8. `14-api-response-summary.png`

**Low Priority** (nice to have):
9. All remaining screenshots

---

*Last Updated: 2025-11-11*
*Total Screenshots: 20*

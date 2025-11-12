# RSS Renaissance - Screenshots

This folder contains all screenshots and visual assets for the hackathon submission.

## Required Screenshots

### 1. Homepage / Feed List View
**Filename**: `01-homepage-feed-list.png`
**Description**: Main interface showing feed list with articles, dark mode enabled, Halloween theme visible.
**Key Elements**:
- Feed sidebar with subscribed feeds
- Article list with titles, excerpts, and metadata
- Dark mode with Halloween color palette (orange, purple accents)
- Unread badges and category tags
- Search bar and filter options

**Capture Instructions**:
```bash
# Navigate to homepage
open http://localhost:3000

# Ensure dark mode is enabled
# Add 5-10 sample feeds (tech news, blogs)
# Take full-page screenshot (1920x1080 recommended)
```

---

### 2. Article Detail with AI Summary
**Filename**: `02-article-detail-ai-summary.png`
**Description**: Individual article view with AI-generated summary displayed.
**Key Elements**:
- Full article content
- AI summary box (highlighted with orange border)
- "Summarize" button (before) and summary text (after)
- Reading time estimate
- Share and bookmark buttons

**Capture Instructions**:
```bash
# Click on any article from feed list
# Click "Summarize with AI" button
# Wait for summary to appear (~2 seconds)
# Take screenshot showing both article and summary
```

---

### 3. Feed Ingestion in Progress
**Filename**: `03-feed-ingestion-loading.png`
**Description**: UI showing feed being added with loading state.
**Key Elements**:
- "Add Feed" modal or input field
- Loading spinner with Halloween theme
- Progress indicator (e.g., "Fetching 50 articles...")
- Success message after completion

**Capture Instructions**:
```bash
# Click "Add Feed" button
# Enter feed URL: https://hnrss.org/frontpage
# Capture loading state (may need to use slow network throttling)
# Or capture success state with "50 articles added" message
```

---

### 4. Deduplication Results
**Filename**: `04-deduplication-results.png`
**Description**: Visual demonstration of deduplication working.
**Key Elements**:
- Before: "500 articles from 10 feeds"
- After: "98 unique articles (80.4% reduction)"
- Merged article indicator (e.g., "3 sources" badge)
- Deduplication stats in settings or dashboard

**Capture Instructions**:
```bash
# Add multiple tech news feeds (HN, TechCrunch, Verge, Ars Technica)
# Wait for all feeds to load
# Navigate to settings or stats page showing deduplication metrics
# Or capture article with "Multiple sources" badge
```

---

### 5. Offline Mode Indicator
**Filename**: `05-offline-mode.png`
**Description**: App working in offline mode with cached content.
**Key Elements**:
- "Offline" indicator in header (orange badge)
- Cached articles still readable
- Grayed-out "Add Feed" button (disabled offline)
- Toast notification: "You're offline. Showing cached content."

**Capture Instructions**:
```bash
# Load app with articles
# Open browser DevTools → Network tab
# Enable "Offline" mode
# Refresh page
# Take screenshot showing offline indicator and working UI
```

---

### 6. Dark Mode Toggle
**Filename**: `06-dark-mode-toggle.png`
**Description**: Side-by-side comparison of light and dark modes.
**Key Elements**:
- Split screen: light mode (left) and dark mode (right)
- Halloween theme visible in both modes
- Theme toggle button in header
- Consistent design across both modes

**Capture Instructions**:
```bash
# Take screenshot in light mode
# Toggle to dark mode
# Take screenshot in dark mode
# Use image editor to create side-by-side comparison
```

---

### 7. Accessibility Features
**Filename**: `07-accessibility-features.png`
**Description**: Keyboard navigation and focus indicators.
**Key Elements**:
- Visible focus ring on interactive elements (purple)
- Skip link visible at top ("Skip to main content")
- Keyboard shortcut hints (e.g., "Press / to search")
- High contrast text (WCAG AA compliant)

**Capture Instructions**:
```bash
# Use Tab key to navigate through interface
# Capture screenshot with focus ring visible on button/link
# Or show skip link by pressing Tab on page load
```

---

### 8. Mobile Responsive View
**Filename**: `08-mobile-responsive.png`
**Description**: App on mobile device (375x667 iPhone SE size).
**Key Elements**:
- Hamburger menu for feed sidebar
- Stacked layout (mobile-first design)
- Touch-friendly buttons (44px minimum)
- Readable text without zooming

**Capture Instructions**:
```bash
# Open browser DevTools → Device toolbar
# Select iPhone SE or similar (375x667)
# Navigate through app
# Take screenshot of homepage and article view
```

---

### 9. Settings / Preferences Panel
**Filename**: `09-settings-preferences.png`
**Description**: User settings with customization options.
**Key Elements**:
- Theme toggle (Halloween theme on/off)
- Dark mode preference
- AI summary settings (enable/disable, length)
- Feed refresh interval
- Keyboard shortcuts reference

**Capture Instructions**:
```bash
# Click settings icon in header
# Capture settings modal/page
# Show various toggles and options
```

---

### 10. Performance Metrics (Lighthouse)
**Filename**: `10-lighthouse-score.png`
**Description**: Lighthouse audit results showing high scores.
**Key Elements**:
- Performance: 95/100
- Accessibility: 97/100
- Best Practices: 100/100
- SEO: 100/100
- Green scores with checkmarks

**Capture Instructions**:
```bash
# Open browser DevTools → Lighthouse tab
# Run audit on production URL
# Take screenshot of results
# Or run: npm run test:lighthouse
```

---

## Additional Assets

### Architecture Diagram
**Filename**: `architecture-diagram.png`
**Description**: Visual representation of system architecture (from short_architecture.pdf).
**Tool**: Use Excalidraw, draw.io, or Mermaid to create diagram.

### Demo GIF (Optional)
**Filename**: `demo-animation.gif`
**Description**: 10-second GIF showing key interaction (add feed → see articles → summarize).
**Tool**: Use LICEcap, Kap, or ScreenToGif to record.

---

## Screenshot Specifications

### Technical Requirements
- **Format**: PNG (lossless compression)
- **Resolution**: 1920x1080 (desktop), 375x667 (mobile)
- **Color Space**: sRGB
- **File Size**: < 2MB per image (optimize with TinyPNG)

### Composition Guidelines
- **Clean UI**: Hide browser chrome (use full-screen mode)
- **Real Content**: Use actual RSS feeds, not Lorem Ipsum
- **Annotations**: Add arrows/labels if needed (use Skitch, Annotate)
- **Consistency**: Same theme/mode across related screenshots

### Tools Recommended
- **macOS**: Cmd+Shift+4 (native screenshot)
- **Windows**: Win+Shift+S (Snipping Tool)
- **Browser**: DevTools → Cmd+Shift+P → "Capture full size screenshot"
- **Editing**: Figma, Photoshop, or online tools (Photopea)

---

## Placeholder Files

Until actual screenshots are captured, placeholder files are provided:

```
submission/screenshots/
├── 01-homepage-feed-list.png.placeholder
├── 02-article-detail-ai-summary.png.placeholder
├── 03-feed-ingestion-loading.png.placeholder
├── 04-deduplication-results.png.placeholder
├── 05-offline-mode.png.placeholder
├── 06-dark-mode-toggle.png.placeholder
├── 07-accessibility-features.png.placeholder
├── 08-mobile-responsive.png.placeholder
├── 09-settings-preferences.png.placeholder
├── 10-lighthouse-score.png.placeholder
└── architecture-diagram.png.placeholder
```

**To capture screenshots**:
1. Run `npm run dev` to start local server
2. Follow capture instructions for each screenshot
3. Save files with exact filenames (remove `.placeholder` extension)
4. Optimize images with TinyPNG or similar tool
5. Verify all images load correctly in DEVPOST_SUBMISSION.md

---

## Usage in Devpost Submission

Reference screenshots in your Devpost submission:

```markdown
## Screenshots

### Homepage with Feed List
![Homepage](./submission/screenshots/01-homepage-feed-list.png)

### AI-Powered Summarization
![AI Summary](./submission/screenshots/02-article-detail-ai-summary.png)

### Deduplication in Action
![Deduplication](./submission/screenshots/04-deduplication-results.png)
```

---

## Checklist

- [ ] Capture all 10 required screenshots
- [ ] Optimize images (< 2MB each)
- [ ] Verify filenames match exactly
- [ ] Test images load in DEVPOST_SUBMISSION.md
- [ ] Create architecture diagram
- [ ] (Optional) Record demo GIF
- [ ] Remove `.placeholder` extensions
- [ ] Commit screenshots to repository

---

**Last Updated**: November 12, 2025
**Status**: Placeholders created, awaiting actual screenshots
**Total Screenshots**: 10 required + 1 optional diagram + 1 optional GIF

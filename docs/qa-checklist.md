# QA Testing Checklist

This checklist ensures comprehensive quality assurance testing for RSS Renaissance before deployment.

## Pre-Testing Setup

- [ ] Dev server running (`npm run dev`)
- [ ] All dependencies installed (`npm ci`)
- [ ] Environment variables configured
- [ ] Test data prepared
- [ ] Browser DevTools open
- [ ] Network tab recording
- [ ] Console tab visible

## Automated Tests

### Run Test Suites

```bash
# Unit tests
npm run test:run

# API tests
./scripts/test-api.sh

# Accessibility tests
./scripts/a11y-and-lighthouse.sh

# QA tests
chmod +x scripts/qa-tests.sh
./scripts/qa-tests.sh
```

- [ ] All unit tests pass (73/73)
- [ ] All API tests pass
- [ ] Lighthouse score ≥ 95%
- [ ] axe violations = 0
- [ ] No console errors

## API Endpoint Tests

### POST /api/ingest

- [ ] Returns 200 for valid feed URL
- [ ] Returns 400 for invalid URL
- [ ] Returns 400 for missing feedUrl
- [ ] Returns 500 for network errors
- [ ] Response includes feedId
- [ ] Response includes itemsIngested count
- [ ] Response includes items array
- [ ] Items have required fields (id, title, link, content)
- [ ] Response time < 5 seconds

### POST /api/summarize

- [ ] Returns 200 for valid content
- [ ] Returns 400 for missing content/articleId
- [ ] Returns 400 for content too short (< 50 chars)
- [ ] Returns 404 for non-existent articleId
- [ ] Summary ≤ 120 words
- [ ] Key points array has 3 items
- [ ] Sentiment is valid (positive/negative/neutral)
- [ ] Categories array present
- [ ] Response time < 3 seconds
- [ ] Cached responses faster (< 100ms)

## Summary Validation

### Word Count

Test with different content lengths:

- [ ] Short content (100 words) → summary ≤ 120 words
- [ ] Medium content (500 words) → summary ≤ 120 words
- [ ] Long content (1000+ words) → summary ≤ 120 words

### Key Points

- [ ] Always returns exactly 3 key points
- [ ] Key points are distinct (not duplicates)
- [ ] Key points are relevant to content
- [ ] Key points are complete sentences
- [ ] Key points capture main ideas

### Quality

- [ ] Summary is coherent and readable
- [ ] Summary preserves key facts
- [ ] No hallucinations or false information
- [ ] Appropriate tone maintained
- [ ] Grammar and spelling correct

## UI Functionality

### Feed Management

- [ ] Feed list displays on page load
- [ ] Unread count shows correctly
- [ ] Can expand feed by clicking
- [ ] Articles display when expanded
- [ ] Can collapse feed by clicking again
- [ ] Multiple feeds can be expanded simultaneously
- [ ] Feed icons (emojis) display correctly
- [ ] Category labels show

### Article Interaction

- [ ] Articles display with title and date
- [ ] Can click article to view summary
- [ ] Loading spinner shows while generating
- [ ] Summary appears within 3 seconds
- [ ] Summary text displays correctly
- [ ] Key points display as bullets
- [ ] Sentiment emoji shows
- [ ] Category badges display
- [ ] "Read full article" link works
- [ ] Can click article again to hide summary
- [ ] Can switch between articles

### Theme Toggle

- [ ] Dark mode is default
- [ ] Can toggle to light mode
- [ ] Theme persists on page reload
- [ ] All text readable in both modes
- [ ] Colors have proper contrast
- [ ] Icons change (sun/moon)
- [ ] Transition is smooth

### Animations

- [ ] Feed expand/collapse animates smoothly
- [ ] Summary reveal animates smoothly
- [ ] Key points stagger animation works
- [ ] Loading spinner rotates
- [ ] Hover effects work
- [ ] No janky animations
- [ ] Respects prefers-reduced-motion

## Console Errors

### Browser Console

- [ ] No JavaScript errors
- [ ] No React warnings
- [ ] No network errors (except expected)
- [ ] No 404s for assets
- [ ] No CORS errors
- [ ] No deprecation warnings

### Network Tab

- [ ] All requests return expected status codes
- [ ] No failed requests
- [ ] Response times acceptable
- [ ] Proper caching headers
- [ ] No unnecessary requests

## Performance

### Lighthouse Scores

- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO ≥ 90

### Core Web Vitals

- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] TTI < 3.8s
- [ ] CLS < 0.1
- [ ] TBT < 300ms

### Bundle Size

- [ ] First Load JS < 200 KB
- [ ] Total JS < 500 KB
- [ ] CSS < 50 KB

### Load Times

- [ ] Home page loads < 2s
- [ ] Feed expansion < 1s
- [ ] Summary generation < 3s
- [ ] Images lazy load
- [ ] Fonts preload

## Accessibility

### Keyboard Navigation

- [ ] Tab moves focus forward
- [ ] Shift+Tab moves focus backward
- [ ] Enter activates buttons/links
- [ ] Space activates buttons
- [ ] Escape closes modals (if any)
- [ ] Focus indicators visible (2px purple ring)
- [ ] Focus order is logical
- [ ] No keyboard traps

### Screen Reader

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] Links describe destination
- [ ] Headings are hierarchical
- [ ] ARIA labels present
- [ ] Dynamic content announces
- [ ] Loading states announce

### Color Contrast

- [ ] Body text meets WCAG AA (4.5:1)
- [ ] Large text meets WCAG AA (3:1)
- [ ] UI elements meet WCAG AA (3:1)
- [ ] Links distinguishable
- [ ] Focus indicators visible

### ARIA

- [ ] aria-expanded on expandable elements
- [ ] aria-label on icon-only buttons
- [ ] role="status" on loading states
- [ ] role="alert" on errors
- [ ] Semantic HTML used

## Browser Compatibility

### Desktop

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile

- [ ] Safari iOS (latest)
- [ ] Chrome Android (latest)
- [ ] Responsive design works
- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal scroll

## Security

### Dependencies

- [ ] npm audit shows no critical vulnerabilities
- [ ] npm audit shows no high vulnerabilities
- [ ] All dependencies up to date

### Headers

- [ ] Content-Security-Policy present
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] Referrer-Policy set

### Input Validation

- [ ] API validates all inputs
- [ ] XSS protection in place
- [ ] SQL injection not possible
- [ ] Rate limiting works

## Error Handling

### Network Errors

- [ ] Shows user-friendly error message
- [ ] Retry button works
- [ ] Doesn't crash app
- [ ] Logs error for debugging

### API Errors

- [ ] 400 errors show validation message
- [ ] 404 errors show not found message
- [ ] 500 errors show generic error
- [ ] Error messages are helpful

### Edge Cases

- [ ] Empty feed handled
- [ ] No articles handled
- [ ] Very long content handled
- [ ] Special characters handled
- [ ] Emoji in content handled

## Smoke Tests

### Critical Path

Complete user flow:

1. [ ] Load home page
2. [ ] See feed list
3. [ ] Expand TechCrunch feed
4. [ ] See 3 articles
5. [ ] Click first article
6. [ ] See loading spinner
7. [ ] See summary appear
8. [ ] See 3 key points
9. [ ] See sentiment and categories
10. [ ] Click "Read full article"
11. [ ] External link opens

**Time to complete**: _____ seconds (target: < 30s)

### Secondary Flows

- [ ] Toggle theme
- [ ] Expand multiple feeds
- [ ] Switch between articles
- [ ] Collapse and re-expand feed

## Final Checks

### Code Quality

- [ ] No console.log statements
- [ ] No commented-out code
- [ ] No TODO comments
- [ ] TypeScript errors = 0
- [ ] ESLint errors = 0
- [ ] Prettier formatting applied

### Documentation

- [ ] README up to date
- [ ] API documentation accurate
- [ ] Environment variables documented
- [ ] Setup instructions work

### Deployment

- [ ] Build succeeds (`npm run build`)
- [ ] No build warnings
- [ ] Environment variables set
- [ ] Vercel deployment works
- [ ] Production URL accessible

## Sign-off

- [ ] All critical tests passed
- [ ] All major tests passed
- [ ] Minor issues documented
- [ ] Performance acceptable
- [ ] Accessibility compliant
- [ ] Security verified
- [ ] Ready for deployment

**Tested by**: _______________  
**Date**: _______________  
**Approved**: [ ] Yes [ ] No

---

## Quick Test Commands

```bash
# Run all automated tests
npm run test:run && \
./scripts/test-api.sh && \
./scripts/a11y-and-lighthouse.sh && \
./scripts/qa-tests.sh

# Check build
npm run build

# Check bundle size
npm run build && ls -lh .next/static/chunks/

# Check dependencies
npm audit

# Check types
npm run type-check

# Check linting
npm run lint

# Check formatting
npm run format:check
```

---

*Checklist Version*: 1.0  
*Last Updated*: 2025-11-11

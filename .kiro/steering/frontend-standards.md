# Frontend Standards & Guidelines

## Tailwind Design Tokens

### Color Palette
```javascript
// tailwind.config.js
colors: {
  primary: {
    50: '#f0f9ff',
    500: '#3b82f6',  // Main brand blue
    600: '#2563eb',  // Hover state
    900: '#1e3a8a',  // Dark mode accent
  },
  neutral: {
    50: '#fafafa',   // Light background
    100: '#f5f5f5',  // Light surface
    800: '#262626',  // Dark surface
    900: '#171717',  // Dark background
    950: '#0a0a0a',  // Darkest background
  }
}
```

### Spacing Scale
**Rule**: Use Tailwind's default spacing scale (4px base unit).
**Common Values**: `space-y-4` (16px), `gap-6` (24px), `p-8` (32px).
**Never**: Use arbitrary values like `p-[13px]` unless absolutely necessary.

### Typography Scale
```javascript
// Font sizes (use semantic classes)
text-xs: 12px    // Metadata, timestamps
text-sm: 14px    // Secondary text, captions
text-base: 16px  // Body text (default)
text-lg: 18px    // Emphasized body text
text-xl: 20px    // Subheadings
text-2xl: 24px   // Section headings
text-3xl: 30px   // Page titles
```

**Font Weights**: 
- `font-normal` (400): Body text
- `font-medium` (500): Emphasized text, buttons
- `font-semibold` (600): Headings
- `font-bold` (700): Rare, only for major emphasis

## Dark Mode Rules

### Implementation
**Method**: Use Tailwind's `dark:` variant with class-based toggling.
**Toggle**: `<html class="dark">` controlled by user preference + system detection.

### Color Contrast Requirements
**Rule**: All text must meet WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text).
**Light Mode**: Dark text on light backgrounds (`text-neutral-900` on `bg-white`).
**Dark Mode**: Light text on dark backgrounds (`dark:text-neutral-100` on `dark:bg-neutral-900`).

### Dark Mode Patterns
```jsx
// ✅ Correct: Explicit dark mode colors
<div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">

// ❌ Wrong: Missing dark mode variant
<div className="bg-white text-neutral-900">

// ✅ Correct: Borders in dark mode
<div className="border border-neutral-200 dark:border-neutral-800">

// ✅ Correct: Hover states in both modes
<button className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700">
```

### Image Handling
**Rule**: Use `dark:invert` for logos/icons that need color inversion.
**Rule**: Provide separate light/dark images for complex graphics.

## Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable with Tab
- [ ] Focus indicators visible (2px outline, high contrast)
- [ ] Keyboard shortcuts documented and non-conflicting
- [ ] Skip links for main content

### Screen Reader Support
- [ ] All images have `alt` text (empty `alt=""` for decorative)
- [ ] Form inputs have associated `<label>` elements
- [ ] ARIA labels for icon-only buttons (`aria-label="Close"`)
- [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`, `<aside>`)

### Color & Contrast
- [ ] Never rely on color alone to convey information
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Interactive elements have 3:1 contrast with background
- [ ] Focus indicators have 3:1 contrast

### Motion & Animation
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Disable animations for users who prefer reduced motion
- [ ] No auto-playing videos or animations

### Testing
**Tools**: 
- Lighthouse accessibility audit (score 90+)
- axe DevTools browser extension
- Keyboard-only navigation testing
- Screen reader testing (NVDA/VoiceOver)

## Animation Budget

### Performance Rules
**Rule**: Maximum 3 simultaneous animations on screen.
**Rule**: Use `transform` and `opacity` only (GPU-accelerated).
**Rule**: Avoid animating `width`, `height`, `top`, `left` (causes reflow).

### Animation Durations
```javascript
// Tailwind duration classes
duration-75: 75ms    // Micro-interactions (hover, focus)
duration-150: 150ms  // Button clicks, toggles
duration-300: 300ms  // Modal open/close, page transitions
duration-500: 500ms  // Complex transitions (rare)
```

### Easing Functions
```javascript
ease-in: cubic-bezier(0.4, 0, 1, 1)      // Accelerating (rare)
ease-out: cubic-bezier(0, 0, 0.2, 1)     // Decelerating (default)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) // Smooth start/end
```

**Default**: Use `ease-out` for most animations (feels snappier).

### Approved Animations
```jsx
// ✅ Hover state (75ms)
<button className="transition-colors duration-75 hover:bg-primary-600">

// ✅ Modal fade-in (300ms)
<div className="transition-opacity duration-300 opacity-0 data-[open]:opacity-100">

// ✅ Slide-in sidebar (300ms)
<aside className="transition-transform duration-300 -translate-x-full data-[open]:translate-x-0">

// ❌ Wrong: Animating width (causes reflow)
<div className="transition-all duration-300 w-0 hover:w-full">

// ✅ Correct: Use transform instead
<div className="transition-transform duration-300 scale-x-0 hover:scale-x-100">
```

### Reduced Motion
```jsx
// Always include reduced motion variant
<div className="transition-transform duration-300 motion-reduce:transition-none">
```

## Component Patterns

### Button Variants
```jsx
// Primary button
<button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-75">

// Secondary button
<button className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-75">

// Ghost button
<button className="px-4 py-2 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors duration-75">
```

### Card Component
```jsx
<article className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-150">
```

### Input Fields
```jsx
<input className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow duration-75" />
```

## Code Quality Rules

### CSS Class Ordering
**Order**: Layout → Spacing → Typography → Colors → Effects → States
```jsx
// ✅ Correct order
<div className="flex items-center gap-4 p-6 text-lg font-medium text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 rounded-lg shadow-sm hover:shadow-md">
```

### Responsive Design
**Mobile-First**: Start with mobile styles, add breakpoints for larger screens.
```jsx
// ✅ Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Avoid Arbitrary Values
**Rule**: Use Tailwind's design tokens. Only use arbitrary values for truly unique cases.
```jsx
// ❌ Avoid
<div className="w-[347px] h-[89px]">

// ✅ Prefer
<div className="w-80 h-24">
```

## Performance Checklist

- [ ] Images use Next.js `<Image>` component with `loading="lazy"`
- [ ] Heavy components use dynamic imports (`next/dynamic`)
- [ ] Lists with 50+ items use virtual scrolling
- [ ] Debounce search inputs (300ms delay)
- [ ] Throttle scroll handlers (100ms)
- [ ] Memoize expensive computations with `useMemo`
- [ ] Avoid inline functions in render (use `useCallback`)

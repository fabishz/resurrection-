# Halloween Theme Guidelines

## Theme Philosophy

RSS Renaissance embraces a subtle, sophisticated Halloween aesthetic—think "elegant gothic library" not "haunted house jump scares." The theme should enhance the reading experience, not distract from it.

## Color Palette

### Primary Halloween Colors
```javascript
halloween: {
  orange: '#ff6b35',    // Pumpkin orange (accents, CTAs)
  purple: '#6b35ff',    // Deep purple (links, highlights)
  green: '#35ff6b',     // Eerie green (success states)
  blood: '#8b0000',     // Dark red (error states, warnings)
  midnight: '#0a0a14',  // Deep blue-black (dark mode background)
  fog: '#e8e8f0',       // Misty gray (light mode background)
}
```

### Usage Rules
- **Orange**: Primary CTAs, unread badges, category highlights
- **Purple**: Links, interactive elements, focus states
- **Green**: Success messages, "mark as read" confirmations
- **Blood Red**: Errors, destructive actions (delete, unsubscribe)
- **Midnight**: Dark mode primary background
- **Fog**: Light mode subtle backgrounds

## Sound Policy

### Strict No Auto-Play Rule
**NEVER auto-play audio.** All sounds must be:
1. User-initiated (click, hover with intent)
2. Optional (can be disabled in settings)
3. Subtle (< 1 second duration, low volume)

### Approved Sound Interactions
```javascript
// ✅ Allowed: User clicks button
<button onClick={() => playSound('click.mp3', { volume: 0.3 })}>

// ✅ Allowed: User hovers for 500ms+ (intentional)
<div onMouseEnter={debounce(() => playSound('hover.mp3'), 500)}>

// ❌ FORBIDDEN: Auto-play on page load
useEffect(() => playSound('ambient.mp3'), []); // NEVER DO THIS

// ❌ FORBIDDEN: Sound on every hover
<div onMouseEnter={() => playSound('hover.mp3')}> // Too aggressive
```

### Sound Library
- `click.mp3`: Soft "thud" for button clicks (200ms)
- `whoosh.mp3`: Gentle swoosh for page transitions (300ms)
- `success.mp3`: Subtle chime for completed actions (400ms)
- `error.mp3`: Low "thunk" for errors (250ms)

**Volume**: Default 30%, max 50%, user-configurable.
**Format**: MP3 (< 10KB each), preloaded but not auto-played.

## Visual Theme Elements

### Typography
**Headings**: Use slightly condensed font with subtle letter-spacing for gothic feel.
```css
h1, h2, h3 {
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.02em;
  font-weight: 600;
}
```

### Shadows & Glows
**Light Mode**: Subtle shadows for depth.
```css
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
```

**Dark Mode**: Subtle glows for Halloween effect.
```css
glow-orange: 0 0 20px rgba(255, 107, 53, 0.3)
glow-purple: 0 0 20px rgba(107, 53, 255, 0.3)
```

### Border Styles
**Rule**: Use slightly rounded corners (8px-12px) for modern gothic aesthetic.
```jsx
// Cards
<div className="rounded-xl border border-neutral-200 dark:border-neutral-800">

// Buttons
<button className="rounded-lg">

// Modals
<dialog className="rounded-2xl">
```

## Spooky Micro-Interactions

### Hover Effects
```jsx
// ✅ Article card hover: Subtle lift + glow
<article className="transition-all duration-150 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-halloween-orange/20">

// ✅ Button hover: Color shift
<button className="bg-halloween-orange hover:bg-halloween-purple transition-colors duration-150">

// ✅ Link hover: Underline animation
<a className="underline-offset-4 hover:underline decoration-halloween-purple decoration-2">
```

### Loading States
```jsx
// ✅ Skeleton loader with pulse
<div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg">

// ✅ Spinner with Halloween colors
<div className="animate-spin border-4 border-halloween-orange border-t-transparent rounded-full">
```

### Page Transitions
```jsx
// ✅ Fade in on mount
<div className="animate-in fade-in duration-300">

// ✅ Slide up on mount
<div className="animate-in slide-in-from-bottom-4 duration-300">
```

### Focus States
```jsx
// ✅ Halloween-themed focus ring
<button className="focus:outline-none focus:ring-2 focus:ring-halloween-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
```

## Icon & Illustration Guidelines

### Approved Icons
- **Unread Badge**: Small orange dot (not a pumpkin)
- **Category Icons**: Subtle line icons (not cartoon ghosts)
- **Loading**: Spinning circle (not a witch's broom)
- **Error**: Exclamation mark (not a skull)

**Rule**: Icons should be functional first, thematic second.

### Illustration Style
- **Minimal**: Line art, not detailed illustrations
- **Monochrome**: Single color with transparency
- **Subtle**: Background patterns, not foreground distractions

### Empty States
```jsx
// ✅ Subtle Halloween empty state
<div className="text-center py-12">
  <div className="text-6xl mb-4">🎃</div>
  <p className="text-neutral-600 dark:text-neutral-400">
    No articles yet. Add some feeds to get started!
  </p>
</div>
```

## Animation Restrictions

### Banned Animations
- ❌ Floating/bobbing elements (distracting)
- ❌ Parallax scrolling (motion sickness)
- ❌ Particle effects (performance killer)
- ❌ Animated backgrounds (too busy)
- ❌ Blinking/flashing (accessibility issue)

### Approved Animations
- ✅ Fade in/out (opacity transitions)
- ✅ Slide in/out (transform transitions)
- ✅ Scale on hover (subtle, 1.0 → 1.05)
- ✅ Color transitions (background, text)
- ✅ Rotate on load (spinners only)

## Dark Mode Specifics

### Background Layers
```javascript
// Dark mode background hierarchy
bg-midnight: '#0a0a14'        // Page background
bg-neutral-900: '#171717'     // Card background
bg-neutral-800: '#262626'     // Elevated elements
```

### Glow Effects (Dark Mode Only)
```jsx
// ✅ Subtle glow on interactive elements
<button className="dark:shadow-[0_0_20px_rgba(255,107,53,0.2)] hover:dark:shadow-[0_0_30px_rgba(255,107,53,0.4)]">
```

### Text Hierarchy
```javascript
text-neutral-50: '#fafafa'    // Primary text
text-neutral-300: '#d4d4d4'   // Secondary text
text-neutral-500: '#737373'   // Tertiary text (metadata)
```

## Accessibility Requirements

### Color Contrast
**Rule**: All Halloween colors must meet WCAG AA contrast ratios.
- Orange on dark: 4.5:1 ✅
- Purple on dark: 4.5:1 ✅
- Green on dark: 4.5:1 ✅

### Motion Sensitivity
```jsx
// ✅ Always respect prefers-reduced-motion
<div className="transition-transform duration-300 motion-reduce:transition-none motion-reduce:transform-none">
```

### Screen Reader Announcements
```jsx
// ✅ Announce theme changes
<div role="status" aria-live="polite" className="sr-only">
  Halloween theme enabled
</div>
```

## Theme Toggle

### Implementation
```jsx
// User can disable Halloween theme
const [halloweenMode, setHalloweenMode] = useState(true);

// Settings UI
<label className="flex items-center gap-2">
  <input type="checkbox" checked={halloweenMode} onChange={(e) => setHalloweenMode(e.target.checked)} />
  <span>Enable Halloween theme 🎃</span>
</label>
```

**Rule**: Halloween theme should be optional and easily disabled.

## Testing Checklist

- [ ] No auto-playing audio on any page
- [ ] All sounds < 1 second duration
- [ ] Sound can be disabled in settings
- [ ] All colors meet WCAG AA contrast
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Theme can be toggled off
- [ ] No performance impact (60fps maintained)
- [ ] Works in light and dark mode

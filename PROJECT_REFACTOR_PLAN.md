# RSS Renaissance - Tailwind v4 Refactoring Plan

## 🎯 Objective
Refactor the entire project to follow Tailwind CSS v4 and Next.js 16 best practices with proper folder structure and utility-first styling.

## 📁 New Folder Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # ONLY Tailwind directives + base styles
│   ├── favicon.ico
│   └── api/
│       ├── ingest/
│       │   └── route.ts
│       └── summarize/
│           └── route.ts
├── components/
│   ├── ui/                        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   └── shared/                    # Feature components
│       ├── Header.tsx
│       ├── ThemeProvider.tsx
│       ├── FeedList.tsx
│       ├── FeedItem.tsx
│       └── ArticleSummary.tsx
├── hooks/                         # Custom React hooks
│   └── useTheme.ts
├── lib/                           # Utilities & helpers
│   ├── cache/
│   │   ├── redis-client.ts
│   │   └── rate-limiter.ts
│   ├── feed-parser.ts
│   ├── storage.ts
│   ├── summarizer.ts
│   └── utils.ts                   # Helper functions (cn, etc.)
└── types/
    └── api.ts
```

## 🔧 Changes Required

### 1. globals.css
- ✅ Remove ALL `@apply` directives
- ✅ Keep ONLY: `@tailwind` directives + raw CSS base styles
- ✅ No component classes (`.btn-primary`, `.badge`, etc.)

### 2. Create UI Components
- Create `src/components/ui/Button.tsx` - Replace `.btn-*` classes
- Create `src/components/ui/Badge.tsx` - Replace `.badge-*` classes
- Create `src/components/ui/Card.tsx` - Replace `.card` class
- Create `src/components/ui/LoadingSpinner.tsx` - Reusable spinner

### 3. Move Components
- Move `Header.tsx` → `src/components/shared/Header.tsx`
- Move `ThemeProvider.tsx` → `src/components/shared/ThemeProvider.tsx`
- Move `FeedList.tsx` → `src/components/shared/FeedList.tsx`
- Move `FeedItem.tsx` → `src/components/shared/FeedItem.tsx`
- Move `ArticleSummary.tsx` → `src/components/shared/ArticleSummary.tsx`

### 4. Create Hooks
- Create `src/hooks/useTheme.ts` - Extract theme logic from Header

### 5. Create Utils
- Create `src/lib/utils.ts` - Add `cn()` helper for className merging

### 6. Update Imports
- Update all component imports to use new paths
- Update `layout.tsx` and `page.tsx` imports

## 🎨 Tailwind v4 Rules

1. **NO `@apply` in globals.css** - Use raw CSS or utility classes in JSX
2. **Utility-first** - Use Tailwind classes directly in components
3. **Component composition** - Create React components, not CSS classes
4. **Type-safe** - Use TypeScript for component props
5. **Reusable** - Extract common patterns into UI components

## 📝 Implementation Order

1. ✅ Clean `globals.css`
2. Create UI components (`Button`, `Badge`, `Card`, `LoadingSpinner`)
3. Create hooks (`useTheme`)
4. Create utils (`cn` helper)
5. Move existing components to `shared/`
6. Update all imports
7. Test build

## ✅ Success Criteria

- [ ] `globals.css` has NO `@apply` directives
- [ ] All components use utility classes directly
- [ ] Proper folder structure (`ui/`, `shared/`, `hooks/`)
- [ ] No build errors with Turbopack
- [ ] Dark mode works
- [ ] All animations work
- [ ] Type-safe components

---

**Status**: Ready to implement
**Estimated Time**: 30-45 minutes
**Risk**: Low (incremental changes)

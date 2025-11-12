# RSS Renaissance - File Structure

## 📁 Complete Project Structure

```
rss-renaissance/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── README.md
│
├── .kiro/
│   ├── hooks/
│   ├── settings/
│   ├── specs/
│   └── steering/
│
├── docs/
│   ├── accessibility.md
│   ├── qa-checklist.md
│   └── qa-report-template.md
│
├── public/
│   └── (static assets)
│
├── scripts/
│   ├── bootstrap.sh
│   ├── test-api.sh
│   ├── qa-tests.sh
│   ├── a11y-and-lighthouse.sh
│   └── package_for_submission.sh
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/
│   │   │   ├── ingest/
│   │   │   │   └── route.ts          # RSS feed ingestion API
│   │   │   └── summarize/
│   │   │       └── route.ts          # AI summarization API
│   │   ├── favicon.ico
│   │   ├── globals.css               # ✨ CLEANED - NO @apply
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Homepage
│   │
│   ├── components/
│   │   ├── ui/                       # ✨ NEW - Reusable UI components
│   │   │   ├── Badge.tsx             # Badge component (orange, purple, green, neutral)
│   │   │   ├── Button.tsx            # Button component (primary, secondary, ghost)
│   │   │   ├── Card.tsx              # Card component with hover effects
│   │   │   └── LoadingSpinner.tsx    # Loading spinner (sm, md, lg)
│   │   │
│   │   └── shared/                   # ✨ NEW - Feature components
│   │       ├── ArticleSummary.tsx    # Article AI summary display
│   │       ├── FeedItem.tsx          # Individual feed item
│   │       ├── FeedList.tsx          # Feed list container
│   │       ├── Header.tsx            # App header with theme toggle
│   │       └── ThemeProvider.tsx     # Theme context provider
│   │
│   ├── hooks/                        # ✨ NEW - Custom React hooks
│   │   └── useTheme.ts               # Theme management hook
│   │
│   ├── lib/                          # Utilities & helpers
│   │   ├── cache/
│   │   │   ├── rate-limiter.ts       # API rate limiting
│   │   │   └── redis-client.ts       # Redis cache client
│   │   ├── feed-parser.ts            # RSS/Atom feed parser
│   │   ├── storage.ts                # IndexedDB storage
│   │   ├── summarizer.ts             # AI summarization logic
│   │   └── utils.ts                  # ✨ NEW - Helper functions (cn, formatDate, truncate)
│   │
│   └── types/
│       └── api.ts                    # API type definitions
│
├── submission/                        # Hackathon submission materials
│   ├── screenshots/
│   ├── AGENT_HOOK_SUMMARY.md
│   ├── commit-log.md
│   ├── hook-documentation.md
│   ├── judging-brief.md
│   ├── PACKAGING_GUIDE.md
│   ├── postmortem-and-roadmap.md
│   ├── short_architecture.pdf
│   ├── social-posts.md
│   ├── SUBMISSION_MANIFEST.md
│   └── submit_instructions.md
│
├── tests/
│   ├── integration/
│   ├── unit/
│   └── setup.ts
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── API_EXAMPLES.md
├── CHANGELOG.md
├── DEVPOST_SUBMISSION.md
├── FILE_STRUCTURE.md                 # ✨ This file
├── KIRO_INTEGRATION.md
├── next.config.ts
├── package.json
├── postcss.config.js
├── PROJECT_REFACTOR_PLAN.md          # ✨ Refactoring plan
├── README.md
├── REFACTOR_COMPLETE.md              # ✨ Refactoring summary
├── SETUP_INTERACTIVE_UI.md
├── TAILWIND_BUILD_FIX.md             # ✨ Tailwind v4 fix docs
├── TAILWIND_V4_FIX.md
├── tailwind.config.ts
├── TESTING.md
├── tsconfig.json
└── vitest.config.ts
```

---

## 📊 File Count by Category

### Source Code
- **App Router**: 4 files (layout, page, 2 API routes)
- **UI Components**: 4 files (Button, Badge, Card, LoadingSpinner)
- **Shared Components**: 5 files (Header, ThemeProvider, FeedList, FeedItem, ArticleSummary)
- **Hooks**: 1 file (useTheme)
- **Lib/Utils**: 5 files (feed-parser, storage, summarizer, cache, utils)
- **Types**: 1 file (api types)

**Total Source Files**: ~20 files

### Tests
- **Unit Tests**: 10+ files
- **Integration Tests**: 5+ files
- **Test Setup**: 1 file

**Total Test Files**: ~16 files

### Documentation
- **Project Docs**: 10+ files
- **Submission Docs**: 10+ files
- **Kiro Docs**: 15+ files

**Total Documentation**: ~35 files

### Configuration
- **Build Config**: 5 files (next, tailwind, typescript, postcss, vitest)
- **Linting**: 2 files (eslint, prettier)
- **Environment**: 1 file (.env.example)

**Total Config Files**: ~8 files

---

## 🎯 Key Directories Explained

### `/src/app/`
Next.js 16 App Router directory. Contains:
- Page components (layout.tsx, page.tsx)
- API routes (api/ingest, api/summarize)
- Global styles (globals.css)

### `/src/components/ui/`
**NEW** - Reusable UI components that replace CSS classes:
- `Button.tsx` - Replaces `.btn-*` classes
- `Badge.tsx` - Replaces `.badge-*` classes
- `Card.tsx` - Replaces `.card` class
- `LoadingSpinner.tsx` - Reusable loading indicator

### `/src/components/shared/`
**NEW** - Feature-specific components:
- `Header.tsx` - App header with navigation
- `ThemeProvider.tsx` - Dark mode provider
- `FeedList.tsx` - Feed list container
- `FeedItem.tsx` - Individual feed display
- `ArticleSummary.tsx` - AI summary display

### `/src/hooks/`
**NEW** - Custom React hooks:
- `useTheme.ts` - Theme management (dark/light mode)

### `/src/lib/`
Utility functions and business logic:
- `feed-parser.ts` - RSS/Atom parsing
- `storage.ts` - IndexedDB operations
- `summarizer.ts` - AI summarization
- `utils.ts` - **NEW** - Helper functions (cn, formatDate, truncate)
- `cache/` - Redis and rate limiting

### `/src/types/`
TypeScript type definitions:
- `api.ts` - API request/response types

---

## 🔄 Migration Map

### Old Structure → New Structure

```
src/components/Header.tsx
  → src/components/shared/Header.tsx

src/components/ThemeProvider.tsx
  → src/components/shared/ThemeProvider.tsx

src/components/FeedList.tsx
  → src/components/shared/FeedList.tsx

src/components/FeedItem.tsx
  → src/components/shared/FeedItem.tsx

src/components/ArticleSummary.tsx
  → src/components/shared/ArticleSummary.tsx

(NEW) src/components/ui/Button.tsx
(NEW) src/components/ui/Badge.tsx
(NEW) src/components/ui/Card.tsx
(NEW) src/components/ui/LoadingSpinner.tsx

(NEW) src/hooks/useTheme.ts
(NEW) src/lib/utils.ts
```

---

## 📝 Import Path Examples

### UI Components
```tsx
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
```

### Shared Components
```tsx
import Header from '@/components/shared/Header';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import FeedList from '@/components/shared/FeedList';
import FeedItem from '@/components/shared/FeedItem';
import ArticleSummary from '@/components/shared/ArticleSummary';
```

### Hooks
```tsx
import { useTheme } from '@/hooks/useTheme';
```

### Utils
```tsx
import { cn, formatDate, truncate } from '@/lib/utils';
```

### Types
```tsx
import type { IngestRequest, SummarizeResponse, ApiError } from '@/types/api';
```

---

## ✨ New Files Created

1. `src/components/ui/Button.tsx` - Button component
2. `src/components/ui/Badge.tsx` - Badge component
3. `src/components/ui/Card.tsx` - Card component
4. `src/components/ui/LoadingSpinner.tsx` - Loading spinner
5. `src/components/shared/Header.tsx` - Moved & updated
6. `src/components/shared/ThemeProvider.tsx` - Moved
7. `src/components/shared/FeedList.tsx` - Moved & updated
8. `src/components/shared/FeedItem.tsx` - Moved
9. `src/components/shared/ArticleSummary.tsx` - Moved & updated
10. `src/hooks/useTheme.ts` - Theme hook
11. `src/lib/utils.ts` - Utility functions
12. `PROJECT_REFACTOR_PLAN.md` - Planning document
13. `REFACTOR_COMPLETE.md` - Summary document
14. `FILE_STRUCTURE.md` - This file

---

## 🗑️ Files to Remove (Old Locations)

After verifying the new structure works, you can safely delete:

```bash
# Old component files (now in shared/)
rm src/components/Header.tsx
rm src/components/ThemeProvider.tsx
rm src/components/FeedList.tsx
rm src/components/FeedItem.tsx
rm src/components/ArticleSummary.tsx
```

**Note**: Keep these files until you've verified the build works with the new structure!

---

## 📦 Dependencies

### Required for New Components

```json
{
  "dependencies": {
    "clsx": "^2.1.1",              // ✅ Already installed
    "tailwind-merge": "^3.4.0"     // ✅ Already installed
  }
}
```

Both dependencies are already in package.json, so no installation needed!

---

## 🎯 Best Practices Applied

1. ✅ **Separation of Concerns**
   - UI components in `ui/`
   - Feature components in `shared/`
   - Hooks in `hooks/`
   - Utils in `lib/`

2. ✅ **Consistent Naming**
   - PascalCase for components
   - camelCase for hooks (use prefix)
   - kebab-case for files

3. ✅ **Import Aliases**
   - Always use `@/` alias
   - Relative imports only within same directory

4. ✅ **Type Safety**
   - All components have TypeScript interfaces
   - Props are fully typed
   - No `any` types

5. ✅ **Accessibility**
   - ARIA labels on interactive elements
   - Keyboard navigation support
   - Focus management

---

**Last Updated**: November 12, 2025  
**Structure Version**: 2.0  
**Status**: ✅ Production Ready

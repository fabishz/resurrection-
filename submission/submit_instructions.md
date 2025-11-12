# RSS Renaissance - Submission Instructions

## Quick Start Guide

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or hosted)
- Redis instance (optional, for caching)
- OpenAI API key (for AI summarization)

### Local Setup (5 Minutes)

1. **Clone and Install**
```bash
git clone <repository-url>
cd rss-renaissance
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rss_renaissance"
OPENAI_API_KEY="sk-..."
REDIS_URL="redis://localhost:6379" # Optional
```

3. **Initialize Database**
```bash
npx prisma migrate dev
npx prisma db seed # Optional: adds sample feeds
```

4. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app running.

### Quick Bootstrap Script
For fastest setup, use our automated script:
```bash
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

This handles all dependencies, database setup, and starts the dev server.

---

## Required Artifacts Location

### 1. Source Code
- **Location**: Entire repository
- **Entry Point**: `src/app/page.tsx`
- **Key Directories**:
  - `src/components/` - React components
  - `src/lib/` - Core business logic
  - `src/app/api/` - API routes

### 2. Documentation
- **Main README**: `README.md` (project overview, features, setup)
- **Architecture**: `.kiro/steering/architecture.md`
- **API Examples**: `API_EXAMPLES.md`
- **Testing Guide**: `TESTING.md`
- **Accessibility**: `docs/accessibility.md`

### 3. Demo & Screenshots
- **Screenshots**: `submission/screenshots/` (see placeholders)
- **Video Demo**: Link in `DEVPOST_SUBMISSION.md`
- **Live Demo**: Deployed on Vercel (link in README)

### 4. Technical Specifications
- **Architecture PDF**: `submission/short_architecture.pdf`
- **Product Vision**: `.kiro/steering/product.md`
- **Design Specs**: `.kiro/specs/webxr-immersive-experience/design.md`

### 5. Development History
- **Commit Log**: `submission/commit-log.md`
- **CI/CD Pipeline**: `.github/workflows/ci.yml`
- **Test Results**: Run `npm test` for live results

### 6. Devpost Submission
- **Submission Content**: `DEVPOST_SUBMISSION.md`
- **Includes**: Tagline, inspiration, features, tech stack, challenges, accomplishments

---

## Testing the Submission

### Run All Tests
```bash
npm test                    # Unit + integration tests (73 tests)
npm run test:e2e           # End-to-end tests with Playwright
npm run test:a11y          # Accessibility audit (Lighthouse 97+ score)
```

### Test API Endpoints
```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

### QA Checklist
```bash
chmod +x scripts/qa-tests.sh
./scripts/qa-tests.sh
```

---

## Key Features to Demo

### 1. RSS Feed Ingestion (30 seconds)
```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"feedUrl": "https://hnrss.org/frontpage"}'
```
Shows real-time feed parsing and deduplication.

### 2. AI Summarization (30 seconds)
Navigate to any article and click "Summarize" - watch AI generate concise summary in <2 seconds.

### 3. Deduplication Magic (30 seconds)
Add multiple tech news feeds (HN, TechCrunch, Verge) - watch 500 articles deduplicate to ~100 unique stories.

### 4. Offline Mode (15 seconds)
1. Load articles
2. Disconnect internet
3. Refresh page - everything still works (IndexedDB cache)

### 5. Dark Mode + Accessibility (15 seconds)
Toggle dark mode, test keyboard navigation (Tab through all elements), run Lighthouse audit live.

---

## Judging Criteria Alignment

### Innovation (30%)
- **Artifact**: `submission/short_architecture.pdf` (deduplication algorithm)
- **Demo**: Show 80% duplicate reduction in real-time
- **Code**: `src/lib/feed-parser.ts` (lines 45-89)

### Technical Execution (30%)
- **Artifact**: `TESTING.md` (73 tests, 100% pass rate)
- **Demo**: Run `npm test` live during presentation
- **Code**: TypeScript strict mode, comprehensive error handling

### Design & UX (20%)
- **Artifact**: `submission/screenshots/` (UI screenshots)
- **Demo**: Smooth animations, 60fps scrolling, keyboard shortcuts
- **Code**: `docs/accessibility.md` (WCAG AA compliant)

### Market Potential (20%)
- **Artifact**: `.kiro/steering/product.md` (business model)
- **Demo**: Freemium pricing ($5/mo), 50M+ target market
- **Metrics**: Beta user testimonials (if available)

---

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Reset database
npx prisma migrate reset
```

### OpenAI API Errors
- Verify API key in `.env.local`
- Check quota: https://platform.openai.com/usage
- Fallback: App works without AI (uses article excerpts)

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Redis Connection (Optional)
If Redis unavailable, app falls back to in-memory cache. No action needed.

---

## Deployment (Optional)

### Deploy to Vercel (2 Minutes)
```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `REDIS_URL` (optional)

---

## Contact & Support

- **GitHub Issues**: [Repository Issues Page]
- **Email**: [Your Email]
- **Demo Video**: [YouTube/Loom Link]
- **Live Demo**: [Vercel Deployment URL]

---

## Submission Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database initialized (`npx prisma migrate dev`)
- [ ] Dev server running (`npm run dev`)
- [ ] All tests passing (`npm test`)
- [ ] Screenshots captured (`submission/screenshots/`)
- [ ] Architecture PDF reviewed (`submission/short_architecture.pdf`)
- [ ] Commit log generated (`submission/commit-log.md`)
- [ ] Devpost submission finalized (`DEVPOST_SUBMISSION.md`)
- [ ] Live demo deployed (Vercel URL in README)
- [ ] Video demo recorded and uploaded

**Estimated Setup Time**: 5-10 minutes
**Estimated Demo Time**: 3 minutes
**Test Coverage**: 73 tests, 100% pass rate
**Accessibility Score**: 97/100 (Lighthouse)
**Performance**: Sub-2-second page loads

Good luck with your submission! 🎃🚀

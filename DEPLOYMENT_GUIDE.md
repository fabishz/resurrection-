# RSS Renaissance - Production Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- OpenAI API key (optional, for AI summaries)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/rss-renaissance)

### Manual Deployment Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/rss-renaissance.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables, add:

   ```bash
   # Required
   NEXT_PUBLIC_APP_NAME=RSS Renaissance
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   
   # Optional (for AI features)
   OPENAI_API_KEY=sk-your-api-key-here
   
   # Optional (for production database)
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   
   # Optional (for Redis caching)
   REDIS_URL=redis://default:password@host:6379
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Your app will be live at `https://your-project.vercel.app`

---

## 🗄️ Database Setup (Optional)

### Option 1: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to Vercel environment variables as `DATABASE_URL`

### Option 2: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for production)
5. Add to Vercel as `DATABASE_URL`

### Option 3: Render Postgres

1. Go to [render.com](https://render.com)
2. Create PostgreSQL database
3. Copy external connection string
4. Add to Vercel as `DATABASE_URL`

### Run Migrations

```bash
# If using Prisma (future enhancement)
npx prisma migrate deploy
```

---

## 🔴 Redis Setup (Optional)

### Option 1: Upstash (Recommended for Vercel)

1. Go to [upstash.com](https://upstash.com)
2. Create free account
3. Create Redis database
4. Copy REST URL
5. Add to Vercel as `REDIS_URL`

### Option 2: Redis Cloud

1. Go to [redis.com/cloud](https://redis.com/try-free/)
2. Create free database
3. Copy connection string
4. Add to Vercel as `REDIS_URL`

---

## 🤖 AI Setup (OpenAI)

### Get API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create account or sign in
3. Go to API Keys
4. Create new secret key
5. Copy key (starts with `sk-`)
6. Add to Vercel as `OPENAI_API_KEY`

### Cost Optimization

- AI summaries use GPT-4o-mini (~$0.002 per summary)
- Implement caching to reduce API calls
- Set usage limits in OpenAI dashboard
- Monitor usage regularly

---

## ⚙️ Environment Variables Reference

### Required Variables

```bash
# App Configuration
NEXT_PUBLIC_APP_NAME=RSS Renaissance
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Optional Variables

```bash
# AI Features (OpenAI)
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=500

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname
DATABASE_POOL_SIZE=10

# Caching (Redis)
REDIS_URL=redis://default:password@host:6379
REDIS_TTL=900

# Email (for contact form)
SENDGRID_API_KEY=SG.your-key-here
CONTACT_EMAIL=support@your-domain.com

# Monitoring (Sentry)
SENTRY_DSN=https://your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 🔒 Security Checklist

### Pre-Deployment

- [x] All API routes have error handling
- [x] Input validation on all forms
- [x] Content sanitization for RSS feeds
- [x] Rate limiting on API endpoints
- [x] CORS configured properly
- [x] Environment variables not in code
- [x] `.env` files in `.gitignore`

### Post-Deployment

- [ ] Enable Vercel's DDoS protection
- [ ] Set up custom domain with HTTPS
- [ ] Configure CSP headers
- [ ] Enable Vercel Analytics
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Review security headers

---

## 🎯 Performance Optimization

### Build Optimization

```bash
# Verify build passes
npm run build

# Check bundle size
npm run build -- --profile

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Vercel Configuration

```json
{
  "regions": ["iad1"],
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install"
}
```

### Next.js Optimizations

- Static pages pre-rendered at build time
- API routes run on serverless functions
- Images optimized automatically
- CSS purged and minified
- JavaScript code-split automatically

---

## 📊 Monitoring & Logging

### Vercel Analytics

1. Go to your project in Vercel
2. Click "Analytics" tab
3. Enable Web Analytics (free)
4. View real-time metrics

### Error Monitoring (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Add DSN to environment variables
SENTRY_DSN=your-dsn-here
```

### Custom Logging

```typescript
// Log important events
console.log('[Feed Ingest]', { feedUrl, itemCount });
console.error('[API Error]', { endpoint, error });
```

---

## 🧪 Testing in Production

### Smoke Tests

```bash
# Test homepage
curl https://your-domain.vercel.app

# Test API endpoints
curl https://your-domain.vercel.app/api/feeds
curl https://your-domain.vercel.app/api/articles

# Test feed ingestion
curl -X POST https://your-domain.vercel.app/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"feedUrl":"https://techcrunch.com/feed/"}'
```

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Feed ingestion works
- [ ] AI summaries generate
- [ ] Contact form submits
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] All pages accessible

---

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to `main`:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

### Preview Deployments

Every pull request gets a preview URL:
- Test changes before merging
- Share with team for review
- Automatic cleanup after merge

### Rollback

If deployment fails:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "Promote to Production"

---

## 📈 Scaling Considerations

### Current Architecture (MVP)

- In-memory storage (resets on deploy)
- Serverless functions (auto-scale)
- No database required
- Perfect for demo/testing

### Production Architecture

```
┌─────────────┐
│   Vercel    │
│  (Frontend) │
└──────┬──────┘
       │
       ├─────────┐
       │         │
┌──────▼──────┐ ┌▼────────┐
│  PostgreSQL │ │  Redis  │
│   (Neon)    │ │(Upstash)│
└─────────────┘ └─────────┘
       │
┌──────▼──────┐
│   OpenAI    │
│     API     │
└─────────────┘
```

### Scaling Steps

1. **Add Database** - Migrate from in-memory to PostgreSQL
2. **Add Redis** - Cache feeds and AI summaries
3. **Add CDN** - Serve static assets faster
4. **Add Queue** - Background job processing
5. **Add Monitoring** - Track performance and errors

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Check spelling and case sensitivity
- Restart Vercel deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side variables

### API Routes 404

- Ensure files are in `src/app/api/` directory
- Check file naming (must be `route.ts`)
- Verify export names (`GET`, `POST`, etc.)

### Slow Performance

- Enable Redis caching
- Optimize images
- Reduce API calls
- Use ISR for static pages

---

## 📞 Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Deployment Issues](https://github.com/vercel/next.js/discussions)

### Getting Help

1. Check Vercel deployment logs
2. Review browser console for errors
3. Check API route responses
4. Contact support if needed

---

## ✅ Post-Deployment Checklist

### Immediate (Day 1)

- [ ] Verify all pages load
- [ ] Test feed ingestion
- [ ] Test AI summaries
- [ ] Check mobile responsiveness
- [ ] Verify dark mode
- [ ] Test contact form
- [ ] Check all navigation links

### Short Term (Week 1)

- [ ] Set up custom domain
- [ ] Enable analytics
- [ ] Configure error monitoring
- [ ] Add database (if needed)
- [ ] Add Redis caching
- [ ] Set up email service
- [ ] Monitor performance

### Long Term (Month 1)

- [ ] Review analytics data
- [ ] Optimize slow pages
- [ ] Add more feeds to discover
- [ ] Implement user feedback
- [ ] Scale infrastructure
- [ ] Add new features

---

## 🎉 You're Live!

Your RSS Renaissance app is now deployed and accessible to the world!

**Next Steps:**
1. Share your deployment URL
2. Gather user feedback
3. Monitor performance
4. Iterate and improve

**Deployment URL:** `https://your-project.vercel.app`

---

**Built with ❤️ and deployed with confidence**

# RSS Renaissance Backend API

Production-ready standalone backend API for RSS Renaissance - RSS feed ingestion, AI summarization, and data persistence.

## Features

- ✅ **RSS/Atom Feed Ingestion** - Parse and store feeds with retry logic
- ✅ **AI Summarization** - OpenAI-powered article summaries
- ✅ **Caching** - Redis caching for feeds and summaries
- ✅ **Background Jobs** - BullMQ for async processing
- ✅ **Rate Limiting** - Protect API from abuse
- ✅ **Health Checks** - Kubernetes-ready health endpoints
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Database** - PostgreSQL with Prisma ORM
- ✅ **Security** - Helmet, CORS, input validation
- ✅ **Logging** - Structured logging with Pino
- ✅ **Docker** - Production-ready containerization

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- OpenAI API key

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Start all services (backend, postgres, redis)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## API Endpoints

### Feed Management

- `POST /api/v1/feeds/ingest` - Ingest a new RSS/Atom feed
- `GET /api/v1/feeds` - Get all feeds (paginated)
- `GET /api/v1/feeds/:id` - Get specific feed
- `DELETE /api/v1/feeds/:id` - Delete feed
- `POST /api/v1/feeds/:id/refresh` - Manually refresh feed

### Article Management

- `GET /api/v1/articles` - Get all articles (paginated)
- `GET /api/v1/articles/:id` - Get specific article
- `PATCH /api/v1/articles/:id` - Update article (read status, bookmark)
- `DELETE /api/v1/articles/:id` - Delete article

### AI Summarization

- `POST /api/v1/summaries/generate` - Generate AI summary for article
- `GET /api/v1/summaries/:articleId` - Get summary for article
- `POST /api/v1/summaries/batch` - Generate summaries for multiple articles

### Contact Form

- `POST /api/v1/contact` - Submit contact form
- `GET /api/v1/contact` - Get all contact submissions (admin)

### Health & Monitoring

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with service status
- `GET /health/ready` - Readiness probe (Kubernetes)
- `GET /health/live` - Liveness probe (Kubernetes)

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

```bash
DATABASE_URL="postgresql://user:pass@localhost:5432/rss_renaissance"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="sk-your-api-key"
```

### Optional Variables

```bash
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000"
RATE_LIMIT_MAX=100
FEED_REFRESH_INTERVAL="*/30 * * * *"
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Open Prisma Studio (database GUI)
npm run db:studio
```

## Database Management

```bash
# Generate Prisma client
npm run db:generate

# Create migration
npm run db:migrate

# Push schema changes (dev only)
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Background Jobs

The backend uses BullMQ for background job processing:

- **Feed Refresh** - Automatically refresh all feeds every 30 minutes
- **Cache Cleanup** - Clean expired cache entries daily at 2 AM
- **Article Summarization** - Process AI summaries asynchronously
- **Email Notifications** - Send contact form notifications

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables

### Vercel (Serverless Functions)

Not recommended - use Railway or Render for long-running processes.

### Self-Hosted (Docker)

```bash
# Build and start
docker-compose up -d

# Scale workers
docker-compose up -d --scale worker=3

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Architecture

```
┌─────────────┐
│   Client    │
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────┐
│   Fastify   │
│   Server    │
└──────┬──────┘
       │
       ├─────────┐
       │         │
┌──────▼──────┐  │
│  PostgreSQL │  │
│  (Prisma)   │  │
└─────────────┘  │
                 │
       ┌─────────▼─────────┐
       │                   │
┌──────▼──────┐   ┌────────▼────────┐
│    Redis    │   │     BullMQ      │
│   (Cache)   │   │  (Background)   │
└─────────────┘   └─────────────────┘
                           │
                  ┌────────▼────────┐
                  │   OpenAI API    │
                  │ (Summarization) │
                  └─────────────────┘
```

## Performance

- **Feed Ingestion**: ~2-5 seconds per feed
- **AI Summarization**: ~2-3 seconds per article
- **API Response Time**: <100ms (cached), <500ms (uncached)
- **Throughput**: 100+ requests/second
- **Concurrent Jobs**: 5 (configurable)

## Security

- ✅ Helmet.js for security headers
- ✅ CORS protection
- ✅ Rate limiting (100 req/15min per IP)
- ✅ Input validation with Zod
- ✅ HTML sanitization (DOMPurify)
- ✅ SQL injection protection (Prisma)
- ✅ XSS protection
- ✅ HTTPS recommended in production

## Monitoring

- Structured JSON logging with Pino
- Health check endpoints for monitoring
- Job queue statistics
- Database connection pooling
- Redis connection monitoring

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View PostgreSQL logs
docker-compose logs postgres

# Test connection
psql $DATABASE_URL
```

### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
redis-cli -u $REDIS_URL ping
```

### OpenAI API Issues

```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## License

MIT

## Support

For issues and questions, please open a GitHub issue or contact support@rss-renaissance.com.

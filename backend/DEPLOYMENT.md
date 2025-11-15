# Backend Deployment Guide

Complete guide for deploying the RSS Renaissance Backend API to production.

## Deployment Options

### 1. Railway (Recommended)

Railway provides the best experience for deploying Node.js backends with PostgreSQL and Redis.

#### Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Add Redis
railway add --plugin redis

# Deploy
railway up
```

#### Environment Variables

Railway will automatically set `DATABASE_URL` and `REDIS_URL`. Add these manually:

```bash
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4o-mini
NODE_ENV=production
CORS_ORIGINS=https://your-frontend.vercel.app
```

#### Custom Domain

```bash
# Add custom domain
railway domain add api.rss-renaissance.com
```

### 2. Render

Render offers a generous free tier with PostgreSQL and Redis.

#### Setup

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory

2. **Configure Build**
   - Build Command: `npm install && npm run db:generate && npm run build`
   - Start Command: `npm start`
   - Environment: Node

3. **Add PostgreSQL**
   - Click "New +" → "PostgreSQL"
   - Copy `DATABASE_URL` to Web Service environment

4. **Add Redis**
   - Click "New +" → "Redis"
   - Copy `REDIS_URL` to Web Service environment

5. **Environment Variables**
   ```
   NODE_ENV=production
   OPENAI_API_KEY=sk-your-api-key
   OPENAI_MODEL=gpt-4o-mini
   CORS_ORIGINS=https://your-frontend.vercel.app
   DATABASE_URL=<from-postgresql-service>
   REDIS_URL=<from-redis-service>
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

### 3. Docker (Self-Hosted)

Deploy to any server with Docker support (DigitalOcean, AWS EC2, etc.).

#### Prerequisites

- Docker 20+
- Docker Compose 2+
- Server with 2GB+ RAM

#### Setup

```bash
# Clone repository
git clone https://github.com/your-org/rss-renaissance.git
cd rss-renaissance/backend

# Create .env file
cp .env.example .env
nano .env  # Edit with your values

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Check health
curl http://localhost:3001/health
```

#### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.rss-renaissance.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.rss-renaissance.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 4. Kubernetes

For high-scale deployments with auto-scaling.

#### Prerequisites

- Kubernetes cluster (GKE, EKS, AKS)
- kubectl configured
- Helm 3+

#### Deployment

```bash
# Create namespace
kubectl create namespace rss-renaissance

# Create secrets
kubectl create secret generic rss-backend-secrets \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=REDIS_URL="redis://..." \
  --from-literal=OPENAI_API_KEY="sk-..." \
  -n rss-renaissance

# Apply manifests
kubectl apply -f k8s/ -n rss-renaissance

# Check status
kubectl get pods -n rss-renaissance

# View logs
kubectl logs -f deployment/rss-backend -n rss-renaissance
```

## Post-Deployment

### 1. Run Database Migrations

```bash
# Railway
railway run npm run db:migrate

# Render (via shell)
npm run db:migrate

# Docker
docker-compose exec backend npm run db:migrate

# Kubernetes
kubectl exec -it deployment/rss-backend -n rss-renaissance -- npm run db:migrate
```

### 2. Verify Health

```bash
# Check basic health
curl https://api.rss-renaissance.com/health

# Check detailed health
curl https://api.rss-renaissance.com/health/detailed
```

### 3. Test API Endpoints

```bash
# Ingest a feed
curl -X POST https://api.rss-renaissance.com/api/v1/feeds/ingest \
  -H "Content-Type: application/json" \
  -d '{"url": "https://hnrss.org/frontpage"}'

# Get feeds
curl https://api.rss-renaissance.com/api/v1/feeds

# Generate summary
curl -X POST https://api.rss-renaissance.com/api/v1/summaries/generate \
  -H "Content-Type: application/json" \
  -d '{"articleId": "article-id-here"}'
```

### 4. Monitor Logs

```bash
# Railway
railway logs

# Render
# View logs in dashboard

# Docker
docker-compose logs -f backend

# Kubernetes
kubectl logs -f deployment/rss-backend -n rss-renaissance
```

### 5. Set Up Monitoring

#### Sentry (Error Tracking)

```bash
# Install Sentry SDK
npm install @sentry/node

# Add to server.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

Monitor these endpoints:
- `GET /health` - Every 5 minutes
- `GET /health/ready` - Every 1 minute

## Scaling

### Horizontal Scaling

#### Railway

```bash
# Scale to 3 instances
railway scale --replicas 3
```

#### Docker

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Scale workers
docker-compose up -d --scale worker=5
```

#### Kubernetes

```bash
# Scale deployment
kubectl scale deployment rss-backend --replicas=3 -n rss-renaissance

# Auto-scaling
kubectl autoscale deployment rss-backend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n rss-renaissance
```

### Vertical Scaling

Increase resources based on load:

- **Light Load**: 512MB RAM, 0.5 CPU
- **Medium Load**: 1GB RAM, 1 CPU
- **Heavy Load**: 2GB RAM, 2 CPU
- **Enterprise**: 4GB+ RAM, 4+ CPU

## Performance Optimization

### 1. Database Connection Pooling

```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connection_limit = 10
}
```

### 2. Redis Caching

Adjust TTL based on usage:

```typescript
// Feeds: 30 minutes (high change rate)
await redis.cacheFeed(url, feed, 1800);

// Summaries: 24 hours (expensive to regenerate)
await redis.cacheSummary(articleId, summary, 86400);
```

### 3. Rate Limiting

Adjust based on traffic:

```bash
# Development
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000  # 15 minutes

# Production
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW=900000
```

### 4. Job Concurrency

```bash
# Light load
JOB_CONCURRENCY=3

# Heavy load
JOB_CONCURRENCY=10
```

## Backup & Recovery

### Database Backups

#### Railway

Automatic daily backups included.

#### Render

Automatic daily backups on paid plans.

#### Self-Hosted

```bash
# Backup
docker-compose exec postgres pg_dump -U postgres rss_renaissance > backup.sql

# Restore
docker-compose exec -T postgres psql -U postgres rss_renaissance < backup.sql
```

### Redis Backups

```bash
# Backup
docker-compose exec redis redis-cli SAVE
docker cp rss-redis:/data/dump.rdb ./redis-backup.rdb

# Restore
docker cp ./redis-backup.rdb rss-redis:/data/dump.rdb
docker-compose restart redis
```

## Troubleshooting

### High Memory Usage

```bash
# Check memory
docker stats rss-backend

# Restart service
docker-compose restart backend
```

### Database Connection Pool Exhausted

Increase connection limit:

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=20"
```

### Redis Connection Timeout

Check Redis health:

```bash
docker-compose exec redis redis-cli ping
```

### OpenAI Rate Limits

Implement exponential backoff:

```typescript
// Increase retry delay
FEED_RETRY_DELAY=5000  # 5 seconds
```

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS origins restricted
- [ ] Rate limiting enabled
- [ ] Helmet security headers active
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection (DOMPurify)
- [ ] Regular dependency updates
- [ ] Monitoring and alerting configured

## Cost Estimation

### Railway (Recommended)

- **Hobby Plan**: $5/month
  - 512MB RAM
  - PostgreSQL included
  - Redis included
  - 100GB bandwidth

- **Pro Plan**: $20/month
  - 8GB RAM
  - Unlimited bandwidth
  - Priority support

### Render

- **Free Tier**: $0/month
  - 512MB RAM
  - PostgreSQL (90 days)
  - Redis (30 days)
  - Spins down after inactivity

- **Starter**: $7/month
  - 512MB RAM
  - Always on
  - PostgreSQL: $7/month
  - Redis: $10/month

### Self-Hosted (DigitalOcean)

- **Basic Droplet**: $6/month
  - 1GB RAM
  - 1 CPU
  - 25GB SSD

- **Production Droplet**: $18/month
  - 2GB RAM
  - 2 CPU
  - 60GB SSD

### OpenAI Costs

- **gpt-4o-mini**: $0.150 / 1M input tokens, $0.600 / 1M output tokens
- **Estimated**: ~$5-10/month for 1,000 summaries/day

## Support

For deployment issues:
- GitHub Issues: https://github.com/your-org/rss-renaissance/issues
- Email: support@rss-renaissance.com
- Discord: https://discord.gg/rss-renaissance

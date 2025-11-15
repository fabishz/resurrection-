# Standalone Backend API - Requirements

## Introduction

This spec defines the requirements for building a complete, production-ready standalone backend API server to replace the current Next.js serverless API routes. The backend will eliminate serverless limitations and provide reliable RSS ingestion, AI summarization, and data persistence.

## Glossary

- **Backend Server**: Standalone Node.js/TypeScript server running Express or Fastify
- **RSS Ingestion**: Process of fetching, parsing, and storing RSS/Atom feeds
- **AI Summarization**: Generating article summaries using OpenAI API
- **Frontend**: Existing Next.js application deployed on Vercel
- **API Client**: Frontend library for communicating with backend
- **Cron Jobs**: Scheduled background tasks for feed refresh and cleanup
- **Rate Limiter**: Middleware to prevent API abuse
- **Cache Layer**: Redis-based caching for feeds and summaries

## Requirements

### Requirement 1: Standalone Backend Server

**User Story:** As a developer, I want a standalone backend server so that I can avoid serverless limitations and timeouts.

#### Acceptance Criteria

1. THE Backend Server SHALL be built using TypeScript
2. THE Backend Server SHALL use Fastify framework for performance
3. THE Backend Server SHALL run independently from Next.js frontend
4. THE Backend Server SHALL support long-running operations without timeout
5. THE Backend Server SHALL enable CORS for frontend domains (Vercel URL, localhost:3000)

### Requirement 2: RSS Feed Ingestion

**User Story:** As a user, I want to ingest RSS feeds reliably so that I can read articles from any source.

#### Acceptance Criteria

1. WHEN a feed URL is provided, THE Backend Server SHALL fetch and parse RSS/Atom/RSS2 feeds
2. THE Backend Server SHALL follow HTTP redirects automatically
3. THE Backend Server SHALL set custom User-Agent headers to avoid blocking
4. THE Backend Server SHALL retry failed requests up to 3 times
5. THE Backend Server SHALL handle invalid XML gracefully without crashing
6. THE Backend Server SHALL extract title, description, URL, author, published date, and images
7. THE Backend Server SHALL normalize feed data to consistent format
8. IF feed fetch fails, THEN THE Backend Server SHALL return descriptive error message
9. THE Backend Server SHALL handle ETIMEDOUT, ECONNRESET, and 404 errors
10. THE Backend Server SHALL detect and reject HTML pages served as XML

### Requirement 3: AI Summarization Service

**User Story:** As a user, I want AI-generated article summaries so that I can quickly understand content.

#### Acceptance Criteria

1. THE Backend Server SHALL integrate with OpenAI API for summarization
2. THE Backend Server SHALL cache summaries in Redis to reduce API calls
3. THE Backend Server SHALL implement retry logic for failed AI requests
4. THE Backend Server SHALL use queue system (BullMQ) for summary generation
5. THE Backend Server SHALL return cached summaries when available
6. THE Backend Server SHALL handle rate limiting from OpenAI gracefully

### Requirement 4: Data Persistence

**User Story:** As a developer, I want persistent data storage so that feed data survives server restarts.

#### Acceptance Criteria

1. THE Backend Server SHALL use PostgreSQL database for data storage
2. THE Backend Server SHALL use Prisma ORM for database operations
3. THE Backend Server SHALL define models for Feed, Article, Summary, and User
4. THE Backend Server SHALL store all ingested feeds and articles
5. THE Backend Server SHALL maintain referential integrity between models
6. THE Backend Server SHALL support database migrations

### Requirement 5: Background Jobs

**User Story:** As a system, I want automated feed refresh so that content stays current.

#### Acceptance Criteria

1. THE Backend Server SHALL implement cron job to re-ingest feeds every 30 minutes
2. THE Backend Server SHALL generate summaries for new articles automatically
3. THE Backend Server SHALL cleanup old cache entries periodically
4. THE Backend Server SHALL log all background job executions
5. THE Backend Server SHALL handle job failures gracefully

### Requirement 6: Security

**User Story:** As a developer, I want secure APIs so that the system is protected from abuse.

#### Acceptance Criteria

1. THE Backend Server SHALL implement rate limiting on all endpoints
2. THE Backend Server SHALL validate all input data using Zod schemas
3. THE Backend Server SHALL sanitize HTML content from feeds
4. THE Backend Server SHALL log all API requests
5. THE Backend Server SHALL implement error middleware for consistent error handling
6. THE Backend Server SHALL protect against SQL injection via parameterized queries

### Requirement 7: API Endpoints

**User Story:** As a frontend developer, I want RESTful APIs so that I can integrate with the backend.

#### Acceptance Criteria

1. THE Backend Server SHALL provide POST /api/ingest endpoint for feed ingestion
2. THE Backend Server SHALL provide GET /api/feeds endpoint for listing feeds
3. THE Backend Server SHALL provide GET /api/articles endpoint for listing articles
4. THE Backend Server SHALL provide POST /api/summarize endpoint for AI summaries
5. THE Backend Server SHALL provide GET /api/feed/:id endpoint for feed details
6. THE Backend Server SHALL provide GET /health endpoint for health checks
7. THE Backend Server SHALL provide GET /metrics endpoint for monitoring
8. THE Backend Server SHALL return JSON responses with proper status codes

### Requirement 8: Deployment

**User Story:** As a developer, I want easy deployment so that I can run the backend in production.

#### Acceptance Criteria

1. THE Backend Server SHALL include Dockerfile for containerization
2. THE Backend Server SHALL include Railway deployment configuration
3. THE Backend Server SHALL include Render deployment configuration
4. THE Backend Server SHALL document all environment variables
5. THE Backend Server SHALL support horizontal scaling

### Requirement 9: Frontend Integration

**User Story:** As a frontend developer, I want an API client library so that I can easily call backend APIs.

#### Acceptance Criteria

1. THE Frontend SHALL use NEXT_PUBLIC_API_URL environment variable
2. THE Frontend SHALL include lib/api.ts helper for API calls
3. THE Frontend SHALL handle API errors gracefully
4. THE Frontend SHALL display loading states during API calls
5. THE Frontend SHALL work with both local and production backend URLs

### Requirement 10: Testing

**User Story:** As a developer, I want comprehensive tests so that I can ensure reliability.

#### Acceptance Criteria

1. THE Backend Server SHALL include unit tests for services
2. THE Backend Server SHALL include integration tests for API endpoints
3. THE Backend Server SHALL include tests for error handling
4. THE Backend Server SHALL achieve 80%+ code coverage
5. THE Backend Server SHALL include test documentation


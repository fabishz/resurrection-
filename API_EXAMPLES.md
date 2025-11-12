# RSS Renaissance API Examples

## Overview

This document provides example requests and responses for the RSS Renaissance API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### 1. POST /api/ingest

Ingest an RSS feed and store its items.

**Request:**

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "feedUrl": "https://hnrss.org/frontpage"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "feedId": "a1b2c3d4e5f6g7h8",
  "itemsIngested": 30,
  "items": [
    {
      "id": "item123abc",
      "feedId": "a1b2c3d4e5f6g7h8",
      "title": "Show HN: My New Project",
      "link": "https://example.com/article",
      "content": "Full article content here...",
      "contentSnippet": "Brief excerpt...",
      "pubDate": "2025-11-11T10:00:00.000Z",
      "author": "John Doe",
      "categories": ["Technology"],
      "guid": "https://example.com/article"
    }
  ]
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "error": "Invalid feed URL",
  "code": "INVALID_URL"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "success": false,
  "error": "Failed to fetch feed: Connection timeout",
  "code": "INGEST_ERROR"
}
```

---

### 2. GET /api/ingest?feedId=xxx

Get feed details by ID.

**Request:**

```bash
curl http://localhost:3000/api/ingest?feedId=a1b2c3d4e5f6g7h8
```

**Response (200 OK):**

```json
{
  "success": true,
  "feed": {
    "id": "a1b2c3d4e5f6g7h8",
    "url": "https://hnrss.org/frontpage",
    "title": "Hacker News: Front Page",
    "description": "Hacker News RSS Feed",
    "link": "https://news.ycombinator.com/",
    "lastFetched": "2025-11-11T10:00:00.000Z",
    "itemCount": 30
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Feed not found",
  "code": "NOT_FOUND"
}
```

---

### 3. POST /api/summarize

Summarize article content using AI.

**Request (by Article ID):**

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "item123abc",
    "maxLength": 200
  }'
```

**Request (by Content):**

```bash
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial intelligence is transforming the technology industry. Machine learning models are becoming more sophisticated and accessible. Companies are investing heavily in AI research and development. The future of AI looks promising with many exciting applications on the horizon.",
    "title": "The Future of AI",
    "maxLength": 150
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "summary": "Artificial intelligence is transforming the technology industry with increasingly sophisticated machine learning models. Companies are investing heavily in AI research, and the future looks promising.",
  "keyPoints": [
    "AI is transforming the technology industry",
    "Machine learning models are becoming more sophisticated",
    "Companies are investing heavily in AI research"
  ],
  "sentiment": "positive",
  "categories": ["Tech"],
  "processingTime": 245
}
```

**Error Response (400 Bad Request - Missing Parameters):**

```json
{
  "success": false,
  "error": "Either articleId or content must be provided",
  "code": "MISSING_PARAMETER"
}
```

**Error Response (400 Bad Request - Content Too Short):**

```json
{
  "success": false,
  "error": "Content too short to summarize (minimum 50 characters)",
  "code": "CONTENT_TOO_SHORT"
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "error": "Article not found",
  "code": "NOT_FOUND"
}
```

---

### 4. GET /api/summarize?articleId=xxx

Get cached summary for an article (if available).

**Request:**

```bash
curl http://localhost:3000/api/summarize?articleId=item123abc
```

**Response (200 OK):**

```json
{
  "success": true,
  "article": {
    "id": "item123abc",
    "title": "Show HN: My New Project",
    "hasContent": true
  }
}
```

---

## Testing Workflow

### 1. Start Development Server

```bash
npm run dev
```

### 2. Run API Tests

```bash
# Make script executable
chmod +x scripts/test-api.sh

# Run tests
./scripts/test-api.sh
```

### 3. Manual Testing

```bash
# Ingest a feed
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{"feedUrl": "https://hnrss.org/frontpage"}' | jq

# Get feed details (replace FEED_ID with actual ID from previous response)
curl http://localhost:3000/api/ingest?feedId=FEED_ID | jq

# Summarize an article (replace ARTICLE_ID with actual ID)
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"articleId": "ARTICLE_ID"}' | jq

# Summarize custom content
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Your article content here...",
    "title": "Article Title",
    "maxLength": 200
  }' | jq
```

---

## Common RSS Feeds for Testing

```bash
# Hacker News
https://hnrss.org/frontpage

# TechCrunch
https://techcrunch.com/feed/

# The Verge
https://www.theverge.com/rss/index.xml

# Ars Technica
https://feeds.arstechnica.com/arstechnica/index

# Wired
https://www.wired.com/feed/rss
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request body failed validation |
| `INVALID_URL` | Feed URL is invalid or malformed |
| `MISSING_PARAMETER` | Required parameter is missing |
| `NOT_FOUND` | Resource not found |
| `INGEST_ERROR` | Failed to fetch or parse feed |
| `SUMMARIZE_ERROR` | Failed to generate summary |
| `CONTENT_TOO_SHORT` | Content is too short to summarize |
| `NO_CONTENT` | No content available to summarize |
| `GET_ERROR` | Failed to retrieve resource |

---

## Rate Limiting

Currently, there are no rate limits in development mode. In production:

- **Ingest**: 10 requests per minute per IP
- **Summarize**: 100 requests per hour per IP (due to AI API costs)

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- The mock summarizer is used by default in development
- To use real AI summarization, configure `OPENAI_API_KEY` in `.env.local`
- Feed items are stored in-memory and will be lost on server restart
- In production, items will be persisted to PostgreSQL database

---

*Last Updated: 2025-11-11*

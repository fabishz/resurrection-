# MCP (Model Context Protocol) Configuration

## Overview

RSS Renaissance uses Model Context Protocol (MCP) servers to integrate with external services and tools. MCP enables Kiro to interact with GitHub, Vercel, OpenAI, Redis, and other services directly through standardized interfaces.

## Configured MCP Servers

### 1. GitHub (`github`)

**Provider**: Official MCP GitHub Server  
**Installation**: `uvx mcp-server-github`

**Purpose**: Repository management and collaboration workflows

**Delegated Actions**:
- ✅ **PR Creation**: Automatically create pull requests for feature branches
- ✅ **Issue Management**: Create issues for bugs found during development, link commits to issues
- ✅ **Code Search**: Search across repository for patterns, dependencies, or specific implementations
- ✅ **File Operations**: Read/write files directly to repository, useful for documentation updates
- ✅ **Commit History**: Analyze commit history for changelog generation
- ✅ **Branch Management**: Create feature branches, check branch status

**Auto-Approved Tools**:
- `create_or_update_file`: Safe file operations
- `search_repositories`: Read-only search
- `get_file_contents`: Read file contents
- `list_commits`: View commit history

**Requires Manual Approval**:
- `create_pull_request`: Review PR details before creation
- `create_issue`: Review issue content
- `push_files`: Confirm before pushing changes

**Setup**:
1. Generate GitHub Personal Access Token at https://github.com/settings/tokens
2. Required scopes: `repo`, `workflow`, `read:org`
3. Add token to `GITHUB_PERSONAL_ACCESS_TOKEN` environment variable

---

### 2. Vercel (`vercel`)

**Provider**: Custom MCP Vercel Server  
**Installation**: Install from npm or build from source

**Purpose**: Deployment management and preview environment monitoring

**Delegated Actions**:
- ✅ **Deployment Status**: Check build and deployment status for PRs
- ✅ **Preview URLs**: Get preview URLs for testing features before merge
- ✅ **Build Logs**: Fetch build logs when deployments fail
- ✅ **Environment Variables**: List and verify environment configuration
- ✅ **Domain Management**: Check domain configuration and SSL status
- ✅ **Analytics**: Query Web Vitals and performance metrics

**Auto-Approved Tools**:
- `list_deployments`: View deployment history
- `get_deployment_status`: Check deployment state

**Requires Manual Approval**:
- `trigger_deployment`: Confirm before triggering new deployment
- `update_env_vars`: Review environment variable changes
- `rollback_deployment`: Confirm rollback action

**Setup**:
1. Generate Vercel token at https://vercel.com/account/tokens
2. Get Team ID from Vercel dashboard (if using team account)
3. Add credentials to environment variables

---

### 3. OpenAI Summarizer (`openai-summarizer`)

**Provider**: Official MCP OpenAI Server  
**Installation**: `uvx mcp-server-openai`

**Purpose**: AI-powered content summarization and categorization

**Delegated Actions**:
- ✅ **Article Summarization**: Generate 2-3 sentence summaries of RSS articles
- ✅ **Content Categorization**: Classify articles into predefined categories (Tech, Business, Science, etc.)
- ✅ **Duplicate Detection**: Analyze article similarity for deduplication
- ✅ **Sentiment Analysis**: Determine article sentiment (positive, negative, neutral)
- ✅ **Entity Extraction**: Extract key people, companies, locations from articles
- ✅ **Code Review**: Analyze code changes and suggest improvements

**Model Configuration**:
- **Model**: `gpt-4o-mini` (cost-effective, fast, good quality)
- **Max Tokens**: 500 (sufficient for summaries)
- **Temperature**: 0.3 (consistent, factual outputs)

**Cost Management**:
- Summaries cached in Redis to avoid re-processing
- Batch processing for multiple articles
- Estimated cost: $0.002 per 1K tokens (~$0.001 per summary)
- Monthly budget: ~$50 for 50,000 summaries

**Setup**:
1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Set `OPENAI_API_KEY` environment variable
3. Configure model and token limits as needed

---

### 4. Redis Cache (`redis-cache`)

**Provider**: Custom MCP Redis Server  
**Installation**: Install from npm or build from source

**Purpose**: High-performance caching for AI summaries, feed data, and API responses

**Delegated Actions**:
- ✅ **Cache AI Summaries**: Store generated summaries with permanent TTL
- ✅ **Cache Feed Data**: Store RSS feed responses (15-minute TTL)
- ✅ **Cache API Responses**: Store expensive API calls
- ✅ **Session Management**: Store user sessions and preferences
- ✅ **Rate Limiting**: Track API request counts per user/feed
- ✅ **Analytics**: Store temporary analytics data before database write

**Auto-Approved Tools**:
- `get`: Read cached values
- `set`: Write to cache
- `del`: Delete cache entries
- `exists`: Check if key exists

**Requires Manual Approval**:
- `flushdb`: Clear entire cache (dangerous)
- `flushall`: Clear all databases (very dangerous)

**Cache Strategy**:
```
Key Pattern                    TTL        Purpose
-----------                    ---        -------
summary:{article_id}           ∞          AI-generated summaries (never expire)
feed:{feed_url}                15min      RSS feed responses
api:{endpoint}:{params}        5min       API response cache
category:{article_id}          ∞          AI categorization results
user:session:{session_id}      24hr       User session data
ratelimit:{user_id}:{action}   1min       Rate limiting counters
```

**Setup**:
1. Use Upstash Redis (free tier: 10K requests/day) or self-hosted
2. Get Redis URL from provider
3. Enable TLS for production (`REDIS_TLS=true`)

---

### 5. Filesystem (`filesystem`)

**Provider**: Official MCP Filesystem Server  
**Installation**: `uvx mcp-server-filesystem`

**Purpose**: Safe file system access for code analysis and documentation

**Delegated Actions**:
- ✅ **Code Analysis**: Read source files to understand implementation
- ✅ **Documentation Generation**: Read code to generate docs
- ✅ **Test Generation**: Analyze implementation to create tests
- ✅ **Dependency Analysis**: Read package.json and lock files
- ✅ **Configuration Review**: Read config files for troubleshooting

**Allowed Directories**:
- `./src`: Source code (read/write)
- `./public`: Public assets (read/write)
- `./.kiro`: Kiro configuration (read/write)

**Restricted Directories**:
- `./node_modules`: Blocked (too large, managed by npm)
- `./.git`: Blocked (use GitHub MCP instead)
- `./.env`: Blocked (secrets should not be read)

**Auto-Approved Tools**:
- `read_file`: Read file contents
- `list_directory`: List directory contents

**Requires Manual Approval**:
- `write_file`: Review changes before writing
- `create_directory`: Confirm directory creation
- `delete_file`: Confirm deletion

---

### 6. PostgreSQL (`postgres`)

**Provider**: Official MCP PostgreSQL Server  
**Installation**: `uvx mcp-server-postgres`

**Purpose**: Database queries for analytics, debugging, and data exploration

**Delegated Actions**:
- ✅ **Analytics Queries**: Generate reports on feed usage, article counts, user activity
- ✅ **Debugging**: Query database to troubleshoot issues
- ✅ **Data Exploration**: Explore schema and relationships
- ✅ **Performance Analysis**: Identify slow queries and missing indexes
- ✅ **Data Validation**: Check data integrity and consistency

**Auto-Approved Tools**:
- `query`: Execute SELECT queries (read-only by default)

**Requires Manual Approval**:
- `execute`: Run INSERT/UPDATE/DELETE queries
- `schema_changes`: ALTER TABLE or CREATE TABLE statements

**Safety Features**:
- Read-only mode by default
- Query timeout: 30 seconds
- Result limit: 1000 rows
- No DROP or TRUNCATE commands allowed

**Setup**:
1. Get PostgreSQL connection string from Supabase/Railway
2. Format: `postgresql://user:password@host:5432/database?sslmode=require`
3. Use read-only user for safety

---

## MCP Workflow Examples

### Example 1: Automated PR Creation with Tests

```
User: "Create a PR for the feed deduplication feature"

Kiro workflow:
1. [filesystem] Read implementation files
2. [filesystem] Generate unit tests
3. [github] Create feature branch
4. [github] Commit changes
5. [github] Create pull request with description
6. [vercel] Get preview deployment URL
7. [github] Add preview URL to PR comment
```

### Example 2: Article Summarization Pipeline

```
User: "Summarize new articles from feeds"

Kiro workflow:
1. [postgres] Query unsummarized articles
2. [redis-cache] Check if summaries already cached
3. [openai-summarizer] Generate summaries for uncached articles
4. [redis-cache] Store summaries with permanent TTL
5. [postgres] Update articles with summary text
6. [openai-summarizer] Categorize articles
7. [postgres] Update article categories
```

### Example 3: Deployment Status Check

```
User: "Check if the latest deployment succeeded"

Kiro workflow:
1. [github] Get latest commit SHA
2. [vercel] List deployments for commit
3. [vercel] Get deployment status and logs
4. [vercel] Get preview URL if successful
5. Report status to user with URL
```

### Example 4: Performance Debugging

```
User: "Why is the feed refresh slow?"

Kiro workflow:
1. [postgres] Query slow query logs
2. [postgres] Check missing indexes
3. [redis-cache] Check cache hit rate
4. [filesystem] Read feed fetching code
5. [github] Search for similar performance issues
6. Provide diagnosis and recommendations
```

---

## Security Best Practices

### Environment Variables

**Never commit secrets to git!** Store all tokens and keys in environment variables:

```bash
# .env.local (add to .gitignore)
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxx
VERCEL_TOKEN=xxxxx
OPENAI_API_KEY=sk-xxxxx
REDIS_URL=redis://xxxxx
POSTGRES_CONNECTION_STRING=postgresql://xxxxx
```

### Token Permissions

**Principle of Least Privilege**: Grant only necessary permissions

- **GitHub**: `repo` (required), `workflow` (optional), avoid `admin:org`
- **Vercel**: Read-only token for monitoring, separate token for deployments
- **OpenAI**: Set spending limits in OpenAI dashboard
- **Redis**: Use password authentication, enable TLS
- **PostgreSQL**: Use read-only user for queries, separate user for writes

### Auto-Approve Guidelines

**Auto-approve only safe, read-only operations**:
- ✅ Reading files, querying databases, checking status
- ❌ Writing files, creating resources, deleting data

**Always require approval for**:
- Creating PRs, issues, or deployments
- Modifying database records
- Changing environment variables
- Deleting or moving files

---

## Troubleshooting

### MCP Server Not Connecting

1. Check if `uvx` is installed: `uvx --version`
2. Verify environment variables are set: `echo $GITHUB_PERSONAL_ACCESS_TOKEN`
3. Check MCP server logs in Kiro output panel
4. Try disabling and re-enabling the server in Kiro settings

### Rate Limiting Issues

**OpenAI**: 
- Reduce batch size for summarization
- Increase cache TTL to reduce API calls
- Consider switching to `gpt-3.5-turbo` for lower costs

**GitHub**:
- Use authenticated requests (higher rate limit)
- Cache repository data in Redis
- Implement exponential backoff for retries

**Vercel**:
- Limit deployment status checks
- Use webhooks instead of polling

### Permission Errors

1. Verify token has required scopes
2. Check if token is expired (regenerate if needed)
3. Ensure team/organization access is granted
4. Review MCP server logs for specific error messages

---

## Cost Estimates

### Monthly Costs (Estimated)

| Service | Usage | Cost |
|---------|-------|------|
| OpenAI (GPT-4o-mini) | 50K summaries | $50 |
| Redis (Upstash) | 10K requests/day | Free |
| PostgreSQL (Supabase) | 500MB database | Free |
| Vercel | Hobby plan | Free |
| GitHub | Public repo | Free |
| **Total** | | **$50/month** |

### Cost Optimization Tips

1. **Aggressive Caching**: Cache AI summaries permanently in Redis
2. **Batch Processing**: Process multiple articles in single API call
3. **Smaller Models**: Use `gpt-4o-mini` instead of `gpt-4`
4. **Rate Limiting**: Limit summarization to N articles per hour
5. **Fallback Strategy**: Use article excerpt if AI quota exceeded

---

## Installation Guide

### 1. Install UV (Python Package Manager)

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with Homebrew
brew install uv
```

### 2. Install MCP Servers

```bash
# GitHub server
uvx mcp-server-github

# OpenAI server
uvx mcp-server-openai

# Filesystem server
uvx mcp-server-filesystem

# PostgreSQL server
uvx mcp-server-postgres
```

### 3. Configure Environment Variables

Create `.env.local` file:

```bash
# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Vercel
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here

# OpenAI
OPENAI_API_KEY=sk-your_openai_key_here

# Redis
REDIS_URL=redis://default:password@host:6379

# PostgreSQL
POSTGRES_CONNECTION_STRING=postgresql://user:password@host:5432/database
```

### 4. Restart Kiro

After configuring MCP servers, restart Kiro to load the new configuration.

### 5. Test MCP Servers

In Kiro, try these commands to test each server:

```
# Test GitHub
"List recent commits in this repository"

# Test Vercel
"Show latest deployment status"

# Test OpenAI
"Summarize this article: [paste article text]"

# Test Redis
"Check if cache key 'test' exists"

# Test PostgreSQL
"Show me the feeds table schema"
```

---

## Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP Server GitHub](https://github.com/modelcontextprotocol/servers)
- [Kiro MCP Guide](https://docs.kiro.ai/mcp)
- [OpenAI API Pricing](https://openai.com/pricing)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)

---

*Last Updated: 2025-11-11*  
*Version: 1.0*

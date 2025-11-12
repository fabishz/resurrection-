# GitHub Actions CI/CD Pipeline

This document describes the CI/CD pipeline for RSS Renaissance.

## Overview

The pipeline runs on every push and pull request to `main` and `develop` branches. It includes linting, testing, building, security auditing, and optional deployment to Vercel.

## Workflow Jobs

### 1. Lint & Type Check (`lint`)

**Purpose**: Ensure code quality and type safety

**Steps**:
- Checkout code
- Setup Node.js with npm cache
- Install dependencies
- Run ESLint
- Run TypeScript type check
- Check code formatting with Prettier

**Duration**: ~2-3 minutes

**Fails if**:
- ESLint errors found
- TypeScript type errors
- Code formatting issues

### 2. Run Tests (`test`)

**Purpose**: Verify functionality with automated tests

**Steps**:
- Checkout code
- Setup Node.js with npm cache
- Install dependencies
- Run unit tests
- Generate coverage report
- Upload coverage to Codecov
- Upload coverage artifacts

**Duration**: ~3-5 minutes

**Fails if**:
- Any test fails
- Coverage below threshold (optional)

### 3. Build Application (`build`)

**Purpose**: Ensure the Next.js app builds successfully

**Steps**:
- Checkout code
- Setup Node.js with npm cache
- Install dependencies
- Build Next.js application
- Verify build output
- Upload build artifacts

**Duration**: ~3-5 minutes

**Fails if**:
- Build errors
- Missing .next directory

**Dependencies**: Requires `lint` and `test` to pass

### 4. Security Audit (`security`)

**Purpose**: Check for known vulnerabilities

**Steps**:
- Checkout code
- Setup Node.js
- Run npm audit
- Generate audit report
- Upload audit report

**Duration**: ~1-2 minutes

**Continues on error**: Yes (won't fail the pipeline)

### 5. Deploy Preview (`deploy-preview`)

**Purpose**: Deploy PR previews to Vercel

**Triggers**: Only on pull requests

**Steps**:
- Checkout code
- Install Vercel CLI
- Pull Vercel environment
- Build project
- Deploy to Vercel preview
- Comment PR with preview URL

**Duration**: ~3-5 minutes

**Dependencies**: Requires `build` to pass

**Secrets Required**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 6. Deploy Production (`deploy-production`)

**Purpose**: Deploy to production on main branch

**Triggers**: Only on push to `main` branch

**Steps**:
- Checkout code
- Install Vercel CLI
- Pull Vercel production environment
- Build project for production
- Deploy to Vercel production
- Create deployment summary

**Duration**: ~5-7 minutes

**Dependencies**: Requires `build` and `security` to pass

**Secrets Required**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### 7. Notify on Failure (`notify-failure`)

**Purpose**: Send notifications when pipeline fails

**Triggers**: Only when `lint`, `test`, or `build` fails

**Steps**:
- Log failure details
- Send notification (optional)

**Duration**: < 1 minute

## Required Secrets

### GitHub Secrets

Configure these in: `Settings > Secrets and variables > Actions`

#### Vercel Deployment

```
VERCEL_TOKEN          - Vercel authentication token
VERCEL_ORG_ID         - Vercel organization/team ID
VERCEL_PROJECT_ID     - Vercel project ID
```

**How to get these values**:

1. **VERCEL_TOKEN**:
   - Go to https://vercel.com/account/tokens
   - Create new token
   - Copy token value

2. **VERCEL_ORG_ID** and **VERCEL_PROJECT_ID**:
   - Run `vercel link` in your project
   - Check `.vercel/project.json`
   - Copy `orgId` and `projectId`

#### Optional Secrets

```
CODECOV_TOKEN         - Codecov upload token (optional)
SLACK_WEBHOOK_URL     - Slack notification webhook (optional)
NEXT_PUBLIC_APP_URL   - Public app URL for builds
NEXT_PUBLIC_API_URL   - Public API URL for builds
```

## Environment Variables

### Build-time Variables

Set in workflow or as secrets:

```yaml
NEXT_PUBLIC_APP_URL: 'https://rss-renaissance.vercel.app'
NEXT_PUBLIC_API_URL: 'https://rss-renaissance.vercel.app/api'
```

### Runtime Variables

Set in Vercel dashboard:

```
DATABASE_URL
REDIS_URL
OPENAI_API_KEY
GITHUB_PERSONAL_ACCESS_TOKEN
```

## Caching Strategy

### Node Modules Cache

```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

**Benefits**:
- Faster dependency installation
- Reduced network usage
- Consistent across jobs

**Cache Key**: Based on `package-lock.json`

**Cache Location**: `~/.npm`

### Build Cache

Build artifacts are uploaded and can be reused:

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: next-build
    path: .next/
```

## Workflow Optimization

### Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**Effect**: Cancels in-progress runs when new commits are pushed

### Parallel Jobs

Jobs run in parallel when possible:
- `lint` and `test` run simultaneously
- `security` runs independently
- `build` waits for `lint` and `test`

### Timeouts

Each job has a timeout to prevent hanging:
- Lint: 10 minutes
- Test: 15 minutes
- Build: 15 minutes
- Deploy: 10-15 minutes

## Triggering the Pipeline

### Automatic Triggers

**Push to main/develop**:
```bash
git push origin main
```

**Pull Request**:
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
# Create PR on GitHub
```

### Manual Trigger

Add to workflow:
```yaml
on:
  workflow_dispatch:
```

Then trigger from GitHub Actions UI.

## Monitoring Pipeline

### GitHub Actions UI

1. Go to repository
2. Click "Actions" tab
3. View workflow runs
4. Click run to see details

### Status Badges

Add to README.md:

```markdown
![CI](https://github.com/username/rss-renaissance/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Notifications

Configure in: `Settings > Notifications`

Options:
- Email on failure
- Slack/Discord webhooks
- GitHub mobile app

## Debugging Failed Runs

### View Logs

1. Click on failed job
2. Expand failed step
3. View error logs

### Re-run Jobs

1. Click "Re-run jobs"
2. Select "Re-run failed jobs" or "Re-run all jobs"

### Debug with SSH

Add to workflow:
```yaml
- name: Setup tmate session
  uses: mxschmitt/action-tmate@v3
  if: failure()
```

## Local Testing

### Test Lint

```bash
npm run lint
npm run type-check
npm run format:check
```

### Test Build

```bash
npm run build
```

### Test Tests

```bash
npm run test:run
npm run test:coverage
```

### Test Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## Troubleshooting

### Cache Issues

**Problem**: Stale dependencies

**Solution**:
```bash
# Clear cache from GitHub Actions UI
# Or update package-lock.json
npm install
git add package-lock.json
git commit -m "chore: update dependencies"
```

### Build Failures

**Problem**: Build works locally but fails in CI

**Solution**:
- Check Node.js version matches
- Verify environment variables
- Check for missing dependencies
- Review build logs

### Deployment Failures

**Problem**: Vercel deployment fails

**Solution**:
- Verify secrets are set correctly
- Check Vercel project settings
- Ensure build succeeds first
- Review Vercel logs

### Test Failures

**Problem**: Tests pass locally but fail in CI

**Solution**:
- Check for timing issues
- Verify test environment
- Check for missing test dependencies
- Review test logs

## Best Practices

### ✅ Do

- Keep workflows fast (< 10 minutes total)
- Use caching for dependencies
- Run jobs in parallel when possible
- Set appropriate timeouts
- Use secrets for sensitive data
- Add status badges to README
- Monitor pipeline regularly

### ❌ Don't

- Commit secrets to repository
- Run unnecessary steps
- Use long timeouts (> 30 minutes)
- Ignore failing tests
- Skip security audits
- Deploy without testing

## Cost Optimization

### GitHub Actions Minutes

- **Free tier**: 2,000 minutes/month
- **Typical run**: ~10-15 minutes
- **Estimated runs**: ~130-200/month

### Optimization Tips

1. **Use caching**: Saves 1-2 minutes per run
2. **Parallel jobs**: Reduces total time
3. **Conditional jobs**: Skip unnecessary steps
4. **Artifact cleanup**: Delete old artifacts

## Future Enhancements

### Planned Improvements

- [ ] Add E2E tests with Playwright
- [ ] Implement visual regression testing
- [ ] Add performance benchmarks
- [ ] Integrate Lighthouse CI
- [ ] Add database migrations
- [ ] Implement blue-green deployments
- [ ] Add smoke tests post-deployment
- [ ] Integrate with monitoring tools

### Optional Integrations

- **Sentry**: Error tracking
- **Datadog**: Performance monitoring
- **Snyk**: Security scanning
- **SonarCloud**: Code quality
- **Chromatic**: Visual testing

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Codecov Documentation](https://docs.codecov.com/)

---

*Last Updated: 2025-11-11*

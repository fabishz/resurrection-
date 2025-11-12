# GitHub Secrets Setup Guide

This guide walks you through setting up the required secrets for the CI/CD pipeline.

## Required Secrets

### 1. Vercel Deployment Secrets

#### VERCEL_TOKEN

**Purpose**: Authenticate with Vercel API

**Steps**:
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions CI/CD"
4. Set scope to "Full Account"
5. Click "Create"
6. Copy the token (you won't see it again!)

**Add to GitHub**:
1. Go to your repository on GitHub
2. Click `Settings` > `Secrets and variables` > `Actions`
3. Click "New repository secret"
4. Name: `VERCEL_TOKEN`
5. Value: Paste the token
6. Click "Add secret"

#### VERCEL_ORG_ID and VERCEL_PROJECT_ID

**Purpose**: Identify your Vercel organization and project

**Steps**:
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to your project directory
3. Run: `vercel link`
4. Follow prompts to link your project
5. Check `.vercel/project.json`:
   ```json
   {
     "orgId": "team_xxxxxxxxxxxxx",
     "projectId": "prj_xxxxxxxxxxxxx"
   }
   ```
6. Copy both IDs

**Add to GitHub**:
1. Go to `Settings` > `Secrets and variables` > `Actions`
2. Add `VERCEL_ORG_ID` with the `orgId` value
3. Add `VERCEL_PROJECT_ID` with the `projectId` value

### 2. Optional Secrets

#### CODECOV_TOKEN

**Purpose**: Upload test coverage reports

**Steps**:
1. Go to https://codecov.io/
2. Sign in with GitHub
3. Add your repository
4. Copy the upload token

**Add to GitHub**:
- Name: `CODECOV_TOKEN`
- Value: Paste the token

#### SLACK_WEBHOOK_URL

**Purpose**: Send notifications to Slack

**Steps**:
1. Go to your Slack workspace
2. Create an Incoming Webhook app
3. Copy the webhook URL

**Add to GitHub**:
- Name: `SLACK_WEBHOOK_URL`
- Value: Paste the webhook URL

## Vercel Environment Variables

Set these in Vercel dashboard for runtime:

### Production Environment

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to `Settings` > `Environment Variables`
4. Add the following:

```
DATABASE_URL
  Value: postgresql://user:password@host:5432/database
  Environment: Production

REDIS_URL
  Value: redis://default:password@host:6379
  Environment: Production

OPENAI_API_KEY
  Value: sk-your-key-here
  Environment: Production

GITHUB_PERSONAL_ACCESS_TOKEN
  Value: ghp_your-token-here
  Environment: Production, Preview (optional)

NEXT_PUBLIC_APP_URL
  Value: https://your-domain.vercel.app
  Environment: Production

NEXT_PUBLIC_API_URL
  Value: https://your-domain.vercel.app/api
  Environment: Production
```

### Preview Environment

Add the same variables for Preview environment, or use different values for testing.

## Verification

### Test Vercel Connection

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Test deployment
vercel --prod
```

### Test GitHub Actions

1. Make a small change
2. Push to a branch
3. Create a pull request
4. Check Actions tab for pipeline run

### Test Secrets

Create a test workflow:

```yaml
name: Test Secrets
on: workflow_dispatch

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Check secrets
        run: |
          echo "VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN != '' }}"
          echo "VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID != '' }}"
          echo "VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID != '' }}"
```

## Security Best Practices

### ✅ Do

- Use separate tokens for CI/CD
- Rotate tokens regularly (every 90 days)
- Use minimal required permissions
- Store secrets in GitHub Secrets, never in code
- Use environment-specific secrets
- Review secret access logs

### ❌ Don't

- Commit secrets to repository
- Share secrets in chat/email
- Use personal tokens for production
- Give tokens more permissions than needed
- Reuse tokens across projects
- Log secret values

## Troubleshooting

### "Secret not found" Error

**Problem**: Workflow can't access secret

**Solutions**:
1. Verify secret name matches exactly (case-sensitive)
2. Check secret is set at repository level, not organization
3. Ensure workflow has permission to access secrets
4. Re-add the secret if it was recently changed

### Vercel Deployment Fails

**Problem**: "Invalid token" or "Project not found"

**Solutions**:
1. Verify `VERCEL_TOKEN` is valid
2. Check `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are correct
3. Ensure token has correct permissions
4. Try regenerating the token

### Environment Variables Not Available

**Problem**: Variables undefined in deployed app

**Solutions**:
1. Check variables are set in Vercel dashboard
2. Verify environment (Production/Preview) is correct
3. Ensure variables start with `NEXT_PUBLIC_` for client-side
4. Redeploy after adding variables

## Updating Secrets

### Rotate Vercel Token

1. Create new token in Vercel
2. Update `VERCEL_TOKEN` in GitHub
3. Test deployment
4. Delete old token in Vercel

### Update Project IDs

1. Run `vercel link` again
2. Check `.vercel/project.json`
3. Update secrets in GitHub
4. Test deployment

## Checklist

Before running CI/CD pipeline:

- [ ] `VERCEL_TOKEN` is set
- [ ] `VERCEL_ORG_ID` is set
- [ ] `VERCEL_PROJECT_ID` is set
- [ ] Vercel project is linked
- [ ] Environment variables are set in Vercel
- [ ] Test deployment works locally
- [ ] GitHub Actions has permission to access secrets
- [ ] Workflow file is committed to repository

## Quick Setup Script

```bash
#!/bin/bash

# Setup Vercel
echo "Setting up Vercel..."
npm i -g vercel
vercel login
vercel link

# Get project IDs
echo "Project IDs (add these to GitHub Secrets):"
cat .vercel/project.json

# Test deployment
echo "Testing deployment..."
vercel --prod

echo "✅ Setup complete!"
echo "Now add the secrets to GitHub:"
echo "1. Go to Settings > Secrets and variables > Actions"
echo "2. Add VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
```

## Support

If you encounter issues:

1. Check [GitHub Actions Documentation](https://docs.github.com/en/actions)
2. Check [Vercel Documentation](https://vercel.com/docs)
3. Review workflow logs in Actions tab
4. Check Vercel deployment logs
5. Open an issue in the repository

---

*Last Updated: 2025-11-11*

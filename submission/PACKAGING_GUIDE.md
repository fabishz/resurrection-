# RSS Renaissance - Packaging Guide

## Quick Start

To package your submission for the hackathon:

```bash
# Make script executable (first time only)
chmod +x scripts/package_for_submission.sh

# Run the packaging script
./scripts/package_for_submission.sh
```

The script will:
1. ✅ Run pre-flight checks
2. ✅ Clean previous builds
3. ✅ Install dependencies
4. ✅ Run tests
5. ✅ Type check
6. ✅ Lint code
7. ✅ Build project
8. ✅ Collect all artifacts
9. ✅ Create ZIP file
10. ✅ Print verification checklist

## Output

The script creates: `rss-renaissance-submission.zip`

**Estimated size**: 50-60 MB (without node_modules)

## What's Included

### 📄 Documentation (15+ files)
- README.md, CHANGELOG.md, LICENSE
- API_EXAMPLES.md, TESTING.md
- KIRO_INTEGRATION.md
- docs/ folder (accessibility, QA, etc.)

### 🎯 Submission Materials (10+ files)
- submission/submit_instructions.md
- submission/short_architecture.pdf
- submission/commit-log.md
- submission/judging-brief.md
- submission/postmortem-and-roadmap.md
- submission/social-posts.md
- submission/hook-documentation.md
- submission/AGENT_HOOK_SUMMARY.md
- submission/screenshots/ (10+ images)

### 🤖 Kiro Integration (17+ files)
- .kiro/specs/ (requirements, design, tasks)
- .kiro/steering/ (product, architecture, standards)
- .kiro/hooks/ (5 agent hooks + documentation)
- .kiro/settings/ (MCP configuration)

### 💻 Source Code (50+ files)
- src/app/ (Next.js app router)
- src/components/ (React components)
- src/lib/ (business logic)
- src/types/ (TypeScript types)

### 🧪 Tests (20+ files)
- tests/unit/ (50 unit tests)
- tests/integration/ (18 integration tests)
- tests/setup.ts
- vitest.config.ts

### 🔧 Configuration (10+ files)
- next.config.ts
- tailwind.config.ts
- tsconfig.json
- eslint.config.mjs
- .prettierrc

### 🚀 CI/CD & Scripts (5+ files)
- .github/workflows/ci.yml
- scripts/bootstrap.sh
- scripts/test-api.sh
- scripts/qa-tests.sh
- scripts/a11y-and-lighthouse.sh

### 🏗️ Build Output
- .next/ (production build)
- public/ (static assets)

## What's Excluded

- ❌ `node_modules/` (too large, judges will run `npm install`)
- ❌ `.git/` (use GitHub link instead)
- ❌ `.env` (sensitive data)
- ❌ `*.log` (log files)
- ❌ `.DS_Store` (macOS files)

## Verification Checklist

The script automatically verifies:

### ✅ Required Files
- [ ] README.md with setup instructions
- [ ] CHANGELOG.md with version history
- [ ] package.json with dependencies
- [ ] .env.example with configuration template
- [ ] DEVPOST_SUBMISSION.md with submission content

### ✅ Submission Materials
- [ ] submit_instructions.md (how to run)
- [ ] short_architecture.pdf (technical overview)
- [ ] commit-log.md (development timeline)
- [ ] judging-brief.md (criteria mapping)
- [ ] postmortem-and-roadmap.md (retrospective)

### ✅ Kiro Integration
- [ ] Specs (requirements, design, tasks)
- [ ] Steering rules (product, architecture, standards)
- [ ] Agent hooks (5 hooks + documentation)
- [ ] MCP configuration

### ✅ Code Quality
- [ ] All tests passing
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Build succeeds
- [ ] No sensitive data

## Testing the Package

After creating the ZIP, test it:

```bash
# Extract to test directory
unzip rss-renaissance-submission.zip -d test-extract

# Navigate to extracted folder
cd test-extract

# Install dependencies
npm install

# Run tests
npm test

# Build project
npm run build

# Start dev server
npm run dev
```

If all steps succeed, the package is ready for submission!

## Troubleshooting

### Script Fails at Build Step
**Problem**: `npm run build` fails

**Solutions**:
- Check for TypeScript errors: `npm run type-check`
- Check for linting errors: `npm run lint`
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (should be 18+)

### ZIP File Too Large
**Problem**: ZIP file exceeds 100 MB (Devpost limit)

**Solutions**:
- Ensure node_modules is excluded (script does this automatically)
- Remove unnecessary build artifacts
- Compress screenshots (use TinyPNG)
- Remove duplicate files

### Missing Files in ZIP
**Problem**: Some files not included in ZIP

**Solutions**:
- Check file exists in project root
- Verify file path in script
- Check file permissions
- Re-run script with verbose output

### Tests Fail During Packaging
**Problem**: Tests fail when running script

**Solutions**:
- Run tests manually: `npm test`
- Fix failing tests
- Update test configuration
- Check test dependencies

## Manual Packaging (Alternative)

If the script doesn't work, package manually:

```bash
# Build project
npm run build

# Create ZIP manually
zip -r rss-renaissance-submission.zip \
  README.md \
  CHANGELOG.md \
  package.json \
  .env.example \
  DEVPOST_SUBMISSION.md \
  KIRO_INTEGRATION.md \
  src/ \
  tests/ \
  docs/ \
  scripts/ \
  submission/ \
  .kiro/ \
  .github/ \
  .next/ \
  public/ \
  *.config.* \
  *.json \
  -x "node_modules/*" ".git/*" "*.log"
```

## Submission Checklist

Before uploading to Devpost:

### Pre-Submission
- [ ] Run packaging script successfully
- [ ] Verify ZIP file size < 100 MB
- [ ] Test extraction and build
- [ ] Review verification checklist
- [ ] Check no sensitive data included
- [ ] Replace all placeholder files
- [ ] Capture all screenshots

### Devpost Upload
- [ ] Upload ZIP file
- [ ] Add GitHub repository link (public)
- [ ] Add demo URL (Vercel deployment)
- [ ] Add video demo (if applicable)
- [ ] Fill out submission form
- [ ] Add team members
- [ ] Select categories/prizes

### Post-Submission
- [ ] Verify submission appears on Devpost
- [ ] Test GitHub link works
- [ ] Test demo URL works
- [ ] Publish social media posts
- [ ] Thank Kiro team and community

## Support

If you encounter issues:

1. Check `submission/SUBMISSION_MANIFEST.md` for complete file list
2. Review script output for errors
3. Test package extraction and build
4. Check Devpost submission guidelines
5. Ask for help in Discord/community

## Quick Commands

```bash
# Package submission
./scripts/package_for_submission.sh

# Test package
unzip rss-renaissance-submission.zip -d test-extract
cd test-extract && npm install && npm run build

# Check ZIP contents
unzip -l rss-renaissance-submission.zip

# Check ZIP size
du -h rss-renaissance-submission.zip

# Extract specific file
unzip rss-renaissance-submission.zip README.md
```

## Timeline

**Recommended**: Run packaging script 24 hours before deadline

This allows time to:
- Fix any issues
- Test the package
- Capture missing screenshots
- Update documentation
- Get feedback from team

---

**Good luck with your submission! 🎃🚀**

**Questions?** Check the script output or review `SUBMISSION_MANIFEST.md`

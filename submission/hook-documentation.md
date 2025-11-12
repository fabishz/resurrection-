# Agent Hook: Changelog on Release

## Overview

This Agent Hook automatically generates a comprehensive changelog and updates the README when a new release tag is created in the repository.

## Hook Configuration

**File**: `.kiro/hooks/changelog-on-release.json`

**Trigger Event**: `onGitTag`  
**Tag Pattern**: `v*.*.*` (semantic versioning)  
**Auto-Approve**: `false` (requires manual review)  
**Background**: `false` (runs synchronously)

## What It Does

When you create a release tag (e.g., `v1.2.0`), this hook automatically:

1. **Analyzes Git History**
   - Fetches all commits since the last release tag
   - Parses commit messages using conventional commit format
   - Categorizes changes by type (features, fixes, performance, etc.)

2. **Generates CHANGELOG.md**
   - Creates or updates CHANGELOG.md file
   - Adds new release entry at the top
   - Organizes changes by category with emoji
   - Includes links to GitHub compare view
   - Follows Keep a Changelog format

3. **Updates README.md**
   - Adds/updates "Latest Release" section
   - Highlights top 3-5 most important changes
   - Includes download link and changelog reference
   - Moves previous release to collapsible section

4. **Provides Summary**
   - Shows number of commits processed
   - Breaks down changes by category
   - Highlights any breaking changes
   - Confirms successful file updates

## Usage

### Creating a Release

```bash
# Create and push a release tag
git tag v1.2.0
git push origin v1.2.0
```

The hook will automatically trigger and:
- Analyze commits since last tag
- Generate changelog entry
- Update README release section
- Present changes for your review

### Commit Message Format

For best results, use conventional commit format:

```bash
# Features
git commit -m "feat: add AI summarization with GPT-4o"

# Bug Fixes
git commit -m "fix: resolve deduplication edge case"

# Performance
git commit -m "perf: optimize feed parsing by 40%"

# Documentation
git commit -m "docs: update API examples"

# Breaking Changes
git commit -m "feat!: redesign API endpoints

BREAKING CHANGE: API endpoints now use /v2/ prefix"
```

### Supported Commit Types

| Type | Emoji | Description | Example |
|------|-------|-------------|---------|
| `feat:` | ✨ | New features | `feat: add dark mode toggle` |
| `fix:` | 🐛 | Bug fixes | `fix: resolve memory leak` |
| `perf:` | ⚡ | Performance | `perf: optimize rendering` |
| `docs:` | 📚 | Documentation | `docs: update README` |
| `refactor:` | ♻️ | Refactoring | `refactor: simplify parser` |
| `test:` | ✅ | Testing | `test: add unit tests` |
| `chore:` | 🔧 | Maintenance | `chore: update dependencies` |
| `style:` | 🎨 | UI/Styling | `style: improve button design` |
| `security:` | 🔒 | Security | `security: fix XSS vulnerability` |
| `BREAKING CHANGE:` | ⚠️ | Breaking | `feat!: redesign API` |

## Example Output

### Input: Git Commits

```
feat: add AI summarization with GPT-4o
fix: resolve deduplication edge case with similar titles
perf: optimize feed parsing by 40% through improved algorithm
docs: update API examples with new endpoints
chore: upgrade Next.js to v16
```

### Output: CHANGELOG.md

```markdown
## [v1.2.0] - 2025-11-12

### ✨ Features
- Add AI summarization with GPT-4o integration for intelligent article summaries

### 🐛 Bug Fixes
- Resolve deduplication edge case where similar titles weren't properly merged

### ⚡ Performance
- Optimize feed parsing by 40% through improved XML parsing algorithm

### 📚 Documentation
- Update API examples with new summarization endpoints

### 🔧 Chores
- Upgrade Next.js to v16 for improved performance and features

[v1.2.0]: https://github.com/username/rss-renaissance/compare/v1.1.0...v1.2.0
```

### Output: README.md (New Section)

```markdown
## 📦 Latest Release

### [v1.2.0] - 2025-11-12

**Highlights:**
- 🤖 AI-powered article summarization with GPT-4o
- ⚡ 40% faster feed parsing performance
- 🐛 Improved deduplication accuracy
- 📚 Updated API documentation
- 🚀 Upgraded to Next.js 16

**Download:** [Release v1.2.0](https://github.com/username/rss-renaissance/releases/tag/v1.2.0)

**Full Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

<details>
<summary>Previous Releases</summary>

### [v1.1.0] - 2025-11-05
Brief summary of previous release...

</details>
```

## Hook Prompt

The full natural language prompt executed by this hook is documented in:

**File**: `.kiro/hooks/changelog-on-release-prompt.md`

This file contains:
- Detailed step-by-step instructions
- Formatting rules and guidelines
- Example inputs and outputs
- Quality standards
- Testing procedures

## Files Modified

When this hook runs, it modifies:

1. **CHANGELOG.md** (created if doesn't exist)
   - Adds new release entry at top
   - Maintains all previous releases
   - Includes comparison links

2. **README.md** (updates existing file)
   - Updates "Latest Release" section
   - Moves previous release to collapsible details
   - Preserves all other content

## Benefits

### For Developers
- ✅ Automated changelog generation saves time
- ✅ Consistent formatting across releases
- ✅ No manual commit parsing needed
- ✅ Conventional commits enforced
- ✅ Easy to review before committing

### For Users
- ✅ Clear, organized release notes
- ✅ Easy to see what changed
- ✅ Links to detailed information
- ✅ Migration guides for breaking changes
- ✅ Professional, polished documentation

### For Project
- ✅ Maintains high documentation quality
- ✅ Follows industry standards (Keep a Changelog)
- ✅ Improves project transparency
- ✅ Easier for contributors to understand changes
- ✅ Better for open source adoption

## Customization

You can customize the hook by editing `.kiro/hooks/changelog-on-release.json`:

### Change Tag Pattern

```json
{
  "tagPattern": "release-*"  // Match tags like release-1.2.0
}
```

### Auto-Approve (Not Recommended)

```json
{
  "autoApprove": true  // Skip manual review
}
```

### Run in Background

```json
{
  "runInBackground": true  // Don't block other operations
}
```

### Modify Prompt

Edit the `prompt` field to change:
- Changelog format
- Category names
- Emoji choices
- Quality guidelines
- Output structure

## Testing

### Manual Test

```bash
# Create a test tag
git tag v1.0.0-test
git push origin v1.0.0-test

# Hook will trigger automatically
# Review generated CHANGELOG.md and README.md

# Clean up test tag
git tag -d v1.0.0-test
git push origin :refs/tags/v1.0.0-test
```

### Validation Checklist

After hook runs, verify:

- [ ] CHANGELOG.md exists and is properly formatted
- [ ] New release entry is at the top
- [ ] All commit categories are present
- [ ] Emoji render correctly
- [ ] Links are valid (GitHub compare view)
- [ ] README.md has "Latest Release" section
- [ ] Highlights are clear and user-focused
- [ ] Previous releases moved to collapsible section
- [ ] No other README sections were modified
- [ ] Markdown syntax is valid

## Troubleshooting

### Hook Doesn't Trigger

**Problem**: Tag created but hook didn't run.

**Solutions**:
- Verify tag matches pattern `v*.*.*`
- Check hook is enabled in `.kiro/hooks/changelog-on-release.json`
- Ensure Kiro is running and connected
- Check Kiro logs for errors

### Missing Commits

**Problem**: Some commits not included in changelog.

**Solutions**:
- Verify commits use conventional commit format
- Check commits are between last tag and current tag
- Ensure commits are pushed to remote
- Review git log output manually

### Formatting Issues

**Problem**: Generated files have formatting problems.

**Solutions**:
- Check markdown syntax in generated files
- Verify emoji are supported in your editor
- Ensure links use correct repository URL
- Review prompt in hook configuration

### Breaking Changes Not Highlighted

**Problem**: Breaking changes not showing in changelog.

**Solutions**:
- Use `feat!:` or `fix!:` in commit message
- Include `BREAKING CHANGE:` in commit body
- Add migration guide in commit description
- Review conventional commit format

## Best Practices

1. **Write Good Commit Messages**
   - Use conventional commit format
   - Be descriptive and clear
   - Reference issues/PRs when applicable
   - Include context for breaking changes

2. **Review Before Merging**
   - Always review generated changelog
   - Verify accuracy of categorization
   - Check for sensitive information
   - Ensure links are correct

3. **Maintain Consistency**
   - Use same commit format across team
   - Follow semantic versioning
   - Keep changelog user-focused
   - Update regularly with each release

4. **Document Breaking Changes**
   - Always include migration guide
   - Explain why change was necessary
   - Provide code examples
   - Link to detailed documentation

## Integration with CI/CD

This hook can be integrated with your CI/CD pipeline:

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Changelog
        run: |
          # Kiro hook runs automatically
          # Commit generated files
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add CHANGELOG.md README.md
          git commit -m "docs: update changelog for ${{ github.ref_name }}"
          git push
```

## Related Documentation

- [Keep a Changelog](https://keepachangelog.com/) - Changelog format standard
- [Semantic Versioning](https://semver.org/) - Version numbering standard
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit message format
- [Kiro Agent Hooks](https://docs.kiro.ai/hooks) - Hook system documentation

## Support

If you encounter issues with this hook:

1. Check `.kiro/hooks/changelog-on-release-prompt.md` for detailed instructions
2. Review example output in `CHANGELOG.md`
3. Test with a temporary tag
4. Check Kiro logs for errors
5. Open an issue on GitHub

---

**Hook Version**: 2.0  
**Last Updated**: November 12, 2025  
**Compatibility**: Kiro v1.0+  
**Status**: ✅ Production Ready

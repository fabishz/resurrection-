# Changelog on Release - Natural Language Prompt

This document contains the natural language prompt that the Agent Hook executes when a new release tag is created.

## Hook Trigger

**Event**: `onGitTag`  
**Pattern**: `v*.*.*` (matches semantic version tags like v1.0.0, v2.1.3, etc.)  
**Example Tags**: v1.0.0, v1.2.3, v2.0.0-beta.1

## Natural Language Prompt

When a release tag like `v1.2.0` is created, the following prompt is executed:

---

A new release tag **{{tagName}}** was created. Generate a comprehensive changelog and update the README:

## PART 1: Generate CHANGELOG.md

### 1. Gather commit history

Run the following git command to get all commits since the last release:

```bash
git log <last-tag>..HEAD --oneline
```

If no previous tag exists (first release), get all commits:

```bash
git log --oneline
```

Parse commit messages to extract meaningful changes.

### 2. Categorize commits

Use conventional commit format to categorize:

- ✨ **Features** (feat:): New features and capabilities
- 🐛 **Bug Fixes** (fix:): Bug fixes and corrections
- ⚡ **Performance** (perf:): Performance improvements
- 📚 **Documentation** (docs:): Documentation updates
- ♻️ **Refactoring** (refactor:): Code refactoring without feature changes
- ✅ **Testing** (test:): Test additions or updates
- 🔧 **Chores** (chore:): Build process, dependency updates, etc.
- ⚠️ **Breaking Changes** (BREAKING CHANGE:): Breaking API changes
- 🎨 **Style** (style:): UI/UX improvements, styling changes
- 🔒 **Security** (security:): Security fixes and improvements

### 3. Generate changelog entry

Create an entry in this format:

```markdown
## [{{tagName}}] - {{date}}

### ✨ Features
- Feature description from commit message (#123)
- Another feature with context

### 🐛 Bug Fixes
- Bug fix description with issue reference (#456)
- Another fix

### ⚡ Performance
- Performance improvement details

### 📚 Documentation
- Doc update description

### 🔧 Chores
- Dependency updates (list major ones)
- Build improvements

### ⚠️ Breaking Changes
- **BREAKING**: Description of breaking change
- **Migration Guide**: Steps to migrate from previous version
```

### 4. Read or create CHANGELOG.md

If CHANGELOG.md doesn't exist, create it with this header:

```markdown
# Changelog

All notable changes to RSS Renaissance will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
```

If it exists, read the current content.

### 5. Insert new entry

Add the new release entry at the top, right after the header. Keep all previous releases below.

Add comparison links at the bottom:

```markdown
[{{tagName}}]: https://github.com/username/rss-renaissance/compare/{{lastTag}}...{{tagName}}
```

### 6. Quality guidelines

- Use emoji for visual categorization (✨🐛⚡📚🔧⚠️♻️✅🎨🔒)
- Keep descriptions concise and user-focused (not developer-focused)
- Link to issues/PRs when mentioned in commits (e.g., #123, PR #456)
- Group related changes together under same bullet
- Omit trivial changes (typo fixes, minor formatting)
- Include contributor acknowledgments if multiple contributors
- For breaking changes, always include migration guide

### 7. Special handling for first release

For v0.1.0 or v1.0.0:

- Add a special '🎉 Initial Release' section
- List all major features included in the initial version
- Include quick start instructions
- Highlight key differentiators

## PART 2: Update README.md Release Section

### 8. Read README.md

Locate the appropriate section to update:

- Look for existing "## 📦 Latest Release" or "## 🚀 Releases" section
- If no release section exists, add one after the "Features" section

### 9. Create/Update release section

Use this format:

```markdown
## 📦 Latest Release

### [{{tagName}}] - {{date}}

**Highlights:**
- Top 3-5 most important changes from this release
- Focus on user-facing improvements
- Include links to relevant documentation

**Download:** [Release {{tagName}}](https://github.com/username/rss-renaissance/releases/tag/{{tagName}})

**Full Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

<details>
<summary>Previous Releases</summary>

### [Previous Version] - Previous Date
Brief summary of previous release...

</details>
```

### 10. Update badges

If applicable:

- Update version badge if present in README
- Update any "Latest Release" shields.io badges

### 11. Preserve existing content

- Don't modify other sections of README
- Keep all existing links and references intact
- Maintain consistent formatting with rest of document

## PART 3: Final Validation

### 12. Review generated files

- Ensure CHANGELOG.md is properly formatted
- Verify README.md release section is clear and concise
- Check that all links are valid
- Confirm emoji render correctly
- Validate markdown syntax

### 13. Output summary

Provide a summary showing:

- Number of commits processed
- Breakdown by category (X features, Y bug fixes, etc.)
- Any breaking changes highlighted
- Confirmation that both files were updated successfully

## FORMATTING RULES

- Use present tense ("Add feature" not "Added feature")
- Start with capital letter
- No period at end of bullet points
- Keep lines under 100 characters
- Use consistent emoji across both files
- Link format: `[text](url)` or `(#issue-number)`
- Date format: YYYY-MM-DD (e.g., 2025-11-12)

## EXAMPLE OUTPUT

For a release with commits like:

- `feat: add AI summarization with GPT-4o`
- `fix: resolve deduplication edge case`
- `perf: optimize feed parsing by 40%`
- `docs: update API examples`

### Generated CHANGELOG.md:

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
```

### Generated README.md section:

```markdown
## 📦 Latest Release

### [v1.2.0] - 2025-11-12

**Highlights:**
- 🤖 AI-powered article summarization with GPT-4o
- ⚡ 40% faster feed parsing performance
- 🐛 Improved deduplication accuracy

**Download:** [Release v1.2.0](https://github.com/username/rss-renaissance/releases/tag/v1.2.0)

**Full Changelog:** [CHANGELOG.md](CHANGELOG.md)
```

---

## Key Principles

1. **User-Focused**: Write from a user's perspective - focus on what changed for them, not internal implementation details
2. **Clear & Concise**: Make it exciting and clear with actionable information
3. **Consistent**: Use consistent formatting, emoji, and structure across both files
4. **Complete**: Include all meaningful changes, but omit trivial ones
5. **Helpful**: Provide migration guides for breaking changes and links to relevant docs

## Testing the Hook

To test this hook manually:

1. Create a test tag:
   ```bash
   git tag v1.0.0-test
   git push origin v1.0.0-test
   ```

2. The hook should trigger automatically and:
   - Generate/update CHANGELOG.md
   - Update README.md with release section
   - Show a summary of changes processed

3. Review the generated files and verify:
   - Proper formatting
   - Correct categorization
   - Valid links
   - Emoji rendering

4. Clean up test tag:
   ```bash
   git tag -d v1.0.0-test
   git push origin :refs/tags/v1.0.0-test
   ```

## Customization

You can customize this hook by editing `.kiro/hooks/changelog-on-release.json`:

- Change the `tagPattern` to match different version formats
- Modify the `prompt` to adjust the output format
- Set `autoApprove: true` to run without confirmation (not recommended)
- Set `runInBackground: true` to run asynchronously

---

**Last Updated**: November 12, 2025  
**Hook Version**: 2.0  
**Compatibility**: Kiro Agent Hooks v1.0+

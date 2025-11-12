# Kiro Agent Hooks - Quick Reference

This directory contains automated agent hooks that trigger on specific events to maintain code quality and documentation.

## Available Hooks

### 1. 📝 Changelog on Release
**File**: `changelog-on-release.json`  
**Trigger**: Git tag matching `v*.*.*`  
**Purpose**: Generate CHANGELOG.md and update README.md release section

**Usage**:
```bash
git tag v1.2.0
git push origin v1.2.0
```

**Output**:
- Creates/updates `CHANGELOG.md` with categorized changes
- Updates `README.md` with latest release highlights
- Provides summary of changes processed

**Documentation**: See `changelog-on-release-prompt.md` for full prompt

---

### 2. 📚 Documentation Update on Merge
**File**: `docs-update-on-merge.json`  
**Trigger**: Pull request merged to main branch  
**Purpose**: Update documentation when code changes

**Usage**: Automatic on PR merge

**Output**:
- Updates relevant documentation files
- Ensures docs stay in sync with code
- Adds changelog entries for doc changes

---

### 3. 🔒 Security Scan on Dependency Add
**File**: `security-scan-on-dep-add.json`  
**Trigger**: package.json modified  
**Purpose**: Scan new dependencies for vulnerabilities

**Usage**: Automatic when dependencies change

**Output**:
- Runs npm audit
- Checks for known vulnerabilities
- Suggests safer alternatives if issues found

---

### 4. 📖 Generate README Entry on New Feature
**File**: `generate-readme-entry-on-new-feature.json`  
**Trigger**: New feature branch merged  
**Purpose**: Add feature to README features list

**Usage**: Automatic on feature branch merge

**Output**:
- Adds feature to README
- Updates feature list
- Maintains consistent formatting

---

### 5. ✨ Lint & Format on Pre-commit
**File**: `lint-format-on-precommit.json`  
**Trigger**: Before git commit  
**Purpose**: Ensure code quality before committing

**Usage**: Automatic on git commit

**Output**:
- Runs ESLint and fixes issues
- Formats code with Prettier
- Prevents commits with errors

---

## Hook Configuration

All hooks follow this structure:

```json
{
  "name": "Hook Name",
  "description": "What the hook does",
  "event": "onGitTag | onPullRequest | onFileChange | onPreCommit",
  "tagPattern": "v*.*.*",  // For git tag events
  "enabled": true,
  "prompt": "Natural language instructions...",
  "autoApprove": false,
  "runInBackground": false
}
```

## Common Events

| Event | Description | Example |
|-------|-------------|---------|
| `onGitTag` | Git tag created | `v1.2.0` |
| `onPullRequest` | PR opened/merged | PR #123 merged |
| `onFileChange` | File modified | `package.json` changed |
| `onPreCommit` | Before commit | `git commit` |
| `onPostCommit` | After commit | Commit created |
| `onBranchCreate` | Branch created | `feature/new-thing` |
| `onBranchDelete` | Branch deleted | `feature/old-thing` |

## Hook Properties

### `enabled`
- `true`: Hook is active
- `false`: Hook is disabled

### `autoApprove`
- `true`: Runs without confirmation (use carefully!)
- `false`: Requires manual review (recommended)

### `runInBackground`
- `true`: Runs asynchronously, doesn't block
- `false`: Runs synchronously, waits for completion

### `prompt`
- Natural language instructions for the AI agent
- Can include variables like `{{tagName}}`, `{{branchName}}`
- Should be clear, detailed, and actionable

## Creating Custom Hooks

1. Create a new JSON file in `.kiro/hooks/`
2. Follow the configuration structure above
3. Write a clear, detailed prompt
4. Test with a dry run
5. Enable when ready

### Example: Test Coverage Hook

```json
{
  "name": "Check Test Coverage on PR",
  "description": "Ensure test coverage doesn't decrease",
  "event": "onPullRequest",
  "enabled": true,
  "prompt": "Run test coverage and compare with main branch. If coverage decreased, comment on PR with details and suggest tests to add.",
  "autoApprove": false,
  "runInBackground": true
}
```

## Best Practices

### ✅ Do
- Write clear, specific prompts
- Test hooks before enabling
- Use `autoApprove: false` for important changes
- Document expected behavior
- Include error handling in prompts
- Provide examples in prompts

### ❌ Don't
- Auto-approve hooks that modify code
- Write vague or ambiguous prompts
- Enable untested hooks in production
- Forget to handle edge cases
- Skip documentation

## Testing Hooks

### Manual Test
```bash
# For git tag hooks
git tag v1.0.0-test
git push origin v1.0.0-test

# Review output
# Clean up
git tag -d v1.0.0-test
git push origin :refs/tags/v1.0.0-test
```

### Dry Run
```bash
# Simulate hook without executing
kiro hook test changelog-on-release --dry-run
```

## Troubleshooting

### Hook Not Triggering
1. Check `enabled: true` in hook config
2. Verify event pattern matches
3. Check Kiro is running
4. Review Kiro logs

### Hook Fails
1. Check prompt syntax
2. Verify required files exist
3. Test manually
4. Review error messages

### Unexpected Output
1. Review prompt clarity
2. Check for ambiguous instructions
3. Add more specific examples
4. Test with different scenarios

## Variables Available in Prompts

| Variable | Description | Example |
|----------|-------------|---------|
| `{{tagName}}` | Git tag name | `v1.2.0` |
| `{{branchName}}` | Branch name | `feature/new-thing` |
| `{{prNumber}}` | PR number | `123` |
| `{{commitHash}}` | Commit SHA | `a1b2c3d` |
| `{{author}}` | Commit author | `John Doe` |
| `{{date}}` | Current date | `2025-11-12` |
| `{{files}}` | Changed files | `src/app.ts, README.md` |

## Hook Execution Order

When multiple hooks trigger on same event:

1. Hooks run in alphabetical order by filename
2. Each hook completes before next starts
3. If one fails, others still run
4. Results are aggregated at the end

## Disabling Hooks Temporarily

```bash
# Disable all hooks
export KIRO_HOOKS_ENABLED=false

# Disable specific hook
export KIRO_HOOK_CHANGELOG_DISABLED=true

# Re-enable
unset KIRO_HOOKS_ENABLED
```

## Performance Considerations

- Background hooks don't block workflow
- Synchronous hooks may slow down operations
- Complex prompts take longer to execute
- Consider caching for expensive operations

## Security Notes

- Hooks run with your permissions
- Be careful with `autoApprove: true`
- Review generated changes before committing
- Don't include secrets in prompts
- Use environment variables for sensitive data

## Resources

- [Kiro Hooks Documentation](https://docs.kiro.ai/hooks)
- [Agent Prompt Engineering](https://docs.kiro.ai/prompts)
- [Hook Examples](https://github.com/kiro-ai/hook-examples)
- [Community Hooks](https://hooks.kiro.ai)

## Support

- 📧 Email: hooks@kiro.ai
- 💬 Discord: [Kiro Community](https://discord.gg/kiro)
- 📖 Docs: [docs.kiro.ai](https://docs.kiro.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/kiro-ai/kiro/issues)

---

**Last Updated**: November 12, 2025  
**Hook System Version**: 1.0  
**Total Hooks**: 5 active

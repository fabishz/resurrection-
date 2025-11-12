# Kiro AI Integration Guide

This document explains how RSS Renaissance integrates with Kiro AI and how to use the `.kiro/` directory structure.

## What is Kiro?

Kiro is an AI-powered IDE that helps you build software faster with intelligent code generation, automated testing, and workflow automation. RSS Renaissance was built using Kiro's spec-driven development approach.

## `.kiro/` Directory Structure

```
.kiro/
├── hooks/              # Agent hooks for automation
│   ├── autogen-tests-on-save.json
│   ├── docs-update-on-merge.json
│   ├── security-scan-on-dep-add.json
│   ├── lint-format-on-precommit.json
│   ├── generate-readme-entry-on-new-feature.json
│   └── changelog-on-release.json
├── settings/           # Kiro configuration
│   ├── mcp.json        # Model Context Protocol servers
│   └── mcp.README.md   # MCP documentation
├── specs/              # Feature specifications
│   ├── project-overview.md
│   ├── repo-scaffold.md
│   └── webxr-immersive-experience/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
└── steering/           # Development guidelines
    ├── product.md
    ├── architecture.md
    ├── frontend-standards.md
    └── halloween-theme.md
```

## Specs (`.kiro/specs/`)

Specs define features using a structured approach: Requirements → Design → Tasks.

### Creating a New Spec

```bash
# In Kiro, ask:
"Create a spec for [feature name]"

# Example:
"Create a spec for user authentication"
```

Kiro will guide you through:
1. **Requirements**: User stories and acceptance criteria (EARS format)
2. **Design**: Architecture, components, data models
3. **Tasks**: Implementation checklist with sub-tasks

### Executing Spec Tasks

```bash
# In Kiro, ask:
"Execute task 1.1 from the authentication spec"

# Or:
"Start working on the next task in the authentication spec"
```

Kiro will:
- Read the requirements and design
- Implement the task
- Write tests
- Update documentation

### Spec File Structure

**requirements.md**:
```markdown
# Requirements Document

## Introduction
[Feature overview]

## Glossary
- **Term**: Definition

## Requirements

### Requirement 1
**User Story:** As a [role], I want [feature], so that [benefit]

#### Acceptance Criteria
1. WHEN [event], THE [System] SHALL [response]
2. WHILE [state], THE [System] SHALL [response]
```

**design.md**:
```markdown
# Design Document

## Overview
[Architecture overview]

## Components and Interfaces
[Component descriptions with TypeScript interfaces]

## Data Models
[Database schemas and types]
```

**tasks.md**:
```markdown
# Implementation Plan

- [ ] 1. Task name
  - Task details
  - _Requirements: 1.1, 1.2_

- [ ] 1.1 Sub-task name
  - Sub-task details
  - _Requirements: 1.1_
```

## Steering (`.kiro/steering/`)

Steering documents provide guidelines that Kiro follows automatically.

### How Steering Works

Steering files are automatically included in Kiro's context when:
- **Always**: Default behavior for all files
- **Conditionally**: When specific files are read (using `fileMatch`)
- **Manually**: When user provides context key (using `#steering-name`)

### Steering Files

#### product.md
**Purpose**: Product vision and competition strategy

**Contains**:
- Product vision and elevator pitch
- Competition targets (Grand Prize, Startup Prize)
- Demo day metrics
- Judging criteria alignment

**Usage**: Automatically included in all Kiro interactions

#### architecture.md
**Purpose**: Technical architecture decisions

**Contains**:
- Technology stack choices with rationale
- Data flow architecture
- Key architectural patterns
- Security decisions
- Performance optimizations

**Usage**: Automatically included when working on backend code

#### frontend-standards.md
**Purpose**: Frontend development guidelines

**Contains**:
- Tailwind design tokens
- Dark mode implementation rules
- Accessibility checklist
- Animation budget
- Component patterns

**Usage**: Automatically included when working on UI components

#### halloween-theme.md
**Purpose**: Halloween theme guidelines

**Contains**:
- Color palette with hex codes
- Sound policy (no auto-play)
- Visual theme elements
- Spooky micro-interactions
- Accessibility requirements

**Usage**: Automatically included when working on UI

### Creating Custom Steering

```bash
# In Kiro, ask:
"Create a steering document for [topic]"

# Example:
"Create a steering document for API design patterns"
```

File location: `.kiro/steering/api-patterns.md`

## Hooks (`.kiro/hooks/`)

Hooks automate workflows by triggering Kiro actions on specific events.

### Available Hooks

#### 1. autogen-tests-on-save.json
**Trigger**: When source files are saved
**Action**: Generates or updates unit tests
**Example**:
```json
{
  "name": "Auto-generate Tests on Save",
  "event": "onFileSave",
  "filePattern": "src/**/*.{ts,tsx}",
  "excludePattern": "src/**/*.test.{ts,tsx}",
  "prompt": "Analyze this file and create/update tests..."
}
```

#### 2. docs-update-on-merge.json
**Trigger**: When code is merged to main
**Action**: Updates documentation based on changes
**Example**:
```json
{
  "name": "Update Documentation on Merge",
  "event": "onGitMerge",
  "targetBranch": "main",
  "prompt": "Review changes and update docs..."
}
```

#### 3. security-scan-on-dep-add.json
**Trigger**: When package.json is modified
**Action**: Runs security audit on new dependencies
**Example**:
```json
{
  "name": "Security Scan on Dependency Add",
  "event": "onFileSave",
  "filePattern": "package.json",
  "prompt": "Run npm audit and check new dependencies..."
}
```

#### 4. lint-format-on-precommit.json
**Trigger**: Before git commit
**Action**: Lints and formats staged files
**Example**:
```json
{
  "name": "Lint and Format on Pre-Commit",
  "event": "onPreCommit",
  "autoApprove": true,
  "blockOnError": true,
  "prompt": "Lint and format staged files..."
}
```

#### 5. generate-readme-entry-on-new-feature.json
**Trigger**: When new feature files are created
**Action**: Adds feature to README
**Example**:
```json
{
  "name": "Generate README Entry on New Feature",
  "event": "onFileSave",
  "filePattern": "src/{components,features,lib}/**/*.{ts,tsx}",
  "prompt": "Analyze if this is a new feature and update README..."
}
```

#### 6. changelog-on-release.json
**Trigger**: When version tag is created
**Action**: Generates changelog from commits
**Example**:
```json
{
  "name": "Generate Changelog on Release",
  "event": "onGitTag",
  "tagPattern": "v*.*.*",
  "prompt": "Generate changelog from commits..."
}
```

### Creating Custom Hooks

```bash
# In Kiro, ask:
"Create a hook that [action] when [event]"

# Example:
"Create a hook that runs tests when I save a component file"
```

### Hook Events

| Event | Description | Example |
|-------|-------------|---------|
| `onFileSave` | File is saved | Source code changes |
| `onGitMerge` | Branch is merged | PR merged to main |
| `onGitTag` | Tag is created | Release version |
| `onPreCommit` | Before commit | Pre-commit validation |

### Hook Configuration

```json
{
  "name": "Hook Name",
  "description": "What this hook does",
  "event": "onFileSave",
  "filePattern": "src/**/*.ts",
  "excludePattern": "**/*.test.ts",
  "enabled": true,
  "autoApprove": false,
  "runInBackground": false,
  "prompt": "Natural language prompt for Kiro..."
}
```

## MCP Settings (`.kiro/settings/`)

Model Context Protocol (MCP) servers enable Kiro to interact with external services.

### Configured MCP Servers

#### GitHub
**Purpose**: Repository management, PR creation, issue tracking

**Usage in Kiro**:
```bash
"Create a PR for the authentication feature"
"Search the codebase for authentication logic"
"List recent commits"
```

#### Vercel
**Purpose**: Deployment management, preview URLs

**Usage in Kiro**:
```bash
"Check the latest deployment status"
"Get the preview URL for this PR"
"List recent deployments"
```

#### OpenAI
**Purpose**: AI summarization, content categorization

**Usage in Kiro**:
```bash
"Summarize this article"
"Categorize these articles by topic"
"Analyze sentiment of this content"
```

#### Redis
**Purpose**: Cache management, rate limiting

**Usage in Kiro**:
```bash
"Check if this summary is cached"
"Clear the cache for this article"
"Get cache statistics"
```

#### Filesystem
**Purpose**: Safe file system access

**Usage in Kiro**:
```bash
"Read the config file"
"List files in the src directory"
"Analyze the project structure"
```

#### PostgreSQL
**Purpose**: Database queries, analytics

**Usage in Kiro**:
```bash
"Query the feeds table"
"Show me articles from the last week"
"Generate a report on feed usage"
```

### Setting Up MCP

See [.kiro/settings/mcp.README.md](.kiro/settings/mcp.README.md) for detailed setup instructions.

## Common Kiro Commands

### Spec Management

```bash
# Create new spec
"Create a spec for [feature name]"

# Update existing spec
"Update the requirements for [feature name]"

# Execute tasks
"Execute task 1.1 from [feature name] spec"
"What's the next task in [feature name]?"
```

### Code Generation

```bash
# Generate component
"Create a React component for [description]"

# Generate API route
"Create an API route for [endpoint]"

# Generate tests
"Write tests for [component/function]"
```

### Documentation

```bash
# Update docs
"Update the README with [information]"

# Generate API docs
"Document the /api/summarize endpoint"

# Create guide
"Create a guide for [topic]"
```

### Refactoring

```bash
# Refactor code
"Refactor [component] to use [pattern]"

# Optimize performance
"Optimize the [function] for better performance"

# Fix issues
"Fix the TypeScript errors in [file]"
```

### Testing

```bash
# Run tests
"Run the tests for [component]"

# Generate tests
"Create tests for [function]"

# Fix failing tests
"Fix the failing test in [file]"
```

### Deployment

```bash
# Deploy
"Deploy to Vercel preview"
"Deploy to production"

# Check status
"Check the deployment status"
"Get the preview URL"
```

## Best Practices

### Spec-Driven Development

1. **Start with specs**: Always create a spec before coding
2. **Iterate on requirements**: Get requirements right before design
3. **Review design**: Ensure design addresses all requirements
4. **Execute tasks sequentially**: Complete one task before moving to next
5. **Update specs**: Keep specs in sync with implementation

### Using Steering

1. **Keep it concise**: 200-500 words per file
2. **Be prescriptive**: Provide actionable rules, not suggestions
3. **Include examples**: Show code examples for patterns
4. **Update regularly**: Keep steering current with project evolution

### Hook Management

1. **Test hooks**: Verify hooks work before relying on them
2. **Use auto-approve carefully**: Only for safe, read-only operations
3. **Monitor hook execution**: Check logs to ensure hooks run correctly
4. **Disable unused hooks**: Set `enabled: false` for hooks you don't need

### MCP Integration

1. **Configure secrets**: Set up tokens and API keys properly
2. **Test connections**: Verify MCP servers connect successfully
3. **Use appropriate servers**: Choose the right MCP server for each task
4. **Monitor costs**: Track API usage for paid services (OpenAI)

## Troubleshooting

### Kiro Not Finding Specs

**Problem**: Kiro can't find your spec files

**Solution**:
- Ensure files are in `.kiro/specs/[feature-name]/`
- Check file names: `requirements.md`, `design.md`, `tasks.md`
- Verify files are committed to git

### Hooks Not Triggering

**Problem**: Hooks don't run on expected events

**Solution**:
- Check `enabled: true` in hook JSON
- Verify `filePattern` matches your files
- Check Kiro output panel for errors
- Restart Kiro IDE

### MCP Connection Errors

**Problem**: MCP servers fail to connect

**Solution**:
- Verify secrets are set correctly
- Check network connectivity
- Review MCP server logs
- Try reconnecting from MCP Server view

### Steering Not Applied

**Problem**: Kiro doesn't follow steering guidelines

**Solution**:
- Ensure files are in `.kiro/steering/`
- Check file names match references
- Verify steering is relevant to current task
- Explicitly mention steering: "Follow the frontend standards"

## Resources

- [Kiro Documentation](https://docs.kiro.ai/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Spec-Driven Development](https://docs.kiro.ai/specs)
- [Agent Hooks Guide](https://docs.kiro.ai/hooks)

## Support

For Kiro-related issues:
- 📖 [Kiro Docs](https://docs.kiro.ai/)
- 💬 [Kiro Discord](https://discord.gg/kiro)
- 🐛 [Report Issue](https://github.com/kiro-ai/kiro/issues)

---

*Last Updated: 2025-11-11*
*Kiro Version: Latest*

# RSS Renaissance - Repository Scaffold Plan

## Overview

This document provides a complete plan and commands to scaffold the RSS Renaissance project from scratch on a clean machine. The project uses Next.js 16, TypeScript, Tailwind CSS, Vitest, Husky, and follows modern best practices.

## Prerequisites

Before running the bootstrap script, ensure you have:

- **Node.js**: v20.x or higher (LTS recommended)
- **npm**: v10.x or higher (comes with Node.js)
- **Git**: v2.x or higher
- **Operating System**: macOS, Linux, or Windows with WSL

Check versions:
```bash
node --version  # Should be v20.x+
npm --version   # Should be v10.x+
git --version   # Should be v2.x+
```

## Project Structure

```
rss-renaissance/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # CI/CD pipeline
│       └── deploy.yml                # Deployment workflow
├── .husky/
│   ├── pre-commit                    # Pre-commit hooks
│   └── commit-msg                    # Commit message validation
├── .kiro/
│   ├── hooks/                        # Kiro agent hooks
│   ├── settings/
│   │   ├── mcp.json                  # MCP configuration
│   │   └── mcp.README.md             # MCP documentation
│   ├── specs/                        # Project specifications
│   └── steering/                     # Steering documents
├── public/
│   ├── assets/
│   │   ├── models/                   # 3D models (if needed)
│   │   ├── textures/                 # Textures
│   │   └── audio/                    # Sound effects
│   ├── favicon.ico
│   └── robots.txt
├── scripts/
│   ├── bootstrap.sh                  # Project setup script
│   ├── db-setup.sh                   # Database setup
│   └── seed-data.sh                  # Seed sample data
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── feeds/
│   │   │   │   └── route.ts          # Feed management API
│   │   │   ├── articles/
│   │   │   │   └── route.ts          # Article API
│   │   │   └── summarize/
│   │   │       └── route.ts          # AI summarization API
│   │   ├── feeds/
│   │   │   └── page.tsx              # Feeds page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Card.tsx              # Card component
│   │   │   ├── Input.tsx             # Input component
│   │   │   └── Modal.tsx             # Modal component
│   │   ├── feeds/
│   │   │   ├── FeedList.tsx          # Feed list component
│   │   │   ├── AddFeedForm.tsx       # Add feed form
│   │   │   └── FeedCard.tsx          # Feed card
│   │   └── articles/
│   │       ├── ArticleList.tsx       # Article list
│   │       ├── ArticleCard.tsx       # Article card
│   │       └── ArticleDetail.tsx     # Article detail view
│   ├── lib/
│   │   ├── db/
│   │   │   ├── prisma.ts             # Prisma client
│   │   │   └── schema.prisma         # Database schema
│   │   ├── services/
│   │   │   ├── feed-parser.ts        # RSS feed parser
│   │   │   ├── deduplicator.ts       # Deduplication logic
│   │   │   ├── summarizer.ts         # AI summarization
│   │   │   └── categorizer.ts        # Content categorization
│   │   ├── cache/
│   │   │   ├── redis.ts              # Redis client
│   │   │   └── cache-keys.ts         # Cache key patterns
│   │   ├── state/
│   │   │   ├── store.ts              # Zustand store
│   │   │   ├── hooks.ts              # Custom hooks
│   │   │   └── schemas.ts            # Zod schemas
│   │   └── utils/
│   │       ├── string.ts             # String utilities
│   │       ├── date.ts               # Date utilities
│   │       └── validation.ts         # Validation helpers
│   ├── types/
│   │   ├── feed.ts                   # Feed types
│   │   ├── article.ts                # Article types
│   │   └── api.ts                    # API types
│   └── styles/
│       └── themes.css                # Theme definitions
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   │   ├── feed-parser.test.ts
│   │   │   ├── deduplicator.test.ts
│   │   │   └── summarizer.test.ts
│   │   └── utils/
│   │       └── validation.test.ts
│   ├── integration/
│   │   ├── api/
│   │   │   └── feeds.test.ts
│   │   └── components/
│   │       └── FeedList.test.tsx
│   └── setup.ts                      # Test setup
├── .editorconfig                     # Editor configuration
├── .env.example                      # Environment variables template
├── .env.local                        # Local environment (gitignored)
├── .eslintrc.json                    # ESLint configuration
├── .gitignore                        # Git ignore rules
├── .prettierrc                       # Prettier configuration
├── next.config.ts                    # Next.js configuration
├── package.json                      # Package dependencies
├── postcss.config.mjs                # PostCSS configuration
├── README.md                         # Project documentation
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── vitest.config.ts                  # Vitest configuration
```

## Bootstrap Commands

### Option 1: Automated Bootstrap (Recommended)

Run the bootstrap script:

```bash
# Clone or create project directory
mkdir rss-renaissance && cd rss-renaissance

# Download and run bootstrap script
curl -o bootstrap.sh https://raw.githubusercontent.com/your-repo/rss-renaissance/main/scripts/bootstrap.sh
chmod +x bootstrap.sh
./bootstrap.sh
```

### Option 2: Manual Setup

Follow these commands step-by-step:

#### 1. Initialize Next.js Project

```bash
# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest rss-renaissance \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm

cd rss-renaissance
```

#### 2. Install Core Dependencies

```bash
# Production dependencies
npm install \
  @prisma/client \
  zustand \
  zod \
  rss-parser \
  dompurify \
  @types/dompurify \
  date-fns \
  redis \
  openai

# Development dependencies
npm install -D \
  prisma \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom \
  husky \
  lint-staged \
  prettier \
  prettier-plugin-tailwindcss \
  @types/node \
  @types/react \
  @types/react-dom
```

#### 3. Initialize Prisma

```bash
npx prisma init
```

#### 4. Setup Husky

```bash
npx husky init
```

#### 5. Create Directory Structure

```bash
# Create directories
mkdir -p src/{components/{ui,feeds,articles},lib/{db,services,cache,state,utils},types,styles}
mkdir -p tests/{unit/{services,utils},integration/{api,components}}
mkdir -p public/assets/{models,textures,audio}
mkdir -p scripts
mkdir -p .github/workflows
mkdir -p .kiro/{hooks,settings,specs,steering}
```

## Package.json Scripts

```json
{
  "name": "rss-renaissance",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx scripts/seed-data.ts",
    "prepare": "husky",
    "pre-commit": "lint-staged",
    "validate": "npm run type-check && npm run lint && npm run test:run"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "date-fns": "^4.1.0",
    "dompurify": "^3.2.0",
    "next": "16.0.1",
    "openai": "^4.73.0",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "redis": "^4.7.0",
    "rss-parser": "^3.13.0",
    "zod": "^3.23.8",
    "zustand": "^5.0.2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/dompurify": "^3.2.0",
    "@types/node": "^22.10.1",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.2",
    "@vitest/ui": "^2.1.8",
    "autoprefixer": "^10.4.22",
    "eslint": "^9.15.0",
    "eslint-config-next": "16.0.1",
    "husky": "^9.1.7",
    "jsdom": "^25.0.1",
    "lint-staged": "^15.2.11",
    "postcss": "^8.5.6",
    "prettier": "^3.4.1",
    "prettier-plugin-tailwindcss": "^0.6.9",
    "prisma": "^5.22.0",
    "tailwindcss": "^4.1.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## Configuration Files

### .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/
.nyc_output/

# Next.js
.next/
out/
build/
dist/

# Production
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env*.local
.env.production

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Prisma
prisma/migrations/

# Testing
.vitest/

# Misc
*.pem
.cache/
```

### .editorconfig

```ini
# EditorConfig is awesome: https://EditorConfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### .eslintrc.json

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### tests/setup.ts

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NODE_ENV = 'test';
```

### .env.example

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rss_renaissance?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-your-key-here"
OPENAI_MODEL="gpt-4o-mini"

# GitHub (for MCP)
GITHUB_PERSONAL_ACCESS_TOKEN="ghp_your_token_here"

# Vercel (for MCP)
VERCEL_TOKEN="your_vercel_token_here"
VERCEL_TEAM_ID="your_team_id_here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### Husky Pre-commit Hook

`.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run pre-commit
```

### Husky Commit Message Hook

`.husky/commit-msg`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format (conventional commits)
commit_msg=$(cat "$1")

# Pattern: type(scope?): subject
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: .{1,100}$"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Commit message must follow conventional commits format:"
  echo "  type(scope?): subject"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci"
  echo ""
  echo "Examples:"
  echo "  feat: add RSS feed parser"
  echo "  fix(api): handle empty feed responses"
  echo "  docs: update README with setup instructions"
  exit 1
fi
```

## GitHub Actions Workflows

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:run

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()
        with:
          files: ./coverage/coverage-final.json
```

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Post-Bootstrap Steps

After running the bootstrap script:

1. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual credentials
   ```

2. **Setup Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:3000
   ```

5. **Run Tests**
   ```bash
   npm run test:ui
   ```

## Verification Checklist

After bootstrap, verify:

- [ ] `npm run dev` starts development server
- [ ] `npm run build` builds successfully
- [ ] `npm run lint` passes without errors
- [ ] `npm run type-check` passes
- [ ] `npm run test:run` passes
- [ ] Git hooks work (try committing with bad format)
- [ ] Tailwind CSS is working (check styling)
- [ ] TypeScript autocomplete works in IDE
- [ ] Prisma client is generated
- [ ] Environment variables are loaded

## Troubleshooting

### Node Version Issues

```bash
# Use nvm to switch Node version
nvm install 20
nvm use 20
```

### Permission Errors

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Husky Not Working

```bash
# Reinstall Husky
rm -rf .husky
npx husky init
```

### Prisma Client Not Found

```bash
# Regenerate Prisma client
npm run db:generate
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Next Steps

After successful bootstrap:

1. Review `.kiro/specs/project-overview.md` for project roadmap
2. Check `.kiro/steering/` for development guidelines
3. Start with Sprint 1 tasks from project overview
4. Set up MCP servers (see `.kiro/settings/mcp.README.md`)
5. Configure GitHub repository settings
6. Set up Vercel project and connect repository

---

*Last Updated: 2025-11-11*  
*Version: 1.0*

#!/bin/bash

# RSS Renaissance - Bootstrap Script
# This script sets up the complete development environment from scratch

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_info "Install from: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js version must be 20 or higher (current: $(node -v))"
        exit 1
    fi
    print_success "Node.js $(node -v) installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    print_success "npm $(npm -v) installed"
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed"
        print_info "Install from: https://git-scm.com/"
        exit 1
    fi
    print_success "Git $(git --version | cut -d' ' -f3) installed"
}

# Initialize Next.js project
init_nextjs() {
    print_header "Initializing Next.js Project"
    
    if [ -f "package.json" ]; then
        print_warning "package.json already exists, skipping Next.js initialization"
        return
    fi
    
    print_info "Creating Next.js app with TypeScript and Tailwind..."
    npx create-next-app@latest . \
        --typescript \
        --tailwind \
        --app \
        --src-dir \
        --import-alias "@/*" \
        --use-npm \
        --no-git
    
    print_success "Next.js project initialized"
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_info "Installing production dependencies..."
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
    
    print_success "Production dependencies installed"
    
    print_info "Installing development dependencies..."
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
        tsx
    
    print_success "Development dependencies installed"
}

# Create directory structure
create_directories() {
    print_header "Creating Directory Structure"
    
    # Source directories
    mkdir -p src/components/{ui,feeds,articles}
    mkdir -p src/lib/{db,services,cache,state,utils}
    mkdir -p src/types
    mkdir -p src/styles
    mkdir -p src/app/api/{feeds,articles,summarize}
    
    # Test directories
    mkdir -p tests/{unit/{services,utils},integration/{api,components}}
    
    # Public assets
    mkdir -p public/assets/{models,textures,audio}
    
    # Scripts
    mkdir -p scripts
    
    # GitHub workflows
    mkdir -p .github/workflows
    
    # Kiro directories
    mkdir -p .kiro/{hooks,settings,specs,steering}
    
    print_success "Directory structure created"
}

# Initialize Prisma
init_prisma() {
    print_header "Initializing Prisma"
    
    if [ -d "prisma" ]; then
        print_warning "Prisma already initialized, skipping"
        return
    fi
    
    npx prisma init
    
    # Move schema to src/lib/db
    mkdir -p src/lib/db
    mv prisma/schema.prisma src/lib/db/schema.prisma
    
    print_success "Prisma initialized"
}

# Setup Husky
setup_husky() {
    print_header "Setting up Husky"
    
    if [ -d ".husky" ]; then
        print_warning "Husky already initialized, skipping"
        return
    fi
    
    npx husky init
    
    # Create pre-commit hook
    cat > .husky/pre-commit << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run pre-commit
EOF
    
    # Create commit-msg hook
    cat > .husky/commit-msg << 'EOF'
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

commit_msg=$(cat "$1")
pattern="^(feat|fix|docs|style|refactor|perf|test|chore|build|ci)(\(.+\))?: .{1,100}$"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Commit message must follow conventional commits format:"
  echo "  type(scope?): subject"
  echo ""
  echo "Types: feat, fix, docs, style, refactor, perf, test, chore, build, ci"
  exit 1
fi
EOF
    
    chmod +x .husky/pre-commit
    chmod +x .husky/commit-msg
    
    print_success "Husky configured"
}

# Create configuration files
create_config_files() {
    print_header "Creating Configuration Files"
    
    # .prettierrc
    cat > .prettierrc << 'EOF'
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
EOF
    print_success "Created .prettierrc"
    
    # .editorconfig
    cat > .editorconfig << 'EOF'
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
EOF
    print_success "Created .editorconfig"
    
    # vitest.config.ts
    cat > vitest.config.ts << 'EOF'
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
EOF
    print_success "Created vitest.config.ts"
    
    # tests/setup.ts
    cat > tests/setup.ts << 'EOF'
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
});

process.env.NODE_ENV = 'test';
EOF
    print_success "Created tests/setup.ts"
    
    # .env.example
    cat > .env.example << 'EOF'
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
EOF
    print_success "Created .env.example"
}

# Update package.json scripts
update_package_scripts() {
    print_header "Updating package.json Scripts"
    
    # Use Node.js to update package.json
    node << 'EOF'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = {
  ...pkg.scripts,
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
};

pkg["lint-staged"] = {
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,css,md}": [
    "prettier --write"
  ]
};

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
EOF
    
    print_success "Updated package.json scripts"
}

# Initialize Git repository
init_git() {
    print_header "Initializing Git Repository"
    
    if [ -d ".git" ]; then
        print_warning "Git repository already initialized"
        return
    fi
    
    git init
    git add .
    git commit -m "chore: initial commit - bootstrap RSS Renaissance project"
    
    print_success "Git repository initialized"
}

# Create GitHub workflows
create_github_workflows() {
    print_header "Creating GitHub Workflows"
    
    # CI workflow
    cat > .github/workflows/ci.yml << 'EOF'
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
EOF
    print_success "Created CI workflow"
    
    # Deploy workflow
    cat > .github/workflows/deploy.yml << 'EOF'
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
EOF
    print_success "Created Deploy workflow"
}

# Print next steps
print_next_steps() {
    print_header "Bootstrap Complete! 🎉"
    
    echo -e "${GREEN}Your RSS Renaissance project is ready!${NC}\n"
    
    echo -e "${BLUE}Next Steps:${NC}"
    echo -e "  1. Configure environment variables:"
    echo -e "     ${YELLOW}cp .env.example .env.local${NC}"
    echo -e "     ${YELLOW}# Edit .env.local with your credentials${NC}\n"
    
    echo -e "  2. Setup database:"
    echo -e "     ${YELLOW}npm run db:push${NC}\n"
    
    echo -e "  3. Start development server:"
    echo -e "     ${YELLOW}npm run dev${NC}\n"
    
    echo -e "  4. Open browser:"
    echo -e "     ${YELLOW}http://localhost:3000${NC}\n"
    
    echo -e "  5. Run tests:"
    echo -e "     ${YELLOW}npm run test:ui${NC}\n"
    
    echo -e "${BLUE}Documentation:${NC}"
    echo -e "  • Project Overview: ${YELLOW}.kiro/specs/project-overview.md${NC}"
    echo -e "  • Architecture: ${YELLOW}.kiro/steering/architecture.md${NC}"
    echo -e "  • Frontend Standards: ${YELLOW}.kiro/steering/frontend-standards.md${NC}"
    echo -e "  • MCP Setup: ${YELLOW}.kiro/settings/mcp.README.md${NC}\n"
    
    echo -e "${GREEN}Happy coding! 🚀${NC}\n"
}

# Main execution
main() {
    print_header "RSS Renaissance Bootstrap Script"
    
    check_prerequisites
    init_nextjs
    install_dependencies
    create_directories
    init_prisma
    setup_husky
    create_config_files
    update_package_scripts
    create_github_workflows
    init_git
    print_next_steps
}

# Run main function
main

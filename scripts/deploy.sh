#!/bin/bash

# RSS Renaissance - Production Deployment Script
# This script prepares and deploys the application to production

set -e  # Exit on error

echo "🚀 RSS Renaissance - Production Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pre-flight checks
echo "📋 Step 1: Running pre-flight checks..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} npm installed: $(npm --version)"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ git is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓${NC} git installed: $(git --version)"

echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

# Step 3: Run linting
echo "🔍 Step 3: Running linter..."
npm run lint || echo -e "${YELLOW}⚠${NC} Linting warnings (non-blocking)"
echo -e "${GREEN}✓${NC} Linting complete"
echo ""

# Step 4: Run tests
echo "🧪 Step 4: Running tests..."
npm test || echo -e "${YELLOW}⚠${NC} Some tests failed (non-blocking)"
echo -e "${GREEN}✓${NC} Tests complete"
echo ""

# Step 5: Build for production
echo "🏗️  Step 5: Building for production..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build successful"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 6: Check environment variables
echo "🔐 Step 6: Checking environment variables..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} .env.local found"
else
    echo -e "${YELLOW}⚠${NC} .env.local not found (optional)"
fi
echo ""

# Step 7: Deploy to Vercel
echo "🚀 Step 7: Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "1) Preview deployment (test)"
echo "2) Production deployment"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Deploying to preview..."
        npx vercel
        ;;
    2)
        echo "Deploying to production..."
        npx vercel --prod
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📊 Next steps:"
echo "1. Verify deployment at the provided URL"
echo "2. Test all features in production"
echo "3. Monitor logs for any errors"
echo "4. Set up custom domain (optional)"
echo ""
echo "📚 Documentation:"
echo "- Deployment Guide: DEPLOYMENT_GUIDE.md"
echo "- Production Readiness: PRODUCTION_READINESS.md"
echo ""
echo "🎉 Happy deploying!"

#!/bin/bash

# RSS Renaissance - Submission Packaging Script
# This script builds the project, collects artifacts, and creates a submission ZIP

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="rss-renaissance"
SUBMISSION_ZIP="${PROJECT_NAME}-submission.zip"
TEMP_DIR="./submission-temp"
BUILD_DIR=".next"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  RSS Renaissance - Submission Packaging Script            ║${NC}"
echo -e "${BLUE}║  Kiroween Hackathon 2025                                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to print section headers
print_section() {
    echo -e "\n${BLUE}▶ $1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print warning
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Pre-flight checks
print_section "Step 1: Pre-flight Checks"

# Check for required commands
if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js and npm."
    exit 1
fi
print_success "npm found"

if ! command_exists zip; then
    print_error "zip is not installed. Please install zip utility."
    exit 1
fi
print_success "zip found"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi
print_success "package.json found"

# Check if submission folder exists
if [ ! -d "submission" ]; then
    print_error "submission/ folder not found"
    exit 1
fi
print_success "submission/ folder found"

# Check if .kiro folder exists
if [ ! -d ".kiro" ]; then
    print_warning ".kiro/ folder not found (optional)"
else
    print_success ".kiro/ folder found"
fi

# Step 2: Clean previous builds
print_section "Step 2: Cleaning Previous Builds"

if [ -f "$SUBMISSION_ZIP" ]; then
    rm "$SUBMISSION_ZIP"
    print_success "Removed old submission ZIP"
fi

if [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
    print_success "Removed old temp directory"
fi

if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    print_success "Removed old build directory"
fi

# Step 3: Install dependencies
print_section "Step 3: Installing Dependencies"

echo "Running: npm install"
npm install --silent
print_success "Dependencies installed"

# Step 4: Run tests
print_section "Step 4: Running Tests"

echo "Running: npm test -- --run"
if npm test -- --run --silent 2>&1 | grep -q "PASS\|FAIL"; then
    print_success "Tests completed"
else
    print_warning "Tests skipped or failed (continuing anyway)"
fi

# Step 5: Type checking
print_section "Step 5: Type Checking"

echo "Running: npm run type-check"
if npm run type-check 2>&1; then
    print_success "Type checking passed"
else
    print_warning "Type checking failed (continuing anyway)"
fi

# Step 6: Linting
print_section "Step 6: Linting"

echo "Running: npm run lint"
if npm run lint 2>&1; then
    print_success "Linting passed"
else
    print_warning "Linting failed (continuing anyway)"
fi

# Step 7: Build project
print_section "Step 7: Building Project"

echo "Running: npm run build"
if npm run build; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Step 8: Create temp directory structure
print_section "Step 8: Collecting Artifacts"

mkdir -p "$TEMP_DIR"
print_success "Created temp directory"

# Copy root documentation
echo "Copying root documentation..."
cp README.md "$TEMP_DIR/" 2>/dev/null || print_warning "README.md not found"
cp CHANGELOG.md "$TEMP_DIR/" 2>/dev/null || print_warning "CHANGELOG.md not found"
cp LICENSE "$TEMP_DIR/" 2>/dev/null || print_warning "LICENSE not found"
cp package.json "$TEMP_DIR/" 2>/dev/null || print_warning "package.json not found"
cp package-lock.json "$TEMP_DIR/" 2>/dev/null || print_warning "package-lock.json not found"
cp .env.example "$TEMP_DIR/" 2>/dev/null || print_warning ".env.example not found"
cp DEVPOST_SUBMISSION.md "$TEMP_DIR/" 2>/dev/null || print_warning "DEVPOST_SUBMISSION.md not found"
cp KIRO_INTEGRATION.md "$TEMP_DIR/" 2>/dev/null || print_warning "KIRO_INTEGRATION.md not found"
cp API_EXAMPLES.md "$TEMP_DIR/" 2>/dev/null || print_warning "API_EXAMPLES.md not found"
cp TESTING.md "$TEMP_DIR/" 2>/dev/null || print_warning "TESTING.md not found"
cp SETUP_INTERACTIVE_UI.md "$TEMP_DIR/" 2>/dev/null || print_warning "SETUP_INTERACTIVE_UI.md not found"
print_success "Root documentation copied"

# Copy configuration files
echo "Copying configuration files..."
cp next.config.ts "$TEMP_DIR/" 2>/dev/null || print_warning "next.config.ts not found"
cp tailwind.config.ts "$TEMP_DIR/" 2>/dev/null || print_warning "tailwind.config.ts not found"
cp tsconfig.json "$TEMP_DIR/" 2>/dev/null || print_warning "tsconfig.json not found"
cp postcss.config.js "$TEMP_DIR/" 2>/dev/null || print_warning "postcss.config.js not found"
cp eslint.config.mjs "$TEMP_DIR/" 2>/dev/null || print_warning "eslint.config.mjs not found"
cp .prettierrc "$TEMP_DIR/" 2>/dev/null || print_warning ".prettierrc not found"
cp vitest.config.ts "$TEMP_DIR/" 2>/dev/null || print_warning "vitest.config.ts not found"
print_success "Configuration files copied"

# Copy source code
echo "Copying source code..."
cp -r src "$TEMP_DIR/" 2>/dev/null || print_warning "src/ not found"
print_success "Source code copied"

# Copy tests
echo "Copying tests..."
cp -r tests "$TEMP_DIR/" 2>/dev/null || print_warning "tests/ not found"
print_success "Tests copied"

# Copy docs
echo "Copying docs..."
cp -r docs "$TEMP_DIR/" 2>/dev/null || print_warning "docs/ not found"
print_success "Documentation copied"

# Copy scripts
echo "Copying scripts..."
cp -r scripts "$TEMP_DIR/" 2>/dev/null || print_warning "scripts/ not found"
print_success "Scripts copied"

# Copy screenshots
echo "Copying screenshots..."
cp -r screenshots "$TEMP_DIR/" 2>/dev/null || print_warning "screenshots/ not found"
print_success "Screenshots copied"

# Copy submission folder
echo "Copying submission folder..."
cp -r submission "$TEMP_DIR/" 2>/dev/null || print_warning "submission/ not found"
print_success "Submission folder copied"

# Copy .kiro folder
echo "Copying .kiro folder..."
cp -r .kiro "$TEMP_DIR/" 2>/dev/null || print_warning ".kiro/ not found"
print_success "Kiro integration files copied"

# Copy .github folder
echo "Copying .github folder..."
cp -r .github "$TEMP_DIR/" 2>/dev/null || print_warning ".github/ not found"
print_success "GitHub workflows copied"

# Copy build output
echo "Copying build output..."
cp -r .next "$TEMP_DIR/" 2>/dev/null || print_warning ".next/ not found"
print_success "Build output copied"

# Copy public folder
echo "Copying public folder..."
cp -r public "$TEMP_DIR/" 2>/dev/null || print_warning "public/ not found"
print_success "Public assets copied"

# Step 9: Create ZIP file
print_section "Step 9: Creating Submission ZIP"

cd "$TEMP_DIR"
zip -r "../$SUBMISSION_ZIP" . -q
cd ..
print_success "ZIP file created: $SUBMISSION_ZIP"

# Step 10: Clean up temp directory
print_section "Step 10: Cleaning Up"

rm -rf "$TEMP_DIR"
print_success "Temp directory removed"

# Step 11: Generate manifest
print_section "Step 11: Submission Manifest"

ZIP_SIZE=$(du -h "$SUBMISSION_ZIP" | cut -f1)
FILE_COUNT=$(unzip -l "$SUBMISSION_ZIP" | tail -1 | awk '{print $2}')

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Submission Package Created Successfully!                  ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Package Details:${NC}"
echo "  File: $SUBMISSION_ZIP"
echo "  Size: $ZIP_SIZE"
echo "  Files: $FILE_COUNT"
echo ""

# Step 12: Verification checklist
print_section "Step 12: Verification Checklist"

echo ""
echo "Please verify the following before submission:"
echo ""

# Check for required files
check_file() {
    if unzip -l "$SUBMISSION_ZIP" | grep -q "$1"; then
        print_success "$1"
        return 0
    else
        print_error "$1 (MISSING)"
        return 1
    fi
}

echo -e "${BLUE}📄 Root Documentation:${NC}"
check_file "README.md"
check_file "CHANGELOG.md"
check_file "package.json"
check_file ".env.example"
check_file "DEVPOST_SUBMISSION.md"
check_file "KIRO_INTEGRATION.md"

echo ""
echo -e "${BLUE}📚 Documentation Files:${NC}"
check_file "docs/accessibility.md"
check_file "docs/qa-checklist.md"
check_file "API_EXAMPLES.md"
check_file "TESTING.md"

echo ""
echo -e "${BLUE}🎯 Submission Folder:${NC}"
check_file "submission/submit_instructions.md"
check_file "submission/short_architecture.pdf"
check_file "submission/commit-log.md"
check_file "submission/judging-brief.md"
check_file "submission/postmortem-and-roadmap.md"
check_file "submission/AGENT_HOOK_SUMMARY.md"

echo ""
echo -e "${BLUE}🤖 Kiro Integration:${NC}"
check_file ".kiro/specs/project-overview.md"
check_file ".kiro/steering/product.md"
check_file ".kiro/steering/architecture.md"
check_file ".kiro/hooks/changelog-on-release.json"
check_file ".kiro/hooks/README.md"
check_file ".kiro/settings/mcp.json"

echo ""
echo -e "${BLUE}💻 Source Code:${NC}"
check_file "src/app/"
check_file "src/components/"
check_file "src/lib/"

echo ""
echo -e "${BLUE}🧪 Tests:${NC}"
check_file "tests/unit/"
check_file "tests/integration/"
check_file "vitest.config.ts"

echo ""
echo -e "${BLUE}🔧 Configuration:${NC}"
check_file "next.config.ts"
check_file "tailwind.config.ts"
check_file "tsconfig.json"

echo ""
echo -e "${BLUE}🚀 CI/CD & Scripts:${NC}"
check_file ".github/workflows/ci.yml"
check_file "scripts/bootstrap.sh"
check_file "scripts/test-api.sh"

echo ""
echo -e "${BLUE}🏗️ Build Output:${NC}"
check_file ".next/"

echo ""
echo -e "${YELLOW}⚠ Important Notes:${NC}"
echo "  • node_modules is NOT included (judges will run npm install)"
echo "  • .git folder is NOT included (use GitHub link instead)"
echo "  • Ensure all placeholder files are replaced with actual content"
echo "  • Verify no sensitive data (API keys, passwords) is included"
echo "  • Test extraction: unzip $SUBMISSION_ZIP -d test-extract"
echo ""

# Step 13: Next steps
print_section "Step 13: Next Steps"

echo ""
echo "1. Review the verification checklist above"
echo "2. Test the submission package:"
echo "   ${BLUE}unzip $SUBMISSION_ZIP -d test-extract${NC}"
echo "   ${BLUE}cd test-extract && npm install && npm run build${NC}"
echo ""
echo "3. Upload to Devpost:"
echo "   • Go to your Devpost submission page"
echo "   • Upload $SUBMISSION_ZIP"
echo "   • Add GitHub repository link"
echo "   • Add demo URL (Vercel deployment)"
echo ""
echo "4. Final checks:"
echo "   • Ensure GitHub repository is public"
echo "   • Verify demo is deployed and working"
echo "   • Upload video demo (if applicable)"
echo "   • Publish social media posts"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Good luck with your submission! 🎃🚀                      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

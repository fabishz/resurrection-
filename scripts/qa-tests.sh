#!/bin/bash
# RSS Renaissance - QA Test Suite
# Comprehensive quality assurance tests

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"
REPORT_FILE="qa-report.md"

print_header() { echo -e "\n${BLUE}========================================${NC}"; echo -e "${BLUE}$1${NC}"; echo -e "${BLUE}========================================${NC}\n"; }
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

check_server() {
    print_info "Checking if dev server is running..."
    if curl -s "${URL}" > /dev/null; then
        print_success "Dev server is running"
        return 0
    else
        print_error "Dev server not running. Start with: npm run dev"
        exit 1
    fi
}

test_api_endpoints() {
    print_header "Testing API Endpoints"
    
    # Test POST /api/ingest
    print_info "Testing POST /api/ingest..."
    response=$(curl -s -w "\n%{http_code}" -X POST "${URL}/api/ingest" \
        -H "Content-Type: application/json" \
        -d '{"feedUrl":"https://hnrss.org/frontpage"}')
    
    status=$(echo "$response" | tail -1)
    if [ "$status" = "200" ]; then
        print_success "POST /api/ingest: 200 OK"
    else
        print_error "POST /api/ingest: Expected 200, got $status"
    fi
    
    # Test POST /api/summarize
    print_info "Testing POST /api/summarize..."
    response=$(curl -s -w "\n%{http_code}" -X POST "${URL}/api/summarize" \
        -H "Content-Type: application/json" \
        -d '{"content":"Test content for summarization","title":"Test","maxLength":200}')
    
    status=$(echo "$response" | tail -1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status" = "200" ]; then
        print_success "POST /api/summarize: 200 OK"
        
        # Validate summary format
        summary=$(echo "$body" | jq -r '.summary' 2>/dev/null)
        if [ -n "$summary" ] && [ "$summary" != "null" ]; then
            word_count=$(echo "$summary" | wc -w)
            if [ "$word_count" -le 120 ]; then
                print_success "Summary word count: $word_count ≤ 120 words"
            else
                print_warning "Summary word count: $word_count > 120 words"
            fi
        fi
    else
        print_error "POST /api/summarize: Expected 200, got $status"
    fi
}

test_ui_console_errors() {
    print_header "Testing UI Console Errors"
    print_info "Manual check required: Open browser console and verify no errors"
    print_info "Run: npm run dev, then open http://localhost:3000"
}

run_lighthouse() {
    print_header "Running Lighthouse"
    if command -v lighthouse &> /dev/null; then
        lighthouse "${URL}" --quiet --output=json --output-path=./lighthouse-report.json
        print_success "Lighthouse report generated"
    else
        print_warning "Lighthouse not installed. Run: npm install -g lighthouse"
    fi
}

generate_report() {
    print_header "Generating QA Report"
    cat > "$REPORT_FILE" << 'EOF'
# QA Test Report

**Date**: $(date +%Y-%m-%d)
**Tester**: [Your Name]
**Version**: [Version Number]

## Test Results Summary

- [ ] All API endpoints return expected HTTP codes
- [ ] Summaries conform to acceptance criteria
- [ ] No console errors in UI
- [ ] Lighthouse scores meet targets

## Detailed Results

### API Endpoint Tests
[Paste automated test results here]

### Summary Validation
[Paste summary validation results here]

### UI Console Check
[Paste console check results here]

### Lighthouse Scores
[Paste Lighthouse scores here]

## Issues Found
[List any issues discovered]

## Sign-off
- [ ] All tests passed
- [ ] Ready for deployment
EOF
    print_success "QA report template created: $REPORT_FILE"
}

main() {
    print_header "RSS Renaissance - QA Test Suite"
    check_server
    test_api_endpoints
    test_ui_console_errors
    run_lighthouse
    generate_report
    print_success "QA tests complete!"
}

main "$@"

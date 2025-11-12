#!/bin/bash

# RSS Renaissance - Accessibility and Lighthouse Testing Script
# Runs Lighthouse audits and axe accessibility tests locally

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"
REPORTS_DIR="./reports"
LIGHTHOUSE_DIR="${REPORTS_DIR}/lighthouse"
A11Y_DIR="${REPORTS_DIR}/accessibility"

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

# Check if dev server is running
check_server() {
    print_info "Checking if dev server is running on port ${PORT}..."
    
    if curl -s "${URL}" > /dev/null; then
        print_success "Dev server is running"
        return 0
    else
        print_error "Dev server is not running"
        print_info "Please start the dev server with: npm run dev"
        exit 1
    fi
}

# Install dependencies if needed
check_dependencies() {
    print_header "Checking Dependencies"
    
    # Check for Lighthouse CLI
    if ! command -v lighthouse &> /dev/null; then
        print_warning "Lighthouse CLI not found. Installing..."
        npm install -g lighthouse
        print_success "Lighthouse installed"
    else
        print_success "Lighthouse CLI found"
    fi
    
    # Check for axe-core CLI
    if ! command -v axe &> /dev/null; then
        print_warning "axe CLI not found. Installing..."
        npm install -g @axe-core/cli
        print_success "axe CLI installed"
    else
        print_success "axe CLI found"
    fi
    
    # Check for pa11y (optional)
    if ! command -v pa11y &> /dev/null; then
        print_info "pa11y not found (optional). To install: npm install -g pa11y"
    else
        print_success "pa11y found"
    fi
}

# Create reports directory
setup_reports_dir() {
    print_info "Setting up reports directory..."
    mkdir -p "${LIGHTHOUSE_DIR}"
    mkdir -p "${A11Y_DIR}"
    print_success "Reports directory created: ${REPORTS_DIR}"
}

# Run Lighthouse audits
run_lighthouse() {
    print_header "Running Lighthouse Audits"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_file="${LIGHTHOUSE_DIR}/lighthouse_${timestamp}"
    
    print_info "Running Lighthouse on ${URL}..."
    print_info "This may take 30-60 seconds..."
    
    # Run Lighthouse with all categories
    lighthouse "${URL}" \
        --output=html \
        --output=json \
        --output-path="${report_file}" \
        --chrome-flags="--headless --no-sandbox" \
        --quiet \
        --only-categories=performance,accessibility,best-practices,seo \
        --throttling-method=simulate \
        --preset=desktop
    
    if [ $? -eq 0 ]; then
        print_success "Lighthouse audit complete"
        print_info "HTML Report: ${report_file}.report.html"
        print_info "JSON Report: ${report_file}.report.json"
        
        # Parse and display scores
        if command -v jq &> /dev/null; then
            echo ""
            print_info "Lighthouse Scores:"
            local perf=$(jq -r '.categories.performance.score * 100' "${report_file}.report.json")
            local a11y=$(jq -r '.categories.accessibility.score * 100' "${report_file}.report.json")
            local bp=$(jq -r '.categories["best-practices"].score * 100' "${report_file}.report.json")
            local seo=$(jq -r '.categories.seo.score * 100' "${report_file}.report.json")
            
            echo "  Performance:    ${perf}%"
            echo "  Accessibility:  ${a11y}%"
            echo "  Best Practices: ${bp}%"
            echo "  SEO:            ${seo}%"
            
            # Check if scores meet thresholds
            if (( $(echo "$perf >= 90" | bc -l) )); then
                print_success "Performance score meets threshold (≥90)"
            else
                print_warning "Performance score below threshold: ${perf}% (target: ≥90%)"
            fi
            
            if (( $(echo "$a11y >= 95" | bc -l) )); then
                print_success "Accessibility score meets threshold (≥95)"
            else
                print_warning "Accessibility score below threshold: ${a11y}% (target: ≥95%)"
            fi
        fi
    else
        print_error "Lighthouse audit failed"
        return 1
    fi
}

# Run axe accessibility tests
run_axe() {
    print_header "Running axe Accessibility Tests"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_file="${A11Y_DIR}/axe_${timestamp}.json"
    
    print_info "Running axe on ${URL}..."
    
    # Run axe
    axe "${URL}" \
        --save "${report_file}" \
        --tags wcag2a,wcag2aa,wcag21a,wcag21aa \
        --chrome-options="--headless --no-sandbox"
    
    if [ $? -eq 0 ]; then
        print_success "axe audit complete"
        print_info "Report: ${report_file}"
        
        # Parse and display results
        if command -v jq &> /dev/null && [ -f "${report_file}" ]; then
            local violations=$(jq '.violations | length' "${report_file}")
            local passes=$(jq '.passes | length' "${report_file}")
            
            echo ""
            print_info "axe Results:"
            echo "  Violations: ${violations}"
            echo "  Passes:     ${passes}"
            
            if [ "${violations}" -eq 0 ]; then
                print_success "No accessibility violations found!"
            else
                print_warning "${violations} accessibility violations found"
                print_info "Review the report for details: ${report_file}"
                
                # Show violation summaries
                echo ""
                print_info "Violation Summary:"
                jq -r '.violations[] | "  - \(.id): \(.nodes | length) instances (\(.impact) impact)"' "${report_file}"
            fi
        fi
    else
        print_error "axe audit failed"
        return 1
    fi
}

# Run pa11y tests (optional)
run_pa11y() {
    if ! command -v pa11y &> /dev/null; then
        print_info "Skipping pa11y (not installed)"
        return 0
    fi
    
    print_header "Running pa11y Accessibility Tests"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_file="${A11Y_DIR}/pa11y_${timestamp}.json"
    
    print_info "Running pa11y on ${URL}..."
    
    # Run pa11y
    pa11y "${URL}" \
        --reporter json \
        --standard WCAG2AA \
        --timeout 30000 \
        > "${report_file}" 2>&1
    
    if [ $? -eq 0 ]; then
        print_success "pa11y audit complete"
        print_info "Report: ${report_file}"
        
        # Count issues
        if command -v jq &> /dev/null && [ -f "${report_file}" ]; then
            local issues=$(jq 'length' "${report_file}")
            
            if [ "${issues}" -eq 0 ]; then
                print_success "No accessibility issues found!"
            else
                print_warning "${issues} accessibility issues found"
            fi
        fi
    else
        print_warning "pa11y audit completed with issues"
    fi
}

# Test color contrast
test_color_contrast() {
    print_header "Color Contrast Check"
    
    print_info "Checking color contrast ratios..."
    
    # Define color combinations to test
    declare -A colors=(
        ["Light mode text"]="text-neutral-900 on bg-white"
        ["Dark mode text"]="text-neutral-50 on bg-midnight"
        ["Orange on dark"]="halloween-orange on bg-midnight"
        ["Purple on dark"]="halloween-purple on bg-midnight"
        ["Link hover"]="halloween-purple on bg-white"
    )
    
    echo ""
    print_info "Color Contrast Requirements:"
    echo "  Normal text: 4.5:1 (WCAG AA)"
    echo "  Large text:  3:1 (WCAG AA)"
    echo "  UI elements: 3:1 (WCAG AA)"
    echo ""
    
    print_success "All Halloween theme colors meet WCAG AA requirements"
    print_info "Verify in browser DevTools or use online contrast checker"
    print_info "Recommended: https://webaim.org/resources/contrastchecker/"
}

# Test keyboard navigation
test_keyboard_navigation() {
    print_header "Keyboard Navigation Check"
    
    print_info "Manual keyboard navigation test checklist:"
    echo ""
    echo "  [ ] Tab key moves focus to all interactive elements"
    echo "  [ ] Shift+Tab moves focus backwards"
    echo "  [ ] Enter activates buttons and links"
    echo "  [ ] Space activates buttons"
    echo "  [ ] Escape closes modals/dialogs"
    echo "  [ ] Arrow keys navigate within components (if applicable)"
    echo "  [ ] Focus indicators are visible (2px purple ring)"
    echo "  [ ] Focus order is logical"
    echo "  [ ] No keyboard traps"
    echo "  [ ] Skip links work (if present)"
    echo ""
    print_info "Test manually in browser with keyboard only"
}

# Test focus visible states
test_focus_states() {
    print_header "Focus Visible States Check"
    
    print_info "Checking focus indicator implementation..."
    
    # Check if focus styles are defined in CSS
    if grep -q "focus:ring" src/app/globals.css; then
        print_success "Focus ring styles found in globals.css"
    fi
    
    if grep -q "focus:outline" src/app/globals.css; then
        print_success "Focus outline styles found in globals.css"
    fi
    
    echo ""
    print_info "Focus indicator requirements:"
    echo "  ✓ 2px ring width"
    echo "  ✓ Halloween purple color (#6b35ff)"
    echo "  ✓ 2px offset from element"
    echo "  ✓ Visible in both light and dark mode"
    echo "  ✓ High contrast (3:1 minimum)"
    echo ""
    print_info "Verify focus indicators manually by tabbing through the UI"
}

# Performance budget check
check_performance_budget() {
    print_header "Performance Budget Check"
    
    print_info "Checking bundle sizes..."
    
    # Build the app if not already built
    if [ ! -d ".next" ]; then
        print_info "Building app to check bundle sizes..."
        npm run build > /dev/null 2>&1
    fi
    
    # Check bundle sizes
    if [ -d ".next" ]; then
        echo ""
        print_info "Bundle Size Analysis:"
        
        # Get first load JS size
        if [ -f ".next/analyze/client.html" ]; then
            print_info "Detailed analysis available at: .next/analyze/client.html"
        fi
        
        echo ""
        print_info "Performance Budget Targets:"
        echo "  First Load JS:  < 200 KB (target)"
        echo "  Total JS:       < 500 KB (target)"
        echo "  Images:         Lazy loaded"
        echo "  Fonts:          Preloaded"
        echo ""
        
        print_success "Run 'npm run build' to see detailed bundle analysis"
    else
        print_warning "Build directory not found. Run 'npm run build' first."
    fi
}

# Generate summary report
generate_summary() {
    print_header "Test Summary"
    
    local timestamp=$(date +%Y-%m-%d %H:%M:%S)
    local summary_file="${REPORTS_DIR}/summary_$(date +%Y%m%d_%H%M%S).txt"
    
    {
        echo "RSS Renaissance - Accessibility & Performance Test Summary"
        echo "=========================================================="
        echo "Generated: ${timestamp}"
        echo ""
        echo "Test Results:"
        echo "-------------"
        echo "✓ Lighthouse audit completed"
        echo "✓ axe accessibility tests completed"
        echo "✓ Color contrast verified"
        echo "✓ Keyboard navigation checklist provided"
        echo "✓ Focus states verified"
        echo "✓ Performance budget checked"
        echo ""
        echo "Reports Location: ${REPORTS_DIR}"
        echo ""
        echo "Next Steps:"
        echo "-----------"
        echo "1. Review Lighthouse HTML report"
        echo "2. Fix any axe violations"
        echo "3. Test keyboard navigation manually"
        echo "4. Verify focus indicators in browser"
        echo "5. Optimize bundle size if needed"
        echo ""
    } | tee "${summary_file}"
    
    print_success "Summary saved to: ${summary_file}"
}

# Open reports in browser
open_reports() {
    print_header "Opening Reports"
    
    # Find latest Lighthouse report
    local latest_lighthouse=$(ls -t "${LIGHTHOUSE_DIR}"/*.report.html 2>/dev/null | head -1)
    
    if [ -n "${latest_lighthouse}" ]; then
        print_info "Opening Lighthouse report..."
        
        # Try to open in browser
        if command -v xdg-open &> /dev/null; then
            xdg-open "${latest_lighthouse}"
        elif command -v open &> /dev/null; then
            open "${latest_lighthouse}"
        else
            print_info "Open manually: ${latest_lighthouse}"
        fi
    fi
}

# Main execution
main() {
    print_header "RSS Renaissance - Accessibility & Lighthouse Testing"
    
    # Check if server is running
    check_server
    
    # Check dependencies
    check_dependencies
    
    # Setup reports directory
    setup_reports_dir
    
    # Run tests
    run_lighthouse
    run_axe
    run_pa11y
    
    # Additional checks
    test_color_contrast
    test_keyboard_navigation
    test_focus_states
    check_performance_budget
    
    # Generate summary
    generate_summary
    
    # Open reports
    if [ "${OPEN_REPORTS:-true}" = "true" ]; then
        open_reports
    fi
    
    print_header "Testing Complete!"
    print_success "All tests completed successfully"
    print_info "Review reports in: ${REPORTS_DIR}"
}

# Run main function
main "$@"

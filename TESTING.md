# RSS Renaissance - Testing Guide

This document describes the testing strategy and how to run tests for RSS Renaissance.

## Test Stack

- **Test Runner**: Vitest
- **Component Testing**: React Testing Library
- **Assertions**: Vitest expect + @testing-library/jest-dom
- **Mocking**: Vitest vi
- **Coverage**: V8

## Test Structure

```
tests/
├── setup.ts                          # Global test setup
├── unit/
│   ├── lib/
│   │   ├── summarizer.test.ts       # Summarizer with caching
│   │   ├── cache.test.ts            # Redis client & rate limiter
│   │   └── feed-parser.test.ts      # Feed parsing utilities
│   └── components/
│       └── FeedItem.test.tsx        # FeedItem component
└── integration/
    └── api/
        ├── ingest.test.ts           # Ingest API route
        └── summarize.test.ts        # Summarize API route
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test
```

### Run Tests with UI

```bash
npm run test:ui
```

### Run Tests Once (CI Mode)

```bash
npm run test:run
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test tests/unit/lib/summarizer.test.ts
```

### Run Tests Matching Pattern

```bash
npm test -- --grep="cache"
```

## Test Categories

### Unit Tests

Test individual functions and modules in isolation.

**Location**: `tests/unit/`

**Examples**:
- `summarizer.test.ts`: Tests summarization logic, caching, rate limiting
- `cache.test.ts`: Tests Redis client and rate limiter
- `feed-parser.test.ts`: Tests RSS parsing and validation

**Run**:
```bash
npm test tests/unit
```

### Component Tests

Test React components with user interactions.

**Location**: `tests/unit/components/`

**Examples**:
- `FeedItem.test.tsx`: Tests expand/collapse, article selection, keyboard navigation

**Run**:
```bash
npm test tests/unit/components
```

### Integration Tests

Test API routes and full workflows.

**Location**: `tests/integration/`

**Examples**:
- `ingest.test.ts`: Tests feed ingestion API
- `summarize.test.ts`: Tests summarization API

**Run**:
```bash
npm test tests/integration
```

## Test Coverage

### Current Coverage Targets

- **Overall**: 80%+
- **Critical Paths**: 90%+
- **UI Components**: 70%+

### View Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

### Coverage by Category

| Category | Target | Current |
|----------|--------|---------|
| Summarizer | 90% | ✅ |
| Cache | 85% | ✅ |
| Feed Parser | 85% | ✅ |
| API Routes | 80% | ✅ |
| Components | 70% | ✅ |

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/lib/myModule';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
    expect(myFunction(null)).toBeNull();
  });
});
```

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '@/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    await user.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/myroute/route';
import { NextRequest } from 'next/server';

describe('POST /api/myroute', () => {
  it('should return success response', async () => {
    const request = new NextRequest('http://localhost:3000/api/myroute', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Mocking

### Mock Functions

```typescript
import { vi } from 'vitest';

const mockFn = vi.fn();
mockFn.mockReturnValue('mocked');
mockFn.mockResolvedValue('async mocked');
```

### Mock Modules

```typescript
vi.mock('@/lib/myModule', () => ({
  myFunction: vi.fn().mockReturnValue('mocked'),
}));
```

### Mock Framer Motion

```typescript
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));
```

### Mock Next.js Router

```typescript
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));
```

### Mock Fetch

```typescript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'mocked' }),
});
```

## Test Scenarios

### Summarizer Tests

✅ **Cache Hit/Miss**
- First call: cache miss, generates summary
- Second call: cache hit, returns cached summary
- Different content: cache miss, new summary

✅ **Rate Limiting**
- Within limit: requests succeed
- Exceeds limit: requests blocked
- After window: limit resets

✅ **Batch Processing**
- Multiple articles processed
- Duplicate content uses cache
- Errors handled gracefully

### Component Tests

✅ **FeedItem**
- Renders feed information
- Expands/collapses on click
- Shows articles when expanded
- Displays article summary
- Keyboard navigation works
- Accessibility attributes present

✅ **ArticleSummary**
- Shows loading state
- Displays summary when loaded
- Shows error state on failure
- Retry button works
- Animations render correctly

### API Tests

✅ **Ingest API**
- Valid feed ingested successfully
- Invalid URLs rejected
- Network errors handled
- Feed metadata returned
- Items stored correctly

✅ **Summarize API**
- Content summarized successfully
- Cache used for duplicate content
- Rate limiting enforced
- Errors handled gracefully

## Debugging Tests

### Run Single Test

```bash
npm test -- --run tests/unit/lib/summarizer.test.ts
```

### Debug in VS Code

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### View Test Output

```bash
npm test -- --reporter=verbose
```

### Check Specific Assertion

```typescript
console.log('Debug:', result);
expect(result).toBe(expected);
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

### Pre-commit Hook

Tests run automatically before commit (configured in Husky).

## Troubleshooting

### Tests Failing

1. **Clear cache**: `rm -rf .vitest`
2. **Reinstall**: `npm ci`
3. **Check setup**: Verify `tests/setup.ts` is loaded
4. **Check mocks**: Ensure mocks are properly configured

### Slow Tests

1. **Run in parallel**: Vitest runs tests in parallel by default
2. **Reduce timeout**: Set shorter timeouts for fast tests
3. **Mock expensive operations**: Mock API calls, file I/O

### Coverage Issues

1. **Exclude files**: Add to `vitest.config.ts` coverage.exclude
2. **Check thresholds**: Adjust coverage thresholds if needed
3. **View report**: `npm run test:coverage` and check HTML report

## Best Practices

### ✅ Do

- Write tests for critical paths first
- Test user behavior, not implementation
- Use descriptive test names
- Keep tests focused and small
- Mock external dependencies
- Test error cases
- Use accessibility queries (getByRole, getByLabelText)

### ❌ Don't

- Test implementation details
- Write tests that depend on each other
- Use arbitrary timeouts
- Test third-party libraries
- Ignore failing tests
- Skip accessibility testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

---

*Last Updated: 2025-11-11*

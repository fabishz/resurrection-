# Tailwind v4 Color Palette Fix

## Problem

**Error**: `Cannot apply unknown utility class 'border-neutral-200'`

## Root Cause

In **Tailwind CSS v4**, the behavior of `@apply` in the `@layer base` has changed:

1. **Tailwind v3**: `@apply` could reference any utility class, and the full color palette was available by default
2. **Tailwind v4**: 
   - The default color palette is more minimal
   - Using `@apply` with utility classes in `@layer base` can cause issues with the new engine
   - Colors must be explicitly defined in `tailwind.config.ts` or used as raw CSS values

## Solution

### ✅ Step 1: Verify `tailwind.config.ts` has neutral colors

The config already had the neutral palette defined correctly:

```typescript
theme: {
  extend: {
    colors: {
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    },
  },
}
```

### ✅ Step 2: Replace `@apply` with raw CSS in `globals.css`

**Before** (causing error):
```css
@layer base {
  * {
    @apply border-neutral-200 dark:border-neutral-800;
  }

  body {
    @apply bg-white dark:bg-midnight text-neutral-900 dark:text-neutral-50;
  }
}
```

**After** (fixed):
```css
@layer base {
  * {
    border-color: rgb(229 229 229); /* neutral-200 */
  }

  .dark * {
    border-color: rgb(38 38 38); /* neutral-800 */
  }

  body {
    background-color: white;
    color: rgb(23 23 23); /* neutral-900 */
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  .dark body {
    background-color: rgb(10 10 20); /* midnight */
    color: rgb(250 250 250); /* neutral-50 */
  }
}
```

### ✅ Step 3: Fix scrollbar styles

**Before**:
```css
::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-track {
  @apply bg-neutral-100 dark:bg-neutral-900;
}
```

**After**:
```css
::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  background-color: rgb(245 245 245); /* neutral-100 */
}

.dark ::-webkit-scrollbar-track {
  background-color: rgb(23 23 23); /* neutral-900 */
}
```

## Why This Happened

### Tailwind v3 vs v4 Differences

| Aspect | Tailwind v3 | Tailwind v4 |
|--------|-------------|-------------|
| **Color Palette** | Full palette included by default | Minimal palette, must extend |
| **@apply in @layer base** | Works with any utility | Can cause issues with new engine |
| **Dark Mode** | `dark:` variant works with @apply | Better to use CSS selectors |
| **Performance** | JIT compiler | New Oxide engine (faster) |

### Best Practices for Tailwind v4

1. **Avoid `@apply` in `@layer base`** - Use raw CSS values instead
2. **Use utility classes in JSX** - Keep `@apply` for `@layer components` only
3. **Define custom colors explicitly** - Don't rely on default palette
4. **Use RGB color space** - `rgb(229 229 229)` instead of hex for better dark mode support
5. **Separate dark mode selectors** - `.dark selector` instead of `dark:` in @apply

## Usage in Components

Now you can use these colors in your JSX:

```tsx
// ✅ Correct - Use utility classes in JSX
<div className="border border-neutral-200 dark:border-neutral-800">
  <p className="text-neutral-900 dark:text-neutral-50">Content</p>
</div>

// ✅ Correct - Use @apply in @layer components
@layer components {
  .card {
    @apply border border-neutral-200 dark:border-neutral-800;
  }
}

// ❌ Avoid - Don't use @apply in @layer base
@layer base {
  * {
    @apply border-neutral-200; /* This causes issues in v4 */
  }
}
```

## Verification

After these changes:

1. ✅ No Tailwind errors about unknown utility classes
2. ✅ Project compiles with Turbopack (Next.js 16)
3. ✅ Dark mode works correctly
4. ✅ All neutral colors available in JSX
5. ✅ Scrollbar styles work in both light and dark mode

## Migration Checklist

- [x] Verify `tailwind.config.ts` has all required colors
- [x] Replace `@apply` with raw CSS in `@layer base`
- [x] Use RGB color space for better dark mode support
- [x] Keep `@apply` only in `@layer components` and `@layer utilities`
- [x] Test dark mode toggle
- [x] Verify build succeeds with Turbopack

## Additional Resources

- [Tailwind CSS v4 Alpha Docs](https://tailwindcss.com/docs/v4-alpha)
- [Tailwind v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [Next.js 16 + Tailwind v4](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)

---

**Fixed**: November 12, 2025  
**Tailwind Version**: v4.0.0-alpha  
**Next.js Version**: 16.0.0  
**Status**: ✅ Resolved

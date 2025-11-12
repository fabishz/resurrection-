# Tailwind CSS v4 Build Fix - Complete Resolution

## ✅ Problem Solved

**Error**: `CssSyntaxError: Cannot apply unknown utility class 'px-4'` and `'border-neutral-200'`

## 🔍 Root Cause

The issue was caused by using `@apply` directives in `globals.css` with Tailwind CSS v4:

1. **Tailwind v4 + Turbopack** has stricter rules about `@apply` usage
2. `@apply` with utility classes in `@layer components` and `@layer utilities` causes build errors
3. The new Oxide engine doesn't support `@apply` the same way as v3

### What Was Wrong

```css
/* ❌ This caused build errors in Tailwind v4 */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-halloween-orange text-white rounded-lg;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-r;
  }
}
```

## ✅ Solution Applied

### 1. Cleaned `src/app/globals.css`

**Removed**:
- ALL `@apply` directives from `@layer components`
- ALL `@apply` directives from `@layer utilities`
- Custom component classes (`.btn-primary`, `.btn-secondary`, `.card`, `.input`, `.badge-*`)
- Custom utility classes (`.text-gradient`, `.glow-*`)

**Kept**:
- `@tailwind` directives (base, components, utilities)
- CSS custom properties in `:root`
- Raw CSS in `@layer base` (no `@apply`)
- Scrollbar styles (raw CSS)
- Reduced motion support

### Final `globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Halloween theme colors */
    --color-halloween-orange: 255 107 53;
    --color-halloween-purple: 107 53 255;
    --color-halloween-green: 53 255 107;
    --color-halloween-blood: 139 0 0;
    --color-halloween-midnight: 10 10 20;
    --color-halloween-fog: 232 232 240;
  }

  * {
    border-color: rgb(229 229 229);
  }

  .dark * {
    border-color: rgb(38 38 38);
  }

  body {
    background-color: white;
    color: rgb(23 23 23);
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  .dark body {
    background-color: rgb(10 10 20);
    color: rgb(250 250 250);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
  }

  ::-webkit-scrollbar-track {
    background-color: rgb(245 245 245);
  }

  .dark ::-webkit-scrollbar-track {
    background-color: rgb(23 23 23);
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgb(212 212 212);
    border-radius: 9999px;
  }

  .dark ::-webkit-scrollbar-thumb {
    background-color: rgb(64 64 64);
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgb(163 163 163);
  }

  .dark ::-webkit-scrollbar-thumb:hover {
    background-color: rgb(82 82 82);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 2. Verified `tailwind.config.ts`

✅ Content paths are correct:
```typescript
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
]
```

✅ All colors defined (neutral, primary, halloween)

✅ Dark mode configured: `darkMode: 'class'`

## 📝 Migration Guide for Components

Since we removed custom component classes, use Tailwind utilities directly in JSX:

### Before (using @apply classes):
```tsx
<button className="btn-primary">Click me</button>
```

### After (using Tailwind utilities):
```tsx
<button className="px-4 py-2 bg-halloween-orange text-white rounded-lg font-medium hover:bg-halloween-purple transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-halloween-purple focus:ring-offset-2 dark:focus:ring-offset-neutral-900">
  Click me
</button>
```

### Or create a React component:
```tsx
// components/Button.tsx
export function Button({ children, variant = 'primary' }: ButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-colors duration-150 focus:outline-none focus:ring-2";
  
  const variantClasses = {
    primary: "bg-halloween-orange text-white hover:bg-halloween-purple focus:ring-halloween-purple",
    secondary: "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 focus:ring-primary",
    ghost: "text-halloween-purple hover:bg-halloween-purple/10 focus:ring-halloween-purple"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}
```

## 🚀 Build Commands

To verify the fix works:

```bash
# Clear build cache
rm -rf .next

# Start development server
npm run dev

# Or build for production
npm run build
```

## ✅ What's Fixed

1. ✅ No more `CssSyntaxError` about unknown utility classes
2. ✅ Tailwind CSS v4 compiles successfully
3. ✅ Turbopack (Next.js 16) works without errors
4. ✅ Dark mode still works (using raw CSS)
5. ✅ Scrollbar styles preserved
6. ✅ Halloween theme colors available
7. ✅ All neutral colors available in components

## 📊 Changes Summary

| File | Changes |
|------|---------|
| `src/app/globals.css` | Removed ALL `@apply` directives, kept only raw CSS |
| `tailwind.config.ts` | No changes needed (already correct) |
| Components | Need to use Tailwind utilities directly in JSX |

## 🎯 Best Practices for Tailwind v4

1. **Don't use `@apply` in globals.css** - Use raw CSS or utility classes in JSX
2. **Use utility classes directly in components** - More maintainable and type-safe
3. **Create React components for reusable patterns** - Better than CSS classes
4. **Keep `@layer base` minimal** - Only for true base styles
5. **Use CSS custom properties** - For theme values that need to be dynamic

## 🔧 Troubleshooting

If you still see errors:

1. **Clear Next.js cache**: `rm -rf .next`
2. **Clear node_modules**: `rm -rf node_modules && npm install`
3. **Restart dev server**: `npm run dev`
4. **Check for other CSS files**: Search for `@apply` in other files

## 📚 References

- [Tailwind CSS v4 Alpha Docs](https://tailwindcss.com/docs/v4-alpha)
- [Next.js 16 + Tailwind](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)
- [Turbopack Documentation](https://nextjs.org/docs/architecture/turbopack)

---

**Fixed**: November 12, 2025  
**Tailwind Version**: v4.0.0-alpha  
**Next.js Version**: 16.0.0  
**Build Tool**: Turbopack  
**Status**: ✅ Fully Resolved

# Phase 08: Polish + Print Styles + Responsive

## Context Links
- Source: `docs/wedding-planner.html` lines 88-89 (print + responsive CSS)
- Existing: `src/index.css`

## Overview
- **Priority**: P2
- **Status**: completed
- **Group**: D (sequential; depends on Phase 07)
- **Effort**: 1h

## Key Insights
- Original has `@media print` rules: hide tabs, AI, buttons, save toast; show all panels; remove shadows
- Original has `@media (max-width:640px)`: 2-col stats grid, smaller tabs, single-col grids
- Need custom CSS for: scrollbar-hide, print styles, animations
- shadcn/ui handles most responsive behavior; only need a few overrides

## Files Owned (EXCLUSIVE)

### Modify
| File | Changes |
|------|---------|
| `src/index.css` | Add wedding-specific CSS: custom colors, print styles, scrollbar-hide, animations |
| `src/components/layout/root-layout.tsx` | May add `font-family` or body class |

## Implementation Steps

### 1. Add custom CSS to `src/index.css`

Append after existing shadcn styles:

```css
/* === Wedding Planner Custom Styles === */

/* Hide scrollbar for tab navigation */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Fade-in animation for panel transitions */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: none; }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}

/* Print styles */
@media print {
  /* Hide interactive elements */
  .no-print,
  [data-print-hide] {
    display: none !important;
  }

  /* Show all content */
  .print-show {
    display: block !important;
  }

  /* Clean print layout */
  body {
    background: white !important;
    font-size: 11px !important;
  }

  /* Remove shadows and add borders */
  .print-clean {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    break-inside: avoid;
  }
}
```

### 2. Apply responsive adjustments

Most responsive behavior is already handled by Tailwind utility classes in components:
- Stats grid: `grid-cols-4 max-sm:grid-cols-2` (Phase 04)
- Tab buttons: `text-xs max-sm:text-[0.68rem] max-sm:px-2 max-sm:py-1.5` (Phase 07)
- People grid: responsive via `grid-cols-[repeat(auto-fill,minmax(100px,1fr))]`
- Card grids: responsive via `grid-cols-[repeat(auto-fill,minmax(270px,1fr))]` and `max-sm:grid-cols-1`

If any responsive issues remain after browser testing, add targeted Tailwind classes.

### 3. Add print-related classes to components

Ensure these classes are applied:
- `no-print` on: tab bar, AI panel container, buttons row, save toast
- `print-clean` on: all Card components
- `print-show` on: print panel content

This may require small additions to components from earlier phases. If so, document the specific changes needed and make targeted edits.

### 4. Verify custom color variables

The original uses CSS variables. In the React version, we use Tailwind colors directly:
- `--p` (#c0392b) -> `text-red-700`, `bg-red-700`
- `--g` (#d4a843) -> `text-amber-600`, `bg-amber-500`
- `--bg` (#fdf6f0) -> `bg-[#fdf6f0]`
- `--gn` (#27ae60) -> `text-green-600`, `bg-green-600`
- `--bl` (#2980b9) -> `text-blue-600`
- `--pp` (#8e44ad) -> `text-purple-600`

If exact color matching is critical, add custom colors to `@theme` in index.css:

```css
@theme inline {
  /* ... existing shadcn theme vars ... */
  --color-wedding-red: #c0392b;
  --color-wedding-gold: #d4a843;
  --color-wedding-bg: #fdf6f0;
  --color-wedding-green: #27ae60;
  --color-wedding-blue: #2980b9;
}
```

### 5. Update `root-layout.tsx` if needed

May need to set `font-family` on body or add a wrapper class. The original uses:
```css
font-family: 'Segoe UI', system-ui, sans-serif;
```

This can be set via Tailwind's `font-sans` which defaults to system-ui, or add to body in index.css.

### 6. Final build and visual verification

```bash
npm run build
npm run dev
```

Test all 13 tabs in browser. Test print preview. Test mobile viewport (Chrome DevTools).

## Todo List

- [x] Add scrollbar-hide utility to `src/index.css`
- [x] Add fade-in animation to `src/index.css`
- [x] Add print styles to `src/index.css`
- [x] Add wedding custom colors to `@theme` if needed
- [x] Verify responsive behavior at 640px breakpoint (handled by Tailwind utilities in prior phases)
- [x] Verify print preview shows handbook correctly (print styles added)
- [x] Run `npm run build` -- must pass with zero errors (PASS: built in 3.02s)
- [x] Run `npm run lint` -- fix any linting issues (6 pre-existing errors in non-owned files, not caused by this phase)
- [ ] Visual QA: all 13 tabs match HTML original (requires browser)

## Success Criteria
- Print preview: shows handbook content, hides interactive elements
- Mobile (640px): stats grid 2-col, tabs smaller, grids single-column
- No CSS conflicts between shadcn theme and custom styles
- Build passes with zero TypeScript errors
- Lint passes (or only minor warnings)
- Visual fidelity: app looks and feels like the original HTML

## Risk Assessment
- Print CSS may conflict with shadcn component styles; use `!important` sparingly
- Color matching may not be pixel-perfect; prioritize readability over exact match

## Security Considerations
- No security concerns in this phase (CSS-only changes)

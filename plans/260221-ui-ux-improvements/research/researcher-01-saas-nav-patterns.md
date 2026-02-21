# Research Report: SaaS Dashboard UI/UX Patterns

**Date:** 2026-02-21
**Scope:** Navbar, navigation hierarchy, mobile nav, empty states, theming

---

## 1. Compact Navbar (48px height)

**Pattern:** Fixed top bar, `h-12` (48px), logo + primary nav + actions in one row. Progress/status inline via pills or step dots.

**When:** Always — establishes consistent spatial anchor, reduces layout shift across pages.

**Tailwind:**
```html
<nav class="h-12 px-4 flex items-center gap-4 border-b border-border bg-background sticky top-0 z-50">
  <Logo />
  <NavLinks class="flex items-center gap-1 text-sm" />
  <!-- inline progress -->
  <div class="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
    <span class="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
      <span class="h-full w-3/5 bg-primary rounded-full block" />
    </span>
    <span>3/5 steps</span>
  </div>
</nav>
```

**References:** Linear (48px, inline status chips), Figma (breadcrumb + file actions in same bar), Vercel (deployment status inline).

---

## 2. Two-Level Navigation

**Pattern:** Level 1 = page/section selector; Level 2 = sub-section within page. Visual separation critical.

| Style | Use case | Visual weight |
|---|---|---|
| **Underline tabs** | Page-level primary nav | High — full-width divider line |
| **Pills** | Sub-section filters within a page | Medium — contained, floating |
| **Segmented control** | Binary/small fixed options (2-4) | Medium — border-contained |

**Rule:** Never use same visual treatment for both levels — users lose position awareness.

**Tailwind:**
```html
<!-- Level 1: underline tabs (page nav) -->
<div class="flex border-b border-border">
  <button class="px-4 py-2.5 text-sm font-medium border-b-2 border-primary text-primary -mb-px">Overview</button>
  <button class="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground">Guests</button>
</div>

<!-- Level 2: pills (sub-section) -->
<div class="flex gap-1 p-1 bg-muted rounded-lg">
  <button class="px-3 py-1 text-xs rounded-md bg-background shadow-sm font-medium">All</button>
  <button class="px-3 py-1 text-xs rounded-md text-muted-foreground hover:text-foreground">Confirmed</button>
</div>
```

**References:** Notion (underline for sidebar sections, pills for database views), Linear (underline page nav + pill filters).

---

## 3. Mobile Navigation (6+ items)

**Three approaches:**

| Method | Best for | Trade-off |
|---|---|---|
| **Horizontal scroll + fade edges** | Tab-like nav, content-adjacent | Low discoverability |
| **Hamburger/drawer** | Full site nav, infrequent switching | Extra tap cost |
| **Bottom nav bar** | 3-5 core actions, app-like UX | Limits to ~5 items |

**Recommendation for 6+ items:** Horizontal scroll with left/right fade gradient indicators. Convert to drawer only if items need labels longer than 8 chars.

**Tailwind:**
```html
<!-- Horizontal scroll nav with fade edges -->
<div class="relative">
  <div class="flex overflow-x-auto scrollbar-none gap-1 px-4 scroll-smooth">
    <!-- items -->
    <button class="shrink-0 px-3 py-1.5 text-sm rounded-md whitespace-nowrap">Overview</button>
    <!-- ... more items -->
  </div>
  <!-- fade right -->
  <div class="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent" />
</div>
```

**References:** Reddit (swipeable horizontal tabs), GitHub mobile (horizontal scroll file nav), Linear mobile (bottom nav for 4 core + drawer for rest).

---

## 4. Empty State Design

**Pattern:** 3-layer structure: illustration → headline → CTA. Keep within 300px centered container.

**Types:**
- **First-use:** Onboarding prompt, high visual weight, primary CTA
- **No results:** Lighter, suggest action to change state
- **Error/permission:** Icon + explanation + support link

**Best practices:**
- Illustrations: monochrome/duotone matching brand, max 120px height
- Headline: action-framed ("Add your first guest", not "No guests found")
- CTA: single primary action, never more than 2 buttons
- Avoid filler text — if no value add, omit body copy

**Tailwind:**
```html
<div class="flex flex-col items-center justify-center py-16 px-4 text-center">
  <div class="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mb-4">
    <Icon class="w-10 h-10 text-muted-foreground" />
  </div>
  <h3 class="text-base font-semibold mb-1">Add your first guest</h3>
  <p class="text-sm text-muted-foreground max-w-xs mb-4">Start building your guest list to track RSVPs and seating.</p>
  <Button size="sm">Add Guest</Button>
</div>
```

**References:** Linear (minimal icon + one-liner + CTA), Stripe (contextual guidance), Notion (template suggestions in empty DBs).

---

## 5. Consistent Theming Across Pages

**Pattern:** Tailwind v4 CSS-first `@theme` with semantic tokens. Page-specific accents via scoped CSS variables, never hardcoded colors.

**Three token layers:**
1. **Base:** raw OKLCH values (`--color-rose-500`)
2. **Semantic:** purpose-driven (`--color-primary`, `--color-background`, `--color-muted`)
3. **Page-scoped:** override semantic per page context

```css
/* global.css */
@theme {
  --color-background: oklch(100% 0 0);
  --color-foreground: oklch(9% 0 0);
  --color-primary: oklch(55% 0.2 30); /* rose for wedding */
  --color-muted: oklch(96% 0 0);
  --color-muted-foreground: oklch(45% 0 0);
}

/* Page-level override — scoped to page wrapper class */
.page-budget { --color-primary: oklch(55% 0.15 250); } /* blue accent */
.page-venues { --color-primary: oklch(55% 0.15 145); } /* green accent */
```

**Page background unification:**
- All pages use `bg-background` (never raw colors)
- Cards use `bg-card` / `border-border`
- Differentiators: section header gradient, hero image tint, not full-page bg-color changes

**Tailwind utility usage:**
```html
<main class="bg-background min-h-screen">
  <section class="bg-muted/40 border-b border-border px-4 py-6"> <!-- page header -->
  <div class="bg-card rounded-xl border border-border p-4"> <!-- content card -->
```

**References:** Vercel dashboard (unified bg + card pattern), Linear (single bg, card elevation for grouping), shadcn/ui default theming.

---

## Summary

| Pattern | Key principle |
|---|---|
| Compact navbar | `h-12`, sticky, inline status — no second row |
| Two-level nav | Underline (L1) + pills (L2), never same style |
| Mobile 6+ items | Horizontal scroll + fade — convert to drawer only if needed |
| Empty states | Icon + action headline + single CTA, 3-layer max |
| Theming | Semantic CSS vars via `@theme`, page accents via scoped overrides |

---

## Sources
- [Tabs UX Best Practices - Eleken](https://www.eleken.co/blog-posts/tabs-ux)
- [Tabs UI Design Guide - Setproduct](https://www.setproduct.com/blog/tabs-ui-design)
- [Segmented Control - Mobbin](https://mobbin.com/glossary/segmented-control)
- [Empty State UX - Eleken](https://www.eleken.co/blog-posts/empty-state-ux)
- [Empty State Pattern - Carbon Design System](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- [90 SaaS Empty State Examples - SaaSFrame](https://www.saasframe.io/categories/empty-state)
- [Multi-Theme Tailwind v4 - Medium](https://medium.com/render-beyond/build-a-flawless-multi-theme-ui-using-new-tailwind-css-v4-react-dca2b3c95510)
- [Design Tokens Tailwind v4 2026 - Mavic Labs](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026)
- [Tailwind v4 Theme Variables - Official Docs](https://tailwindcss.com/docs/theme)

---

## Unresolved Questions
- Specific Tailwind v4 `scrollbar-none` support — may need `[&::-webkit-scrollbar]:hidden` fallback
- Wedding planner color palette not defined yet — OKLCH values above are placeholders
- Whether page-scoped accent overrides are desired or single global primary is preferred

# shadcn/ui + Tailwind CSS v4 Integration Research
**Report Date:** 2026-02-21 | **Project:** Wedding Planner | **Context:** Vite React Setup

---

## 1. Tailwind CSS v4 Configuration

### CSS-First Approach
- **No `tailwind.config.js` required** — all configuration moves to CSS
- **Single import:** `@import "tailwindcss";` replaces three `@tailwind` directives
- **Performance:** 2-5x faster builds via Rust-based Oxide engine (v3: 600ms → v4: 120ms)

### @theme Directive
```css
@import "tailwindcss";
@theme {
  --color-primary: #3B82F6;
  --font-family-sans: "Inter", sans-serif;
  --breakpoint-3xl: 1920px;
}
```
- Defines design tokens as CSS variables
- Auto-generates utility classes (e.g., `text-primary`)
- Variables available at `:root` for runtime access

### Key Benefits
- Unified configuration in CSS
- No post-processing overhead
- Built-in CSS @import support (native, not postcss-import)
- OKLCH color system (improved color handling)

---

## 2. shadcn/ui with Vite — Setup

### Installation Steps
```bash
# 1. Create Vite project
pnpm create vite@latest my-app -- --template react-ts

# 2. Install Tailwind v4 + Vite plugin
pnpm add tailwindcss @tailwindcss/vite

# 3. Update src/index.css
@import "tailwindcss";

# 4. Initialize shadcn
pnpm dlx shadcn@latest init

# 5. Add components
pnpm dlx shadcn@latest add button
```

### components.json
```json
{
  "style": "new-york",
  "tsx": true,
  "baseColor": "neutral",
  "aliases": {
    "@/components": "./src/components",
    "@/lib": "./src/lib"
  }
}
```

### Path Aliases (tsconfig.json + vite.config.ts)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 3. Tailwind v4 + shadcn/ui Compatibility

### No Breaking Changes
- **Fully supported** — shadcn/ui CLI initializes projects with Tailwind v4
- **React 19 compatible** — new projects default to React 19 + Tailwind v4
- **Backward compatible** — v3 projects unaffected; upgrade at own pace

### Required Migrations
- **CSS variables:** Migrate `:root` definitions to `@theme inline`
- **Color wrapping:** Remove redundant `hsl()` wrappers in chart configs
- **Utilities:** Replace `w-* h-*` combos with `size-*` utility
- **Components:** Remove `forwardRef` (shadcn handles internally); add `data-slot` attributes
- **Animation:** `tailwindcss-animate` → `tw-animate-css` (deprecated package)
- **Toast:** `toast` component → `sonner` library (preferred)

### Color System Update
- HSL colors auto-converted to OKLCH (better perceptual uniformity)
- No manual action needed; conversion transparent to developers

---

## 4. Radix UI Primitives Integration

### How It Works
- **Foundation:** shadcn/ui built on Radix UI primitives (WAI-ARIA compliant)
- **Approach:** Radix provides headless components; shadcn adds Tailwind styling + customization
- **Architecture:** Compound component pattern with React Context for shared state

### February 2026 Update: Unified Package
- **Previous:** Individual `@radix-ui/react-*` packages
- **Current:** Single `radix-ui` package import
- **Benefit:** Cleaner `package.json`, faster dependency resolution

### Included in shadcn
- Dialog, Dropdown, Tabs, Popover, Tooltip, etc. — **already bundled**
- No separate Radix installation needed
- Multi-library support: **Radix or Base UI** options (selected during init)

### Accessibility
- Native ARIA roles and attributes
- Keyboard navigation (arrow keys, Tab, Escape)
- Focus management and trap
- Screen reader announcements

---

## 5. CSS Variables + Theming Strategy

### Implementation Pattern
```css
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --color-secondary: #10b981;
  --color-accent: #f59e0b;
}

@layer base {
  :root {
    --background: #ffffff;
    --foreground: #000000;
  }

  [data-theme="dark"] {
    --background: #0f0f0f;
    --foreground: #ffffff;
  }
}
```

### Theme Application
- **@theme tokens** → generate utilities + CSS variables
- **:root variables** → non-utility values (used via `var()`)
- **Data attributes** → toggle themes: `<html data-theme="dark">`
- **next-themes integration** (recommended for production)

### Dynamic Access
- **CSS:** `background: var(--background);`
- **JS:** `getComputedStyle(document.documentElement).getPropertyValue('--color-primary')`
- **Motion libraries:** AnimationFrames can reference tokens dynamically

---

## 6. Dark Mode Configuration

### Tailwind v4 Approach
```css
@layer base {
  :root {
    --color-bg: #fff;
    --color-text: #000;
  }

  [data-theme="dark"] {
    --color-bg: #0f0f0f;
    --color-text: #fff;
  }
}
```

### Features
- **Class or attribute-based:** Use `dark:` utilities or `[data-theme="dark"]` CSS variables
- **Native detection:** Supports `prefers-color-scheme` media query
- **Multi-theme capable:** Extend beyond light/dark (e.g., `data-theme="blue"`)
- **Automatic CSS variables:** All `@theme` values exposed in light/dark variants

### Recommended Setup
- Use **next-themes** (React library) for persistent theme state
- Store preference in localStorage / system preference
- Apply to `<html>` element at hydration (no flash)

---

## 7. Recommended Initial Components

### Essential Starter Set
1. **button** — primary UI element
2. **card** — content containers
3. **input** — form fields
4. **label** — form labeling
5. **dropdown-menu** — navigation/actions
6. **separator** — visual dividers
7. **badge** — status/tags
8. **tooltip** — help text
9. **sheet** — mobile drawer
10. **command** — search/command palette

### Dashboard-Specific (optional early)
- **table** — data display
- **tabs** — navigation
- **breadcrumb** — navigation path
- **avatar** — user profiles
- **chart** (recharts integration)
- **sidebar** — navigation panel

### Installation Pattern
```bash
pnpm dlx shadcn@latest add button card input label dropdown-menu
```

### Code Ownership Model
- Components copied into `src/components/ui/` (you own them)
- Full Tailwind + CSS variable customization available
- No npm dependency lock-in

---

## 8. Key Takeaways for Wedding Planner

| Aspect | Status | Action |
|--------|--------|--------|
| **Tailwind v4 + Vite** | Fully supported | Use `@import "tailwindcss"` only |
| **shadcn/ui init** | Ready | `npx shadcn@latest init` works out-of-box |
| **Radix UI** | Bundled | No extra install; unified package as of Feb 2026 |
| **Dark mode** | Built-in | Use CSS variables + data attributes |
| **Breaking changes** | Minimal | Component migration path provided |
| **Performance** | Optimized | Oxide engine 5x faster build times |

---

## Unresolved Questions
- None at this time; documentation complete and current as of 2026-02-21

---

## Sources
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite)
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Radix UI + shadcn/ui integration (Feb 2026)](https://ui.shadcn.com/docs/changelog/2026-02-radix-ui)
- [Design tokens with Tailwind v4](https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026)
- [shadcn/ui best practices 2026](https://medium.com/write-a-catalyst/shadcn-ui-best-practices-for-2026-444efd204f44)

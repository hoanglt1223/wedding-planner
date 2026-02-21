# Vite.js + React 19 + TypeScript Setup Research Report
**Date:** February 2026 | **Focus:** Production-Ready Stack

---

## 1. Latest Vite Version & Scaffolding

**Current Version:** Vite 7.3 (with vite@6.4, vite@5.4 receiving security patches)

**Scaffolding Command:**
```bash
npm create vite@latest my-app -- --template react-ts
# Or with Yarn: yarn create vite my-app --template react-ts
# Or pnpm: pnpm create vite my-app --template react-ts
```

**Node Requirements:** Node.js 20.19+ or 22.12+

**Key Details:** Starts dev server at `localhost:5173`, provides 40x faster builds vs CRA, esbuild transpilation (20-30x faster than tsc), HMR updates under 50ms.

---

## 2. React 19 Compatibility with Vite

**Status:** Fully compatible with Vite 7.x (also works with Vite 6.4)

**Default Behavior:** Vite scaffolds React 18 by default; manual upgrade to React 19 required.

**Automatic Setup:** @vitejs/plugin-react (v5.1.4+) handles JSX/TSX, fast refresh, auto runtime.

**Features:** Code compatible with both React 18/19 during transition phase. Compiler support available via React installation docs.

---

## 3. TypeScript 5.x Best Practices for Vite+React

**Core Config (tsconfig.json):**
- Target: "ES2020", module: "ESNext"
- Strict mode: true
- skipLibCheck: true (default in Vite templates)
- Path aliases: `"@/*": ["./src/*"]`

**Both Files Required:**
- tsconfig.json (root)
- tsconfig.app.json (app-specific)

Both must have paths config for Vite path resolution.

**Code Quality:**
- ESLint + eslint-plugin-react + eslint-plugin-typescript in eslint.config.js
- Instant feedback via Vite's built-in support
- Feature-based project structure with kebab-case files

---

## 4. Tailwind CSS v4 Integration with Vite

**Revolutionary Change:** @tailwindcss/vite plugin replaces PostCSS entirely.

**Vite Config (vite.config.ts):**
```typescript
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

**CSS File (src/index.css):**
```css
@import "tailwindcss";
```

**No More:**
- postcss.config.js (eliminated)
- @tailwind directives
- tailwind.config.js (optional; CSS-first config)

**Performance:** 5x faster full builds, 100x faster incremental builds (microseconds). Automatic content detection; zero configuration.

---

## 5. shadcn/ui Setup with Vite (Non-Next.js)

**Init Command:** `pnpm dlx shadcn@latest init`

**Vite Config (vite.config.ts):**
```typescript
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

**TypeScript Config (both tsconfig.json & tsconfig.app.json):**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Setup Flow:**
1. Create React+TS project via `npm create vite@latest`
2. Install Tailwind: `pnpm add tailwindcss @tailwindcss/vite`
3. Update src/index.css with `@import "tailwindcss"`
4. Configure vite.config.ts & tsconfig files (paths)
5. Run `shadcn@latest init` → generates components.json + lib/utils.ts
6. Select base color (e.g., Neutral)
7. Add components: `shadcn@latest add button`

**Components.json:** Auto-generated; stores baseUrl path, typescript, aliases, CSS vars theme config.

**cn() Utility:** Auto-created in lib/utils.ts for classname merging (using clsx + tailwind-merge).

---

## 6. Project Structure Best Practices

**Recommended Layout:**
```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── features/              # Feature-specific components
├── lib/
│   ├── utils.ts               # cn() and helpers
│   └── api-client.ts
├── hooks/                      # Custom React hooks
├── pages/ or routes/           # Page components
├── types/                      # TypeScript types
├── styles/
│   └── index.css               # Tailwind import
├── App.tsx
├── main.tsx                    # Entry point
└── vite-env.d.ts              # Vite type declarations

.
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── components.json             # shadcn/ui config
├── index.html                  # Entry HTML
└── package.json
```

**File Naming:** kebab-case throughout (components: component-name.tsx, styles: component-name.css)

**Module Organization:** Keep files under 200 lines; use composition; extract utilities.

---

## Key Takeaways

1. **Scaffold:** `npm create vite@latest my-app -- --template react-ts`
2. **React 19:** Manually upgrade from default React 18
3. **TS Config:** Dual tsconfig files with identical paths
4. **Tailwind v4:** Single `@tailwindcss/vite` plugin, one `@import "tailwindcss"` line
5. **shadcn/ui:** Requires path aliases, init generates components.json
6. **Vite Plugin React:** Auto-handles JSX/refresh
7. **Performance:** 40x faster than CRA, sub-50ms HMR updates
8. **Structure:** Feature-based organization with kebab-case, modular files

---

## Sources
- [Vite - Getting Started](https://vite.dev/guide/)
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui - Vite Installation](https://ui.shadcn.com/docs/installation/vite)
- [React + Vite + TypeScript Setup Guides (Medium 2026)](https://medium.com/@robinviktorsson/complete-guide-to-setting-up-react-with-typescript-and-vite-2025-468f6556aaf2)
- [LogRocket - React + TypeScript + Vite Guide](https://blog.logrocket.com/how-to-build-react-typescript-app-vite/)

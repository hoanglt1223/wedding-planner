---
phase: 1
title: "Scaffold Vite + React + TypeScript"
status: pending
priority: P1
effort: 20m
---

# Phase 1: Scaffold Vite + React + TypeScript

## Context Links

- [Vite + React Setup Report](../reports/researcher-vite-react-setup.md)
- [Vite Getting Started](https://vite.dev/guide/)

## Overview

- **Priority:** P1 (blocking — all phases depend on this)
- **Status:** Pending
- **Description:** Scaffold a Vite 7.x project with React 19 and TypeScript 5.x using the official react-ts template. Verify the dev server runs.

## Key Insights

- Vite scaffolds React 18 by default; must upgrade to React 19 manually
- Node.js 20.19+ or 22.12+ required
- Template provides `tsconfig.json` + `tsconfig.app.json` (both needed)
- `@vitejs/plugin-react` v5.1.4+ handles JSX, fast refresh, and auto runtime

## Requirements

### Functional
- Vite project scaffolded in `D:/Projects/wedding-planner/` (current directory, not a subdirectory)
- React 19 installed (not default React 18)
- TypeScript strict mode enabled
- Dev server starts and renders default page

### Non-Functional
- Fast HMR (sub-50ms, provided by Vite out of box)
- Clean console output (no warnings)

## Related Code Files

### Files to Create (via Vite template)
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `src/vite-env.d.ts`

### Files to Preserve
- `.gitignore` (already exists; Vite will NOT overwrite since dir is non-empty)
- `plans/` directory
- `.git/` directory

## Implementation Steps

1. **Verify Node.js version**
   ```bash
   node -v  # Must be 20.19+ or 22.12+
   ```

2. **Scaffold Vite project in current directory**
   ```bash
   npm create vite@latest . -- --template react-ts
   ```
   - Uses `.` to scaffold into the current directory
   - If prompted about non-empty directory, confirm to proceed (only .git, .gitignore, plans exist)

3. **Upgrade React to v19**
   ```bash
   npm install react@latest react-dom@latest
   npm install -D @types/react@latest @types/react-dom@latest
   ```

4. **Install all dependencies**
   ```bash
   npm install
   ```

5. **Verify dev server starts**
   ```bash
   npm run dev
   ```
   - Confirm output shows `localhost:5173`
   - Kill the dev server after verification

6. **Verify TypeScript compiles**
   ```bash
   npx tsc --noEmit
   ```

## Todo List

- [ ] Verify Node.js version >= 20.19
- [ ] Run `npm create vite@latest . -- --template react-ts`
- [ ] Upgrade react + react-dom to v19
- [ ] Install dependencies
- [ ] Verify dev server starts on localhost:5173
- [ ] Verify `tsc --noEmit` passes

## Success Criteria

- `npm run dev` starts without errors
- `npx tsc --noEmit` passes
- `src/App.tsx` renders React 19 default page
- `package.json` shows `react: ^19.x`

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Vite refuses non-empty directory | Low | Low | Only metadata files present; use `--force` if needed |
| React 19 type mismatch | Low | Medium | Ensure @types/react@latest matches React 19 |

## Security Considerations

- No secrets or env vars in this phase
- `.gitignore` already excludes `.env*` files

## Next Steps

- Proceed to Phase 2: Configure Tailwind CSS v4 + shadcn/ui

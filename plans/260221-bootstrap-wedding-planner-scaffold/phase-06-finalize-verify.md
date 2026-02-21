---
phase: 6
title: "Finalize & Verify"
status: pending
priority: P2
effort: 15m
---

# Phase 6: Finalize & Verify

## Context Links

- [Plan Overview](./plan.md)
- All previous phase files

## Overview

- **Priority:** P2
- **Status:** Pending
- **Description:** Run all verification checks — TypeScript type checking, production build, dev server, and API endpoint — to confirm the scaffold is complete and functional. Clean up any remaining template boilerplate.

## Key Insights

- `tsc --noEmit` catches type errors without producing output files
- `npm run build` uses Vite to produce optimized production bundle in `dist/`
- API endpoints can be tested via `vercel dev` or confirmed by file structure
- Template boilerplate (logos, default text) should be fully removed

## Requirements

### Functional
- TypeScript type checking passes with zero errors
- Production build completes successfully
- Dev server starts and renders landing page
- `api/health.ts` is valid and ready for deployment
- No template boilerplate remains (Vite default logos, text, etc.)

### Non-Functional
- Build output is clean (no warnings)
- All placeholder directories exist
- README.md documents the tech stack and setup

## Related Code Files

### Files to Create
- `README.md` — project overview and setup instructions
- `docs/.gitkeep` — docs directory placeholder

### Files to Verify
- All files from Phases 1-5

### Files to Clean Up (if still present)
- `public/vite.svg` — Vite template logo (remove)
- Any references to Vite logo in `index.html`

## Implementation Steps

1. **Clean up remaining boilerplate**
   ```bash
   rm -f public/vite.svg
   ```
   - Check `index.html` for Vite favicon reference; update to generic or remove
   - Remove any remaining Vite default content

2. **Create `docs/` directory**
   ```bash
   mkdir -p docs
   touch docs/.gitkeep
   ```

3. **Create `README.md`**
   ```markdown
   # Wedding Planner

   A wedding planning application built with modern web technologies.

   ## Tech Stack

   - **Frontend:** Vite 7.x + React 19 + TypeScript 5.x
   - **Styling:** Tailwind CSS v4 + shadcn/ui
   - **Backend:** Vercel Serverless Functions
   - **Database:** Neon PostgreSQL + Drizzle ORM
   - **Cache:** Upstash Redis

   ## Getting Started

   ### Prerequisites
   - Node.js 20.19+ or 22.12+

   ### Setup
   ```bash
   npm install
   cp .env.example .env.local
   # Fill in .env.local with your credentials
   npm run dev
   ```

   ### Available Scripts
   - `npm run dev` — Start dev server
   - `npm run build` — Production build
   - `npm run preview` — Preview production build
   - `npm run db:generate` — Generate Drizzle migrations
   - `npm run db:migrate` — Run Drizzle migrations
   - `npm run db:studio` — Open Drizzle Studio

   ## Project Structure
   ```
   src/
     components/
       ui/          # shadcn/ui components
       layout/      # Layout components
     lib/           # Utilities and helpers
     db/            # Database schema and connection
     hooks/         # Custom React hooks
     pages/         # Page components
     types/         # TypeScript type definitions
   api/             # Vercel serverless functions
   docs/            # Project documentation
   plans/           # Implementation plans
   ```
   ```

4. **Run TypeScript type checking**
   ```bash
   npx tsc --noEmit
   ```
   - Must pass with zero errors

5. **Run production build**
   ```bash
   npm run build
   ```
   - Must complete successfully
   - Verify `dist/` directory created with HTML + JS + CSS

6. **Start dev server and verify**
   ```bash
   npm run dev
   ```
   - Confirm server starts on `localhost:5173`
   - Verify landing page renders with:
     - Header with "Wedding Planner" title
     - Card component with buttons
     - Footer with copyright
     - Proper Tailwind styling

7. **Verify API file structure**
   - Confirm `api/health.ts` exists and is valid TypeScript
   - (Full API testing requires `vercel dev` — optional at this stage)

8. **Final directory audit**
   ```
   Verify these exist:
   ├── api/health.ts
   ├── src/components/ui/ (6 shadcn components)
   ├── src/components/layout/ (3 layout files)
   ├── src/db/index.ts
   ├── src/db/schema.ts
   ├── src/lib/utils.ts
   ├── src/lib/redis.ts
   ├── src/hooks/.gitkeep
   ├── src/pages/.gitkeep
   ├── src/types/.gitkeep
   ├── docs/.gitkeep
   ├── vercel.json
   ├── drizzle.config.ts
   ├── components.json
   ├── .env.example
   ├── .gitignore
   ├── README.md
   └── package.json
   ```

9. **Clean dist/ before commit**
   ```bash
   rm -rf dist
   ```
   - `dist/` is in `.gitignore` but clean it anyway

## Todo List

- [ ] Remove `public/vite.svg` and Vite favicon references
- [ ] Create `docs/` directory with `.gitkeep`
- [ ] Create `README.md` with tech stack and setup docs
- [ ] Run `tsc --noEmit` — zero errors
- [ ] Run `npm run build` — succeeds
- [ ] Start dev server — landing page renders correctly
- [ ] Verify `api/health.ts` is valid
- [ ] Audit directory structure — all expected files present
- [ ] Clean `dist/` directory
- [ ] Final commit of scaffold

## Success Criteria

- `tsc --noEmit` exits with code 0
- `npm run build` exits with code 0 and produces `dist/`
- Dev server starts on localhost:5173
- Landing page renders with header, card, footer, and shadcn styling
- `api/health.ts` contains valid TypeScript
- All directories and files from audit list exist
- No template boilerplate remains
- `README.md` documents tech stack and setup

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missed boilerplate file | Low | Low | Directory audit catches strays |
| Type error in new files | Low | Medium | tsc --noEmit run catches all issues |
| Build fails on clean project | Very Low | Medium | All phases verified individually |

## Security Considerations

- Verify no secrets in committed files
- Confirm `.env.local` not tracked by git
- README does not contain credentials

## Next Steps

- Scaffold complete — ready for feature implementation
- Set up CI/CD pipeline (Vercel auto-deploys from GitHub)
- Connect Neon database and Upstash Redis via environment variables
- Begin implementing business features per project roadmap

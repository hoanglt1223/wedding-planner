# Brainstorm: Hash Routing → TanStack Router Migration

## Problem Statement
App uses hand-rolled hash-based routing (`window.location.hash`) in `main.tsx` with state-driven page switching (`state.page`) in `page-router.tsx`. This causes:
- No SEO/OG tags for public pages (wedding website, RSVP, shared cards)
- No deep linking or browser back/forward for app pages
- Fragile routing code scattered across 14 files (~33 hash refs)
- No type-safe params, no built-in code splitting orchestration

## Requirements
- Clean URLs for all routes (public + app internal)
- Type-safe route params
- Proper code splitting per route
- Browser back/forward navigation for app pages
- Deep linking support (e.g., `/app/planning`, `/app/astrology`)
- Maintain existing Vercel serverless API layer unchanged
- Preserve localStorage-based state management

## Evaluated Approaches

### A: React Router v7
- **Pros:** Largest ecosystem, battle-tested, lazy routes
- **Cons:** SSR-oriented API (loaders/actions) unnecessary for pure SPA, heavier bundle (~14KB), pushes patterns that conflict with localStorage state
- **Verdict:** Overfit for this use case

### B: TanStack Router ✅ CHOSEN
- **Pros:** Type-safe routes/params, SPA-first design, file-based or code-based, excellent code splitting, search params as state
- **Cons:** Smaller ecosystem, more upfront boilerplate for route tree
- **Verdict:** Best fit — designed for SPAs with client-side state

### C: Custom history API router
- **Pros:** Zero deps, minimal code change
- **Cons:** Same DX problems as current hash routing, no type safety, accumulates tech debt
- **Verdict:** Trap — swaps syntax without fixing architecture

## Final Solution: TanStack Router Full Migration

### Route Structure
```
/                    → LandingPage
/app                 → App layout (redirect to /app/home)
/app/home            → HomePage
/app/planning        → PlanningPage
/app/guests          → GuestsPage
/app/astrology       → AstrologyPage
/app/numerology      → NumerologyPage
/app/lunar           → LunarPage
/app/cards           → CardsPanel
/app/ai              → AiPanel
/app/handbook        → PrintPanel
/app/tasks           → TaskBoardDashboard
/app/website         → WebsiteSettingsPanel
/rsvp/$token         → RsvpLandingPage
/shared/$shareId     → SharedPreviewPage
/w/$slug             → WeddingWebsitePage
/photos/$token       → PhotoUploadPage
/tasks/$token        → TaskLandingPage
/admin               → AdminApp (lazy)
```

### Key Decisions
- `state.page` replaced by URL path — `store.setPage()` becomes `navigate()`
- Navigation components update to use `<Link>` instead of `setPage()`
- `/app` layout route wraps all app pages (shared header, sidebar, footer)
- Lazy loading via TanStack Router's `lazy()` route option
- Vercel rewrites already configured for history-mode (`/:path*` → `/index.html`)

### Migration Strategy
1. Install TanStack Router + devtools
2. Define route tree (code-based, not file-based — less disruption)
3. Create `/app` layout route with existing App shell
4. Convert each page-router case to a child route
5. Convert top-level hash routes to root-level routes
6. Update all 14 files with hash references to use `<Link>` / `useNavigate()`
7. Remove `state.page` from WeddingState + localStorage
8. Add redirect from hash URLs for backward compat

### Risks
- **localStorage migration:** `state.page` removal needs migrate-state update (wp_v16 → wp_v17)
- **Bookmark breakage:** Users with `#/app` bookmarks need hash → pathname redirects
- **PWA cache:** Service worker navigateFallback already points to `/index.html` — should work

### Success Criteria
- All routes use clean pathnames (no hash)
- Browser back/forward works across all app pages
- Type-safe route params (no more string slicing)
- Public pages shareable with correct URLs
- No regressions in existing functionality
- Bundle size neutral or smaller (lazy routes)

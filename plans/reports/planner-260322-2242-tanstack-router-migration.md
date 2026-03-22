# Planner Report: TanStack Router Migration

## Summary
Created 4-phase implementation plan to migrate from hash-based routing to TanStack Router.

## Plan Location
`D:\Projects\wedding-planner\plans\260322-2222-tanstack-router-migration\plan.md`

## Phases
1. **Install + Route Tree Scaffold** (1.5h) -- install packages, create `src/router.ts` with 18 routes, replace `Root` in `main.tsx` with `RouterProvider`
2. **App Layout + Child Routes** (2h) -- create `WeddingStoreContext`, convert `App.tsx` to layout route with `<Outlet />`, update 11 page components to consume store from context, delete `page-router.tsx`
3. **Update Navigation Refs** (1.5h) -- replace 33 hash refs across 14 files: sidebar/nav use `<Link>`, shareable URLs drop `#/` prefix
4. **Cleanup + Compat** (1h) -- remove `state.page` from WeddingState, add hash-to-pathname redirect for old bookmarks, add devtools

## Key Decisions
- Code-based route tree (not file-based) -- simpler for 18 routes, no plugin needed
- `WeddingStoreContext` to replace prop-drilling through PageRouter
- `lazyRouteComponent()` for 6 heavy pages (admin, tasks, website, wedding-web, photos, task-landing)
- No state version bump needed -- `page` field in existing localStorage is harmlessly ignored
- Hash redirect via `window.history.replaceState()` before React renders

## Files Inventory
- **Create**: `src/router.ts`, `src/contexts/wedding-store-context.tsx`
- **Delete**: `src/pages/page-router.tsx`
- **Major modify**: `src/main.tsx`, `src/App.tsx`, `src/hooks/use-wedding-store.ts`, `src/types/wedding.ts`
- **Navigation updates**: `left-sidebar.tsx`, `bottom-nav.tsx`, `quick-actions.tsx`, `landing-hero.tsx`, `landing-footer.tsx`, `admin-app.tsx`, `admin-sidebar.tsx`
- **URL string updates**: `share.ts`, `rsvp-export-actions.tsx`, `rsvp-qr-modal.tsx`, `rsvp-response-table.tsx`, `photo-upload-link.tsx`, `photo-qr-generator.tsx`, `website-slug-input.tsx`, `website-settings-panel.tsx`, `task-assignee-links.tsx`

## Total Effort: ~6h

## Unresolved Questions
- None -- all decisions resolved in brainstorm. Implementation can proceed.

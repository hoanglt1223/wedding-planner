# Phase 4: Remove state.page + Backward Compatibility

## Context
- [Plan overview](plan.md) | [Phase 3](phase-03-update-navigation-refs.md)
- Depends on: Phase 3 completed

## Overview
- **Priority:** P2
- **Status:** pending
- **Description:** Remove `page` from WeddingState, add hash-to-pathname redirects, clean up dead code, state migration

## Key Insights
- `state.page` currently in `WeddingState` interface, `DEFAULT_STATE`, and `useWeddingStore`
- `setPage` used in store, App.tsx `handleGoAI`, page tracking
- Users may have bookmarks with `#/app`, `#/rsvp/xxx`, etc. -- need redirect
- State migration: `wp_v16` has `page` field; removing it can be a clean-up in `wp_v16` (no version bump needed since the field is just ignored)

## Related Code Files

### Modify
- `src/types/wedding.ts` -- remove `page: string` from `WeddingState`
- `src/hooks/use-wedding-store.ts` -- remove `setPage` callback, remove from return
- `src/data/backgrounds.ts` (or wherever `DEFAULT_STATE` is) -- remove `page` default
- `src/App.tsx` -- remove `state.page` from tracking, remove `handleGoAI` (already done in Phase 2)
- `src/main.tsx` -- add hash redirect script before `RouterProvider`
- `src/pages/admin/admin-users.tsx` -- check if it uses `state.page` (grep showed it)
- `src/data/page-definitions.ts` -- keep (still used for sidebar nav items), but `DEFAULT_PAGE` export may be unused

### Delete
- `src/pages/page-router.tsx` -- already deleted in Phase 2

## Implementation Steps

1. **Add hash-to-pathname redirect in `main.tsx`**
   ```typescript
   // Before RouterProvider render, redirect hash URLs to pathname URLs
   const hash = window.location.hash
   if (hash.startsWith('#/')) {
     const path = hash.slice(1) // '#/app' -> '/app'
     window.history.replaceState(null, '', path)
   }
   ```
   This runs once on load, transparently redirecting old bookmarks.

2. **Remove `page` from `WeddingState`**
   - `src/types/wedding.ts`: delete `page: string;` line
   - Update `DEFAULT_STATE` in `src/data/backgrounds.ts`: remove `page: "home"`

3. **Remove `setPage` from store**
   - `src/hooks/use-wedding-store.ts`: delete `setPage` callback and its return
   - Remove from `WeddingStore` type (auto since it's `ReturnType`)

4. **Clean up tracking in `App.tsx`**
   - Remove `state.page` from `prevSnap` tracking
   - Replace with pathname-based page_view tracking:
     ```typescript
     const location = useLocation()
     useEffect(() => {
       const page = location.pathname.split('/').pop() || 'home'
       track("page_view", { page })
     }, [location.pathname, track])
     ```

5. **Check `admin-users.tsx`** for `state.page` usage -- update if needed

6. **State migration consideration**
   - No version bump needed: existing `wp_v16` data with `page` field is harmless (extra field is ignored by TypeScript)
   - `migrateState()` no change needed
   - If we want to be tidy: migration can `delete` the `page` key, but YAGNI

7. **Remove unused exports**
   - Check if `DEFAULT_PAGE` from `page-definitions.ts` is still used anywhere
   - Check if `PAGE_MAP` in `migrate-state.ts` still needed (yes, for old migrations)

8. **Add TanStack Router Devtools** (dev only)
   ```typescript
   // In main.tsx or router.ts, conditionally:
   import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
   // Add as child of RouterProvider or in root route component
   ```

9. **Final verification**
   ```bash
   pnpm lint
   pnpm build
   ```
   - Test all routes manually
   - Test hash bookmark redirect
   - Test browser back/forward
   - Test shareable links (RSVP, wedding website, photo upload)

## Todo List
- [ ] Add hash-to-pathname redirect in main.tsx
- [ ] Remove `page` from WeddingState interface
- [ ] Remove `setPage` from useWeddingStore
- [ ] Remove `page` from DEFAULT_STATE
- [ ] Update page tracking to use pathname
- [ ] Add TanStack Router Devtools (dev only)
- [ ] Remove unused code/exports
- [ ] Run lint + build
- [ ] Manual test: all routes, back/forward, hash redirect, shareable links

## Success Criteria
- `state.page` no longer exists in types or store
- Old hash bookmarks (e.g., `#/app`, `#/rsvp/xxx`) redirect to pathname equivalents
- Browser back/forward works for all app pages
- No lint errors, build passes
- Page view tracking fires on route changes
- PWA service worker handles all routes (navigateFallback: `/index.html` -- already configured)

## Risk Assessment
- **Hash redirect race condition**: redirect runs synchronously before React renders, so no flash. `replaceState` doesn't trigger a page reload.
- **PWA offline navigation**: service worker `navigateFallback` already configured for SPA -- all non-API routes fall back to `index.html`. No change needed.
- **localStorage bloat**: old `page` field stays in stored JSON. Harmless. Cleans up on next full state reset.

## Security Considerations
- No auth changes
- Shareable URLs now use clean paths -- no security impact (same server-side validation)

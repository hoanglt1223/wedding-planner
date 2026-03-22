# Phase 3: Update Hash References + Navigation Components

## Context
- [Plan overview](plan.md) | [Phase 2](phase-02-app-layout-and-children.md)
- Depends on: Phase 2 completed

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Replace all 33 hash references across 14 files with TanStack Router `<Link>` / `useNavigate()` / pathname URLs

## Key Insights
- Two categories of hash refs:
  1. **Internal navigation** (sidebar, bottom nav, quick actions, landing hero/footer) -- use `<Link>` or `useNavigate()`
  2. **External/shareable URLs** (RSVP links, share links, website URLs) -- use `window.location.origin + pathname` string

## Related Code Files

### Files with internal navigation (use `<Link>` / `useNavigate()`)

| File | Current pattern | New pattern |
|------|----------------|-------------|
| `src/components/layout/left-sidebar.tsx` | `onPageChange(pageId)` callback | `<Link to={'/app/' + pageId}>` |
| `src/components/layout/bottom-nav.tsx` | `onPageChange(section.defaultPage)` | `useNavigate()` or `<Link>` |
| `src/components/home/quick-actions.tsx` | `onNavigate(page)` callback | `<Link to={'/app/' + page}>` |
| `src/components/landing/landing-hero.tsx` | `href="#/app"` | `<Link to="/app/home">` |
| `src/components/landing/landing-footer.tsx` | `href="#/app"` | `<Link to="/app/home">` |
| `src/pages/admin/admin-app.tsx` | `window.location.hash = "#/admin"` | `useNavigate()` |
| `src/pages/admin/admin-sidebar.tsx` | `window.location.hash = "#/admin/${route}"` | `useNavigate()` or `<Link>` |
| `src/pages/home-page.tsx` | `store.setPage` passed to QuickActions | Removed (QuickActions uses Link directly) |

### Files with shareable URLs (string replacement only)

| File | Hash pattern | New pattern |
|------|-------------|-------------|
| `src/lib/share.ts:28` | `/#/shared/${id}` | `/shared/${id}` |
| `src/components/guests/rsvp-export-actions.tsx:18,39` | `/#/rsvp/${token}` | `/rsvp/${token}` |
| `src/components/guests/rsvp-qr-modal.tsx:15` | `/#/rsvp/${token}` | `/rsvp/${token}` |
| `src/components/guests/rsvp-response-table.tsx:22` | `/#/rsvp/${token}` | `/rsvp/${token}` |
| `src/components/photo-wall/photo-upload-link.tsx:53` | `/#/photos/${token}` | `/photos/${token}` |
| `src/components/photo-wall/photo-qr-generator.tsx:12` | `/#/photos/${token}` | `/photos/${token}` |
| `src/components/website/website-slug-input.tsx:31` | `#/w/` | `/w/` |
| `src/components/website/website-settings-panel.tsx:17,59` | `#/w/${slug}` | `/w/${slug}` |
| `src/components/tasks/task-assignee-links.tsx:54,68,97` | `/#/tasks/${token}` | `/tasks/${token}` |

## Implementation Steps

1. **Update `LeftSidebar`** (`src/components/layout/left-sidebar.tsx`)
   - Replace `onPageChange` callback with TanStack `<Link>` components
   - Change props: remove `onPageChange`, `activePage`
   - Derive active state from `useRouterState()` or `useMatch()`
   - Each nav button becomes `<Link to={'/app/' + page.id}>`
   - Use TanStack's `activeProps` or manual path comparison for active styling

2. **Update `BottomNav`** (`src/components/layout/bottom-nav.tsx`)
   - Similar to LeftSidebar: replace `onPageChange` with `<Link>`
   - `activePage` derived from current pathname
   - Keep `onMenuOpen` prop for drawer trigger

3. **Update `QuickActions`** (`src/components/home/quick-actions.tsx`)
   - Replace `onNavigate` callback with `<Link to={'/app/' + page}>`
   - Remove `onNavigate` prop

4. **Update landing page links** (`landing-hero.tsx`, `landing-footer.tsx`)
   - Replace `<a href="#/app">` with `<Link to="/app/home">`
   - Import `Link` from `@tanstack/react-router`

5. **Update admin navigation** (`admin-app.tsx`, `admin-sidebar.tsx`)
   - Replace `window.location.hash = "#/admin/..."` with `useNavigate()`
   - `parseAdminRoute()` reads from pathname instead of hash
   - Or: define admin sub-routes in the route tree (dashboard, users, analytics, system)
   - **Simpler approach**: keep admin's internal routing as-is but switch from hash to pathname via `useLocation()` + `navigate()`

6. **Update shareable URL strings** (simple find-replace)
   - All files: replace `/#/` with `/` in URL construction
   - Remove `window.location.pathname` prefix where it appears (just use `window.location.origin`)
   - Pattern: `` `${window.location.origin}/shared/${id}` `` (no hash)

7. **Update `App.tsx`** props passed to sidebar/nav
   - Remove `activePage={state.page}` -- components derive from router
   - Remove `onPageChange={store.setPage}` -- components use `<Link>` / `navigate`
   - `store.setPage` can be removed from the store entirely (Phase 4)

8. **Run `pnpm build`** + manual test all navigation paths

## Todo List
- [ ] Update LeftSidebar to use `<Link>`
- [ ] Update BottomNav to use `<Link>` / `navigate()`
- [ ] Update QuickActions to use `<Link>`
- [ ] Update landing-hero.tsx and landing-footer.tsx
- [ ] Update admin-app.tsx and admin-sidebar.tsx
- [ ] Replace all shareable URL hash patterns (9 files)
- [ ] Remove activePage/onPageChange props from App.tsx
- [ ] Verify build + test all routes

## Success Criteria
- No `#/` references remain in source code
- Sidebar, bottom nav, quick actions all navigate via `<Link>`
- Active page highlighting works based on URL path
- All shareable links produce clean URLs (e.g., `https://domain.com/rsvp/abc123`)
- Admin panel navigation works

## Risk Assessment
- **LeftSidebar active state**: Currently uses `page.id === activePage`. New: compare `page.id` against pathname segment. Pattern: `location.pathname === '/app/' + page.id` or use TanStack's `Link` `activeProps`.
- **BottomNav section mapping**: `PAGE_TO_SECTION` map still works -- just need to extract page ID from pathname instead of state.

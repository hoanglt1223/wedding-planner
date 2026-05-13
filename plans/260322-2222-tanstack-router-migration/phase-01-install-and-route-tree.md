# Phase 1: Install + Route Tree Scaffold

## Context
- [Plan overview](plan.md)
- [TanStack Router code-based routing docs](https://tanstack.com/router/latest/docs/routing/code-based-routing)
- [Code splitting docs](https://tanstack.com/router/latest/docs/guide/code-splitting)

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Install TanStack Router, define the full route tree, wire up `RouterProvider` in `main.tsx`

## Requirements
- Install `@tanstack/react-router` + devtools
- Create route tree file with all 18+ routes
- Replace `Root` component in `main.tsx` with `RouterProvider`
- TypeScript strict mode + `verbatimModuleSyntax` + `erasableSyntaxOnly` compatibility

## Architecture

### Route tree structure
```
rootRoute (/)
├── indexRoute (/) -> LandingPage
├── appRoute (/app) -> AppLayout (Outlet)
│   ├── appIndexRoute (/app/) -> redirect to /app/home
│   ├── homeRoute (/app/home) -> HomePage
│   ├── planningRoute (/app/planning) -> PlanningPage
│   ├── guestsRoute (/app/guests) -> GuestsPage
│   ├── astrologyRoute (/app/astrology) -> AstrologyPage
│   ├── numerologyRoute (/app/numerology) -> NumerologyPage
│   ├── lunarRoute (/app/lunar) -> LunarPage
│   ├── cardsRoute (/app/cards) -> CardsPanel
│   ├── aiRoute (/app/ai) -> AiPanel
│   ├── handbookRoute (/app/handbook) -> PrintPanel
│   ├── tasksRoute (/app/tasks) -> TaskBoardDashboard (lazy)
│   └── websiteRoute (/app/website) -> WebsiteSettingsPanel (lazy)
├── rsvpRoute (/rsvp/$token) -> RsvpLandingPage
├── sharedRoute (/shared/$shareId) -> SharedPreviewPage
├── weddingWebRoute (/w/$slug) -> WeddingWebsitePage (lazy)
├── photosRoute (/photos/$token) -> PhotoUploadPage (lazy)
├── tasksLandingRoute (/tasks/$token) -> TaskLandingPage (lazy)
└── adminRoute (/admin) -> AdminApp (lazy, has own sub-routing)
```

## Related Code Files

### Create
- `src/router.ts` -- route tree + router instance

### Modify
- `src/main.tsx` -- replace `Root` with `RouterProvider`
- `package.json` -- add dependencies

## Implementation Steps

1. **Install packages**
   ```bash
   pnpm add @tanstack/react-router
   pnpm add -D @tanstack/react-router-devtools
   ```

2. **Create `src/router.ts`**
   ```typescript
   import {
     createRouter,
     createRootRoute,
     createRoute,
     redirect,
     lazyRouteComponent,
   } from '@tanstack/react-router'

   // Root route -- renders Outlet for child matching
   const rootRoute = createRootRoute()

   // Landing page (index)
   const indexRoute = createRoute({
     getParentRoute: () => rootRoute,
     path: '/',
     component: () => import('./pages/landing-page').then(m => m.LandingPage),
     // Actually use lazyRouteComponent or direct import -- see below
   })
   ```

   For eager-loaded pages (LandingPage, App pages), use direct `component`.
   For lazy pages, use `lazyRouteComponent`:
   ```typescript
   import { lazyRouteComponent } from '@tanstack/react-router'

   const adminRoute = createRoute({
     getParentRoute: () => rootRoute,
     path: '/admin',
     component: lazyRouteComponent(() => import('./pages/admin/admin-app')),
   })
   ```

3. **Define all routes** following the tree above. Key patterns:
   - `/app` layout route: `component` renders the App shell with `<Outlet />`
   - `/app/` index: uses `beforeLoad` to `throw redirect({ to: '/app/home' })`
   - Param routes: `path: '/rsvp/$token'` -- TanStack auto-extracts `$token`
   - Lazy routes: `lazyRouteComponent(() => import('./path'))` for admin, tasks, website, wedding-web, photos, task-landing

4. **Build route tree**
   ```typescript
   const routeTree = rootRoute.addChildren([
     indexRoute,
     appRoute.addChildren([
       appIndexRoute,
       homeRoute, planningRoute, guestsRoute,
       astrologyRoute, numerologyRoute, lunarRoute,
       cardsRoute, aiRoute, handbookRoute,
       tasksRoute, websiteRoute,
     ]),
     rsvpRoute, sharedRoute, weddingWebRoute,
     photosRoute, tasksLandingRoute, adminRoute,
   ])

   export const router = createRouter({ routeTree })

   // Type registration for type safety
   declare module '@tanstack/react-router' {
     interface Register {
       router: typeof router
     }
   }
   ```

5. **Update `src/main.tsx`**
   ```typescript
   import { StrictMode } from 'react'
   import { createRoot } from 'react-dom/client'
   import { RouterProvider } from '@tanstack/react-router'
   import { router } from './router'
   import './index.css'

   createRoot(document.getElementById('root')!).render(
     <StrictMode>
       <RouterProvider router={router} />
     </StrictMode>,
   )
   ```

6. **Run `pnpm build`** to verify no TS errors

## Todo List
- [ ] Install @tanstack/react-router + devtools
- [ ] Create src/router.ts with full route tree
- [ ] Replace Root component in main.tsx with RouterProvider
- [ ] Verify build passes with `pnpm build`

## Success Criteria
- `pnpm build` succeeds
- Navigating to `/` shows LandingPage
- Navigating to `/app/home` shows App shell (even if page content not yet wired)
- Navigating to `/admin` lazy-loads AdminApp

## Risk Assessment
- **`erasableSyntaxOnly`**: TanStack Router uses `declare module` for type registration. This is a declaration, not erasable syntax -- should be fine. If issues, can put in a `.d.ts` file.
- **React 19 compat**: TanStack Router v1 supports React 18+. Verify no peer dep warnings on install.

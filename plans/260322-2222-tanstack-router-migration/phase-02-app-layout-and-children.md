# Phase 2: App Layout Route + Child Routes

## Context
- [Plan overview](plan.md) | [Phase 1](phase-01-install-and-route-tree.md)
- Depends on: Phase 1 completed

## Overview
- **Priority:** P1
- **Status:** pending
- **Description:** Extract App shell into a layout component with `<Outlet />`, wire each app page as a child route, pass store/state via route context

## Key Insights
- `App.tsx` currently contains: store init, sync, tracking, theme, layout shell (header/sidebar/footer), and `<PageRouter>` for content
- `PageRouter` receives `state`, `store`, `progress`, `onGoAI`, `userId` as props
- Challenge: child route components need access to store/state but TanStack Router uses `component` on route config
- Solution: Use TanStack Router's **route context** to pass the store down, OR keep using the existing pattern where `App.tsx` renders `<Outlet />` and child components access store via a shared hook/context

### Chosen approach: React Context for store
Create a lightweight `WeddingStoreContext` so child route components can `useContext()` instead of prop-drilling. This is cleaner than route context for mutable app state.

## Related Code Files

### Create
- `src/contexts/wedding-store-context.tsx` -- context provider for store

### Modify
- `src/App.tsx` -- become the `/app` layout: replace `<PageRouter>` with `<Outlet />`
- `src/pages/page-router.tsx` -- DELETE (replaced by route tree)
- `src/pages/home-page.tsx` -- consume store from context instead of props
- `src/pages/planning-page.tsx` -- same
- `src/pages/guests-page.tsx` -- same
- `src/pages/astrology-page.tsx` -- same
- `src/pages/numerology-page.tsx` -- same
- `src/pages/lunar-page.tsx` -- same
- `src/components/cards/cards-panel.tsx` -- same
- `src/components/ai/ai-panel.tsx` -- same
- `src/components/print/print-panel.tsx` -- same
- `src/components/tasks/task-board-dashboard.tsx` -- same
- `src/components/website/website-settings-panel.tsx` -- same
- `src/router.ts` -- update app child route components

## Implementation Steps

1. **Create `src/contexts/wedding-store-context.tsx`**
   ```typescript
   import { createContext, useContext } from 'react'
   import type { WeddingStore } from '@/hooks/use-wedding-store'

   export const WeddingStoreContext = createContext<WeddingStore | null>(null)

   export function useWeddingStoreContext(): WeddingStore {
     const store = useContext(WeddingStoreContext)
     if (!store) throw new Error('useWeddingStoreContext must be used within WeddingStoreContext.Provider')
     return store
   }
   ```

2. **Update `App.tsx`** to be the `/app` layout route component:
   - Keep all existing logic (store, sync, tracking, theme, onboarding)
   - Replace `<PageRouter ... />` with `<Outlet />`
   - Wrap children in `<WeddingStoreContext.Provider value={store}>`
   - Import `Outlet` from `@tanstack/react-router`
   - Remove `PageRouter` import
   - Remove `handleGoAI` (navigation will use `useNavigate()` instead)

   Key change in JSX:
   ```tsx
   <WeddingStoreContext.Provider value={{ ...store, progress, userId }}>
     <main className="flex-1 overflow-y-auto">
       <div className="page-transition-enter max-w-[920px] mx-auto px-3 sm:px-4 pt-2 pb-4">
         <Outlet />
       </div>
       <Footer lang={state.lang} />
     </main>
   </WeddingStoreContext.Provider>
   ```

   Note: The `key={state.page}` on the content div should be replaced with route-based keying (TanStack Router handles transitions).

3. **Update page tracking in `App.tsx`**
   - Replace `state.page` tracking with TanStack Router's location
   - Use `useRouterState()` or `useLocation()` to get current path
   - Track `pathname` instead of `state.page`

4. **Update `LeftSidebar` and `BottomNav`**
   - `activePage` derived from current route path instead of `state.page`
   - `onPageChange` replaced by navigation (Phase 3 handles this fully)
   - Temporarily can keep callback that calls `navigate({ to: '/app/' + pageId })`

5. **Update each page component** to consume store from context:
   - Each page: `const store = useWeddingStoreContext()`
   - Extract needed values: `const { state } = store`
   - Remove props interface or make props optional
   - Example for `HomePage`:
     ```typescript
     export function HomePage() {
       const { state, ...store } = useWeddingStoreContext()
       const progress = store.getProgress()
       // ... rest unchanged
     }
     ```

6. **Update route definitions in `src/router.ts`**
   - Each app child route gets its component pointing to the updated page
   - Eager imports for small pages, `lazyRouteComponent` for heavy ones

7. **Delete `src/pages/page-router.tsx`**

8. **Run `pnpm build`** to verify

## Todo List
- [ ] Create WeddingStoreContext
- [ ] Update App.tsx: replace PageRouter with Outlet, add context provider
- [ ] Update each of 11 page components to use context
- [ ] Update route definitions in router.ts
- [ ] Delete page-router.tsx
- [ ] Update page tracking to use pathname
- [ ] Verify build passes

## Success Criteria
- All `/app/*` routes render correct page content
- Store state (localStorage) still works -- checklist items, budget, etc.
- Theme application works (CSS variables on root div)
- Onboarding wizard still gates access
- Save toast still fires on state changes

## Risk Assessment
- **Context re-renders**: `WeddingStoreContext` value changes on every state update, causing all consumers to re-render. This is identical to current behavior (props flow from App down). No regression.
- **`onGoAI` pattern**: Currently `handleGoAI` calls `store.setPage("ai")`. Replace with `navigate({ to: '/app/ai' })`. Used in `PlanningPage` -- update that component.
- **`key={state.page}` transition**: Currently triggers CSS animation on page switch. Replace with route-based approach or remove (TanStack unmounts/remounts on route change anyway).

## Security Considerations
- No auth changes -- admin route still has its own login gate
- Store context doesn't expose anything not already in localStorage

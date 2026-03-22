import { createRootRoute, createRoute, createRouter, Outlet, redirect, lazyRouteComponent } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { LandingPage } from './pages/landing-page'
import AppLayout from './App'
import { HomePage } from './pages/home-page'
import { PlanningPage } from './pages/planning-page'
import { GuestsPage } from './pages/guests-page'
import { AstrologyPage } from './pages/astrology-page'
import { NumerologyPage } from './pages/numerology-page'
import { LunarPage } from './pages/lunar-page'
import { CardsPanel } from './components/cards/cards-panel'
import { AiPanel } from './components/ai/ai-panel'
import { PrintPanel } from './components/print/print-panel'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})

// Landing page route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

// App layout route
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppLayout,
})

// App index — redirect to /app/home
const appIndexRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/app/home' })
  },
})

const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/home',
  component: HomePage,
})

const planningRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/planning',
  component: PlanningPage,
})

const guestsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/guests',
  component: GuestsPage,
})

const astrologyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/astrology',
  component: AstrologyPage,
})

const numerologyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/numerology',
  component: NumerologyPage,
})

const lunarRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/lunar',
  component: LunarPage,
})

const cardsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cards',
  component: CardsPanel,
})

const aiRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/ai',
  component: AiPanel,
})

const handbookRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/handbook',
  component: PrintPanel,
})

const tasksRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/tasks',
  component: lazyRouteComponent(() => import('./components/tasks/task-board-dashboard'), 'default'),
})

const websiteRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/website',
  component: lazyRouteComponent(() => import('./components/website/website-settings-panel'), 'default'),
})

// Standalone routes
const rsvpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rsvp/$token',
  component: lazyRouteComponent(() => import('./pages/rsvp-landing-page'), 'RsvpLandingPage'),
})

const sharedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shared/$shareId',
  component: lazyRouteComponent(() => import('./pages/shared-preview-page'), 'SharedPreviewPage'),
})

const weddingWebsiteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/w/$slug',
  component: lazyRouteComponent(() => import('./pages/wedding-website-page'), 'default'),
})

const photosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/photos/$token',
  component: lazyRouteComponent(() => import('./pages/photo-upload-page'), 'default'),
})

const taskLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks/$token',
  component: lazyRouteComponent(() => import('./pages/task-landing-page'), 'default'),
})

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: lazyRouteComponent(() => import('./pages/admin/admin-app'), 'default'),
})

// Catch-all for admin sub-routes (/admin/users, /admin/analytics, etc.)
// AdminApp handles its own internal routing via pathname parsing
const adminCatchAllRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '$',
})

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  appRoute.addChildren([
    appIndexRoute,
    homeRoute,
    planningRoute,
    guestsRoute,
    astrologyRoute,
    numerologyRoute,
    lunarRoute,
    cardsRoute,
    aiRoute,
    handbookRoute,
    tasksRoute,
    websiteRoute,
  ]),
  rsvpRoute,
  sharedRoute,
  weddingWebsiteRoute,
  photosRoute,
  taskLandingRoute,
  adminRoute.addChildren([adminCatchAllRoute]),
])

export const router = createRouter({ routeTree })

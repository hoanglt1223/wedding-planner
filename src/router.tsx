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
import { ChecklistPage } from './pages/checklist-page'

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

const checklistRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/checklist',
  component: ChecklistPage,
})

const giftRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/gifts',
  component: lazyRouteComponent(() => import('./pages/gift-page'), 'default'),
})

const seatingRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/seating',
  component: lazyRouteComponent(() => import('./pages/seating-page'), 'default'),
})

const itineraryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/itinerary',
  component: lazyRouteComponent(() => import('./pages/itinerary-page'), 'default'),
})

const songsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/songs',
  component: lazyRouteComponent(() => import('./components/songs/song-list-page'), 'SongListPage'),
})

const speechesRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/speeches',
  component: lazyRouteComponent(() => import('./components/speeches/speech-list-page'), 'SpeechListPage'),
})

const vendorsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/vendors',
  component: lazyRouteComponent(() => import('./pages/vendor-page'), 'VendorPage'),
})

const contractsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/contracts',
  component: lazyRouteComponent(() => import('./pages/contracts-page'), 'ContractsPage'),
})

const contactsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/contacts',
  component: lazyRouteComponent(() => import('./pages/contacts-page'), 'ContactsPage'),
})

const guestBookRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/guest-book',
  component: lazyRouteComponent(() => import('./pages/guest-book-page'), 'default'),
})

const weddingPartyRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/wedding-party',
  component: lazyRouteComponent(() => import('./pages/wedding-party-page'), 'WeddingPartyPage'),
})

const moodBoardRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/mood-board',
  component: lazyRouteComponent(() => import('./pages/mood-board-page'), 'MoodBoardPage'),
})

const emergencyKitRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/emergency-kit',
  component: lazyRouteComponent(() => import('./pages/emergency-kit-page'), 'EmergencyKitPage'),
})

const guestGiftsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/guest-gifts',
  component: lazyRouteComponent(() => import('./pages/guest-gift-page'), 'default'),
})

const photoGalleryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/photos',
  component: lazyRouteComponent(() => import('./pages/photo-gallery-page'), 'default'),
})

const registryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/registry',
  component: lazyRouteComponent(() => import('./pages/registry-page'), 'default'),
})

const transportationRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/transportation',
  component: lazyRouteComponent(() => import('./pages/transportation-page'), 'default'),
})

const analyticsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/analytics',
  component: lazyRouteComponent(() => import('./pages/analytics-page'), 'default'),
})

const anniversaryRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/anniversary',
  component: lazyRouteComponent(() => import('./pages/anniversary-page'), 'AnniversaryPage'),
})

const honeymoonRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/honeymoon',
  component: lazyRouteComponent(() => import('./pages/honeymoon-page'), 'HoneymoonPage'),
})

const budgetRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/budget',
  component: lazyRouteComponent(() => import('./pages/budget-page'), 'BudgetPage'),
})

const photoShotsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/photo-shots',
  component: lazyRouteComponent(() => import('./pages/photo-shots-page'), 'PhotoShotsPage'),
})

const welcomeBagsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/welcome-bags',
  component: lazyRouteComponent(() => import('./pages/welcome-bag-page'), 'WelcomeBagPage'),
})

const weatherRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/weather',
  component: lazyRouteComponent(() => import('./pages/weather-page'), 'default'),
})

const weddingDayRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/wedding-day',
  component: lazyRouteComponent(() => import('./pages/wedding-day-page'), 'default'),
})

const menuRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/menu',
  component: lazyRouteComponent(() => import('./pages/menu-page'), 'default'),
})

const menuCardsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/menu-cards',
  component: lazyRouteComponent(() => import('./pages/menu-cards-page'), 'default'),
})

const guestMealsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/guest-meals',
  component: lazyRouteComponent(() => import('./components/meals/guest-meal-assignment-page'), 'GuestMealAssignmentPage'),
})

const hashtagGeneratorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/hashtag-generator',
  component: lazyRouteComponent(() => import('./pages/hashtag-generator-page'), 'default'),
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
    checklistRoute,
    giftRoute,
    seatingRoute,
    itineraryRoute,
    songsRoute,
    vendorsRoute,
    contractsRoute,
    contactsRoute,
    speechesRoute,
    guestBookRoute,
    weddingPartyRoute,
    moodBoardRoute,
    emergencyKitRoute,
    guestGiftsRoute,
    photoGalleryRoute,
    registryRoute,
    analyticsRoute,
    budgetRoute,
    photoShotsRoute,
    transportationRoute,
    welcomeBagsRoute,
    weatherRoute,
    weddingDayRoute,
    anniversaryRoute,
    honeymoonRoute,
    menuRoute,
    menuCardsRoute,
    guestMealsRoute,
    hashtagGeneratorRoute,
  ]),
  rsvpRoute,
  sharedRoute,
  weddingWebsiteRoute,
  photosRoute,
  taskLandingRoute,
  adminRoute.addChildren([adminCatchAllRoute]),
])

export const router = createRouter({ routeTree })

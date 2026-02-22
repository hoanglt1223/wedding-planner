# Mobile Responsiveness & Launch Readiness Audit

**Score: 65/100** — Good foundation, targeted fixes needed.

## Components Already Mobile-Friendly
- `src/components/wedding/stats-grid.tsx` — `max-sm:grid-cols-2` + `grid-cols-4`
- `src/components/wedding/people-grid.tsx` — `max-sm:grid-cols-2` + `grid-cols-3`
- `src/components/guests/seating-chart.tsx` — `sm:grid-cols-3` + `grid-cols-2`
- `src/components/cards/invitation-grid.tsx` — `sm:grid-cols-3 md:grid-cols-5` + `grid-cols-2`
- `src/components/cards/background-grid.tsx` — Same pattern
- `src/components/cards/photo-board.tsx` — `sm:grid-cols-3` + `grid-cols-2`
- `src/components/layout/header.tsx` — `hidden sm:block` for title
- `src/components/guests/guest-table.tsx` — `hidden sm:table-cell` for phone column
- `src/components/layout/scrollable-tab-bar.tsx` — Proper scroll with fade indicators
- `src/components/notes/notes-panel.tsx`, `ai/ai-panel.tsx`, `cards/rsvp-section.tsx`

## Components Needing Mobile Fixes

### Critical
1. **guest-panel.tsx** (line 79) — `grid-cols-2` with 5 inputs = misaligned on <640px
2. **guest-table.tsx** (line 21) — `min-w-[420px]` forces horizontal scroll on phones <420px
3. **vendor-panel.tsx** (line 61-73) — `flex gap-1` inputs don't stack on phones
4. **budget-category-row.tsx** (line 28-40) — Hardcoded `w-[50px]` and `w-[80px]` widths

### Minor
5. **budget-panel.tsx** (line 55) — Preset buttons may overflow on small screens
6. **App.tsx** (line 66) — `px-2` (8px) padding tight on 320px phones

## Meta/Viewport
- `charset="UTF-8"` ✓ | `viewport` ✓ | Google Fonts ✓
- **Missing**: manifest.json, theme-color, apple-touch-icon, favicon, OG tags, description

## Public Directory: EMPTY
- No favicon, icons, manifest, robots.txt, or service worker

## Onboarding Gaps
- App starts with pre-filled example data ("Nguyễn Thị Thu Thảo" & "Nguyễn Thanh Hoàng")
- No welcome page, tutorial, or feature explanation
- No empty state design for first-time users
- Budget pre-set to 200M VND with no explanation

## Missing Dependencies
- No PWA plugin (vite-plugin-pwa or workbox)
- No social sharing meta tags
- No image export library (html2canvas)

## State Management
- localStorage key `wp_v11`, auto-save via SaveToast
- DEFAULT_STATE in backgrounds.ts with pre-filled data
- Clean factory pattern, no persistence issues

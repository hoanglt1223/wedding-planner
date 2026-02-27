---
phase: "07"
title: "Wedding Website (Public Landing Page)"
status: complete
priority: P1
effort: 2-3 days
completed: 2026-02-28
---

# Phase 07: Wedding Website (Public Landing Page)

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [researcher-02 report](../260227-phase2-features-brainstorm/research/researcher-02-taskboard-website-countdown.md)

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (WebsiteSettings type, store methods, routes, i18n)
- **Can run with:** Phases 02, 03, 04, 05, 06
- **No file conflicts** — creates files in `src/components/website/`, `src/pages/`, `api/`

## Overview
Public shareable wedding page at `#/w/:slug`. Assembles existing couple data (names, date, venue, timeline, photos) into a beautiful themed page. Couple configures which sections to show. API fetches public subset of wedding data by slug.

## Key Insights
- Hash route `#/w/:slug` for simplest integration (no server routing changes)
- Limitation: hash routes don't support OG meta tags for social sharing (documented tradeoff)
- Slug derived from couple names using Vietnamese diacritics removal
- Public data is a SUBSET of WeddingState — no budget, vendor, or private info
- Theme inherits couple's chosen app theme
- Sections: Hero (names+date+countdown), Story, Timeline, Gallery, Venue/Map, RSVP link
- Website settings UI lives within the app (settings panel)
- API endpoint fetches public data from DB (user_sessions.wedding_data)

## Requirements

### Functional
- **Public wedding page** (`#/w/:slug`):
  - Hero section: couple names, wedding date, countdown, custom message
  - Story section: couple's story text
  - Timeline section: timeline entries (from Phase 03 data)
  - Gallery section: photos (from existing `photos` in state, not Photo Wall)
  - Venue section: venue name, address, map link
  - RSVP section: link to RSVP page
  - Themed: inherits couple's selected theme
  - Mobile-first responsive
- **Settings UI** (within app):
  - Enable/disable website
  - Slug configuration (auto-generated + editable)
  - Section toggles (story, timeline, gallery, venue, rsvp)
  - Hero image URL
  - Custom welcome message
  - Story text editor
  - Preview link
  - Copy link button
- **API endpoint**:
  - `GET /api/website?slug=X` — fetch public wedding data by slug

### Non-Functional
- Page loads fast (public data cached at CDN level via Cache-Control headers)
- Slug uniqueness validated
- All files < 200 lines

## Architecture

```
Public page: #/w/:slug
  └── WeddingWebsitePage (src/pages/wedding-website-page.tsx)
        ├── website-hero.tsx         — couple names, date, countdown, photo
        ├── website-story.tsx        — story section
        ├── website-timeline.tsx     — timeline entries display
        ├── website-gallery.tsx      — photo grid
        ├── website-venue.tsx        — venue info + map link
        └── website-rsvp-cta.tsx     — RSVP call-to-action

Settings (within app):
  └── WebsiteSettingsPanel (src/components/website/website-settings-panel.tsx)
        ├── website-slug-input.tsx   — slug configuration
        └── website-section-toggles.tsx — section visibility

API:
  └── api/website.ts                — fetch public data by slug
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `WebsiteSettings`, `TimelineEntry`, `WeddingState`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — `setWebsiteSettings()`
- `D:\Projects\wedding-planner\src\db\schema.ts` — `userSessions` table
- `D:\Projects\wedding-planner\src\db\index.ts` — `createDb()`
- `D:\Projects\wedding-planner\src\data\themes.ts` — `THEMES`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`
- `D:\Projects\wedding-planner\src\lib\format.ts` — date formatting

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\pages\wedding-website-page.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-hero.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-story.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-timeline.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-gallery.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-venue.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-rsvp-cta.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-settings-panel.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-slug-input.tsx`
- `D:\Projects\wedding-planner\src\components\website\website-section-toggles.tsx`
- `D:\Projects\wedding-planner\src\lib\website-api.ts`
- `D:\Projects\wedding-planner\src\lib\slug-utils.ts`
- `D:\Projects\wedding-planner\api\website.ts`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/pages/wedding-website-page.tsx` | CREATE — default export, lazy-loaded from main.tsx |
| `src/components/website/website-hero.tsx` | CREATE |
| `src/components/website/website-story.tsx` | CREATE |
| `src/components/website/website-timeline.tsx` | CREATE |
| `src/components/website/website-gallery.tsx` | CREATE |
| `src/components/website/website-venue.tsx` | CREATE |
| `src/components/website/website-rsvp-cta.tsx` | CREATE |
| `src/components/website/website-settings-panel.tsx` | CREATE |
| `src/components/website/website-slug-input.tsx` | CREATE |
| `src/components/website/website-section-toggles.tsx` | CREATE |
| `src/lib/website-api.ts` | CREATE — client API helper |
| `src/lib/slug-utils.ts` | CREATE — Vietnamese slug generation |
| `api/website.ts` | CREATE — serverless handler |

## Implementation Steps

### 1. Create `src/lib/slug-utils.ts`

Vietnamese-aware slug generation:
```typescript
export function generateSlug(bride: string, groom: string): string {
  // Combine names: "minh-linh" from "Minh" + "Linh"
  // Remove Vietnamese diacritics: NFD normalize + strip combining chars
  // Lowercase, replace spaces with hyphens, remove non-alphanumeric
  const combined = `${groom}-${bride}`;
  return combined
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,50}[a-z0-9]$/.test(slug);
}
```
Max ~30 lines.

### 2. Create `api/website.ts`

Serverless handler:
```typescript
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  // Only GET allowed

  // GET /api/website?slug=X
  //   Search user_sessions where wedding_data->>'websiteSettings' contains slug
  //   Use SQL: WHERE wedding_data->'websiteSettings'->>'slug' = $slug
  //     AND wedding_data->'websiteSettings'->>'enabled' = 'true'
  //   Extract PUBLIC subset:
  //     couple info (names, date), theme, rsvp settings (venue, story),
  //     website settings, timeline entries, photos (non-photo-wall)
  //   Do NOT expose: budget, vendors, expenses, API keys, notes
  //   Cache-Control: public, s-maxage=300, stale-while-revalidate=600
  //   Return { found: true, data: {...} }

  // Rate limit: 60 req/min per IP (public endpoint)
}
```
Max ~100 lines.

### 3. Create `src/lib/website-api.ts`

Client API helper:
```typescript
export interface PublicWeddingData {
  couple: { bride: string; groom: string; date: string; };
  theme: string;
  websiteSettings: WebsiteSettings;
  rsvpSettings: { venue: string; venueAddress: string; venueMapLink: string; };
  timelineEntries: TimelineEntry[];
  photos: { url: string; tag: string; }[];
  lang: string;
}

export async function fetchPublicWedding(slug: string): Promise<PublicWeddingData | null>;
```
Max ~40 lines.

### 4. Create `src/pages/wedding-website-page.tsx`

Public wedding page (default export, lazy-loaded):
```typescript
export default function WeddingWebsitePage({ slug }: { slug: string }) {
  // Fetch public data by slug
  // Loading / error / not-found states
  // Apply theme CSS vars
  // Render enabled sections: Hero, Story, Timeline, Gallery, Venue, RSVP
  // Mobile-first layout
}
```
Max ~100 lines.

### 5. Create `src/components/website/website-hero.tsx`

Hero section:
- Couple names in large typography
- Wedding date formatted
- Mini countdown (days until wedding)
- Hero image (if set)
- Custom welcome message
- Theme-colored background
- Max ~80 lines

### 6. Create `src/components/website/website-story.tsx`

Story section:
- "Our Story" / "Cau Chuyen Cua Chung Toi" heading
- Story text from websiteSettings.storyText or rsvpSettings.coupleStory
- Elegant typography
- Max ~40 lines

### 7. Create `src/components/website/website-timeline.tsx`

Timeline display (read-only):
- Vertical timeline layout
- Time badge + title + location for each entry
- Category color coding
- Empty: hide section
- Max ~60 lines

### 8. Create `src/components/website/website-gallery.tsx`

Photo grid (read-only):
- Simple grid of photos from state (not Photo Wall photos)
- Click to enlarge (simple lightbox)
- Empty: hide section
- Max ~60 lines

### 9. Create `src/components/website/website-venue.tsx`

Venue info:
- Venue name, address
- Map link (opens in new tab with sanitized URL)
- Map embed placeholder (optional)
- Max ~50 lines

### 10. Create `src/components/website/website-rsvp-cta.tsx`

Call-to-action:
- "Xac Nhan Tham Du" / "RSVP" heading
- Brief message
- Note: cannot deep-link to individual RSVP since tokens are per-guest
- Show venue info + date as reminder
- Max ~40 lines

### 11. Create `src/components/website/website-settings-panel.tsx`

Settings container for couple (within app):
- Enable/disable toggle
- Slug display + edit
- Section toggles
- Custom message textarea
- Story text textarea
- Hero image URL input
- Preview link + copy button
- Max ~120 lines

### 12. Create `src/components/website/website-slug-input.tsx`

Slug configuration:
- Auto-generate from couple names via `generateSlug()`
- Manual edit with validation
- Uniqueness check via API (optional — v2)
- Display full URL preview
- Max ~60 lines

### 13. Create `src/components/website/website-section-toggles.tsx`

Section visibility toggles:
- Checkbox for each: story, timeline, gallery, venue, rsvp
- Each with label and description
- Max ~50 lines

### Settings panel integration note:
The website settings panel needs to be accessible from within the app. Options:
1. Add as new case in page-router (Phase 01 adds `case "website"` rendering `<WebsiteSettingsPanel>`)
2. Add within the "cards" page alongside RSVP settings

**Recommendation:** Phase 01 should add `{ id: "website", label: "🌐 Website Cưới" }` to PAGES and corresponding page-router case. This keeps it as a top-level nav item.

## Todo List

- [ ] Create `src/lib/slug-utils.ts` (slug generation + validation)
- [ ] Create `api/website.ts` (public data API)
- [ ] Create `src/lib/website-api.ts` (client API helper)
- [ ] Create `src/pages/wedding-website-page.tsx` (public page)
- [ ] Create `src/components/website/website-hero.tsx`
- [ ] Create `src/components/website/website-story.tsx`
- [ ] Create `src/components/website/website-timeline.tsx`
- [ ] Create `src/components/website/website-gallery.tsx`
- [ ] Create `src/components/website/website-venue.tsx`
- [ ] Create `src/components/website/website-rsvp-cta.tsx`
- [ ] Create `src/components/website/website-settings-panel.tsx`
- [ ] Create `src/components/website/website-slug-input.tsx`
- [ ] Create `src/components/website/website-section-toggles.tsx`
- [ ] Test: slug generation from Vietnamese names
- [ ] Test: API returns correct public data subset
- [ ] Test: public page renders all enabled sections
- [ ] Test: theme applies correctly on public page
- [ ] Test: disabled sections are hidden
- [ ] Test: settings save correctly
- [ ] Build check passes

## Success Criteria

- Public page renders at `#/w/:slug` with couple's data
- Theme applies correctly (colors, typography)
- Only enabled sections display
- API excludes private data (budget, vendors, expenses, API keys)
- Slug generates correctly from Vietnamese names (diacritics removed)
- Settings panel allows full configuration
- Cache-Control headers set for CDN caching
- Mobile-responsive layout
- All files < 200 lines

## Conflict Prevention

- Only creates files in `src/components/website/`, `src/pages/`, `src/lib/`, `api/`
- Route in main.tsx already added by Phase 01
- WebsiteSettings type and store methods already in Phase 01
- No shared file edits

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Hash routes block social sharing previews | High | Documented limitation; v2 can add server-side rendering |
| Slug collision (two couples same names) | Medium | Append random suffix if collision detected |
| JSONB query performance for slug lookup | Low | Low volume; add GIN index if needed later |
| Public data exposure | High | Explicitly whitelist public fields; never return full wedding_data |

## Security Considerations
- **Data exposure**: API returns ONLY public subset; explicitly whitelist fields
- **XSS**: sanitize all rendered text; validate URLs before href
- **Slug validation**: regex check, max 50 chars
- **Rate limiting**: 60 req/min per IP on public endpoint
- **Cache-Control**: public responses cacheable (5 min max-age)
- **No write operations**: public page is read-only
- **venueMapLink**: sanitize with `encodeURI()` before rendering in href (existing pattern)

## Unresolved Questions

1. Should website settings be a top-level page or nested within cards/RSVP section? **Recommendation: top-level page via page-router.**
2. Slug uniqueness: enforce globally or per-deployment? For MVP, no global uniqueness check — couples can manually change slug if collision occurs.
3. Should the public page include Photo Wall photos (from DB) or only local photos (from state)? **Recommendation: only local photos for MVP; Photo Wall integration in v2.**

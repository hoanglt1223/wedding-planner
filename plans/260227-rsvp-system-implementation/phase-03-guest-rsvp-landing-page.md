# Phase 3: Guest RSVP Landing Page

## Context Links

- [Brainstorm Report](./reports/brainstorm-report.md)
- [Phase 2 — API Endpoints](./phase-02-api-endpoints.md)
- [Existing public page — shared-preview-page.tsx](../../src/pages/shared-preview-page.tsx)
- [Routing — main.tsx](../../src/main.tsx)
- [Themes — themes.ts](../../src/data/themes.ts)
- [i18n — i18n-translations.ts](../../src/lib/i18n-translations.ts)

## Overview

- **Priority:** P1
- **Status:** complete
- **Description:** Guest-facing RSVP landing page at `#/rsvp/:token`. Fetches invitation + event data from API, renders themed page with hero, event details, couple story, RSVP form, and thank-you state. Fully server-driven (no app state dependency).

## Key Insights

- `SharedPreviewPage` is the closest existing pattern: standalone public page, fetches data from API, renders themed content with loading/error states
- Hash routing in `main.tsx`: simple `hash.startsWith('#/rsvp/')` match, extract token
- Theme applied by looking up `themeId` in `THEMES` array -- same pattern as shared page using `BRAND`
- Page must work completely without WeddingState (guest has no localStorage)
- i18n: `lang` from API response determines all text; use `t()` function
- Mobile-first responsive: max-w-lg centered container

## Requirements

### Functional
- Route: `#/rsvp/:token` accessible from any browser without app state
- States: loading, error/expired, form (pending), already-responded (thank-you)
- Sections (when status=pending): hero, event details, couple story, RSVP form
- Hero: couple names, wedding date, welcome message, themed gradient background
- Event details: venue name, address, map link (external link), time
- Couple story: optional section (hidden if empty)
- RSVP form: pre-filled guest name (readonly), attendance radio (accept/decline), plus-ones counter, dietary textarea, message textarea, submit button
- After submit: thank-you screen with response summary
- Already responded: show thank-you + what they submitted (no edit)
- Themed: apply planner's theme colors from API response
- Bilingual: all text in vi/en based on `lang` from API

### Non-functional
- First meaningful paint < 1s (single API call on mount)
- Mobile-first responsive design
- No JavaScript framework dependencies beyond React (no additional routing lib)
- Accessible: proper form labels, ARIA attributes, keyboard navigation

## Architecture

### Component Tree

```
main.tsx
  └── RsvpLandingPage (token prop)
        ├── RsvpLoading
        ├── RsvpError (token not found / network error)
        └── RsvpContent (data loaded)
              ├── RsvpHero (couple names, date, welcome message)
              ├── RsvpEventDetails (venue, address, map link)
              ├── RsvpCoupleStory (optional text section)
              ├── RsvpForm (attendance, plus-ones, dietary, message)
              └── RsvpThankYou (post-submit or already-responded)
```

### Data Flow

```
Page Load
  → GET /api/rsvp?token=X
  → if 404: show RsvpError
  → if status=pending: show RsvpContent with form
  → if status=accepted/declined: show RsvpThankYou

Form Submit
  → POST /api/rsvp/respond { token, status, plusOnes, dietary, message }
  → if 200: transition to RsvpThankYou
  → if 409: show "already responded" message
  → if error: show error toast
```

### Theme Application

```typescript
// Lookup theme from API response
const theme = THEMES.find(t => t.id === data.themeId) || THEMES[0];

// Apply as CSS vars on root container (same pattern as App.tsx)
const themeStyle = {
  '--theme-primary': theme.primary,
  '--theme-primary-light': theme.primaryLight,
  '--theme-accent': theme.accent,
  '--theme-surface': theme.surface,
  '--theme-border': theme.themeBorder,
  '--theme-bg': theme.bg,
} as React.CSSProperties;
```

## Related Code Files

### Files to Create
- `src/pages/rsvp-landing-page.tsx` — main page component (orchestrator, API calls, state machine)
- `src/components/rsvp/rsvp-hero.tsx` — hero section
- `src/components/rsvp/rsvp-event-details.tsx` — venue/address/map section
- `src/components/rsvp/rsvp-couple-story.tsx` — optional story section
- `src/components/rsvp/rsvp-form.tsx` — RSVP response form
- `src/components/rsvp/rsvp-thank-you.tsx` — post-submit confirmation

### Files to Modify
- `src/main.tsx` — add `#/rsvp/:token` route
- `src/lib/i18n-translations.ts` — add RSVP-related translation keys

## Implementation Steps

### 1. Add Route in main.tsx

Add before the admin route check:
```typescript
if (hash.startsWith('#/rsvp/')) {
  const token = hash.replace('#/rsvp/', '');
  return <RsvpLandingPage token={token} />;
}
```

Import `RsvpLandingPage` at top (no lazy loading needed -- small page).

### 2. Add i18n Translation Keys

Add to `src/lib/i18n-translations.ts`:
```
- "Xác nhận tham dự" / "Confirm Attendance"
- "Từ chối" / "Decline"
- "Tham dự" / "Will Attend"
- "Số khách đi cùng" / "Plus Ones"
- "Chế độ ăn đặc biệt" / "Dietary Requirements"
- "Lời nhắn" / "Message"
- "Gửi RSVP" / "Submit RSVP"
- "Cảm ơn bạn!" / "Thank You!"
- "Chúng tôi đã nhận phản hồi" / "We've received your response"
- "Không tìm thấy lời mời" / "Invitation not found"
- "Link không hợp lệ hoặc đã hết hạn" / "Invalid or expired link"
- "Bạn đã phản hồi rồi" / "You've already responded"
- "Đang gửi..." / "Submitting..."
- "Địa điểm" / "Venue"
- "Thời gian" / "Date & Time"
- "Xem bản đồ" / "View Map"
- "Câu chuyện của chúng tôi" / "Our Story"
- "Lời mời dành cho" / "Invitation for"
```

### 3. Create RsvpLandingPage (`src/pages/rsvp-landing-page.tsx`)

State machine:
```typescript
type PageStatus = "loading" | "error" | "form" | "submitted" | "already-responded";
```

- On mount: fetch `GET /api/rsvp?token=X`
- Parse response, determine initial status:
  - 404 -> "error"
  - status=pending -> "form"
  - status=accepted/declined -> "already-responded"
- On form submit: POST to `/api/rsvp/respond`
  - 200 -> "submitted"
  - 409 -> "already-responded"
- Props: `{ token: string }`
- Renders appropriate sub-component per status
- Wraps all content in themed container div

Keep under 100 lines. Delegate all rendering to sub-components.

### 4. Create RsvpHero (`src/components/rsvp/rsvp-hero.tsx`)

- Gradient background using theme primaryLight -> white
- Couple names (bride & groom) as large heading
- Wedding date formatted with locale
- Welcome message (from rsvpSettings)
- Decorative wedding emoji
- Props: `{ bride, groom, date, welcomeMessage, theme, lang }`

### 5. Create RsvpEventDetails (`src/components/rsvp/rsvp-event-details.tsx`)

- Card with venue name, address, map link
- Map link opens in new tab (`target="_blank" rel="noopener"`)
- Icons for venue/address/map
- Only renders if venue is non-empty
- Props: `{ venue, venueAddress, venueMapLink, lang }`

### 6. Create RsvpCoupleStory (`src/components/rsvp/rsvp-couple-story.tsx`)

- Card with story text
- Only renders if coupleStory is non-empty
- Simple text block with heading
- Props: `{ story, lang }`

### 7. Create RsvpForm (`src/components/rsvp/rsvp-form.tsx`)

- Pre-filled guest name (readonly, styled as badge)
- Attendance: two radio-style buttons (Accept / Decline)
- If accepted: show plus-ones counter (0-10 stepper) + dietary textarea + message textarea
- If declined: show only message textarea
- Submit button with loading state
- Props: `{ guestName, onSubmit, lang }` where onSubmit receives `{ status, plusOnes, dietary, message }`

Keep form state local to this component. Max 120 lines.

### 8. Create RsvpThankYou (`src/components/rsvp/rsvp-thank-you.tsx`)

- Large checkmark or celebration emoji
- "Thank you!" heading
- Summary: attendance status, plus-ones count, dietary, message
- Subtle "powered by Wedding Planner" footer with CTA link
- Props: `{ guestName, status, plusOnes, dietary, message, lang }`

### 9. Build + Lint Check

```bash
npm run build && npm run lint
```

## Todo List

- [ ] Add #/rsvp/:token route in main.tsx
- [ ] Add ~18 RSVP translation keys to i18n-translations.ts
- [ ] Create src/pages/rsvp-landing-page.tsx
- [ ] Create src/components/rsvp/rsvp-hero.tsx
- [ ] Create src/components/rsvp/rsvp-event-details.tsx
- [ ] Create src/components/rsvp/rsvp-couple-story.tsx
- [ ] Create src/components/rsvp/rsvp-form.tsx
- [ ] Create src/components/rsvp/rsvp-thank-you.tsx
- [ ] Run npm run build -- verify clean
- [ ] Manual test: navigate to #/rsvp/invalid-token -> error state
- [ ] Manual test: full flow with valid token

## Success Criteria

- `#/rsvp/:token` renders full page without app state
- Loading -> form -> submit -> thank-you flow works end-to-end
- Already-responded state shows summary (no re-submit)
- Invalid token shows error page
- Theme colors match planner's selected theme
- Vietnamese and English text renders correctly per `lang`
- Mobile viewport (375px) looks correct
- `npm run build` passes

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| Theme mismatch if THEMES array changes | Low | Low | Fallback to THEMES[0] when themeId not found |
| API fetch failure on slow connection | Medium | Low | Loading state shows spinner; retry button on error |
| Form double-submit | Medium | Medium | Disable submit button on click; API returns 409 on duplicate |

## Security Considerations

- No user data stored in localStorage from guest page
- Token never appears in form data (already known from URL)
- External map link uses `rel="noopener noreferrer"` to prevent tab-napping
- No PII collected beyond guest name (already known to planner)
- Form inputs have maxLength to match API validation (500 chars)

## Next Steps

This phase can run in parallel with Phase 4 (Dashboard). Both depend on Phase 2 (API) being complete.

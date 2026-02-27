# Phase 4: Planner RSVP Dashboard

## Context Links

- [Brainstorm Report](./reports/brainstorm-report.md)
- [Phase 1 — DB Schema](./phase-01-database-schema-migration.md)
- [Phase 2 — API Endpoints](./phase-02-api-endpoints.md)
- [Guest Panel](../../src/components/guests/guest-panel.tsx) (existing tab integration point)
- [Store Hook](../../src/hooks/use-wedding-store.ts) (state callbacks)
- [Themes](../../src/data/themes.ts)

## Overview

- **Priority:** P1
- **Status:** complete
- **Description:** Add RSVP tab to GuestPanel. Includes settings form, bulk link generation, response dashboard with stats/table/QR codes, CSV export, and copy-all-links.

## Key Insights

- GuestPanel currently has 2 view tabs: "list" and "chart". Add "rsvp" as third view.
- GuestPanel receives `guests` array and callbacks as props; RSVP tab needs same guests + userId + rsvpSettings.
- RSVP dashboard fetches data from `GET /api/rsvp/list?userId=X` -- not from localStorage.
- QR codes rendered client-side with `qrcode` package (canvas/data URL).
- `useUserId()` hook already exists for anonymous UUID -- reuse for API calls.
- Keep GuestPanel under 200 lines: extract RSVP tab into separate component.

## Requirements

### Functional
- New "RSVP" tab button alongside existing "List" and "Seating" tabs
- **Settings form**: welcome message, venue, address, map link, couple story -- saved to rsvpSettings in state (auto-synced via existing useSync)
- **Generate links button**: calls POST /api/rsvp for all guests without existing rsvpToken; updates local Guest objects with returned tokens
- **Stats bar**: counts for accepted / declined / pending
- **Response table**: rows with guest name, status badge (color-coded), plus-ones, dietary, message, QR code button
- **QR code**: per-guest modal or inline showing QR for `{origin}/#/rsvp/{token}`
- **Copy link**: button per row copies individual RSVP URL to clipboard
- **Copy all links**: button copies all guest links as formatted text
- **CSV export**: download response data as CSV

### Non-functional
- QR generation is client-side only (no server rendering)
- Settings form auto-saves (no explicit save button; debounced via existing sync)
- Table sorts by status (pending first) by default
- Responsive: table scrolls horizontally on mobile

## Architecture

### Component Tree

```
GuestPanel (modified)
  ├── [existing] GuestTable view
  ├── [existing] SeatingChart view
  └── [new] RsvpDashboard
        ├── RsvpSettingsForm
        ├── RsvpGenerateLinks
        ├── RsvpStatsBar
        ├── RsvpResponseTable
        │     └── RsvpQrModal (per guest)
        └── RsvpExportActions (copy-all + CSV)
```

### Data Flow

```
RsvpDashboard mount
  → GET /api/rsvp/list?userId=X
  → Set invitations state
  → Render stats + table

Generate Links click
  → Filter guests without rsvpToken
  → POST /api/rsvp { userId, guests, themeId, lang }
  → Receive tokens
  → Update local Guest[] with rsvpToken via store callback
  → Refresh invitations list

Settings change
  → setRsvpSettings callback updates localStorage
  → useSync auto-syncs to server (existing debounce)
```

### QR Code URL Format

```
https://{window.location.origin}/#/rsvp/{token}
```

For local dev: `http://localhost:5173/#/rsvp/{token}`

## Related Code Files

### Files to Create
- `src/components/guests/rsvp-dashboard.tsx` — main RSVP tab container
- `src/components/guests/rsvp-settings-form.tsx` — settings input form
- `src/components/guests/rsvp-generate-links.tsx` — bulk generation UI
- `src/components/guests/rsvp-stats-bar.tsx` — accepted/declined/pending counts
- `src/components/guests/rsvp-response-table.tsx` — response data table
- `src/components/guests/rsvp-qr-modal.tsx` — QR code display modal
- `src/components/guests/rsvp-export-actions.tsx` — copy-all + CSV export
- `src/lib/rsvp-api.ts` — API helper functions for RSVP endpoints

### Files to Modify
- `src/components/guests/guest-panel.tsx` — add "rsvp" view tab + render RsvpDashboard
- `src/hooks/use-wedding-store.ts` — add `setRsvpSettings`, `updateGuestRsvpToken` callbacks

### Dependencies to Install
- `qrcode` — `npm install qrcode`
- `@types/qrcode` — `npm install -D @types/qrcode`

## Implementation Steps

### 1. Install qrcode

```bash
npm install qrcode && npm install -D @types/qrcode
```

### 2. Create API Helper (`src/lib/rsvp-api.ts`)

Centralize all RSVP API calls:
```typescript
export async function createRsvpTokens(userId: string, guests: {name: string}[], themeId: string, lang: string)
export async function fetchRsvpList(userId: string)
// Types for API responses
export interface RsvpInvitation { id, userId, guestName, token, status, plusOnes, dietary, message, respondedAt, createdAt }
```

Keep under 60 lines. Simple fetch wrappers with error handling.

### 3. Add Store Callbacks (`use-wedding-store.ts`)

Add two new callbacks:

```typescript
const setRsvpSettings = useCallback((settings: Partial<RsvpSettings>) => {
  setState(prev => ({
    ...prev,
    rsvpSettings: { ...prev.rsvpSettings, ...settings },
  }));
}, [setState]);

const updateGuestRsvpToken = useCallback((guestId: number, token: string) => {
  setState(prev => ({
    ...prev,
    guests: prev.guests.map(g =>
      g.id === guestId ? { ...g, rsvpToken: token } : g
    ),
  }));
}, [setState]);
```

Add to return object. Keep total file under 200 lines -- may need to split if close.

### 4. Modify GuestPanel (`guest-panel.tsx`)

- Add `"rsvp"` to view state type: `useState<"list" | "chart" | "rsvp">("list")`
- Add third tab button for RSVP
- Add new props: `rsvpSettings`, `onSetRsvpSettings`, `userId`, `onUpdateGuestRsvpToken`, `themeId`
- Render `<RsvpDashboard>` when view === "rsvp"
- File stays under 200 lines

### 5. Create RsvpDashboard (`rsvp-dashboard.tsx`)

Orchestrator component:
- Fetches invitations on mount via `fetchRsvpList(userId)`
- Manages loading/error state for API calls
- Renders child components in order: settings, generate, stats, table, export
- Props: `{ guests, userId, rsvpSettings, onSetRsvpSettings, onUpdateGuestRsvpToken, themeId, lang }`
- Max 100 lines

### 6. Create RsvpSettingsForm (`rsvp-settings-form.tsx`)

- Collapsible card (collapsed by default if settings already filled)
- Fields: welcomeMessage (textarea), venue (input), venueAddress (input), venueMapLink (input), coupleStory (textarea)
- onChange directly calls `onSetRsvpSettings({ field: value })`
- Uses shadcn Input + Textarea components
- Props: `{ settings: RsvpSettings, onChange: (partial) => void, lang }`
- Max 80 lines

### 7. Create RsvpGenerateLinks (`rsvp-generate-links.tsx`)

- Shows count: "X guests without RSVP links"
- Button: "Generate Links" (disabled if all guests have tokens, or no guests)
- On click: calls `createRsvpTokens()`, updates each guest via `onUpdateGuestRsvpToken`
- Loading spinner during API call
- Success toast: "Generated X links"
- Props: `{ guests, userId, themeId, lang, onUpdateGuestRsvpToken, onRefresh }`
- Max 60 lines

### 8. Create RsvpStatsBar (`rsvp-stats-bar.tsx`)

- Horizontal bar with 3 colored badges:
  - Green: Accepted (count)
  - Red: Declined (count)
  - Gray: Pending (count)
- Total count
- Props: `{ invitations: RsvpInvitation[], lang }`
- Max 40 lines

### 9. Create RsvpResponseTable (`rsvp-response-table.tsx`)

- Scrollable table: Guest Name | Status | Plus-Ones | Dietary | Message | Actions
- Status column: colored badge (green=accepted, red=declined, gray=pending)
- Actions column: copy link button + QR button
- Copy link: `navigator.clipboard.writeText(url)`
- QR button: opens RsvpQrModal
- Sorted: pending first, then accepted, then declined
- Props: `{ invitations, lang }`
- Max 100 lines

### 10. Create RsvpQrModal (`rsvp-qr-modal.tsx`)

- Modal dialog (shadcn Dialog component)
- Shows guest name as title
- QR code rendered via `qrcode.toDataURL(url)` on mount
- Displays as `<img>` element
- Copy URL button below QR
- Props: `{ guestName, token, open, onClose }`
- Max 50 lines

### 11. Create RsvpExportActions (`rsvp-export-actions.tsx`)

- "Copy All Links" button: formats as `GuestName: URL\n` list, copies to clipboard
- "Export CSV" button: generates CSV with columns: Name, Status, Plus-Ones, Dietary, Message, Link
- Uses `Blob` + `URL.createObjectURL` for CSV download
- Props: `{ invitations, lang }`
- Max 60 lines

### 12. Add i18n Keys

Add RSVP dashboard translation keys to `i18n-translations.ts`:
```
- "📬 RSVP" / "📬 RSVP"
- "Cài đặt RSVP" / "RSVP Settings"
- "Lời chào" / "Welcome Message"
- "Địa điểm tiệc" / "Venue"
- "Địa chỉ" / "Address"
- "Link bản đồ" / "Map Link"
- "Câu chuyện đôi mình" / "Our Story"
- "Tạo link RSVP" / "Generate RSVP Links"
- "khách chưa có link" / "guests without links"
- "Đã nhận" / "Accepted"
- "Từ chối" / "Declined"
- "Chờ phản hồi" / "Pending"
- "Sao chép link" / "Copy Link"
- "Đã sao chép!" / "Copied!"
- "Sao chép tất cả" / "Copy All Links"
- "Xuất CSV" / "Export CSV"
- "Mã QR" / "QR Code"
```

### 13. Wire Props Through Component Tree

Ensure `rsvpSettings`, `setRsvpSettings`, `userId`, `updateGuestRsvpToken`, and `themeId` are threaded from App.tsx -> page-router -> planning page -> GuestPanel.

### 14. Build + Lint

```bash
npm run build && npm run lint
```

## Todo List

- [ ] Install qrcode + @types/qrcode
- [ ] Create src/lib/rsvp-api.ts
- [ ] Add setRsvpSettings and updateGuestRsvpToken to store
- [ ] Modify guest-panel.tsx with RSVP tab
- [ ] Create rsvp-dashboard.tsx
- [ ] Create rsvp-settings-form.tsx
- [ ] Create rsvp-generate-links.tsx
- [ ] Create rsvp-stats-bar.tsx
- [ ] Create rsvp-response-table.tsx
- [ ] Create rsvp-qr-modal.tsx
- [ ] Create rsvp-export-actions.tsx
- [ ] Add ~17 dashboard i18n keys
- [ ] Wire props through component tree
- [ ] Run npm run build -- verify clean

## Success Criteria

- RSVP tab appears in GuestPanel alongside List and Seating
- Settings form saves and persists across page reloads
- Generate links creates tokens for all guests, updates Guest objects
- Stats bar accurately reflects API response data
- Response table renders all invitations with correct status badges
- QR code modal displays scannable QR for each guest
- Copy link copies correct URL to clipboard
- Copy all links copies formatted list
- CSV export downloads valid file
- `npm run build` passes

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| qrcode bundle size too large | Low | Low | qrcode is ~30KB gzipped; acceptable |
| GuestPanel exceeds 200 lines after adding RSVP tab | Medium | Low | Extract RSVP-specific code into RsvpDashboard; panel stays as thin switcher |
| Props drilling too deep | Medium | Low | Max 3 levels: App -> GuestPanel -> RsvpDashboard -> children |
| clipboard.writeText not supported in old browsers | Low | Low | Wrap in try/catch; show manual copy fallback |
| useWeddingStore exceeds 200 lines | Medium | Low | Extract RSVP callbacks into separate hook `useRsvpStore` if needed |

## Security Considerations

- RSVP links contain tokens but no PII; safe to copy/share
- userId sent to API is the same anonymous UUID used for sync
- QR codes generated client-side; no server round-trip
- CSV export is local-only; no data sent to external services
- No admin auth required; planner accesses own data via userId

## Next Steps

Phase 5 (Integration Testing) begins after this phase. It validates the full flow across all phases.

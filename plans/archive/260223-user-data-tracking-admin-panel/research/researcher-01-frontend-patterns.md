# Researcher-01: Frontend Patterns Report
Date: 2026-02-23 | Scope: WeddingState, store, routing

---

## 1. WeddingState Field Map

Source: `src/types/wedding.ts` — `WeddingState` interface (line 103–128)

### Top-level fields relevant for admin extraction

| Field | Type | Notes |
|---|---|---|
| `info` | `CoupleInfo` | Nested object — primary user data |
| `guests` | `Guest[]` | Array, has `id`, `name`, `phone`, `side`, `tableGroup` |
| `lang` | `string` | `"vi"` or `"en"` |
| `region` | `Region` | Imported from `@/data/regions` |
| `budget` | `number` | Total wedding budget |
| `checkedItems` | `Record<string, boolean>` | Checklist progress keys |
| `onboardingComplete` | `boolean` | Whether user finished onboarding |
| `themeId` | `string` | Selected theme |
| `partyTime` | `"noon" \| "afternoon"` | Party time preference |

### CoupleInfo nested fields (at `state.info.*`)

| Field | Type | Description |
|---|---|---|
| `info.bride` | `string` | Bride's name |
| `info.groom` | `string` | Groom's name |
| `info.brideFamilyName` | `string` | Bride family name |
| `info.groomFamilyName` | `string` | Groom family name |
| `info.date` | `string` | Wedding date (format unspecified, likely `YYYY-MM-DD`) |
| `info.engagementDate` | `string` | Engagement date |
| `info.betrothalDate` | `string` | Betrothal date |
| `info.brideBirthDate` | `string` | `"YYYY-MM-DD"` or `""` |
| `info.brideBirthHour` | `number \| null` | 0–23 or null |
| `info.brideGender` | `string` | `"female"` or `"male"` |
| `info.groomBirthDate` | `string` | `"YYYY-MM-DD"` or `""` |
| `info.groomBirthHour` | `number \| null` | 0–23 or null |
| `info.groomGender` | `string` | `"female"` or `"male"` |

### Guest count derivation
- `state.guests.length` — total guest count
- No dedicated `guestCount` field; derived from array length

### Checklist progress derivation
- No dedicated progress field; computed via `getProgress()` in the store hook
- Returns `{ total, done, pct }` where `pct` is 0–100 integer
- Keys in `checkedItems` follow pattern: `{stepId}_{ceremonyIndex}_{checkIndex}`

---

## 2. State Storage & Update Patterns

Source: `src/hooks/use-wedding-store.ts`

### Storage mechanism
- Custom hook `useWeddingStore()` — NOT Zustand, NOT Context API
- Backed by `useLocalStorage<WeddingState>("wp_v13", DEFAULT_STATE)`
- Storage key: `"wp_v13"` (versioned — migration handled via `src/lib/migrate-state.ts`)
- State is plain React state serialized to `localStorage`

### How to detect/read state externally
- Read `localStorage.getItem("wp_v13")` and `JSON.parse()` — full WeddingState available
- For server-side tracking: NO server persistence; all state is client-side only

### Setter functions (all via `useWeddingStore()` return)

| Setter | Signature | Updates |
|---|---|---|
| `setPage(page)` | `(string) => void` | `state.page` |
| `updateInfo(field, value)` | `(string, string\|number\|null) => void` | `state.info[field]` |
| `setLang(lang)` | `(string) => void` | `state.lang` |
| `setRegion(region)` | `(Region) => void` | `state.region` |
| `setBudget(n)` | `(number) => void` | `state.budget` |
| `addGuest(guest)` | `(Omit<Guest,"id">) => void` | `state.guests[]` |
| `toggleCheck(key)` | `(string) => void` | `state.checkedItems[key]` |
| `completeOnboarding()` | `() => void` | `state.onboardingComplete` |
| `getProgress()` | `() => {total,done,pct}` | Read-only computed |
| `setState` | raw setter | Full state replacement |

---

## 3. Routing Mechanism

Source: `src/pages/page-router.tsx`

### Pattern: State-based routing via `state.page` string
- NO hash-based routing (`window.location.hash`)
- NO React Router, NO URL changes
- Routing is a `switch(state.page)` inside `PageRouter` component
- Page navigation = calling `store.setPage("pageName")` which updates `state.page` in localStorage

### Existing page keys
```
"planning"    → PlanningPage
"astrology"   → AstrologyPage
"cards"       → CardsPanel
"ai"          → AiPanel
"handbook"    → PrintPanel
"ideas"       → IdeasPanel
default       → null
```

### How to add `/admin` route
Since routing is state-based (not URL-based), adding an admin page requires:

1. Add new `case "admin"` in `PageRouter` switch block (`src/pages/page-router.tsx`)
2. Create `src/pages/admin-page.tsx` component
3. Trigger via `store.setPage("admin")` from a nav element
4. No URL change needed — consistent with existing patterns

**Alternative** (URL-based, if admin needs direct access): Check `window.location.pathname` or `window.location.hash` in `App.tsx` before rendering `PageRouter`. No existing pattern for this — would be new infrastructure.

---

## 4. Key Admin Data Extraction Summary

To build an admin panel that reads user data, extract from `localStorage["wp_v13"]`:

```ts
const raw = localStorage.getItem("wp_v13");
const state: WeddingState = JSON.parse(raw);

// Primary fields:
state.info.bride            // bride name
state.info.groom            // groom name
state.info.brideBirthDate   // "YYYY-MM-DD"
state.info.groomBirthDate   // "YYYY-MM-DD"
state.info.date             // wedding date
state.info.engagementDate
state.info.betrothalDate
state.region                // Region enum/string
state.lang                  // "vi" | "en"
state.guests.length         // guest count
state.budget                // budget number
state.onboardingComplete    // boolean

// Checklist progress: computed, not stored directly
// Use getProgress() logic or count truthy values in state.checkedItems
```

---

## Unresolved Questions

1. `Region` type definition not read — need `src/data/regions.ts` to know exact values (string union vs enum)
2. `DEFAULT_STATE` not read — unknown default values for fields like `region`, `lang`, `budget`
3. No server-side persistence — admin panel can only read data from the same browser session's localStorage, or data must be explicitly sent to an API endpoint
4. Date format for `info.date` (wedding date) — type is `string`, actual format (ISO, locale) not confirmed from types alone

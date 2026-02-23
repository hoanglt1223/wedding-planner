---
phase: 2
title: "Birth Input Form Upgrade"
status: pending
priority: P1
effort: 2h
---

# Phase 2: Birth Input Form Upgrade

## Context Links

- [plan.md](./plan.md) | [phase-01](./phase-01-data-model-migration.md)
- [astrology-page.tsx](../../src/pages/astrology-page.tsx) | [wedding.ts](../../src/types/wedding.ts)

## Overview

Replace the two simple number inputs (bride/groom birth year) in `astrology-page.tsx` with an expanded birth data form: date picker, Vietnamese birth hour dropdown (12 Earthly Branch hours), and gender selector. Support graceful degradation when only year is known.

## Key Insights

- Current form: two `<Input type="number">` fields (lines 47-74 of astrology-page.tsx)
- Vietnamese birth hours map to 12 two-hour periods named after Earthly Branches (Giờ Tý = 23-01h, etc.)
- ~30-50% of users won't know birth hour — "Không biết" option is essential
- Form must fit mobile viewport; current layout is two columns
- The `onUpdateInfo(field, value)` callback now accepts `string | number | null` (from Phase 1)

## Requirements

### Functional
1. Date input for bride/groom birth date (native HTML date input or manual YYYY-MM-DD)
2. Hour dropdown with 12 Vietnamese time periods + "Không biết" option
3. Gender selector (default: bride=female, groom=male, but allow override)
4. If user previously entered only year (migrated from v11), show year in the date field
5. "Xếp Chi Tiết" AI button unlocked only when birthDate + birthHour both provided

### Non-functional
- Mobile-first: must not overflow on 375px screens
- Inputs should be compact — don't dominate the page above the tabs

## Architecture

Extract birth form into its own component to keep astrology-page.tsx under 200 lines.

```
astrology-page.tsx (main page)
  └── birth-input-form.tsx (NEW — form component)
        ├── Date inputs (2x)
        ├── Hour dropdowns (2x)
        └── Gender toggles (2x, optional, collapsed by default)
```

## Related Code Files

### Modify
- `src/pages/astrology-page.tsx` — Remove inline birth year inputs, import new form component, pass new data

### Create
- `src/components/astrology/birth-input-form.tsx` — New birth data form component

### Delete
- None

## Implementation Steps

### Step 1: Define Vietnamese birth hour constants

In the new `birth-input-form.tsx`, define:

```typescript
const BIRTH_HOURS: { value: number; label: string }[] = [
  { value: 0,  label: "Giờ Tý (23h-1h)" },
  { value: 2,  label: "Giờ Sửu (1h-3h)" },
  { value: 4,  label: "Giờ Dần (3h-5h)" },
  { value: 6,  label: "Giờ Mão (5h-7h)" },
  { value: 8,  label: "Giờ Thìn (7h-9h)" },
  { value: 10, label: "Giờ Tỵ (9h-11h)" },
  { value: 12, label: "Giờ Ngọ (11h-13h)" },
  { value: 14, label: "Giờ Mùi (13h-15h)" },
  { value: 16, label: "Giờ Thân (15h-17h)" },
  { value: 18, label: "Giờ Dậu (17h-19h)" },
  { value: 20, label: "Giờ Tuất (19h-21h)" },
  { value: 22, label: "Giờ Hợi (21h-23h)" },
];
```

Use the even-hour start of each period as the value. This maps cleanly to the traditional 12 Earthly Branch time slots.

### Step 2: Create birth-input-form.tsx

File: `src/components/astrology/birth-input-form.tsx`

Props interface:

```typescript
import type { CoupleInfo } from "@/types/wedding";

interface BirthInputFormProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string | number | null) => void;
}
```

Layout (2-column grid for bride/groom):

```
Row 1: [Bride Date Input]  [Groom Date Input]
Row 2: [Bride Hour Select] [Groom Hour Select]
```

Each side:
- `<Label>` with name (e.g., "Cô dâu" or bride name if set)
- `<Input type="date">` bound to `info.brideBirthDate`
- `<select>` with BIRTH_HOURS + "Không biết" (value="" maps to null)

Gender toggle: Only show if user taps an expand button or link "Thay đổi giới tính". Default hidden since 99% of weddings are male-female and defaults cover it.

### Step 3: Handle date input binding

Date input value must be in `YYYY-MM-DD` format. If user's `brideBirthDate` is `"2000-01-01"` (migrated from year-only), the date picker will show Jan 1, 2000 — user can adjust.

```typescript
<Input
  type="date"
  value={info.brideBirthDate}
  min="1940-01-01"
  max="2010-12-31"
  onChange={(e) => onUpdateInfo("brideBirthDate", e.target.value)}
/>
```

### Step 4: Handle hour dropdown

```typescript
<select
  value={info.brideBirthHour ?? ""}
  onChange={(e) => {
    const val = e.target.value;
    onUpdateInfo("brideBirthHour", val === "" ? null : parseInt(val));
  }}
  className="w-full rounded-md border bg-background px-3 py-2 text-sm"
>
  <option value="">Không biết</option>
  {BIRTH_HOURS.map((h) => (
    <option key={h.value} value={h.value}>{h.label}</option>
  ))}
</select>
```

### Step 5: Update astrology-page.tsx

1. Remove the inline birth year input JSX (lines 47-74)
2. Import `BirthInputForm` from `@/components/astrology/birth-input-form`
3. Replace with: `<BirthInputForm info={info} onUpdateInfo={onUpdateInfo} />`
4. Update `hasData` check: `const brideYear = getBirthYear(info.brideBirthDate); const groomYear = getBirthYear(info.groomBirthDate);`
5. Import `getBirthYear` from `@/lib/astrology`

### Step 6: Style considerations

- Use shadcn `<Input>` for date field, native `<select>` styled with Tailwind for hour (shadcn Select component is overkill here)
- Keep form compact: `text-sm`, `gap-2`, `py-1`
- On mobile, date picker opens native date picker which is good UX

## Todo List

- [ ] Create `src/components/astrology/birth-input-form.tsx` with BIRTH_HOURS constant
- [ ] Implement date input + hour dropdown for bride/groom
- [ ] Add optional gender toggle (collapsed by default)
- [ ] Update `astrology-page.tsx` to use new form component
- [ ] Update `hasData` logic to use `getBirthYear(info.brideBirthDate)`
- [ ] Test on mobile viewport (375px)
- [ ] Verify graceful degradation: year-only migrated data works
- [ ] Run `npm run build`

## Success Criteria

- Birth date picker + hour dropdown renders for both bride/groom
- "Không biết" hour selection sets `birthHour: null`
- Existing v11-migrated users see their year pre-filled in date input
- `hasData` check still gates tab content behind valid birth data
- Page stays under 200 lines; form component under 200 lines

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Native date picker varies across mobile browsers | Low | HTML5 date input has good support (iOS Safari, Chrome); fallback is manual text entry |
| Users confused by Jan 1 placeholder date from migration | Low | Show helper text: "Ngày sinh dùng để xem tử vi chi tiết hơn" |
| Form becomes too tall on mobile | Medium | Use compact spacing; collapse gender toggle by default |

## Security Considerations

- No server-side data; all client-side form state
- Birth date stored only in localStorage

## Next Steps

- Phase 4 uses `birthHour` to conditionally show AI reading button
- Phase 7 updates existing tabs to derive year from `brideBirthDate`

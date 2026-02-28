---
phase: "02"
title: "Countdown + Smart Reminders"
status: complete
priority: P1
effort: 1-2 days
completed: 2026-02-28
---

# Phase 02: Countdown + Smart Reminders

## Context Links
- [plan.md](./plan.md)
- [phase-01-foundation.md](./phase-01-foundation.md)
- [researcher-02 report](../260227-phase2-features-brainstorm/research/researcher-02-taskboard-website-countdown.md)

## Parallelization Info
- **Group:** Parallel (02-07)
- **Dependencies:** Phase 01 (foundation)
- **Can run with:** Phases 03, 04, 05, 06, 07
- **No file conflicts** — only creates files in `src/components/countdown/` and `src/data/`

## Overview
Visual countdown widget displayed on the planning page header + milestone-based reminder toast system tied to checklist progress and days until wedding.

## Key Insights
- Countdown uses existing `state.info.date` — no new data fetching
- Reminders are toast-based v1 (no PWA push notifications, no permission dialogs)
- Show days+hours for final 7 days; days-only otherwise
- Post-wedding: show celebration message instead of countdown
- Reminder definitions are static data; dismissals stored in `state.dismissedReminders`
- Milestone celebrations at 25%, 50%, 75%, 100% checklist completion

## Requirements

### Functional
- Countdown widget: real-time days/hours/minutes countdown to wedding date
- Display variants: "no date set" / "X days" / "X days Y hours" (last 7 days) / "wedding day!" / "past"
- Milestone reminders: triggered by days-remaining + checklist progress
- Reminder toast: non-intrusive, dismissible, persists dismissal in state
- Planning page header integration (appears above tabs)

### Non-Functional
- No external dependencies (pure date math)
- Responsive: works on mobile widths
- Performance: `setInterval` for live countdown, cleanup on unmount

## Architecture

```
PlanningPage header
  └── CountdownWidget (src/components/countdown/countdown-widget.tsx)
        ├── countdown-display.tsx  — visual digits
        └── reminder-banner.tsx    — active reminder toasts

src/data/reminder-definitions.ts  — static reminder rules
```

## Related Code Files (Full Paths)

**Reads (does NOT edit):**
- `D:\Projects\wedding-planner\src\types\wedding.ts` — `WeddingState`, `ReminderPreference`
- `D:\Projects\wedding-planner\src\hooks\use-wedding-store.ts` — `dismissReminder()`, `getProgress()`
- `D:\Projects\wedding-planner\src\lib\i18n.ts` — `t()`
- `D:\Projects\wedding-planner\src\pages\planning-page.tsx` — import CountdownWidget here

**Note:** `planning-page.tsx` needs a 1-line import + JSX insertion for the CountdownWidget. This is the one file that Phase 02 must edit outside its exclusive directory. If this causes conflict concerns, the countdown can be conditionally rendered via a wrapper — but given it's a single import line, it should be safe.

**CREATES (exclusive):**
- `D:\Projects\wedding-planner\src\components\countdown\countdown-widget.tsx`
- `D:\Projects\wedding-planner\src\components\countdown\countdown-display.tsx`
- `D:\Projects\wedding-planner\src\components\countdown\reminder-banner.tsx`
- `D:\Projects\wedding-planner\src\components\countdown\use-countdown.ts`
- `D:\Projects\wedding-planner\src\data\reminder-definitions.ts`

## File Ownership (EXCLUSIVE)

| File | Action |
|------|--------|
| `src/components/countdown/countdown-widget.tsx` | CREATE |
| `src/components/countdown/countdown-display.tsx` | CREATE |
| `src/components/countdown/reminder-banner.tsx` | CREATE |
| `src/components/countdown/use-countdown.ts` | CREATE |
| `src/data/reminder-definitions.ts` | CREATE |

**Exception:** Must add `<CountdownWidget>` to `src/pages/planning-page.tsx` (1 import + 1 JSX line). Coordinate with Phase 01 to ensure no merge conflict.

## Implementation Steps

### 1. Create `src/data/reminder-definitions.ts`
Define reminder rules as a static array:
```typescript
export interface ReminderDefinition {
  id: string;
  daysBeforeWedding: number;       // trigger when X days remain
  messageVi: string;
  messageEn: string;
  icon: string;
  type: "deadline" | "milestone";
}

export const REMINDER_DEFINITIONS: ReminderDefinition[] = [
  { id: "r-90", daysBeforeWedding: 90, messageVi: "3 tháng nữa: Đặt nhà hàng & nhiếp ảnh", messageEn: "3 months: Book venue & photographer", icon: "🏛️", type: "deadline" },
  { id: "r-60", daysBeforeWedding: 60, messageVi: "2 tháng nữa: Gửi thiệp mời", messageEn: "2 months: Send invitations", icon: "💌", type: "deadline" },
  { id: "r-30", daysBeforeWedding: 30, messageVi: "1 tháng nữa: Xác nhận vendor, chốt danh sách khách", messageEn: "1 month: Confirm vendors, finalize guest list", icon: "✅", type: "deadline" },
  { id: "r-14", daysBeforeWedding: 14, messageVi: "2 tuần nữa: Sơ đồ bàn, review lịch trình", messageEn: "2 weeks: Seating chart, review timeline", icon: "🪑", type: "deadline" },
  { id: "r-7", daysBeforeWedding: 7, messageVi: "1 tuần nữa: Xác nhận lần cuối, chuẩn bị emergency kit", messageEn: "1 week: Final confirmations, prepare emergency kit", icon: "🎒", type: "deadline" },
  { id: "r-1", daysBeforeWedding: 1, messageVi: "Ngày mai cưới! Nghỉ ngơi và tận hưởng nhé 💕", messageEn: "Wedding tomorrow! Rest and enjoy 💕", icon: "💍", type: "deadline" },
];
```

### 2. Create `src/components/countdown/use-countdown.ts`
Custom hook that:
- Takes `weddingDate: string` (ISO date)
- Uses `setInterval(1000)` for live update
- Returns `{ days, hours, minutes, seconds, status }` where status is "no-date" | "counting" | "today" | "past"
- Cleans up interval on unmount

### 3. Create `src/components/countdown/countdown-display.tsx`
Presentational component:
- Props: `{ days, hours, minutes, seconds, status, lang }`
- Show 4 digit boxes when < 7 days, otherwise just days count
- Gradient color: green (>30d) -> orange (7-30d) -> red (<7d)
- "today" state: celebration animation
- "past" state: "Đám cưới đã qua!" message
- Max ~80 lines

### 4. Create `src/components/countdown/reminder-banner.tsx`
- Props: `{ reminders: ReminderDefinition[], dismissedIds: string[], onDismiss: (id) => void, lang }`
- Filter: show reminders where `daysBeforeWedding >= daysRemaining` AND not dismissed
- Show only the most relevant 1-2 reminders
- Dismiss button persists to `state.dismissedReminders`
- Styled as subtle banner below countdown
- Max ~60 lines

### 5. Create `src/components/countdown/countdown-widget.tsx`
Container component:
- Props: `{ weddingDate, progress, dismissedReminders, onDismiss, lang }`
- Composes `CountdownDisplay` + `ReminderBanner`
- Milestone check: if progress >= 25/50/75/100% and not dismissed, show celebration
- Max ~60 lines

### 6. Integrate into `src/pages/planning-page.tsx`
Add import and render `<CountdownWidget>` above the tab bar:
```tsx
import { CountdownWidget } from "@/components/countdown/countdown-widget";
// ... in render, before tab bar:
<CountdownWidget
  weddingDate={state.info.date}
  progress={progress}
  dismissedReminders={state.dismissedReminders || []}
  onDismiss={store.dismissReminder}
  lang={state.lang}
/>
```

## Todo List

- [ ] Create `src/data/reminder-definitions.ts` with 6+ deadline reminders
- [ ] Create `src/components/countdown/use-countdown.ts` hook
- [ ] Create `src/components/countdown/countdown-display.tsx` (visual digits)
- [ ] Create `src/components/countdown/reminder-banner.tsx` (toast alerts)
- [ ] Create `src/components/countdown/countdown-widget.tsx` (container)
- [ ] Add CountdownWidget to `planning-page.tsx`
- [ ] Verify countdown works with no date, future date, today, past date
- [ ] Verify reminders show at correct thresholds
- [ ] Verify dismiss persists across page reloads
- [ ] Build check passes

## Success Criteria

- Countdown displays correct days/hours to wedding
- All 4 states work: no-date, counting, today, past
- Reminders appear at correct milestone days
- Dismissing a reminder persists in localStorage
- Widget is responsive on mobile
- All files < 200 lines

## Conflict Prevention

- Only creates new files in `src/components/countdown/` and `src/data/`
- Single touch point in `planning-page.tsx` (1 import + 1 JSX line) — coordinate with Phase 01

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| setInterval memory leak | Low | Proper cleanup in useEffect |
| Date parsing edge cases | Low | Use Date.parse() with fallback |
| planning-page.tsx conflict | Low | Minimal change (1 import + 1 JSX) |

## Security Considerations
- No user input processed
- No API calls
- Pure client-side date math

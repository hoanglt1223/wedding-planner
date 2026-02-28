# Phase 04: Home Dashboard Components

## Parallelization Info

- **Group:** C (runs in parallel with Phase 05 and 06)
- **Depends on:** Phase 03 (home-page.tsx container exists)
- **Blocks:** Phase 07 (Polish)
- **No file conflicts with Phase 05 or 06**

## Context Links

- [Phase 03 home-page placeholder](phase-03-section-page-containers.md)
- [Brainstorm Summary](../260228-phase3-engagement-polish-brainstorm/brainstorm-summary.md)
- [Current countdown-widget.tsx](../../src/components/countdown/countdown-widget.tsx)
- [Current wedding-steps data](../../src/data/wedding-steps-01-meeting.ts)

## Overview

- **Priority:** HIGH
- **Status:** complete
- **Effort:** 4h
- **Description:** Build dashboard widgets for the Home page: progress ring, quick action cards, daily tip carousel, recent activity feed. These slot into the `HomePage` placeholder created by Phase 03.

## Key Insights

- Home page is the new default landing; must provide at-a-glance value
- Progress ring: SVG circle, percentage derived from existing `getProgress()` store method
- Quick actions: navigate to key features (Add Guest, Set Budget, View Timeline, AI Chat)
- Daily tip: rotate content from wedding-steps data (ceremony notes, cultural tips)
- Recent activity: derived from state comparison (no server), shows "what changed"
- Countdown widget already exists in `src/components/countdown/`; reuse, don't duplicate
- All components accept `lang` prop for bilingual support

## Requirements

### Functional
- Progress ring shows overall completion % (reuse store.getProgress)
- Quick action cards: 4-6 shortcut buttons that navigate to specific pages/tabs
- Daily tip carousel: one tip per day, sourced from static data, auto-rotates
- Countdown integration: reuse existing CountdownWidget
- Section progress: per-section completion bars (planning, guests, etc.)

### Non-Functional
- All components < 200 lines each
- No external chart libraries; SVG-based progress ring
- Tips data files: vi + en versions
- Mobile-first layout; responsive grid

## Architecture

```
HomePage (from Phase 03)
  -> CountdownWidget (existing, reuse)
  -> ProgressRing (NEW: SVG circle + percentage)
  -> QuickActions (NEW: grid of shortcut cards)
  -> DailyTip (NEW: rotating tip card)
  -> RecentActivity (NEW: derived from state snapshot)
```

## Related Code Files

### Files to CREATE
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/home/progress-ring.tsx` | SVG circular progress indicator | ~80 |
| `src/components/home/quick-actions.tsx` | Grid of navigation shortcut cards | ~80 |
| `src/components/home/daily-tip.tsx` | Daily rotating tip card | ~70 |
| `src/components/home/recent-activity.tsx` | State-derived activity feed | ~100 |
| `src/data/daily-tips.ts` | Vietnamese daily tips content (~30 tips) | ~80 |
| `src/data/daily-tips.en.ts` | English daily tips content | ~80 |

### Files to MODIFY
None directly. Phase 03 owns `home-page.tsx`; this phase creates components that Phase 03's placeholder will import.

**IMPORTANT:** The `home-page.tsx` file must be updated to import these components. Since Phase 03 owns that file, the implementation agent should update `home-page.tsx` during Phase 04 execution (Phase 03 is already complete by then). This is an agreed handoff -- Phase 04 has permission to modify `home-page.tsx` ONLY to replace placeholder content with real dashboard widgets.

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/components/home/progress-ring.tsx` (NEW)
- `src/components/home/quick-actions.tsx` (NEW)
- `src/components/home/daily-tip.tsx` (NEW)
- `src/components/home/recent-activity.tsx` (NEW)
- `src/data/daily-tips.ts` (NEW)
- `src/data/daily-tips.en.ts` (NEW)
- `src/pages/home-page.tsx` (MODIFY -- replace placeholder only, by agreement)

No other phase may touch these files.

## Implementation Steps

### Step 1: Create daily-tips.ts data file

`src/data/daily-tips.ts` (~80 lines):

Generate ~30 tips from wedding planning best practices, Vietnamese customs:
```typescript
export interface DailyTip {
  id: number;
  icon: string;
  text: string;
  category: "planning" | "budget" | "guests" | "tradition" | "general";
}

export const DAILY_TIPS: DailyTip[] = [
  { id: 1, icon: "📋", text: "Kiểm tra danh sách khách ít nhất 2 lần trước khi in thiệp", category: "guests" },
  { id: 2, icon: "💰", text: "Đặt cọc trước cho nhà hàng ít nhất 3 tháng", category: "budget" },
  // ... 28 more tips covering all categories
];
```

### Step 2: Create daily-tips.en.ts

Mirror structure with English translations.

### Step 3: Create progress-ring.tsx

`src/components/home/progress-ring.tsx` (~80 lines):

SVG-based circular progress:
```typescript
interface ProgressRingProps {
  percentage: number;
  size?: number;     // default 120
  strokeWidth?: number; // default 8
  lang?: string;
}
```

- SVG circle with `stroke-dasharray` and `stroke-dashoffset` for progress
- Center text: percentage number
- Color: `var(--theme-primary)`
- Smooth transition on percentage change

### Step 4: Create quick-actions.tsx

`src/components/home/quick-actions.tsx` (~80 lines):

Grid of 4-6 action cards:
```typescript
interface QuickActionsProps {
  onNavigate: (page: string, tab?: number) => void;
  lang?: string;
  guestCount: number;
  hasTimeline: boolean;
}
```

Actions:
- "Add Guest" -> navigate to `guests` page
- "Set Budget" -> navigate to `planning` page, budget tab
- "View Timeline" -> navigate to `planning` page, timeline tab
- "AI Chat" -> navigate to `tools` page (AI tab)
- "RSVP" -> navigate to `guests` page (RSVP tab)
- "Website" -> navigate to `website` page

Each card: icon + label, themed background, touch-friendly (min-h-[44px])

### Step 5: Create daily-tip.tsx

`src/components/home/daily-tip.tsx` (~70 lines):

```typescript
interface DailyTipProps {
  lang?: string;
}
```

- Select tip based on day of year: `tips[dayOfYear % tips.length]`
- Card with icon + text + category badge
- Themed styling: `bg-[var(--theme-surface)]`
- Optional: "Next tip" button to manually cycle

### Step 6: Create recent-activity.tsx

`src/components/home/recent-activity.tsx` (~100 lines):

Derive recent activity from state:
```typescript
interface RecentActivityProps {
  state: WeddingState;
  lang?: string;
}
```

Logic:
- Check if wedding date set -> "Wedding date set: March 14, 2026"
- Check guest count -> "12 guests added"
- Check checklist progress -> "45% planning complete"
- Check gifts count -> "8 gifts logged"
- Check timeline entries -> "6 timeline events"
- Show max 5 items, most relevant first
- Each item: icon + text + relative indicator

This is a "summary" view, not a chronological log. Lightweight.

### Step 7: Assemble in home-page.tsx

Update `src/pages/home-page.tsx` to compose all widgets:

```typescript
export function HomePage({ state, store, progress }: HomePageProps) {
  const lang = state.lang;
  return (
    <div className="space-y-4 py-2">
      {/* Countdown (reuse existing) */}
      <CountdownWidget weddingDate={state.info.date} progress={progress}
        dismissedReminders={state.dismissedReminders || []}
        onDismiss={store.dismissReminder} lang={lang} />

      {/* Progress ring + summary */}
      <div className="flex items-center gap-4">
        <ProgressRing percentage={progress.pct} />
        <div>
          <p className="text-lg font-bold">{progress.done}/{progress.total}</p>
          <p className="text-sm text-muted-foreground">{t("hoàn thành", lang)}</p>
        </div>
      </div>

      <QuickActions onNavigate={(page, tab) => { store.setPage(page); if (tab !== undefined) store.setTab(tab); }} lang={lang} guestCount={state.guests.length} hasTimeline={(state.timelineEntries?.length ?? 0) > 0} />
      <DailyTip lang={lang} />
      <RecentActivity state={state} lang={lang} />
    </div>
  );
}
```

### Step 8: Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Todo List

- [ ] Create `daily-tips.ts` with ~30 Vietnamese tips
- [ ] Create `daily-tips.en.ts` with English translations
- [ ] Create `progress-ring.tsx` (SVG circle)
- [ ] Create `quick-actions.tsx` (navigation shortcuts)
- [ ] Create `daily-tip.tsx` (daily rotating tip)
- [ ] Create `recent-activity.tsx` (state summary)
- [ ] Update `home-page.tsx` to compose widgets
- [ ] Verify tsc --noEmit
- [ ] Verify build

## Success Criteria

- Home page shows: countdown, progress ring, quick actions, daily tip, activity summary
- Progress ring matches `store.getProgress()` percentage
- Quick actions navigate to correct pages
- Daily tip rotates by day
- All text bilingual
- All component files < 200 lines

## Conflict Prevention

- All new files are in `src/components/home/` and `src/data/daily-tips*.ts` -- exclusive namespace
- `home-page.tsx` update is by Phase 03 handoff agreement
- CountdownWidget is IMPORTED, not modified -- owned by existing code

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| SVG progress ring rendering issues | Low | Simple circle math; test cross-browser |
| Too many tips vs too few | Low | Start with 30; expandable data file |
| Recent activity too sparse for new users | Med | Show "Get started" prompts when state is empty |

## Security Considerations

- No API calls, no user input handling
- Tips are static read-only data
- Quick actions only trigger client-side navigation

## Next Steps

- Phase 07 integrates offline badge into home page header area
- Future: add notification badges to quick actions when items need attention

# Phase 06: Onboarding Revamp + Progress Gamification

## Parallelization Info

- **Group:** C (runs in parallel with Phase 04 and 05)
- **Depends on:** Phase 03 (app structure, Home page exists as default landing)
- **Blocks:** Phase 07 (Polish)
- **No file conflicts with Phase 04 or 05**

## Context Links

- [Brainstorm: Phase 3C](../260228-phase3-engagement-polish-brainstorm/brainstorm-summary.md)
- [Current onboarding-wizard.tsx](../../src/components/onboarding/onboarding-wizard.tsx) -- 325 lines, 3 steps
- [Current onboarding-preview.tsx](../../src/components/onboarding/onboarding-preview.tsx)
- [WeddingState](../../src/types/wedding.ts) -- `onboardingComplete: boolean`
- [i18n translations](../../src/lib/i18n-translations.ts)

## Overview

- **Priority:** MEDIUM
- **Status:** complete
- **Effort:** 4h
- **Description:** Revamp 3-step onboarding to 5 steps (welcome, names, date/region, ceremony selection, get started). Add milestone badge system with static data + display component. Create per-section progress calculator.

## Key Insights

- Current onboarding crams names, dates, region, budget, party time into one massive Step 0 (~130 lines)
- New flow spreads across 5 focused steps for better mobile UX
- Onboarding lands on "home" page (new default) instead of "planning"
- Badge system is purely derived from state -- no new state fields needed
- Badges: "Date Set", "Guest List", "Budget", "Gift", "Website", "100 Days", "Complete"
- Progress calculator: function that computes per-section completion from existing state
- `onboardingComplete: boolean` already exists -- no migration needed for onboarding itself
- The `onboarding-wizard.tsx` is currently 325 lines (over 200-line limit); refactoring into steps will fix this

## Requirements

### Functional
- 5-step onboarding wizard:
  1. Welcome (app intro, wedding illustration, language selector)
  2. Couple names + birthdays
  3. Wedding date + region + party time
  4. Ceremony step selection (existing OnboardingPreview)
  5. Confirmation + "Get Started" (lands on home page)
- Budget input moved to main app (not onboarding) -- simpler onboarding
- Milestone badge system:
  - 7 badges with unlock conditions derived from state
  - Badge display component showing earned/locked badges
  - Celebration animation on badge unlock (CSS-only)
- Per-section progress: function returning completion % per section

### Non-Functional
- Onboarding wizard split into focused step components (< 200 lines each)
- Badge data: vi + en versions
- No new WeddingState fields (badges derived from existing state)
- No new API endpoints

## Architecture

```
Onboarding Flow:
  OnboardingWizard (coordinator, ~100 lines)
    -> Step 1: OnboardingWelcome (~60 lines)
    -> Step 2: OnboardingNames (~80 lines)
    -> Step 3: OnboardingDateRegion (~80 lines)
    -> Step 4: OnboardingCeremonies (~40 lines, reuses OnboardingPreview)
    -> Step 5: OnboardingConfirm (~50 lines)

Badge System:
  badges.ts / badges.en.ts (static data)
  progress-calculator.ts (derives badge unlock + section progress)
  badge-display.tsx (renders badge grid)
  section-progress.tsx (renders per-section progress bars)
```

## Related Code Files

### Files to MODIFY
| File | Changes |
|------|---------|
| `src/components/onboarding/onboarding-wizard.tsx` | Complete rewrite: 5 steps, coordinator pattern, split sub-components |

### Files to CREATE
| File | Purpose | Max Lines |
|------|---------|-----------|
| `src/components/onboarding/onboarding-welcome.tsx` | Step 1: app intro + language | ~60 |
| `src/components/onboarding/onboarding-names.tsx` | Step 2: couple names + birthdays | ~80 |
| `src/components/onboarding/onboarding-date-region.tsx` | Step 3: dates + region + party time | ~100 |
| `src/components/onboarding/onboarding-confirm.tsx` | Step 5: summary + start button | ~60 |
| `src/components/progress/badge-display.tsx` | Badge grid with earned/locked states | ~120 |
| `src/components/progress/section-progress.tsx` | Per-section completion bars | ~100 |
| `src/data/badges.ts` | Vietnamese badge definitions | ~50 |
| `src/data/badges.en.ts` | English badge definitions | ~50 |
| `src/lib/progress-calculator.ts` | Compute badge unlock + section % | ~120 |

## File Ownership (EXCLUSIVE)

This phase owns:
- `src/components/onboarding/onboarding-wizard.tsx` (REWRITE)
- `src/components/onboarding/onboarding-welcome.tsx` (NEW)
- `src/components/onboarding/onboarding-names.tsx` (NEW)
- `src/components/onboarding/onboarding-date-region.tsx` (NEW)
- `src/components/onboarding/onboarding-confirm.tsx` (NEW)
- `src/components/onboarding/onboarding-preview.tsx` (MODIFY if needed for style alignment)
- `src/components/progress/badge-display.tsx` (NEW)
- `src/components/progress/section-progress.tsx` (NEW)
- `src/data/badges.ts` (NEW)
- `src/data/badges.en.ts` (NEW)
- `src/lib/progress-calculator.ts` (NEW)

No other phase may touch these files.

## Implementation Steps

### Step 1: Create badges.ts data file

`src/data/badges.ts` (~50 lines):

```typescript
export interface BadgeDefinition {
  id: string;
  icon: string;
  name: string;
  description: string;
  condition: string; // human-readable unlock condition
}

export const BADGES: BadgeDefinition[] = [
  { id: "date-set", icon: "📅", name: "Đặt Ngày", description: "Đã chọn ngày cưới", condition: "weddingDate" },
  { id: "guest-list", icon: "👥", name: "Danh Sách Khách", description: "Thêm 10 khách mời trở lên", condition: "guests10" },
  { id: "budget-set", icon: "💰", name: "Ngân Sách", description: "Đã thiết lập ngân sách", condition: "budgetSet" },
  { id: "first-gift", icon: "🎁", name: "Phong Bì", description: "Ghi nhận quà/phong bì đầu tiên", condition: "firstGift" },
  { id: "website-live", icon: "🌐", name: "Trang Web", description: "Đã xuất bản website cưới", condition: "websiteLive" },
  { id: "countdown-100", icon: "💯", name: "100 Ngày", description: "Còn 100 ngày đến đám cưới", condition: "100days" },
  { id: "complete", icon: "🏆", name: "Hoàn Thành", description: "Hoàn thành tất cả checklist", condition: "allDone" },
];
```

### Step 2: Create badges.en.ts

Same structure, English names/descriptions.

### Step 3: Create progress-calculator.ts

`src/lib/progress-calculator.ts` (~120 lines):

```typescript
import type { WeddingState } from "@/types/wedding";

export interface BadgeStatus {
  id: string;
  unlocked: boolean;
}

export interface SectionProgress {
  id: string;
  label: string;
  percentage: number;
  total: number;
  done: number;
}

export function computeBadgeStatuses(state: WeddingState): BadgeStatus[] {
  const hasDate = !!state.info.date;
  const hasGuests10 = state.guests.length >= 10;
  const hasBudget = state.budget > 0;
  const hasGift = (state.gifts?.length ?? 0) > 0;
  const hasWebsite = state.websiteSettings?.enabled === true;
  const daysToWedding = state.info.date
    ? Math.ceil((new Date(state.info.date).getTime() - Date.now()) / 86400000)
    : Infinity;
  const within100 = daysToWedding <= 100 && daysToWedding > 0;
  // allDone: use existing progress logic
  // (import isStepEnabled + getWeddingSteps for full calc, or accept progress param)

  return [
    { id: "date-set", unlocked: hasDate },
    { id: "guest-list", unlocked: hasGuests10 },
    { id: "budget-set", unlocked: hasBudget },
    { id: "first-gift", unlocked: hasGift },
    { id: "website-live", unlocked: hasWebsite },
    { id: "countdown-100", unlocked: within100 },
    { id: "complete", unlocked: false }, // requires progress param
  ];
}

export function computeSectionProgress(state: WeddingState, lang: string): SectionProgress[] {
  // Derive per-section completion from state
  return [
    { id: "planning", label: "planning", percentage: 0, total: 0, done: 0 }, // from checkedItems
    { id: "guests", label: "guests", percentage: state.guests.length > 0 ? 50 : 0, total: 1, done: state.guests.length > 0 ? 1 : 0 },
    { id: "budget", label: "budget", percentage: state.budget > 0 ? 50 : 0, total: 1, done: state.budget > 0 ? 1 : 0 },
    // etc.
  ];
}
```

Accept `progressPct` parameter for the "complete" badge.

### Step 4: Create onboarding step components

**onboarding-welcome.tsx** (~60 lines):
- Wedding illustration (emoji: 💍)
- App name + tagline
- Language selector (vi/en toggle)
- "Get Started" button -> next step

**onboarding-names.tsx** (~80 lines):
- Bride name input (required)
- Groom name input (required)
- Bride birthday (optional)
- Groom birthday (optional)
- Continue button (disabled until both names filled)

**onboarding-date-region.tsx** (~100 lines):
- Wedding date input (optional)
- Engagement date input (optional)
- Region selector (North/Central/South buttons)
- Party time selector (Noon/Evening)
- All optional except region

**Step 4 (ceremonies)**: Reuse existing `OnboardingPreview` component as-is.

**onboarding-confirm.tsx** (~60 lines):
- Summary card: names, date, region
- "Start Planning" button with animation
- Skip link for sample data

### Step 5: Rewrite onboarding-wizard.tsx

`src/components/onboarding/onboarding-wizard.tsx` (~100 lines):

Coordinator that manages:
- Current step index (0-4)
- Local state for form fields
- Step indicator dots (5 dots)
- Navigation: back/next/skip
- handleComplete: commit all state to store, call `completeOnboarding()`
- Track analytics for each step transition

```typescript
export function OnboardingWizard({ store, track }: Props) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ bride: "", groom: "", ... });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={brandStyles}>
      <div className="w-full max-w-md">
        {/* Step indicator */}
        <StepDots current={step} total={5} />

        {/* Step content */}
        {step === 0 && <OnboardingWelcome lang={lang} onSetLang={store.setLang} onNext={() => setStep(1)} />}
        {step === 1 && <OnboardingNames data={formData} onChange={setFormData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <OnboardingDateRegion data={formData} onChange={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <OnboardingCeremonies ... onNext={() => setStep(4)} onBack={() => setStep(2)} />}
        {step === 4 && <OnboardingConfirm data={formData} onComplete={handleComplete} onBack={() => setStep(3)} />}

        {/* Skip link */}
        <SkipButton onSkip={handleSkip} />
      </div>
    </div>
  );
}
```

### Step 6: Create badge-display.tsx

`src/components/progress/badge-display.tsx` (~120 lines):

- Grid of badge cards (2 columns)
- Each badge: icon + name + description
- Locked: grayscale, opacity-40
- Unlocked: full color, subtle glow animation
- Uses `computeBadgeStatuses()` to determine unlock state
- Loads badge data from `badges.ts` / `badges.en.ts` based on lang

### Step 7: Create section-progress.tsx

`src/components/progress/section-progress.tsx` (~100 lines):

- List of sections with progress bars
- Each: section icon + name + progress bar + percentage
- Uses `computeSectionProgress()` from progress-calculator
- Color: `var(--theme-primary)` for filled portion

### Step 8: Verify

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Todo List

- [ ] Create `badges.ts` with 7 badge definitions
- [ ] Create `badges.en.ts` with English translations
- [ ] Create `progress-calculator.ts` with badge + section progress functions
- [ ] Create `onboarding-welcome.tsx` (Step 1)
- [ ] Create `onboarding-names.tsx` (Step 2)
- [ ] Create `onboarding-date-region.tsx` (Step 3)
- [ ] Create `onboarding-confirm.tsx` (Step 5)
- [ ] Rewrite `onboarding-wizard.tsx` as coordinator
- [ ] Update `onboarding-preview.tsx` if style alignment needed
- [ ] Create `badge-display.tsx`
- [ ] Create `section-progress.tsx`
- [ ] Verify tsc + lint + build

## Success Criteria

- Onboarding wizard has 5 clear steps with back/next navigation
- Each step focused on 1-2 inputs (not overwhelming)
- Skip with sample data still works
- After onboarding, user lands on Home page
- Badge display shows 7 badges with correct unlock states
- Section progress shows per-section completion
- All files < 200 lines
- All labels bilingual
- Analytics tracked per step

## Conflict Prevention

- **onboarding-wizard.tsx**: Complete rewrite. No other phase touches onboarding.
- **onboarding-preview.tsx**: Minor style changes only. Component logic unchanged.
- `progress-calculator.ts` is a pure function (no side effects); safe to call from any component.
- Badge data is read-only static; no state mutations.

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Rewrite breaks existing onboarding analytics | Med | Keep same track() calls with same event names |
| OnboardingPreview props change | Low | Existing props (lang, enabledSteps, onToggleStep) stay the same |
| Badge conditions too easy/hard | Low | Conditions derived from real state; adjust thresholds in data file |
| 5 steps feels too long | Med | Each step is short; skip button always visible; test real users |

## Security Considerations

- No API calls in onboarding (all localStorage)
- Name inputs sanitized via React's built-in escaping
- No sensitive data collected in onboarding
- Sample data is hardcoded (no external fetch)

## Next Steps

- Phase 04's Home page can import `BadgeDisplay` and `SectionProgress` components
- Phase 07 adds celebration animation for badge unlocks
- Future: badge notifications (toast on first unlock)

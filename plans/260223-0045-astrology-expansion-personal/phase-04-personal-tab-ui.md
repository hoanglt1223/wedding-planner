---
phase: 4
title: "Personal Tab UI — Cá Nhân"
status: pending
priority: P1
effort: 3h
---

# Phase 4: Personal Tab UI — "Ca Nhan"

## Context Links

- [plan.md](./plan.md) | [phase-03](./phase-03-static-content-data.md)
- [astrology-page.tsx](../../src/pages/astrology-page.tsx) | [astrology.ts](../../src/lib/astrology.ts)
- [astrology-feng-shui.ts](../../src/lib/astrology-feng-shui.ts)

## Overview

Add a new "Ca Nhan" (Personal) tab to the astrology page. Displays individual zodiac personality profiles, yearly forecasts, lucky attributes, and element deep-dives for bride or groom. Toggle between the two views.

## Key Insights

- Current TABS array has 5 entries; new tab adds as 6th (or insert at position 0/1 for prominence)
- Tab content component receives `brideYear`/`groomYear` + names; personal tab also needs `info` for birth date/hour/gender
- 4 sections: Personality, Yearly Forecast, Lucky Attributes, Element Deep-Dive
- Must stay under 200 lines per component; split into sub-components
- Reuse existing `getZodiac()`, `getSoundElement()`, `getStemBranch()` from `astrology.ts`

## Requirements

### Functional
1. New tab: `{ id: "personal", label: "✨ Cá Nhân" }` — inserted as first or second tab
2. Toggle between bride/groom personal profile view
3. Personality section: zodiac animal traits, strengths, weaknesses, marriage disposition, Can Chi name
4. Yearly forecast section: 4 categories with star ratings + description
5. Lucky attributes section: numbers, colors, directions, compatible signs, careers
6. Element deep-dive: Nap Am name, element personality, health, lucky/unlucky colors

### Non-functional
- Responsive mobile-first layout
- Use theme CSS variables consistently
- Under 200 lines per component file

## Architecture

Split into multiple files to stay under limits:

```
src/components/astrology/
  tab-personal.tsx              — Main tab (toggle + sections orchestration) ~120 lines
  personal-personality.tsx      — Personality profile section ~100 lines
  personal-yearly-forecast.tsx  — Yearly forecast section ~80 lines
  personal-lucky-attributes.tsx — Lucky attributes section ~80 lines
  personal-element-dive.tsx     — Element deep-dive section ~80 lines
```

### Data Flow

```
astrology-page.tsx
  └── TabPersonal (info, brideYear, groomYear, brideName, groomName)
        ├── activeProfile state: "bride" | "groom"
        ├── Derive: year, birthDate, birthHour, gender from info + activeProfile
        ├── Compute: zodiac = getZodiac(year), soundElement = getSoundElement(year)
        ├── Lookup: profile = getZodiacProfile(zodiac.chiIndex)
        ├── Lookup: elementProfile = getElementProfile(soundElement.element)
        ├── Lookup: forecast = getYearlyForecast(zodiac.chiIndex)
        │
        ├── PersonalitySection (zodiac, soundElement, profile)
        ├── YearlyForecastSection (forecast)
        ├── LuckyAttributesSection (profile, elementProfile)
        └── ElementDiveSection (soundElement, elementProfile)
```

## Related Code Files

### Modify
- `src/pages/astrology-page.tsx` — Add "personal" tab to TABS array, render TabPersonal, pass `info` prop

### Create
- `src/components/astrology/tab-personal.tsx`
- `src/components/astrology/personal-personality.tsx`
- `src/components/astrology/personal-yearly-forecast.tsx`
- `src/components/astrology/personal-lucky-attributes.tsx`
- `src/components/astrology/personal-element-dive.tsx`

### Delete
- None

## Implementation Steps

### Step 1: Add "personal" tab to TABS in astrology-page.tsx

Insert as second tab (after compatibility, before five-elements):

```typescript
const TABS = [
  { id: "compatibility", label: "💑 Hợp Tuổi" },
  { id: "personal", label: "✨ Cá Nhân" },   // NEW
  { id: "five-elements", label: "🔥 Ngũ Hành" },
  { id: "wedding-year", label: "📅 Năm Cưới" },
  { id: "compatible-ages", label: "🔍 Tuổi Hợp" },
  { id: "feng-shui", label: "🧭 Phong Thủy" },
];
```

Add rendering:
```typescript
{activeTab === "personal" && <TabPersonal info={info} {...tabProps} />}
```

### Step 2: Create tab-personal.tsx (orchestrator)

```typescript
import { useState } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { getZodiac, getSoundElement, getStemBranch, getBirthYear } from "@/lib/astrology";
import { getZodiacProfile } from "@/data/astrology-zodiac-profiles";
import { getElementProfile } from "@/data/astrology-element-profiles";
import { getYearlyForecast } from "@/data/astrology-yearly-forecast";
import { PersonalitySection } from "./personal-personality";
import { YearlyForecastSection } from "./personal-yearly-forecast";
import { LuckyAttributesSection } from "./personal-lucky-attributes";
import { ElementDiveSection } from "./personal-element-dive";

interface TabPersonalProps {
  info: CoupleInfo;
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

export function TabPersonal({ info, brideYear, groomYear, brideName, groomName }: TabPersonalProps) {
  const [activeProfile, setActiveProfile] = useState<"bride" | "groom">("bride");

  const year = activeProfile === "bride" ? brideYear : groomYear;
  const name = activeProfile === "bride" ? (brideName || "Cô dâu") : (groomName || "Chú rể");
  const birthHour = activeProfile === "bride" ? info.brideBirthHour : info.groomBirthHour;

  const zodiac = getZodiac(year);
  const soundElement = getSoundElement(year);
  const stemBranch = getStemBranch(year);
  const profile = getZodiacProfile(zodiac.chiIndex);
  const elementProfile = getElementProfile(soundElement.element);
  const forecast = getYearlyForecast(zodiac.chiIndex);

  return (
    <div className="space-y-3">
      {/* Profile toggle */}
      <div className="flex gap-2">
        <ToggleButton active={activeProfile === "bride"} onClick={() => setActiveProfile("bride")}
          label={brideName || "Cô dâu"} />
        <ToggleButton active={activeProfile === "groom"} onClick={() => setActiveProfile("groom")}
          label={groomName || "Chú rể"} />
      </div>

      {/* Header card with zodiac + element summary */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 text-center">
        <div className="text-4xl mb-1">{zodiac.emoji}</div>
        <div className="text-lg font-bold">{name}</div>
        <div className="text-sm text-muted-foreground">{stemBranch} · {zodiac.name} ({zodiac.chi})</div>
        <div className="text-sm">{soundElement.emoji} {soundElement.name} ({soundElement.label})</div>
      </div>

      <PersonalitySection profile={profile} zodiac={zodiac} />
      <YearlyForecastSection forecast={forecast} />
      <LuckyAttributesSection profile={profile} elementProfile={elementProfile} />
      <ElementDiveSection soundElement={soundElement} elementProfile={elementProfile} />

      {/* AI reading button placeholder — Phase 6 adds the real component here */}
    </div>
  );
}

function ToggleButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );
}
```

### Step 3: Create personal-personality.tsx

Displays: traits chips, strengths/weaknesses lists, marriage disposition text.

```typescript
import type { ZodiacProfile } from "@/data/astrology-zodiac-profiles";

interface Props {
  profile: ZodiacProfile;
  zodiac: { name: string; chi: string; emoji: string };
}

export function PersonalitySection({ profile, zodiac }: Props) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">🎭 Tính Cách — {zodiac.emoji} {zodiac.name}</h3>

      {/* Trait chips */}
      <div className="flex flex-wrap gap-1.5">
        {profile.traits.map((t) => (
          <span key={t} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">{t}</span>
        ))}
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-medium text-green-600 mb-1">✅ Điểm mạnh</div>
          {profile.strengths.map((s) => <div key={s} className="text-muted-foreground">• {s}</div>)}
        </div>
        <div>
          <div className="font-medium text-amber-600 mb-1">⚠️ Điểm yếu</div>
          {profile.weaknesses.map((w) => <div key={w} className="text-muted-foreground">• {w}</div>)}
        </div>
      </div>

      {/* Marriage disposition */}
      <div className="text-xs bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)] rounded-lg p-3">
        <div className="font-medium text-[var(--theme-note-text)] mb-1">💍 Hôn nhân</div>
        <div className="text-muted-foreground">{profile.marriageDisposition}</div>
      </div>
    </div>
  );
}
```

### Step 4: Create personal-yearly-forecast.tsx

Displays: overview text + 4 rating bars (love, career, wealth, health).

```typescript
import type { YearlyForecast } from "@/data/astrology-yearly-forecast";
import { FORECAST_YEAR } from "@/data/astrology-yearly-forecast";

interface Props {
  forecast: YearlyForecast;
}

export function YearlyForecastSection({ forecast }: Props) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">📅 Vận Mệnh Năm {FORECAST_YEAR}</h3>
      <p className="text-xs text-muted-foreground">{forecast.overview}</p>
      <div className="space-y-2">
        <RatingRow label="💕 Tình duyên" rating={forecast.love.rating} desc={forecast.love.description} />
        <RatingRow label="💼 Sự nghiệp" rating={forecast.career.rating} desc={forecast.career.description} />
        <RatingRow label="💰 Tài lộc" rating={forecast.wealth.rating} desc={forecast.wealth.description} />
        <RatingRow label="🏥 Sức khỏe" rating={forecast.health.rating} desc={forecast.health.description} />
      </div>
    </div>
  );
}

function RatingRow({ label, rating, desc }: { label: string; rating: number; desc: string }) {
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-medium">{label}</span>
        <span>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
      </div>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}
```

### Step 5: Create personal-lucky-attributes.tsx

Displays: lucky numbers, colors (with color dots), directions, compatible signs, careers.

Uses `profile` (zodiac) and `elementProfile` to show combined lucky attributes.

### Step 6: Create personal-element-dive.tsx

Displays: Nap Am name/element, element personality traits, health tendencies, lucky/unlucky colors.

Uses `soundElement` from `getSoundElement()` and `elementProfile` from data file.

## Todo List

- [ ] Add "personal" tab to TABS array in `astrology-page.tsx`
- [ ] Create `tab-personal.tsx` with bride/groom toggle
- [ ] Create `personal-personality.tsx` with traits, strengths/weaknesses, marriage
- [ ] Create `personal-yearly-forecast.tsx` with 4 rating bars
- [ ] Create `personal-lucky-attributes.tsx` with lucky numbers/colors/directions
- [ ] Create `personal-element-dive.tsx` with Nap Am + element analysis
- [ ] Pass `info` prop to TabPersonal from astrology-page.tsx
- [ ] Verify all components under 200 lines
- [ ] Test bride/groom toggle switches data correctly
- [ ] Run `npm run build`

## Success Criteria

- "Ca Nhan" tab appears in tab bar and is selectable
- Toggle switches between bride and groom profiles
- All 4 sections render with real zodiac/element data
- Star ratings display correctly for yearly forecast
- Lucky attributes show color dots and number badges
- All Vietnamese text has proper diacritics

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Tab bar overflows horizontally with 6 tabs | Low | Already has `overflow-x-auto`; 6 tabs fit on most screens |
| Personal tab data doesn't update when birth date changes | Low | Component re-renders on info prop change (React default) |
| Too many sub-components fragment the code | Low | 5 files is manageable; each has clear single responsibility |

## Security Considerations

- No user input processing beyond reading from state
- All data is static and client-side

## Next Steps

- Phase 6 (AI Reading Frontend) adds the "Xep Chi Tiet" button inside this tab
- Button renders below the ElementDiveSection

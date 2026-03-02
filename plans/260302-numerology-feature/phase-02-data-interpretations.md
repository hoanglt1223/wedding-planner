# Phase 2: Data & Interpretations

## Context Links

- Parent plan: [plan.md](plan.md)
- Depends on: [Phase 1](phase-01-core-calculations.md)
- Reference: `src/data/astrology-zodiac-profiles.ts` (data structure pattern)

## Overview

- **Priority**: P1 (blocks UI phases)
- **Status**: complete
- **Description**: Create Vietnamese interpretation data files for all numerology numbers — profiles (1-9, 11, 22, 33), compatibility pairs, wedding date meanings.

## Key Insights

- 12 number profiles total (1-9 + masters 11, 22, 33)
- Each profile needs: personality, love/marriage, career, lucky attributes
- Compatibility data: define harmony levels between number pairs
- Wedding date data: meaning of each Universal Day Number for weddings
- All Vietnamese text must use proper diacritics
- English variable/property names per code standards

## Requirements

### Functional
- Life Path profiles for numbers 1-9, 11, 22, 33
- Each profile: traits, strengths, weaknesses, marriageDisposition, luckyNumbers, luckyColors, career guidance
- Compatibility harmony map between all number pairs
- Universal Day Number interpretations for wedding planning

### Non-functional
- Each data file under 200 lines — split if needed
- Export typed arrays/records
- Interface definitions co-located or in types file

## Architecture

### File: `src/data/numerology-profiles.ts` (~200 lines)

```typescript
export interface NumerologyNumberProfile {
  number: number;
  name: string;              // Vietnamese name, e.g. "Nguoi Tien Phong"
  emoji: string;
  keywords: string[];        // 3-4 keywords
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  marriageDisposition: string;
  luckyNumbers: number[];
  luckyColors: string[];
  careers: string[];
  weddingAdvice: string;     // Numerology-specific wedding tip
}

export const NUMEROLOGY_PROFILES: NumerologyNumberProfile[];
export function getNumerologyProfile(num: number): NumerologyNumberProfile;
```

### File: `src/data/numerology-compatibility.ts` (~100 lines)

```typescript
export interface NumberPairHarmony {
  number1: number;
  number2: number;
  harmony: number;        // 0-100
  label: string;          // "Rat tuong hop", "Tuong hop", "Trung binh", "Thach thuc"
  description: string;    // Vietnamese explanation
}

export const HARMONY_MAP: Record<string, NumberPairHarmony>;
export function getNumberHarmony(n1: number, n2: number): NumberPairHarmony;
```

### File: `src/data/numerology-wedding.ts` (~80 lines)

```typescript
export interface WeddingDayMeaning {
  universalDay: number;
  label: string;           // e.g. "Ngay cua su khoi dau"
  suitability: "excellent" | "good" | "neutral" | "avoid";
  description: string;
  weddingTip: string;
}

export const WEDDING_DAY_MEANINGS: WeddingDayMeaning[];
export function getWeddingDayMeaning(universalDay: number): WeddingDayMeaning;
```

## Related Code Files

### Files to Create
- `src/data/numerology-profiles.ts`
- `src/data/numerology-compatibility.ts`
- `src/data/numerology-wedding.ts`

### Files to Reference
- `src/data/astrology-zodiac-profiles.ts` — interface + array pattern
- `src/data/astrology-element-profiles.ts` — element profile pattern

## Implementation Steps

1. Create `src/data/numerology-profiles.ts`
2. Define `NumerologyNumberProfile` interface
3. Write 12 profiles (1-9, 11, 22, 33) with Vietnamese text:
   - Number 1: Nguoi Tien Phong (Leader)
   - Number 2: Nguoi Hoa Giai (Mediator)
   - Number 3: Nguoi Sang Tao (Creator)
   - Number 4: Nguoi Xay Dung (Builder)
   - Number 5: Nguoi Tu Do (Adventurer)
   - Number 6: Nguoi Cham Soc (Nurturer)
   - Number 7: Nguoi Tim Kiem (Seeker)
   - Number 8: Nguoi Thanh Dat (Achiever)
   - Number 9: Nguoi Nhan Ai (Humanitarian)
   - Number 11: Nguoi Truc Giac (Intuitive Master)
   - Number 22: Nguoi Kien Tao (Master Builder)
   - Number 33: Nguoi Day Do (Master Teacher)
4. Implement `getNumerologyProfile()` lookup function
5. Create `src/data/numerology-compatibility.ts`
6. Define harmony scores for key pairs:
   - Same number: 90 (harmony)
   - Complementary (1-2, 3-6, 4-8, 5-7, etc.): 80
   - Neutral: 60
   - Challenging (4-5, 1-8, etc.): 40
7. Implement `getNumberHarmony()` — normalize pair key as `min-max` for lookup
8. Create `src/data/numerology-wedding.ts`
9. Write Universal Day interpretations 1-9 + 11/22/33 for wedding context:
   - Day 1: Khoi dau moi, tot cho cap doi doc lap
   - Day 2: Hop tac, su ket noi — rat tot cho dam cuoi
   - Day 6: Gia dinh, tinh yeu — ngay ly tuong nhat cho dam cuoi
   - Day 9: Nhan ai, ket thuc mot chu ky — tot cho dam cuoi cuoi nam
   - etc.
10. Implement `getWeddingDayMeaning()` lookup

## Todo List

- [ ] Create `src/data/numerology-profiles.ts` with interface
- [ ] Write profiles for numbers 1-9 (9 profiles)
- [ ] Write profiles for master numbers 11, 22, 33
- [ ] Implement `getNumerologyProfile()`
- [ ] Create `src/data/numerology-compatibility.ts`
- [ ] Define harmony map for all significant pairs
- [ ] Implement `getNumberHarmony()`
- [ ] Create `src/data/numerology-wedding.ts`
- [ ] Write wedding day meanings for 1-9, 11, 22, 33
- [ ] Implement `getWeddingDayMeaning()`
- [ ] Verify all Vietnamese text has proper diacritics
- [ ] Run `npm run build`

## Success Criteria

- All 12 profiles have complete data (no empty fields)
- Vietnamese text uses proper diacritics throughout
- Harmony lookup works bidirectionally (getNumberHarmony(3,6) === getNumberHarmony(6,3))
- All files under 200 lines
- `npm run build` clean

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Content volume exceeds 200-line limit | File too large | Split profiles into numerology-profiles-1.ts and numerology-profiles-2.ts if needed |
| Inaccurate Vietnamese interpretations | Cultural mismatch | Research popular Vietnamese numerology sources before writing |

## Security Considerations

- Static data files, no security concerns
- All English property names per code standards

## Next Steps

- Phase 3 UI components consume these data files to render profiles and compatibility results

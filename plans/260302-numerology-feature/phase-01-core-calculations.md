# Phase 1: Core Calculations

## Context Links

- Parent plan: [plan.md](plan.md)
- Reference: `src/lib/astrology.ts` (calculation module pattern)
- Types: `src/types/wedding.ts` (CoupleInfo)

## Overview

- **Priority**: P1 (blocks all other phases)
- **Status**: complete
- **Description**: Build Pythagorean numerology calculation engine in `src/lib/numerology.ts` and compatibility scorer in `src/lib/numerology-compatibility.ts`.

## Key Insights

- Pythagorean letter map: A=1..I=9, J=1..R=9, S=1..Z=8
- Vietnamese diacritics stripped before mapping (Nguyen, not Nguyen)
- Master numbers 11, 22, 33 must NOT be reduced further
- Y treated as vowel (standard Pythagorean)
- Life Path uses full date reduction, not just year

## Requirements

### Functional
- Calculate 8 core numbers from birth date + full name
- Strip Vietnamese diacritics from names before calculation
- Preserve master numbers 11/22/33
- Compute couple compatibility score (weighted multi-number)
- Score wedding dates via Universal Day Number vs Life Paths

### Non-functional
- Pure functions, no side effects
- Each file under 200 lines
- All exports typed

## Architecture

### File: `src/lib/numerology.ts` (~150 lines)

```typescript
// --- Constants ---
const PYTHAGOREAN_MAP: Record<string, number>; // A=1..Z=8
const VOWELS = new Set(["A","E","I","O","U","Y"]);

// --- Helpers ---
export function stripDiacritics(text: string): string;
export function reduceToSingleDigit(n: number): number; // stops at 11/22/33
function sumDigits(n: number): number;
function letterValue(char: string): number;

// --- Core Numbers ---
export function calcLifePath(birthDate: string): number;
export function calcExpression(fullName: string): number;
export function calcSoulUrge(fullName: string): number;
export function calcPersonality(fullName: string): number;
export function calcBirthday(birthDate: string): number;
export function calcPersonalYear(birthDate: string, year?: number): number;
export function calcMaturity(lifePath: number, expression: number): number;
export function calcChallenge(birthDate: string): number[];

// --- Aggregate ---
export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
  maturity: number;
  challenges: number[];
}
export function calcFullProfile(birthDate: string, fullName: string, year?: number): NumerologyProfile;

// --- Wedding Date ---
export function calcUniversalDayNumber(dateStr: string): number;
```

### File: `src/lib/numerology-compatibility.ts` (~80 lines)

```typescript
import type { NumerologyProfile } from "./numerology";

export interface CompatibilityResult {
  score: number;           // 0-100
  level: "excellent" | "good" | "moderate" | "challenging";
  breakdown: { label: string; weight: number; harmony: number }[];
}

export function calcCompatibility(
  profile1: NumerologyProfile,
  profile2: NumerologyProfile,
): CompatibilityResult;

export function calcWeddingDateScore(
  dateStr: string,
  lifePath1: number,
  lifePath2: number,
): { score: number; universalDay: number; harmony1: number; harmony2: number };
```

## Related Code Files

### Files to Create
- `src/lib/numerology.ts`
- `src/lib/numerology-compatibility.ts`

### Files to Reference (read-only)
- `src/lib/astrology.ts` — pattern for calculation module
- `src/types/wedding.ts` — CoupleInfo shape

## Implementation Steps

1. Create `src/lib/numerology.ts`
2. Implement `stripDiacritics()` using `String.normalize("NFD").replace(/[\u0300-\u036f]/g, "")` plus Vietnamese-specific: D/d mapping
3. Implement `PYTHAGOREAN_MAP` constant — map A-Z to 1-9 repeating
4. Implement `reduceToSingleDigit(n)` — sum digits repeatedly, stop if 11/22/33
5. Implement `calcLifePath(birthDate)`:
   - Parse "YYYY-MM-DD" into day, month, year
   - Reduce each part separately, then sum and reduce final
6. Implement name-based functions (Expression, Soul Urge, Personality):
   - Strip diacritics, uppercase, filter A-Z only
   - Expression = sum all letters
   - Soul Urge = sum vowels only
   - Personality = sum consonants only
7. Implement `calcBirthday(birthDate)` — reduce day number only
8. Implement `calcPersonalYear(birthDate, year)` — birth month + birth day + target year digits
9. Implement `calcMaturity(lifePath, expression)` — reduce sum
10. Implement `calcChallenge(birthDate)` — compute 4 challenge numbers from differences
11. Implement `calcFullProfile()` aggregate function
12. Implement `calcUniversalDayNumber(dateStr)` — reduce full date
13. Create `src/lib/numerology-compatibility.ts`
14. Implement weighted compatibility scoring:
    - Life Path harmony: 40% weight
    - Expression harmony: 20%
    - Soul Urge harmony: 20%
    - Birthday harmony: 10%
    - Personal Year harmony: 10%
15. Harmony = 100 if same number, 80 if complementary pair (1-2, 3-6, etc.), else 50
16. Implement `calcWeddingDateScore()` — Universal Day vs each Life Path

## Todo List

- [ ] Create `src/lib/numerology.ts`
- [ ] Implement stripDiacritics with Vietnamese D handling
- [ ] Implement PYTHAGOREAN_MAP
- [ ] Implement reduceToSingleDigit (master 11/22/33)
- [ ] Implement calcLifePath
- [ ] Implement calcExpression / calcSoulUrge / calcPersonality
- [ ] Implement calcBirthday
- [ ] Implement calcPersonalYear
- [ ] Implement calcMaturity
- [ ] Implement calcChallenge
- [ ] Implement calcFullProfile
- [ ] Implement calcUniversalDayNumber
- [ ] Create `src/lib/numerology-compatibility.ts`
- [ ] Implement calcCompatibility
- [ ] Implement calcWeddingDateScore
- [ ] Run `npm run build` to verify no TS errors

## Success Criteria

- All 8 core numbers calculate correctly for sample inputs
- Master numbers 11/22/33 preserved in reduction
- Vietnamese diacritics fully stripped (Nguyen Thi Minh = NGUYEN THI MINH)
- Compatibility score returns 0-100 with meaningful breakdown
- `npm run build` passes cleanly

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Vietnamese D (D) not handled by NFD normalize | Wrong letter values | Explicit pre-replace: D->D, d->d before normalize |
| Master number edge cases | Wrong Life Path | Unit-test 29 (2+9=11), 22nd births, etc. |

## Security Considerations

- Pure functions, no user input escaping needed
- No API calls in this phase

## Next Steps

- Phase 2: Data files consume these number types for interpretations
- Phase 3: UI components call these functions

# Vietnamese Lunar Calendar Implementation Plan

## Quick Decision

**RECOMMENDED SOLUTION:** @dqcai/vn-lunar (library) + custom auspicious date layer

---

## Top Library Candidate

### @dqcai/vn-lunar

```bash
npm install @dqcai/vn-lunar
```

**Why:**
- ✅ Most recently maintained (Jan 2026)
- ✅ Full TypeScript (native types)
- ✅ Zero dependencies
- ✅ Universal runtime (Node, browser, React Native, Deno, Bun)
- ✅ Supports Can Chi (干支) calculations
- ✅ Leap month detection
- ✅ Vietnamese localization
- ✅ Range: 1200-2199 CE (more than enough for wedding planning)

**Package Stats:**
- Version: 1.0.1 (MIT license)
- Size: 281 KB unpacked
- Maintainer: cuongdq (active)
- Dependencies: None

**GitHub:** https://github.com/cuongdqpayment/dqcai-vn-lunar

---

## What NOT Included (Expected)

❌ **Hoàng Đạo / Hắc Đạo** - Lucky/unlucky days
❌ **Auspicious date recommendations** - Wedding-specific luck

**Why?** These are cultural/religious interpretations (Buddhism, Taoism, folk beliefs). Different regions have different rules. Libraries focus on objective calendar math.

---

## Custom Implementation Required

**What to build:** Auspicious date evaluation layer

### Architecture

```typescript
// 1. Use @dqcai/vn-lunar for conversions
convertSolarToLunar(2026, 3, 15)
// → { year: 2026, month: 1, day: 28, isLeapMonth: false }

getCanChi(2026, 1, 28)
// → "甲寅" (Year 甲, Month 寅, Day 寅)

// 2. Lookup table for Vietnamese wedding Can Chi combinations
const weddingAuspiciousCanChi = [
  "甲寅", "乙卯", "丙辰", // ... ~12-18 recommended combinations
]

// 3. Expose API for UI
getAuspiciousDatesForWedding(year, startMonth, endMonth)
// Returns: [{ date, lunar, canChi, isLucky, reason }]
```

### Implementation Estimate

| Phase | Time | Notes |
|-------|------|-------|
| Install & test library | 30 min | Verify conversions work |
| Build auspicious lookup | 2-3 hours | Can Chi table + rules |
| UI integration | 2-3 hours | Calendar highlighting |
| Testing | 1-2 hours | Edge cases (leap years) |
| **Total** | **~1 day** | Production-ready |

---

## Auspicious Days for Weddings (Research Notes)

Vietnamese wedding astrology typically considers:

1. **Can Chi day classification** (60-year cycle)
   - Certain Can Chi combinations = better for weddings
   - Example: 甲寅 (Wood-Tiger) might be auspicious

2. **Earthly Branches for luck** (12-year cycle)
   - 午 (Horse) days favorable for many activities
   - 卯 (Rabbit) generally considered lucky

3. **Month considerations**
   - Some lunar months better for weddings (traditionally 1, 5, 8, 11)

4. **Numerology factors**
   - Lucky day counts (2, 6, 8, 9 considered good)
   - Avoid certain combinations with couple's birth years

**Next step:** Consult Vietnamese astrology source or couple's family for specific preferences.

---

## Alternatives Considered

### lunar-javascript (v1.7.7)

**Advantages:**
- Richer feature set (includes lucky day classification)
- More adoption (~8k-15k weekly downloads)
- Includes: Hoàng Đạo, 12 luck stars, lucky directions

**Disadvantages:**
- Designed for Chinese calendar (Vietnamese support uncertain)
- Older maintainer activity (3 months vs 5 months)
- Larger package

**Use if:** @dqcai/vn-lunar insufficient for Vietnamese needs

### lunar-calendar-ts-vi

**Status:** Maintained but 1+ year old
**Verdict:** Fallback option

---

## Implementation Checklist

- [ ] `npm install @dqcai/vn-lunar`
- [ ] Create `src/lib/lunar-calendar.ts` service
- [ ] Implement `convertSolarToLunar()` wrapper
- [ ] Implement `getCanChi()` wrapper
- [ ] Build auspicious date lookup table
- [ ] Create `getAuspiciousDatesForWedding()` function
- [ ] Add TypeScript types for lunar dates
- [ ] Write unit tests (edge cases)
- [ ] Integrate with wedding planner calendar UI
- [ ] Document auspicious date rules (for team reference)

---

## Code Structure

```
src/lib/lunar-calendar/
├── index.ts                    # Main export
├── types.ts                    # TypeScript interfaces
├── converter.ts                # Solar ↔ Lunar conversion
├── auspicious-dates.ts         # Auspicious logic (custom)
└── can-chi-lookup.ts           # Can Chi reference table
```

---

## Next Steps

1. **Validate library**: Install & test conversions against known dates
2. **Research auspicious rules**: Confirm Vietnamese wedding Can Chi preferences
3. **Implement service**: Build wrapper layer with domain types
4. **Test thoroughly**: Edge cases (leap years, boundary dates)
5. **UI integration**: Calendar component with auspicious highlights

---

## Risk Assessment

| Risk | Probability | Mitigation |
|------|-------------|-----------|
| Library accuracy | Low | Test against official Vietnamese calendar |
| Auspicious rule conflicts | Medium | Document assumptions, allow user override |
| Performance | Low | Date conversions are <1ms |
| Maintenance | Low | Library has active maintainer |

---

## Final Recommendation

✅ **Proceed with @dqcai/vn-lunar + custom auspicious layer**

- Low risk, well-scoped effort (1 day)
- Leverages battle-tested library (removes astronomical math complexity)
- Maintains flexibility for Vietnamese customization
- Supports future mobile/Deno/Bun integrations


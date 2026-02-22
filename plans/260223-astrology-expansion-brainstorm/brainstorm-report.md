# Astrology Page Expansion - Brainstorm Report

**Date:** 2026-02-23
**Status:** Brainstorm Complete - Ready for Planning

---

## Problem Statement

Current astrology page has 5 couple-focused tabs (Compatibility, Five Elements, Wedding Year, Compatible Ages, Feng Shui) using only birth year input. No personal astrology, no date selection, no birth chart. Users have no reason to return after checking compatibility once.

**Goals:** Engagement + Cultural Completeness + Differentiation from competitors (lichngaytot.com, tuvi.vn, etc.)

---

## Agreed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Birth hour input | Graceful degradation | Optional, unlocks deeper features when provided. ~30-50% of users won't know their birth hour |
| Personal astrology layout | Separate "Ca Nhan" tab | Clean separation from couple analysis |
| Personal/couple toggle | Both modes | Individual view + couple comparison |
| Data model | Replace birth year with full Person type | Migration needed but cleaner long-term |
| Content strategy | Hybrid: static base + AI (OpenAI GPT) | Static personality text + "Xep Chi Tiet" AI button for deeper reading |
| Chart depth | Full traditional La So Tu Vi | 12 palaces, 100+ stars — long-term investment |
| Calendar engine | Hybrid: library + custom logic | JS lunar calendar library for conversion, custom astrology logic on top |
| Date planner scope | Full ceremony planner | Separate date picking for dam ngo, an hoi, don dau + Hoang Dao hours |
| Timeline | No pressure, build incrementally | Quality over speed |
| Phase 1 delivery | Ship all at once | No sub-phasing within Phase 1 |

---

## Phased Roadmap

### Phase 1 — Foundation + Personal Astrology
**Scope:** Biggest phase, ships as one cohesive release.

**Data Model Changes:**
- Replace `brideBirthYear`/`groomBirthYear` strings with structured Person type
- New fields: `birthDate` (YYYY-MM-DD), `birthHour` (0-23 | null), `gender`
- State migration from current v11 format
- Backward compatibility: derive year from birthDate for existing calculations

**New "Ca Nhan" (Personal) Tab:**
1. **Personality Profile** — Zodiac animal traits, strengths/weaknesses, character description based on Can Chi combination (60 unique profiles)
2. **Yearly Forecast** — Current year prediction: career, love, health, wealth luck ratings with brief descriptions
3. **Lucky Attributes** — Numbers, colors, directions, seasons, compatible zodiac signs, career suggestions
4. **Element Deep-Dive** — Detailed Nap Am element analysis: personality implications, health tendencies, life patterns

**AI Enhancement:**
- "Xep Chi Tiet" button calls OpenAI GPT via Vercel serverless function
- Generates personalized deeper reading combining zodiac + element + year + hour
- Cache responses in Upstash Redis (same reading for same birth data)
- Rate limit per session to control cost

**UX:**
- Birth date/hour input form (date picker + hour dropdown with "Khong biet" option)
- Graceful degradation: basic features with year only, full features with hour
- Toggle between bride/groom personal profiles
- Couple comparison view (side-by-side)

**Static Content Required:**
- 12 zodiac personality descriptions (Vietnamese)
- 5 element personality descriptions
- 60 Can Chi combination nuances (can be shorter, referencing zodiac + element)
- Yearly forecast templates per zodiac for current year
- Lucky attributes data per element/zodiac

---

### Phase 2 — Lunar Calendar + Ceremony Date Planner

**Calendar Engine:**
- Integrate JS lunar calendar library (e.g., `lunar-calendar` or `am-lich`)
- Build custom Hoang Dao day/hour calculation logic on top
- Solar-lunar date conversion for the wedding planning range (2024-2030)

**Ceremony Date Planner:**
- Separate date selection for each ceremony:
  - Dam Ngo (engagement visit)
  - An Hoi (betrothal ceremony)
  - Don Dau (bride reception/wedding day)
- Visual monthly calendar view with color-coded days (good/neutral/bad)
- Per-day detail: Hoang Dao category, auspicious stars, conflict warnings
- Filter by couple's zodiac compatibility
- Cross-reference with Tam Tai, Thai Tue, Kim Lau warnings

**Hoang Dao Hours:**
- 12 time slots per day with guardian deity
- Highlight recommended ceremony start times
- Compatible hours for specific couple

---

### Phase 3 — La So Tu Vi Birth Chart

**Calculation Engine:**
- Full 12-palace distribution algorithm
- 14 primary stars (Tu Vi, Thien Co, Thien Phu, etc.) placement
- 100+ auxiliary star placements
- Palace-star interaction interpretations
- Requires birth hour for accuracy (graceful: show partial chart without hour)

**Visual Chart:**
- Traditional 12-palace grid layout (4x3 or circular)
- Star badges in each palace with color coding (auspicious/neutral/inauspicious)
- Click palace for detailed interpretation
- Highlight Cung Phu The (Spouse Palace) for wedding context

**Couple Chart Comparison:**
- Side-by-side birth charts
- Highlighted palace interactions
- Cung Phu The cross-analysis
- Marriage timing recommendations from chart

---

### Phase 4 — Engagement + Polish

**Daily Features:**
- Daily horoscope for each zodiac sign
- "Hom Nay" (Today) mini-card on home page
- Push notification for auspicious dates (PWA)

**Remediation (Hoa Giai):**
- Guidance text for each conflict type (Tuong Khac, Luc Xung, Tam Tai, Kim Lau)
- Traditional remediation methods
- Cultural disclaimers

**Enhanced Sharing:**
- Personal zodiac card (individual, not just couple)
- Birth chart share image
- Ceremony date share card
- QR code watermark on cards

**Zodiac Personality Insights:**
- Compatibility quiz (gamification)
- Zodiac-based wedding theme suggestions
- "How to love a [zodiac]" relationship tips

---

## Technical Considerations

### Phase 1 Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| State migration breaks existing users | High | Careful migration in migrate-state.ts, test all v11→v12 paths |
| 60 Can Chi content is a lot of writing | Medium | Start with 12 zodiac base, enhance with element modifiers. Use templates |
| OpenAI API cost per user | Medium | Cache responses (same birth data = same reading), rate limit |
| AI content quality in Vietnamese | Medium | Test GPT Vietnamese output, consider system prompts with cultural context |

### Architecture Notes
- All astrology calculations remain client-side (current pattern)
- AI enhancement is the ONLY server-side addition (Vercel function → OpenAI → cache in Redis)
- New personal tab reuses existing astrology.ts + astrology-feng-shui.ts libs
- New lib file needed: `astrology-personality.ts` (static content + templates)
- New API endpoint: `/api/astrology-reading.ts` (OpenAI integration)

### Content Strategy
- Static base: 12 zodiac profiles + 5 element profiles + yearly templates
- Template variables: `{zodiac}`, `{element}`, `{canChi}`, `{year}`, `{hour}`
- AI prompt: combine all variables into a personalized reading prompt
- Cache key: `astrology:reading:{birthDate}:{birthHour}:{gender}:{year}`

---

## Success Metrics

- **Phase 1:** Users spend >3 min on astrology page (vs. current ~1 min check-and-leave)
- **Phase 2:** Users return to check dates (multi-session engagement)
- **Phase 3:** Users share birth charts (viral growth)
- **Phase 4:** Daily active users from horoscope feature

---

## Unresolved Questions

1. **Vietnamese content quality** — Who writes the 12 zodiac personality texts? AI-generated drafts reviewed by human, or fully human-written?
2. **OpenAI model choice** — GPT-4o-mini (cheap, fast) vs GPT-4o (better quality)? Cost tradeoff
3. **Lunar calendar library** — Need to evaluate specific JS libraries for accuracy with Vietnamese lunar calendar (some libraries only handle Chinese lunar calendar, which differs slightly)
4. **Birth chart accuracy validation** — How to verify La So Tu Vi calculations are correct? Need a reference implementation or astrologer to validate

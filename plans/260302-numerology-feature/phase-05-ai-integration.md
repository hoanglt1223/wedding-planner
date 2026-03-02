# Phase 5: AI Integration

## Context Links

- Parent plan: [plan.md](plan.md)
- Depends on: [Phase 4](phase-04-page-and-routing.md)
- Reference: `src/lib/astrology-prompt.ts` (prompt builder pattern)
- Reference: `src/components/astrology/ai-reading-card.tsx` (AI card pattern)
- Reference: `api/ai.ts` (API handler with action routing)

## Overview

- **Priority**: P2 (optional enhancement, static interpretations work without AI)
- **Status**: complete
- **Description**: Add AI-powered deep numerology reading via ZhipuAI. Create prompt builder, add `action=numerology` handler to existing AI endpoint, wire into ai-numerology-card component.

## Key Insights

- Reuse existing `api/ai.ts` infrastructure — add `action=numerology` case
- Same rate limiting (5/day per IP) and caching pattern as astrology
- Prompt includes all 8 core numbers + Vietnamese wedding context
- Cache key includes birth date + name hash + year for uniqueness
- System prompt instructs AI to write Vietnamese numerology analysis

## Requirements

### Functional
- Build AI prompt from numerology profile (8 numbers + name + birth date)
- Server-side handler in `api/ai.ts` with `action=numerology`
- Rate limited: 5 requests/IP/day (shared limit with astrology)
- Redis cache: 300-day TTL per unique input combo
- Response displayed in ai-numerology-card component

### Non-functional
- Prompt builder under 80 lines
- No changes to ZhipuAI model or timeout config
- Vietnamese only (no lang parameter needed)

## Architecture

### File: `src/lib/numerology-prompt.ts` (~50 lines)

```typescript
import type { NumerologyProfile } from "./numerology";

export interface NumerologyReadingInput {
  birthDate: string;
  fullName: string;
  profile: NumerologyProfile;
}

export function buildNumerologyPrompt(input: NumerologyReadingInput): {
  system: string;
  user: string;
};
```

System prompt:
```
Ban la chuyen gia Than So Hoc (Pythagorean Numerology) voi kien thuc sau ve y nghia
cac con so trong hon nhan va cuoc song. Viet bai phan tich than so hoc bang tieng Viet,
dung thuat ngu than so hoc voi dau tieng Viet day du.
Giong van: am ap, khich le, thuc te.
Do dai: 400-500 tu.
```

User prompt template:
```
Phan tich than so hoc ca nhan:
- Ho ten: {fullName}
- Ngay sinh: {birthDate}
- So Chu Dao (Life Path): {lifePath}
- So Bieu Dat (Expression): {expression}
- So Linh Hon (Soul Urge): {soulUrge}
- So Nhan Cach (Personality): {personality}
- So Ngay Sinh (Birthday): {birthday}
- So Nam Ca Nhan (Personal Year): {personalYear}
- So Truong Thanh (Maturity): {maturity}

Viet 5 phan:
1. Tong quan tinh cach va su menh
2. Tinh duyen & hon nhan
3. Su nghiep & tai loc
4. Loi khuyen cho ngay cuoi
5. Loi khuyen dac biet
```

### Modifications to Existing Files

**`api/ai.ts`** — Add numerology handler:

```typescript
import { buildNumerologyPrompt } from "../src/lib/numerology-prompt.js";
import type { NumerologyReadingInput } from "../src/lib/numerology-prompt.js";

async function handleNumerology(req: VercelRequest, res: VercelResponse) {
  const body = req.body as NumerologyReadingInput;
  // Rate limit (same 5/day pool)
  // Validate input
  // Cache check with key: `num:reading:{birthDate}:{nameHash}:{year}`
  // Build prompt
  // Call ZhipuAI
  // Cache and return
}

// In handler switch:
if (action === "numerology") return await handleNumerology(req, res);
```

## Related Code Files

### Files to Create
- `src/lib/numerology-prompt.ts`

### Files to Modify
- `api/ai.ts` — add `handleNumerology` function + action case

### Files to Reference
- `src/lib/astrology-prompt.ts` — prompt structure pattern
- `src/components/numerology/ai-numerology-card.tsx` — client-side consumer (from Phase 3)

## Implementation Steps

1. Create `src/lib/numerology-prompt.ts`
2. Define `NumerologyReadingInput` interface
3. Implement `buildNumerologyPrompt()`:
   - System message: Vietnamese numerology expert persona
   - User message: all 8 numbers + name + birth date + 5 analysis sections
4. Edit `api/ai.ts`:
   - Add import for `buildNumerologyPrompt` and `NumerologyReadingInput`
   - Create `handleNumerology()` function:
     a. Rate limit check (reuse `astro_rl` prefix or create `num_rl`)
     b. Validate: birthDate required, fullName required, profile object required
     c. Generate cache key: `num:reading:{birthDate}:{simpleHash(fullName)}:{currentYear}`
     d. Check Redis cache
     e. Build prompt via `buildNumerologyPrompt()`
     f. Call `callWithFallback()` with max_tokens=800, temp=0.7
     g. Parse response, cache to Redis (300-day TTL)
     h. Return `{ text, cached }`
   - Add `if (action === "numerology")` case in main handler switch
5. Update `ai-numerology-card.tsx` (from Phase 3) to POST correct payload:
   ```typescript
   body: JSON.stringify({
     birthDate, fullName,
     profile: { lifePath, expression, soulUrge, personality, birthday, personalYear, maturity, challenges }
   })
   ```
6. Simple hash function for cache key (sum char codes, not crypto):
   ```typescript
   function simpleHash(str: string): string {
     let h = 0;
     for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
     return Math.abs(h).toString(36);
   }
   ```

## Todo List

- [ ] Create `src/lib/numerology-prompt.ts`
- [ ] Implement buildNumerologyPrompt with Vietnamese persona
- [ ] Add handleNumerology to `api/ai.ts`
- [ ] Implement rate limiting for numerology
- [ ] Implement Redis cache for numerology readings
- [ ] Add action=numerology case in handler switch
- [ ] Update ai-numerology-card.tsx POST payload
- [ ] Test end-to-end: button click -> API -> response display
- [ ] Run `npm run build`

## Success Criteria

- POST `/api/ai?action=numerology` returns Vietnamese analysis text
- Rate limiting works (429 after 5 requests/day)
- Cache hit returns `cached: true` on repeat request
- ai-numerology-card shows loading -> result flow
- Error states handled (rate limit, timeout, network)

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| ZhipuAI doesn't know Vietnamese numerology well | Low quality output | Detailed prompt with all numbers pre-computed, AI just interprets |
| Shared rate limit exhaustion | Users can't get astrology + numerology readings | Consider separate rate limit prefix `num_rl` (5/day each) |
| Large request body (profile object) | Payload size | Profile is ~200 bytes, well within limits |

## Security Considerations

- API key server-side only (Z_AI_KEY env var)
- Rate limiting prevents abuse
- Input validation: birthDate format, fullName non-empty
- Cache key uses hash of name (no PII in Redis keys)

## Next Steps

- Phase 6: Build verification, edge cases, polish

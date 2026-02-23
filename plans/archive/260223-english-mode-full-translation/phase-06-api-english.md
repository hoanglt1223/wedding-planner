# Phase 6: API English Support

## Context
- Parent: [plan.md](plan.md)
- Independent of Phases 2-5 (can start after Phase 1)
- API endpoints: `api/ai/chat.ts`, `api/astrology-reading.ts`

## Overview
- **Priority:** P1
- **Status:** Completed
- **Description:** Make API endpoints language-aware — English system prompts, English responses when lang="en"
- **Completed:** 2026-02-23

## Key Insights
- Both APIs use ZhipuAI (Chinese LLM, model glm-5)
- System prompts are entirely Vietnamese
- Frontend needs to pass `lang` parameter in request body
- Redis cache keys should include lang to avoid serving wrong language
- ZhipuAI supports English well — just needs English system prompt
- Rate limiting is per-IP, not per-lang — no changes needed

## Requirements
### Functional
- Both endpoints accept `lang` field in request body (default: "vi")
- When lang="en": system prompt in English, AI responds in English
- When lang="vi": behavior unchanged (existing Vietnamese)
- Cache keys include lang suffix to separate cached responses
- Error messages returned in matching language

### Non-Functional
- No breaking changes — existing requests without `lang` default to Vietnamese
- Cache separation: won't serve cached Vietnamese to English users (or vice versa)

## Related Code Files
### Modify
- `api/ai/chat.ts` — Lang-aware system prompt + error messages
- `api/astrology-reading.ts` — Lang-aware system prompt + user prompt + error messages + cache keys

### Frontend (for sending lang)
- `src/components/ai/ai-panel.tsx` — Include `lang` in POST body (covered in Phase 5 but noted here)

## Implementation Steps

### 1. Update `api/ai/chat.ts`

**Add lang-aware system prompt:**
```typescript
// Extract lang from body (default "vi")
const { prompt, budget, lang = "vi" } = body;

// System prompt by language
const systemPrompt = lang === "en"
  ? `Expert Vietnamese wedding consultant with 20 years experience across all 3 regions of Vietnam. Provide detailed advice with VND pricing. Budget: ${budget}.`
  : `Chuyên gia đám cưới VN 20 năm kinh nghiệm. 3 miền. Chi tiết, có giá VNĐ. Budget: ${budget}.`;
```

**Budget formatting:**
```typescript
const budgetStr = lang === "en"
  ? `${budget.toLocaleString("en-US")} VND`
  : `${budget.toLocaleString("vi-VN")}đ`;
```

**Error messages:**
```typescript
const errorTimeout = lang === "en"
  ? "ZhipuAI timed out after 25s. Please try again."
  : "ZhipuAI timeout sau 25s. Thử lại sau.";
```

### 2. Update `api/astrology-reading.ts`

**Lang-aware system prompt:**
```typescript
const { lang = "vi" } = body;

const system = lang === "en"
  ? `You are a Vietnamese astrology expert with deep knowledge of Earthly Branches (Dia Chi), Heavenly Stems (Thien Can), and Five Elements (Ngu Hanh Nap Am).
Write a personal astrology analysis in English, using traditional Vietnamese terminology with translations.
Tone: warm, encouraging, use tendencies rather than absolute predictions.
Length: 400-500 words.`
  : `Bạn là chuyên gia Tử Vi Việt Nam... (existing)`;
```

**Lang-aware user prompt:**
```typescript
const user = lang === "en"
  ? `Personal astrology analysis:
- Birth year: ${year} (${stemBranch})
- Zodiac: ${zodiac.name} (${zodiac.chi})
- Nap Am: ${soundElement.name} — ${soundElement.label} element
- Birth hour: ${hourLabel}
- Gender: ${genderLabel}
- Current year: ${body.currentYear} (${currentStemBranch}) — Year of the ${currentZodiac.name}

Write 5 sections:
1. 🔮 Overall fortune for ${body.currentYear}
2. 💕 Love & marriage
3. 💼 Career & wealth
4. 🏥 Health
5. 💡 Special advice`
  : `Phân tích tử vi cá nhân:... (existing)`;
```

**Cache key with lang suffix:**
```typescript
// Before:
const cacheKey = `astro:${year}:${body.birthHour}:${body.gender}:${body.currentYear}`;
// After:
const cacheKey = `astro:${year}:${body.birthHour}:${body.gender}:${body.currentYear}:${lang}`;
```

**Error messages:**
```typescript
const rateLimitMsg = lang === "en"
  ? "You've used all your readings for today. Please try again tomorrow."
  : "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai.";
```

**Gender/hour labels:**
```typescript
const genderLabel = lang === "en"
  ? (body.gender === "female" ? "Female" : "Male")
  : (body.gender === "female" ? "Nữ" : "Nam");
```

### 3. Frontend: Pass lang in API calls

In `ai-panel.tsx` (Phase 5 overlap):
```typescript
body: JSON.stringify({
  prompt,
  budget: formatMoney(budget, lang),
  lang,  // Add lang field
}),
```

In astrology components that call `/api/astrology-reading`:
```typescript
body: JSON.stringify({
  ...birthData,
  lang,  // Add lang field
}),
```

## Todo
- [x] Update api/ai/chat.ts: accept lang, English system prompt
- [x] Update api/ai/chat.ts: English error messages
- [x] Update api/astrology-reading.ts: accept lang, English system/user prompts
- [x] Update api/astrology-reading.ts: cache key with lang suffix
- [x] Update api/astrology-reading.ts: English error/gender/hour labels
- [x] Frontend: pass lang in AI chat API call
- [x] Frontend: pass lang in astrology reading API call
- [x] Test: AI chat returns English response when lang="en"
- [x] Test: Astrology reading returns English when lang="en"

## Success Criteria
- API responds in English when `lang: "en"` in request body
- API defaults to Vietnamese when no lang specified (backwards compatible)
- Cache keys separate by language
- Error messages match requested language
- ZhipuAI produces quality English responses

## Risk Assessment
- **ZhipuAI English quality:** Chinese LLM may produce lower quality English than Vietnamese → test actual responses, consider adding "Respond in fluent English" reinforcement
- **Cache separation:** Adding lang to cache key means existing Vietnamese cache entries remain valid, English entries build separately — good
- **Rate limit:** Shared across languages per IP — one user can't get 5 Vietnamese + 5 English readings per day. This is acceptable.

## Security Considerations
- Validate `lang` param: only accept "vi" or "en", default to "vi"
- Don't expose system prompt differences to client

## Next Steps
- End-to-end testing: full English mode walkthrough
- User review of translation quality

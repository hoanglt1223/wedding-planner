---
phase: 5
title: "AI Reading API Endpoint"
status: completed
priority: P1
effort: 3h
---

# Phase 5: AI Reading API Endpoint

## Context Links

- [plan.md](./plan.md) | [researcher-02 report](./research/researcher-02-openai-integration.md)
- [api/share.ts](../../api/share.ts) — Reference API handler pattern
- [src/lib/redis.ts](../../src/lib/redis.ts) — Redis factory

## Overview

Create a Vercel serverless endpoint that generates personalized Vietnamese astrology readings using OpenAI GPT-4o-mini. Includes Redis caching (300-day TTL) and rate limiting (5 req/IP/day).

## Key Insights

- Existing API pattern: `api/share.ts` uses `export default { async fetch(req) }` with Web API Request/Response
- `createRedis()` factory already available in `src/lib/redis.ts`
- gpt-4o-mini: $0.15/1M input, $0.60/1M output — ~$0.0005 per reading
- Cache key on birth data + year = deterministic output for same person/year
- Free tier Vercel timeout: 10s — cache-first approach critical
- `@upstash/ratelimit` package needs to be installed

## Requirements

### Functional
1. POST endpoint at `api/astrology-reading.ts`
2. Request body: `{ birthDate, birthHour, gender, currentYear }`
3. Generate Vietnamese astrology reading combining zodiac + element + year data
4. Cache response in Redis: key `astro:reading:{birthDate}:{birthHour}:{gender}:{currentYear}`, TTL 300 days
5. Rate limit: 5 requests per IP per day (sliding window)
6. Return cached response on cache hit without calling OpenAI

### Non-functional
- Response time < 10s (Vercel free tier constraint)
- Error responses with appropriate HTTP status codes
- CORS headers matching existing `api/share.ts` pattern

## Architecture

```
Client POST /api/astrology-reading
  → Check rate limit (Upstash Ratelimit)
  → Check Redis cache
  → If cached: return cached text
  → If not cached:
      → Build system prompt with birth data
      → Call OpenAI gpt-4o-mini (max_tokens: 800, temperature: 0.7)
      → Store in Redis (TTL 300 days)
      → Return generated text
```

### System Prompt Structure

```
You are a Vietnamese astrology master specializing in Tu Vi and the 12 Earthly Branches.
Generate a personalized reading for:
- Birth year: {year} ({stemBranch})
- Zodiac: {zodiac} ({chi})
- Element (Nap Am): {soundElement}
- Birth hour: {hourLabel} (or "unknown")
- Gender: {gender}
- Current year: {currentYear} ({currentYearStemBranch})

Write in Vietnamese. Sections:
1. Tong quan van menh {currentYear}
2. Tinh duyen & hon nhan
3. Su nghiep & tai loc
4. Suc khoe
5. Loi khuyen dac biet

Tone: warm, encouraging, culturally authentic. ~400-500 words.
Use traditional Vietnamese astrological terminology with proper diacritics.
```

## Related Code Files

### Modify
- `package.json` — Add `openai` and `@upstash/ratelimit` dependencies

### Create
- `api/astrology-reading.ts` — Vercel serverless endpoint

### Delete
- None

## Implementation Steps

### Step 1: Install dependencies

```bash
npm install openai @upstash/ratelimit
```

### Step 2: Add OPENAI_API_KEY to environment

Add to `.env.local`:
```
OPENAI_API_KEY=sk-...
```

Add to `.env.example` (no actual key):
```
OPENAI_API_KEY=
```

Add to Vercel dashboard environment variables for production.

### Step 3: Create api/astrology-reading.ts

Following the exact pattern from `api/share.ts`:

```typescript
import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { createRedis } from "../src/lib/redis";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface ReadingRequest {
  birthDate: string;      // "YYYY-MM-DD"
  birthHour: number | null; // 0-23 or null
  gender: string;           // "female" | "male"
  currentYear: number;      // 2026
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS_HEADERS });
    }

    try {
      const redis = createRedis();

      // Rate limit
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1d"),
        prefix: "astro_rl",
      });
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return Response.json(
          { error: "rate_limited", message: "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai." },
          { status: 429, headers: CORS_HEADERS }
        );
      }

      // Parse request
      const body = await request.json() as ReadingRequest;
      if (!body.birthDate || !body.gender || !body.currentYear) {
        return Response.json({ error: "missing_fields" }, { status: 400, headers: CORS_HEADERS });
      }

      // Cache check
      const hourKey = body.birthHour !== null ? String(body.birthHour) : "x";
      const cacheKey = `astro:reading:${body.birthDate}:${hourKey}:${body.gender}:${body.currentYear}`;
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        return Response.json({ text: cached, cached: true }, { headers: CORS_HEADERS });
      }

      // Build prompt (see buildPrompt function below)
      const prompt = buildPrompt(body);

      // Call OpenAI
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return Response.json({ error: "ai_not_configured" }, { status: 503, headers: CORS_HEADERS });
      }
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      if (!text) {
        return Response.json({ error: "empty_response" }, { status: 500, headers: CORS_HEADERS });
      }

      // Cache result (300 days)
      await redis.set(cacheKey, text, { ex: 86400 * 300 });

      return Response.json({ text, cached: false }, { headers: CORS_HEADERS });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) return Response.json({ error: "openai_rate_limited" }, { status: 429, headers: CORS_HEADERS });
      if (status === 503) return Response.json({ error: "ai_unavailable" }, { status: 503, headers: CORS_HEADERS });
      console.error("Astrology reading error:", err);
      return Response.json({ error: "generation_failed" }, { status: 500, headers: CORS_HEADERS });
    }
  },
};
```

### Step 4: Implement buildPrompt function

In same file (or extracted if needed for size):

```typescript
import { getZodiac, getSoundElement, getStemBranch } from "../src/lib/astrology";

function buildPrompt(body: ReadingRequest): { system: string; user: string } {
  const year = parseInt(body.birthDate.slice(0, 4));
  const zodiac = getZodiac(year);
  const soundElement = getSoundElement(year);
  const stemBranch = getStemBranch(year);
  const currentStemBranch = getStemBranch(body.currentYear);
  const currentZodiac = getZodiac(body.currentYear);

  const hourLabel = body.birthHour !== null
    ? `Giờ ${getHourBranch(body.birthHour)}`
    : "Không rõ giờ sinh";

  const genderLabel = body.gender === "female" ? "Nữ" : "Nam";

  const system = `Bạn là chuyên gia Tử Vi Việt Nam, am hiểu sâu về Địa Chi, Thiên Can, Ngũ Hành Nạp Âm.
Viết bài phân tích tử vi bằng tiếng Việt, dùng thuật ngữ truyền thống với dấu tiếng Việt đầy đủ.
Giọng văn: ấm áp, khích lệ, dùng xu hướng thay vì tiên đoán tuyệt đối.
Độ dài: 400-500 từ.`;

  const user = `Phân tích tử vi cá nhân:
- Năm sinh: ${year} (${stemBranch})
- Con giáp: ${zodiac.name} (${zodiac.chi})
- Nạp Âm: ${soundElement.name} — Mệnh ${soundElement.label}
- Giờ sinh: ${hourLabel}
- Giới tính: ${genderLabel}
- Năm hiện tại: ${body.currentYear} (${currentStemBranch}) — Năm ${currentZodiac.name}

Viết 5 phần:
1. 🔮 Tổng quan vận mệnh ${body.currentYear}
2. 💕 Tình duyên & hôn nhân
3. 💼 Sự nghiệp & tài lộc
4. 🏥 Sức khỏe
5. 💡 Lời khuyên đặc biệt`;

  return { system, user };
}

/** Map hour (0-23) to Earthly Branch name */
function getHourBranch(hour: number): string {
  const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  // Each branch covers 2 hours: Tý=23-1, Sửu=1-3, ..., Hợi=21-23
  const index = Math.floor(((hour + 1) % 24) / 2);
  return branches[index];
}
```

### Step 5: Verify file stays under 200 lines

The full `api/astrology-reading.ts` should be approximately 140-160 lines. If it exceeds, extract `buildPrompt` + `getHourBranch` into a separate file `src/lib/astrology-prompt.ts`.

## Todo List

- [x] Install `openai` and `@upstash/ratelimit` packages
- [x] Add `OPENAI_API_KEY` to `.env.example`
- [x] Create `api/astrology-reading.ts` with full handler
- [x] Implement rate limiting with `@upstash/ratelimit` sliding window
- [x] Implement Redis caching with `astro:reading:*` key pattern
- [x] Implement `buildPrompt()` with Vietnamese system/user prompts
- [x] Implement `getHourBranch()` hour-to-branch mapper
- [ ] Add OPENAI_API_KEY to Vercel environment variables (manual step)
- [ ] Test with curl: cache miss (first call) + cache hit (second call)
- [ ] Test rate limiting: 6th request returns 429
- [x] Run `npm run build`

## Success Criteria

- POST `/api/astrology-reading` returns 200 with Vietnamese text on valid input
- Second identical request returns cached response (`cached: true`)
- 6th request from same IP in 24h returns 429
- Response time < 8s on cache miss, < 500ms on cache hit
- Missing OPENAI_API_KEY returns 503 gracefully
- Invalid input returns 400

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vercel 10s timeout on free tier | High | Cache-first approach; gpt-4o-mini typical latency 3-6s |
| OpenAI API outage | Medium | Return 503 with user-friendly message; static content still works |
| Vietnamese output quality | Low | Tested GPT-4o-mini; good Vietnamese quality per research |
| Cost overrun | Low | Rate limit + cache = negligible cost ($0.01/day at 10k users) |

## Security Considerations

- `OPENAI_API_KEY` in environment variables only, never exposed to client
- Rate limit per IP prevents abuse
- Input validation: reject missing/invalid fields
- No user-generated content echoed back (prompt injection minimal risk since output is astrology reading)
- Cache keys don't contain sensitive data (birth date is not PII in this context)

## Next Steps

- Phase 6 (AI Reading Frontend) calls this endpoint from the personal tab
- Add OPENAI_API_KEY to Vercel project settings before deploy

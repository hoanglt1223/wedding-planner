# Research Report: OpenAI API Integration — Vietnamese Astrology Feature

**Date:** 2026-02-23 | **Project:** wedding-planner astrology expansion

---

## 1. OpenAI Node.js SDK

**Latest:** `openai` npm package v4.x (TypeScript-first, ESM + CJS, actively maintained).

Install: `npm install openai`

**Vercel Serverless (Web API pattern):**
```ts
import OpenAI from 'openai';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: Request): Promise<Response> {
  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
  });
  return Response.json({ text: completion.choices[0].message.content });
}
```

**Streaming:** SDK supports streaming via `.stream()` or `stream: true`. For astrology readings (non-interactive), streaming adds complexity with no UX benefit — **skip streaming, use standard completion**.

---

## 2. GPT-4o-mini vs GPT-4o

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-4o | $2.50 | $10.00 |

**Cost ratio:** gpt-4o is ~16x more expensive on output.

For 800 tokens output × 1000 requests:
- gpt-4o-mini: ~$0.48
- gpt-4o: ~$8.00

**Vietnamese quality:** GPT-4o uses an improved tokenizer with better multilingual support (Vietnamese, Arabic, Hindi, Tamil). GPT-4o-mini inherits this tokenizer. For short structured readings, **quality difference is negligible** — gpt-4o-mini is the clear choice.

**Recommendation: `gpt-4o-mini`** — same tokenizer quality, 16x cheaper, faster latency.

---

## 3. Vercel Serverless + OpenAI Pattern

**Timeout reality:**
- Free tier (Hobby): 10s max — **risky** for cold-start + OpenAI latency
- Pro tier: 60s — comfortable
- Edge Functions: 25s — but Edge runtime blocks Node.js SDK usage

**Best pattern for free tier:** Always check Redis cache first. Cold path (cache miss + OpenAI call) typically takes 3-8s for gpt-4o-mini at 800 tokens. Risky on free tier without caching.

**Error handling pattern:**
```ts
try {
  const completion = await client.chat.completions.create({ ... });
  return Response.json({ text: completion.choices[0].message.content });
} catch (err: any) {
  if (err.status === 429) return Response.json({ error: 'rate_limited' }, { status: 429 });
  if (err.status === 503) return Response.json({ error: 'ai_unavailable' }, { status: 503 });
  return Response.json({ error: 'generation_failed' }, { status: 500 });
}
```

**Key practices:**
- Set `max_tokens` explicitly to cap cost and latency
- Use `temperature: 0.7` for creative but consistent output
- Add `signal: AbortSignal.timeout(9000)` on free tier to avoid Vercel timeout with dangling OpenAI request

---

## 4. Caching Strategy (Upstash Redis)

Astrology readings for same birth data + same year = **deterministic output** — cache indefinitely (until next year cycle).

**Cache key pattern:** `astro:reading:{zodiac}:{lunarYear}:{hash(birthDate)}` or simpler `astro:{userId}:{year}`

**TTL strategy:**
- Same-year reading: expire at end of Vietnamese lunar year (~Jan-Feb of next year)
- Calculated TTL: seconds until next Tết (~365 days max)
- Simple approach: `ex: 86400 * 300` (300 days)

**Pattern:**
```ts
const cacheKey = `astro:${userId}:${lunarYear}`;
const cached = await redis.get(cacheKey);
if (cached) return Response.json({ text: cached, cached: true });

const text = await generateReading(prompt);
await redis.set(cacheKey, text, { ex: 86400 * 300 });
return Response.json({ text, cached: false });
```

Cache hit on 300-day TTL = **zero OpenAI cost** for repeat visitors (most wedding app users check once).

---

## 5. Rate Limiting (Upstash Redis)

Use `@upstash/ratelimit` — designed for serverless, built-in sliding window/fixed window algorithms.

```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1d'), // 5 reads per IP per day
  prefix: 'astro_rl',
});

const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
const { success } = await ratelimit.limit(ip);
if (!success) return Response.json({ error: 'limit_exceeded' }, { status: 429 });
```

**Strategy for astrology feature:**
- 5 requests/IP/day — generous (user reads once, shares, re-reads)
- Cache hit bypasses OpenAI cost but still counts toward rate limit
- For wedding app: per-IP is sufficient; no auth required for reading

**Cost control math:** 5 req/day × 800 tokens × $0.60/1M = $0.0000024 per request. Even 10k daily users = $0.012/day. Rate limiting is precautionary, not critical.

---

## 6. System Prompt Design for Vietnamese Astrology

**Key principles:**
1. Specify the tradition explicitly: `Tử Vi` (Vietnamese astrology) vs Chinese Ba Zi — different systems
2. Use structured output sections for consistent parsing (if needed)
3. Inject birth data as variables, not free text
4. Request Vietnamese-language output directly in prompt

**Recommended prompt structure:**
```
You are a Vietnamese astrology master specializing in Tử Vi and the 12 Earthly Branches (Địa Chi).
Generate a personalized yearly reading for someone born in the Year of the {zodiac} ({birthYear}).
Current year: {currentLunarYear} - Year of the {currentZodiac}.

Format the reading in Vietnamese with these sections:
1. Tổng quan vận mệnh (Overall fortune)
2. Tình duyên (Love & relationships)
3. Sự nghiệp & tài lộc (Career & wealth)
4. Sức khỏe (Health)

Tone: warm, encouraging, culturally authentic. Length: 400-500 words total.
Use traditional Vietnamese astrological terminology where appropriate.
```

**Tips:**
- `temperature: 0.7` — avoids repetition, maintains cultural consistency
- `max_tokens: 700` — enough for ~450 Vietnamese words
- Avoid asking for "predictions" (use "xu hướng" / trends instead — softer, more culturally appropriate)
- Test with a few birth years to verify zodiac-specific personality traits are accurate

---

## Unresolved Questions

1. **Free vs Pro Vercel tier** — If on free tier, the 10s timeout is a real risk on cache miss + cold start. Either upgrade to Pro or pre-generate readings as a background job.
2. **Lunar year calculation** — Need to verify which library handles Vietnamese lunar calendar (Tết new year boundary differs from Jan 1). Candidate: `lunar-calendar` npm package.
3. **GPT-4.1 models** — OpenAI released GPT-4.1 mini (early 2025, cheaper than gpt-4o-mini per some sources). Worth checking `platform.openai.com/docs/models` at implementation time.

---

## Sources
- [OpenAI SDK v4 announcement](https://community.openai.com/t/v4-typescript-node-sdk-for-openai-api/323681)
- [Vercel streaming functions docs](https://vercel.com/docs/functions/streaming-functions)
- [GPT-4o mini pricing](https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/)
- [OpenAI model compare](https://platform.openai.com/docs/models/compare?model=gpt-4o-mini)
- [Upstash Redis + OpenAI use cases](https://upstash.com/blog/redis-openapi)
- [Upstash ratelimit-js GitHub](https://github.com/upstash/ratelimit-js)
- [Upstash edge rate limiting](https://upstash.com/blog/edge-rate-limiting)
- [Redis caching strategies 2025](https://www.digitalapplied.com/blog/redis-caching-strategies-nextjs-production)

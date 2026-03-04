export const config = { maxDuration: 60 };

import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRedis } from "../src/lib/redis.js";
import { buildAstrologyPrompt } from "../src/lib/astrology-prompt.js";
import type { ReadingInput } from "../src/lib/astrology-prompt.js";
import { buildNumerologyPrompt } from "../src/lib/numerology-prompt.js";
import type { NumerologyReadingInput } from "../src/lib/numerology-prompt.js";

const ZHIPU_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const ZHIPU_MODEL = "glm-4.7-flash";
const ZHIPU_FALLBACK = "glm-4.5-flash";
const FETCH_TIMEOUT_MS = 55_000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

async function callZhipu(model: string, messages: { role: string; content: string }[], maxTokens: number, temp: number, stream = false): Promise<Response> {
  const apiKey = process.env.Z_AI_KEY;
  if (!apiKey) throw Object.assign(new Error("ai_not_configured"), { status: 503 });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(ZHIPU_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: temp, stream }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw Object.assign(new Error("ai_timeout"), { status: 504 });
    throw err;
  } finally { clearTimeout(timer); }
}

/** Try primary model, fallback to secondary on rate limit / balance errors */
async function callWithFallback(messages: { role: string; content: string }[], maxTokens: number, temp: number, stream = false): Promise<Response> {
  const aiRes = await callZhipu(ZHIPU_MODEL, messages, maxTokens, temp, stream);
  if (aiRes.ok) return aiRes;

  const text = await aiRes.text();
  const retriable = text.includes("1302") || text.includes("1113");
  if (!retriable) return new Response(text, { status: aiRes.status, headers: aiRes.headers });

  return callZhipu(ZHIPU_FALLBACK, messages, maxTokens, temp, stream);
}

function handleAiError(aiRes: Response, text: string, lang: string, res: VercelResponse) {
  if (text.includes("1113")) {
    return res.status(503).json({
      error: lang === "en"
        ? "AI service is temporarily unavailable. Please try again later."
        : "Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.",
    });
  }
  if (text.includes("1302")) {
    return res.status(429).json({
      error: lang === "en"
        ? "Too many requests. Please wait a moment and try again."
        : "Quá nhiều yêu cầu. Vui lòng chờ một chút và thử lại.",
    });
  }
  return res.status(502).json({ error: `ZhipuAI API ${aiRes.status}` });
}

// action=chat — Wedding consultation chat
async function handleChat(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { prompt?: string; budget?: string; lang?: string; stream?: boolean; max_tokens?: number };
  const { prompt, budget, lang = "vi", stream = false } = body ?? {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const maxTokens = Math.max(100, Math.min(4000, Number(body?.max_tokens) || 1024));

  const messages = [
    { role: "system", content: lang === "en"
      ? `Expert Vietnamese wedding consultant with 20 years of experience across all 3 regions of Vietnam. Provide detailed advice with VND pricing. Respond in English. Budget: ${budget}.`
      : `Chuyên gia đám cưới VN 20 năm kinh nghiệm. 3 miền. Chi tiết, có giá VNĐ. Budget: ${budget}.` },
    { role: "user", content: prompt },
  ];

  if (!stream) {
    const aiRes = await callWithFallback(messages, maxTokens, 1.0);
    if (!aiRes.ok) return handleAiError(aiRes, await aiRes.text(), lang, res);
    return res.status(200).json(await aiRes.json());
  }

  // Streaming SSE path
  const aiRes = await callWithFallback(messages, maxTokens, 1.0, true);
  if (!aiRes.ok) return handleAiError(aiRes, await aiRes.text(), lang, res);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const reader = aiRes.body?.getReader();
  if (!reader) return res.status(500).json({ error: "no_stream_body" });

  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk);
    }
  } catch {
    // Client disconnected or upstream error — just close
  } finally {
    res.write("data: [DONE]\n\n");
    res.end();
  }
}

// action=astrology — Personal astrology reading
async function handleAstrology(req: VercelRequest, res: VercelResponse) {
  const body = req.body as ReadingInput;
  const lang = body?.lang || "vi";

  // Rate limit: 5/day per IP
  let redis: ReturnType<typeof createRedis> | null = null;
  try { redis = createRedis(); } catch { /* unavailable */ }
  if (redis) {
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 d"), prefix: "astro_rl" });
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await rl.limit(ip);
    if (!success) return res.status(429).json({
      error: "rate_limited",
      message: lang === "en" ? "You've used all your readings for today. Please try again tomorrow." : "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai.",
    });
  }

  if (!body?.birthDate || !body.gender || !body.currentYear) return res.status(400).json({ error: "missing_fields" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) return res.status(400).json({ error: "invalid_birth_date" });
  const birthYear = parseInt(body.birthDate.slice(0, 4));
  if (isNaN(birthYear) || birthYear < 1900 || birthYear > 2100) return res.status(400).json({ error: "invalid_birth_date" });
  if (body.birthHour !== null && (typeof body.birthHour !== "number" || body.birthHour < 0 || body.birthHour > 23)) return res.status(400).json({ error: "invalid_birth_hour" });
  if (!["male", "female"].includes(body.gender)) return res.status(400).json({ error: "invalid_gender" });

  // Cache check
  const hourKey = body.birthHour !== null ? String(body.birthHour) : "x";
  const cacheKey = `astro:reading:${body.birthDate}:${hourKey}:${body.gender}:${body.currentYear}:${lang}`;
  if (redis) {
    const cached = await redis.get<string>(cacheKey);
    if (cached) return res.status(200).json({ text: cached, cached: true });
  }

  const prompt = buildAstrologyPrompt(body);
  const aiRes = await callWithFallback([
    { role: "system", content: prompt.system },
    { role: "user", content: prompt.user },
  ], 800, 0.7);

  if (!aiRes.ok) return handleAiError(aiRes, await aiRes.text(), lang, res);
  const data = (await aiRes.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text) return res.status(500).json({ error: "empty_response" });

  if (redis) await redis.set(cacheKey, text, { ex: 86400 * 300 });
  return res.status(200).json({ text, cached: false });
}

// action=numerology — Personal numerology reading
async function handleNumerology(req: VercelRequest, res: VercelResponse) {
  const body = req.body as NumerologyReadingInput;

  // Rate limit: 5/day per IP (separate from astrology)
  let redis: ReturnType<typeof createRedis> | null = null;
  try { redis = createRedis(); } catch { /* unavailable */ }
  if (redis) {
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 d"), prefix: "num_rl" });
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await rl.limit(ip);
    if (!success) return res.status(429).json({
      error: "rate_limited",
      message: "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai.",
    });
  }

  if (!body?.birthDate || !body.fullName) return res.status(400).json({ error: "missing_fields" });
  if (typeof body.fullName !== "string" || body.fullName.length > 100) return res.status(400).json({ error: "invalid_name" });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) return res.status(400).json({ error: "invalid_birth_date" });

  // Cache key: hash name to avoid PII in Redis
  function simpleHash(str: string): string {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  }
  const year = new Date().getFullYear();
  const cacheKey = `num:reading:${body.birthDate}:${simpleHash(body.fullName)}:${year}`;
  if (redis) {
    const cached = await redis.get<string>(cacheKey);
    if (cached) return res.status(200).json({ text: cached, cached: true });
  }

  const prompt = buildNumerologyPrompt(body);
  const aiRes = await callWithFallback([
    { role: "system", content: prompt.system },
    { role: "user", content: prompt.user },
  ], 800, 0.7);

  if (!aiRes.ok) return handleAiError(aiRes, await aiRes.text(), "vi", res);
  const data = (await aiRes.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text) return res.status(500).json({ error: "empty_response" });

  if (redis) await redis.set(cacheKey, text, { ex: 86400 * 300 });
  return res.status(200).json({ text, cached: false });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const action = (Array.isArray(req.query.action) ? req.query.action[0] : req.query.action) ?? "";
    if (action === "chat") return await handleChat(req, res);
    if (action === "astrology") return await handleAstrology(req, res);
    if (action === "numerology") return await handleNumerology(req, res);
    return res.status(400).json({ error: "invalid_action" });
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 429) return res.status(429).json({ error: "zhipu_rate_limited" });
    if (status === 503) return res.status(503).json({ error: "ai_not_configured" });
    if (status === 504) return res.status(504).json({ error: "ai_timeout" });
    console.error("AI error:", err);
    return res.status(500).json({ error: "generation_failed" });
  }
}

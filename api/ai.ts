export const config = { maxDuration: 30 };

import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRedis } from "../src/lib/redis.js";
import { buildAstrologyPrompt } from "../src/lib/astrology-prompt.js";
import type { ReadingInput } from "../src/lib/astrology-prompt.js";

const ZHIPU_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const FETCH_TIMEOUT_MS = 25_000;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

async function callZhipu(messages: { role: string; content: string }[], maxTokens: number, temp: number): Promise<Response> {
  const apiKey = process.env.Z_AI_KEY;
  if (!apiKey) throw Object.assign(new Error("ai_not_configured"), { status: 503 });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(ZHIPU_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: "glm-5", messages, max_tokens: maxTokens, temperature: temp }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw Object.assign(new Error("ai_timeout"), { status: 504 });
    throw err;
  } finally { clearTimeout(timer); }
}

// action=chat — Wedding consultation chat
async function handleChat(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { prompt?: string; budget?: string; lang?: string };
  const { prompt, budget, lang = "vi" } = body ?? {};
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const aiRes = await callZhipu([
    { role: "system", content: lang === "en"
      ? `Expert Vietnamese wedding consultant with 20 years of experience across all 3 regions of Vietnam. Provide detailed advice with VND pricing. Respond in English. Budget: ${budget}.`
      : `Chuyên gia đám cưới VN 20 năm kinh nghiệm. 3 miền. Chi tiết, có giá VNĐ. Budget: ${budget}.` },
    { role: "user", content: prompt },
  ], 2000, 1.0);

  if (!aiRes.ok) return res.status(502).json({ error: `ZhipuAI API ${aiRes.status}: ${await aiRes.text()}` });
  return res.status(200).json(await aiRes.json());
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
  const aiRes = await callZhipu([
    { role: "system", content: prompt.system },
    { role: "user", content: prompt.user },
  ], 800, 0.7);

  if (!aiRes.ok) return res.status(502).json({ error: "generation_failed" });
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
    if (action === "chat") return handleChat(req, res);
    if (action === "astrology") return handleAstrology(req, res);
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

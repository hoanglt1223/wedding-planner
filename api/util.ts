import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { analyticsEvents } from "../src/db/schema.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

// action=health — Health check
async function handleHealth(res: VercelResponse) {
  const checks: Record<string, string> = {
    status: "ok", timestamp: new Date().toISOString(), environment: process.env.VERCEL_ENV ?? "development",
  };
  const dbUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (dbUrl) {
    try { const { neon } = await import("@neondatabase/serverless"); await neon(dbUrl)`SELECT 1`; checks.database = "connected"; }
    catch { checks.database = "error"; }
  } else checks.database = "not_configured";

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (redisUrl && redisToken) {
    try { const { Redis } = await import("@upstash/redis"); await new Redis({ url: redisUrl, token: redisToken }).ping(); checks.redis = "connected"; }
    catch { checks.redis = "error"; }
  } else checks.redis = "not_configured";

  return res.status(200).json(checks);
}

// action=share — Create/fetch ephemeral share links
async function handleShare(req: VercelRequest, res: VercelResponse) {
  let redis: ReturnType<typeof createRedis>;
  try { redis = createRedis(); } catch { return res.status(503).json({ error: "redis_not_configured" }); }

  if (req.method === "POST") {
    const body = req.body as { data?: string };
    if (!body?.data || typeof body.data !== "string") return res.status(400).json({ error: "Missing data" });
    if (body.data.length > 15_000) return res.status(413).json({ error: "Data too large" });
    const id = crypto.randomUUID().slice(0, 8);
    await redis.set(`share:${id}`, body.data, { ex: 600 });
    return res.status(200).json({ id });
  }

  if (req.method === "GET") {
    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id || id.length > 36) return res.status(400).json({ error: "Missing id" });
    const data = await redis.get<string>(`share:${id}`);
    if (!data) return res.status(404).json({ error: "expired" });
    return res.status(200).json({ data });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// action=track — Analytics event ingestion
async function handleTrack(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const body = req.body as { userId?: string; events?: { type: string; data?: unknown; timestamp: string }[] };
  if (!body?.userId || !UUID_RE.test(body.userId)) return res.status(400).json({ error: "invalid_user_id" });
  if (!Array.isArray(body.events) || body.events.length === 0) return res.status(400).json({ error: "invalid_events" });
  if (body.events.length > 50) return res.status(400).json({ error: "too_many_events" });

  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "track_rl" });
    const { success } = await rl.limit(body.userId);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const rows = body.events.map((e) => {
    const ts = new Date(e.timestamp);
    return {
      userId: body.userId!,
      eventType: e.type,
      eventData: (e.data ?? null) as Record<string, unknown> | null,
      createdAt: isNaN(ts.getTime()) ? new Date() : ts,
    };
  });

  const db = createDb();
  await db.insert(analyticsEvents).values(rows);
  return res.status(200).json({ ok: true, count: rows.length });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const action = (Array.isArray(req.query.action) ? req.query.action[0] : req.query.action) ?? "";
    if (action === "health") return handleHealth(res);
    if (action === "share") return handleShare(req, res);
    if (action === "track") return handleTrack(req, res);
    return res.status(400).json({ error: "invalid_action" });
  } catch (err) {
    console.error("Util error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

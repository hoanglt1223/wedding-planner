import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { analyticsEvents } from "../src/db/schema.js";

function getCorsOrigin(): string {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (url) return `https://${url}`;
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "*";
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": getCorsOrigin(),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface TrackEvent {
  type: string;
  data?: unknown;
  timestamp: string;
}

interface TrackRequest {
  userId: string;
  events: TrackEvent[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const body = req.body as TrackRequest;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "invalid_json" });
    }

    const { userId, events } = body;

    if (!userId || !UUID_RE.test(userId)) {
      return res.status(400).json({ error: "invalid_user_id" });
    }

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: "invalid_events" });
    }

    if (events.length > 50) {
      return res.status(400).json({ error: "too_many_events" });
    }

    // Rate limit: 10 req/min per userId
    try {
      const redis = createRedis();
      const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "track_rl" });
      const { success } = await rl.limit(userId);
      if (!success) return res.status(429).json({ error: "rate_limited" });
    } catch { /* Redis unavailable — skip rate limiting */ }

    const rows = events.map((e) => {
      const ts = new Date(e.timestamp);
      return {
        userId,
        eventType: e.type,
        eventData: (e.data ?? null) as Record<string, unknown> | null,
        createdAt: isNaN(ts.getTime()) ? new Date() : ts,
      };
    });

    const db = createDb();
    try {
      await db.insert(analyticsEvents).values(rows);
    } catch (e: unknown) {
      // FK violation if user_sessions row doesn't exist yet -- silently drop
      const msg = e instanceof Error ? e.message : "";
      if (msg.includes("foreign key") || msg.includes("violates")) {
        return res.status(200).json({ ok: true, count: 0, dropped: true });
      }
      throw e;
    }

    return res.status(200).json({ ok: true, count: rows.length });
  } catch (err: unknown) {
    console.error("Track error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

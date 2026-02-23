import { Ratelimit } from "@upstash/ratelimit";
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

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405, headers: CORS_HEADERS });
  }

  try {
    let body: TrackRequest;
    try {
      body = (await request.json()) as TrackRequest;
    } catch {
      return Response.json({ error: "invalid_json" }, { status: 400, headers: CORS_HEADERS });
    }

    const { userId, events } = body;

    if (!userId || !UUID_RE.test(userId)) {
      return Response.json({ error: "invalid_user_id" }, { status: 400, headers: CORS_HEADERS });
    }

    if (!Array.isArray(events) || events.length === 0) {
      return Response.json({ error: "invalid_events" }, { status: 400, headers: CORS_HEADERS });
    }

    if (events.length > 50) {
      return Response.json({ error: "too_many_events" }, { status: 400, headers: CORS_HEADERS });
    }

    // Rate limit: 10 req/min per userId
    const redis = createRedis();
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "track_rl",
    });
    const { success } = await ratelimit.limit(userId);
    if (!success) {
      return Response.json({ error: "rate_limited" }, { status: 429, headers: CORS_HEADERS });
    }

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
        return Response.json({ ok: true, count: 0, dropped: true }, { headers: CORS_HEADERS });
      }
      throw e;
    }

    return Response.json({ ok: true, count: rows.length }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    console.error("Track error:", err);
    return Response.json({ error: "internal_error" }, { status: 500, headers: CORS_HEADERS });
  }
}

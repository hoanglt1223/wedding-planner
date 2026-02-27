import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, desc } from "drizzle-orm";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { rsvpInvitations } from "../../src/db/schema.js";

function getCorsOrigin(req: VercelRequest): string {
  const origin = req.headers.origin || "";
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  if (/\.vercel\.app$/.test(origin)) return origin;
  return "";
}

function setCors(req: VercelRequest, res: VercelResponse): void {
  const origin = getCorsOrigin(req);
  if (origin) res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const userIdParam = req.query.userId;
    const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
    if (!userId || !UUID_RE.test(userId)) {
      return res.status(400).json({ error: "invalid_user_id" });
    }

    // Rate limit: 30 req/min per userId
    try {
      const redis = createRedis();
      const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rsvp_list_rl" });
      const { success } = await rl.limit(userId);
      if (!success) return res.status(429).json({ error: "rate_limited" });
    } catch { /* Redis unavailable — skip */ }

    const db = createDb();
    const invitations = await db
      .select()
      .from(rsvpInvitations)
      .where(eq(rsvpInvitations.userId, userId))
      .orderBy(desc(rsvpInvitations.createdAt));

    return res.status(200).json({ invitations });
  } catch (err) {
    console.error("RSVP list error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

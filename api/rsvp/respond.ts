import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq, isNull, and } from "drizzle-orm";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { rsvpInvitations } from "../../src/db/schema.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

interface RespondRequest {
  token: string;
  status: "accepted" | "declined";
  plusOnes?: number;
  dietary?: string;
  message?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const body = req.body as RespondRequest;
    if (!body?.token || typeof body.token !== "string" || body.token.length > 20) {
      return res.status(400).json({ error: "invalid_token" });
    }
    if (body.status !== "accepted" && body.status !== "declined") {
      return res.status(400).json({ error: "invalid_status" });
    }

    const plusOnes = Math.min(Math.max(Math.round(Number(body.plusOnes) || 0), 0), 20);
    const dietary = typeof body.dietary === "string" ? body.dietary.slice(0, 500) : null;
    const message = typeof body.message === "string" ? body.message.slice(0, 500) : null;

    // Rate limit: 20 req/min per IP
    try {
      const redis = createRedis();
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
      const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 m"), prefix: "rsvp_respond_rl" });
      const { success } = await rl.limit(ip);
      if (!success) return res.status(429).json({ error: "rate_limited" });
    } catch { /* Redis unavailable — skip */ }

    const db = createDb();

    // Atomic: only update if not already responded
    const now = new Date();
    const result = await db
      .update(rsvpInvitations)
      .set({
        status: body.status,
        plusOnes: body.status === "accepted" ? plusOnes : 0,
        dietary: body.status === "accepted" ? dietary : null,
        message,
        respondedAt: now,
      })
      .where(
        and(
          eq(rsvpInvitations.token, body.token),
          isNull(rsvpInvitations.respondedAt),
        ),
      )
      .returning({ id: rsvpInvitations.id });

    if (result.length === 0) {
      // Check if token exists at all
      const [existing] = await db
        .select({ id: rsvpInvitations.id, respondedAt: rsvpInvitations.respondedAt })
        .from(rsvpInvitations)
        .where(eq(rsvpInvitations.token, body.token))
        .limit(1);

      if (!existing) return res.status(404).json({ error: "not_found" });
      return res.status(409).json({ error: "already_responded" });
    }

    return res.status(200).json({ ok: true, respondedAt: now.toISOString() });
  } catch (err) {
    console.error("RSVP respond error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

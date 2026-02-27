import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { rsvpInvitations, userSessions } from "../src/db/schema.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface BulkCreateRequest {
  userId: string;
  guests: { name: string }[];
  themeId?: string;
  lang?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const db = createDb();

    // POST: Bulk create RSVP tokens
    if (req.method === "POST") {
      const body = req.body as BulkCreateRequest;
      if (!body?.userId || !UUID_RE.test(body.userId)) {
        return res.status(400).json({ error: "invalid_user_id" });
      }
      if (!Array.isArray(body.guests) || body.guests.length === 0) {
        return res.status(400).json({ error: "guests_required" });
      }
      if (body.guests.length > 500) {
        return res.status(400).json({ error: "too_many_guests" });
      }

      // Rate limit: 10 req/min per userId
      try {
        const redis = createRedis();
        const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rsvp_create_rl" });
        const { success } = await rl.limit(body.userId);
        if (!success) return res.status(429).json({ error: "rate_limited" });
      } catch { /* Redis unavailable — skip */ }

      const rows = body.guests.map((g) => ({
        userId: body.userId,
        guestName: (g.name || "").trim().slice(0, 200),
        token: nanoid(12),
        status: "pending",
        plusOnes: 0,
      }));

      await db.insert(rsvpInvitations).values(rows);

      return res.status(200).json({
        tokens: rows.map((r) => ({ guestName: r.guestName, token: r.token })),
      });
    }

    // GET: Fetch invitation by token (public)
    if (req.method === "GET") {
      const tokenParam = req.query.token;
      const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
      if (!token || token.length > 20) {
        return res.status(400).json({ error: "invalid_token" });
      }

      const [invitation] = await db
        .select()
        .from(rsvpInvitations)
        .where(eq(rsvpInvitations.token, token))
        .limit(1);

      if (!invitation) {
        return res.status(404).json({ error: "not_found" });
      }

      // Fetch planner's wedding data for event details
      const [session] = await db
        .select({ weddingData: userSessions.weddingData })
        .from(userSessions)
        .where(eq(userSessions.id, invitation.userId))
        .limit(1);

      const wd = (session?.weddingData ?? {}) as Record<string, unknown>;
      const info = (wd.info ?? {}) as Record<string, string>;
      const rsvpSettings = (wd.rsvpSettings ?? {}) as Record<string, string>;

      return res.status(200).json({
        guestName: invitation.guestName,
        status: invitation.status,
        respondedAt: invitation.respondedAt,
        plusOnes: invitation.plusOnes,
        dietary: invitation.dietary,
        message: invitation.message,
        event: {
          bride: info.bride ?? "",
          groom: info.groom ?? "",
          date: info.date ?? "",
          welcomeMessage: rsvpSettings.welcomeMessage ?? "",
          venue: rsvpSettings.venue ?? "",
          venueAddress: rsvpSettings.venueAddress ?? "",
          venueMapLink: rsvpSettings.venueMapLink ?? "",
          coupleStory: rsvpSettings.coupleStory ?? "",
        },
        themeId: (wd.themeId as string) ?? "red",
        lang: (wd.lang as string) ?? "vi",
      });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    console.error("RSVP error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

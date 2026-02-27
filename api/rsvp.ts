import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { eq, desc, isNull, and } from "drizzle-orm";
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

function getParam(req: VercelRequest, key: string): string {
  const val = req.query[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// POST action=create — Bulk create RSVP tokens
async function handleCreate(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { userId?: string; guests?: { name: string }[] };
  if (!body?.userId || !UUID_RE.test(body.userId)) {
    return res.status(400).json({ error: "invalid_user_id" });
  }
  if (!Array.isArray(body.guests) || body.guests.length === 0) {
    return res.status(400).json({ error: "guests_required" });
  }
  if (body.guests.length > 500) {
    return res.status(400).json({ error: "too_many_guests" });
  }

  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rsvp_create_rl" });
    const { success } = await rl.limit(body.userId);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const db = createDb();
  const rows = body.guests.map((g) => ({
    userId: body.userId!,
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

// POST action=respond — Guest responds to invitation
async function handleRespond(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { token?: string; status?: string; plusOnes?: number; dietary?: string; message?: string };
  if (!body?.token || typeof body.token !== "string" || body.token.length > 20) {
    return res.status(400).json({ error: "invalid_token" });
  }
  if (body.status !== "accepted" && body.status !== "declined") {
    return res.status(400).json({ error: "invalid_status" });
  }

  const plusOnes = Math.min(Math.max(Math.round(Number(body.plusOnes) || 0), 0), 20);
  const dietary = typeof body.dietary === "string" ? body.dietary.slice(0, 500) : null;
  const message = typeof body.message === "string" ? body.message.slice(0, 500) : null;

  try {
    const redis = createRedis();
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 m"), prefix: "rsvp_respond_rl" });
    const { success } = await rl.limit(ip);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const db = createDb();
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
    .where(and(eq(rsvpInvitations.token, body.token), isNull(rsvpInvitations.respondedAt)))
    .returning({ id: rsvpInvitations.id });

  if (result.length === 0) {
    const [existing] = await db
      .select({ id: rsvpInvitations.id, respondedAt: rsvpInvitations.respondedAt })
      .from(rsvpInvitations)
      .where(eq(rsvpInvitations.token, body.token))
      .limit(1);
    if (!existing) return res.status(404).json({ error: "not_found" });
    return res.status(409).json({ error: "already_responded" });
  }

  return res.status(200).json({ ok: true, respondedAt: now.toISOString() });
}

// GET action=list — Planner lists all invitations
async function handleList(req: VercelRequest, res: VercelResponse) {
  const userId = getParam(req, "userId");
  if (!userId || !UUID_RE.test(userId)) {
    return res.status(400).json({ error: "invalid_user_id" });
  }

  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rsvp_list_rl" });
    const { success } = await rl.limit(userId);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const db = createDb();
  const invitations = await db
    .select()
    .from(rsvpInvitations)
    .where(eq(rsvpInvitations.userId, userId))
    .orderBy(desc(rsvpInvitations.createdAt));

  return res.status(200).json({ invitations });
}

// GET (no action) — Fetch single invitation by token (public)
async function handleGetByToken(req: VercelRequest, res: VercelResponse) {
  const token = getParam(req, "token");
  if (!token || token.length > 20) {
    return res.status(400).json({ error: "invalid_token" });
  }

  const db = createDb();
  const [invitation] = await db
    .select()
    .from(rsvpInvitations)
    .where(eq(rsvpInvitations.token, token))
    .limit(1);

  if (!invitation) return res.status(404).json({ error: "not_found" });

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const action = getParam(req, "action");

    if (req.method === "POST" && action === "create") return handleCreate(req, res);
    if (req.method === "POST" && action === "respond") return handleRespond(req, res);
    if (req.method === "GET" && action === "list") return handleList(req, res);
    if (req.method === "GET") return handleGetByToken(req, res);

    return res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    console.error("RSVP error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

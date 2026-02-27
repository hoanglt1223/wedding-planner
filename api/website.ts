import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { userSessions } from "../src/db/schema.js";
import { sql } from "drizzle-orm";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,50}[a-z0-9]$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  if (!slug || !SLUG_RE.test(slug)) {
    return res.status(400).json({ error: "invalid_slug" });
  }

  // Rate limit: 60 req/min per IP
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || "unknown";
  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, "1 m"), prefix: "website_rl" });
    const { success } = await rl.limit(ip);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable — skip rate limiting */ }

  try {
    const db = createDb();
    const rows = await db
      .select({ weddingData: userSessions.weddingData })
      .from(userSessions)
      .where(
        sql`${userSessions.weddingData}->'websiteSettings'->>'slug' = ${slug}
        AND ${userSessions.weddingData}->'websiteSettings'->>'enabled' = 'true'`
      )
      .limit(1);

    if (!rows.length || !rows[0].weddingData) {
      return res.status(404).json({ found: false });
    }

    const wd = rows[0].weddingData as Record<string, unknown>;

    // Extract PUBLIC subset only — never expose budget, vendors, expenses, guests, apiKey, notes
    const info = (wd.info ?? {}) as Record<string, unknown>;
    const rsvp = (wd.rsvpSettings ?? {}) as Record<string, unknown>;
    const ws = (wd.websiteSettings ?? {}) as Record<string, unknown>;
    const photos = ((wd.photos as unknown[]) ?? []) as Array<Record<string, unknown>>;

    const publicData = {
      couple: { bride: info.bride ?? "", groom: info.groom ?? "", date: info.date ?? "" },
      theme: (wd.themeId as string) ?? "red",
      lang: (wd.lang as string) ?? "vi",
      websiteSettings: ws,
      rsvpSettings: {
        venue: rsvp.venue ?? "",
        venueAddress: rsvp.venueAddress ?? "",
        venueMapLink: rsvp.venueMapLink ?? "",
        coupleStory: rsvp.coupleStory ?? "",
      },
      timelineEntries: (wd.timelineEntries as unknown[]) ?? [],
      photos: photos.map((p) => ({ url: p.url as string, tag: p.tag as string })),
    };

    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ found: true, data: publicData });
  } catch (err: unknown) {
    console.error("Website API error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

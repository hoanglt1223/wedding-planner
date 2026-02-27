import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { userSessions } from "../src/db/schema.js";
import type { WeddingState } from "../src/types/wedding.js";

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

interface SyncRequest {
  userId: string;
  data: WeddingState;
  progress: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const body = req.body as SyncRequest;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "invalid_json" });
    }

    const { userId, data, progress } = body;

    if (!userId || !UUID_RE.test(userId)) {
      return res.status(400).json({ error: "invalid_user_id" });
    }

    const payloadSize = JSON.stringify(data).length;
    if (payloadSize > 50_000) {
      return res.status(413).json({ error: "payload_too_large" });
    }

    // Rate limit: 30 req/min per userId (sliding window)
    try {
      const redis = createRedis();
      const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "sync_rl" });
      const { success } = await rl.limit(userId);
      if (!success) return res.status(429).json({ error: "rate_limited" });
    } catch { /* Redis unavailable — skip rate limiting */ }

    // Strip sensitive fields before DB storage
    const { apiKey: _ak, aiResponse: _ar, ...safeData } = data ?? {} as Record<string, unknown>;

    // Extract profile fields
    const fields = {
      groomName: data?.info?.groom ?? null,
      brideName: data?.info?.bride ?? null,
      groomBirthDate: data?.info?.groomBirthDate ?? null,
      brideBirthDate: data?.info?.brideBirthDate ?? null,
      weddingDate: data?.info?.date ?? null,
      engagementDate: data?.info?.engagementDate ?? null,
      partyTime: data?.partyTime ?? null,
      region: data?.region ?? null,
      lang: data?.lang ?? null,
      guestCount: data?.guests?.length ?? 0,
      vendorCount: data?.vendors?.length ?? 0,
      photoCount: data?.photos?.length ?? 0,
      checklistProgress: typeof progress === "number" ? progress : 0,
      budget: data?.budget ?? 0,
      onboardingComplete: data?.onboardingComplete ?? false,
    };

    // Upsert user_sessions
    const db = createDb();
    await db
      .insert(userSessions)
      .values({
        id: userId,
        weddingData: safeData as unknown as Record<string, unknown>,
        ...fields,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userSessions.id,
        set: {
          weddingData: safeData as unknown as Record<string, unknown>,
          ...fields,
          updatedAt: new Date(),
        },
      });

    return res.status(200).json({ ok: true, syncedAt: new Date().toISOString() });
  } catch (err: unknown) {
    console.error("Sync error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

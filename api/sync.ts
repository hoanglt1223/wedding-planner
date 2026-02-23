import { Ratelimit } from "@upstash/ratelimit";
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface SyncRequest {
  userId: string;
  data: WeddingState;
  progress: number;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "method_not_allowed" }, { status: 405, headers: CORS_HEADERS });
  }

  try {
    // Parse body
    let body: SyncRequest;
    try {
      body = (await request.json()) as SyncRequest;
    } catch {
      return Response.json({ error: "invalid_json" }, { status: 400, headers: CORS_HEADERS });
    }

    const { userId, data, progress } = body;

    // Validate userId
    if (!userId || !UUID_RE.test(userId)) {
      return Response.json({ error: "invalid_user_id" }, { status: 400, headers: CORS_HEADERS });
    }

    // Validate payload size (<50KB)
    const payloadSize = JSON.stringify(data).length;
    if (payloadSize > 50_000) {
      return Response.json({ error: "payload_too_large" }, { status: 413, headers: CORS_HEADERS });
    }

    // Rate limit: 30 req/min per userId (sliding window)
    try {
      const redis = createRedis();
      const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "sync_rl" });
      const { success } = await rl.limit(userId);
      if (!success) return Response.json({ error: "rate_limited" }, { status: 429, headers: CORS_HEADERS });
    } catch { /* Redis unavailable — skip rate limiting */ }

    // Strip sensitive fields before DB storage
    const { apiKey: _ak, aiResponse: _ar, ...safeData } = data ?? {} as Record<string, unknown>;

    // Extract profile fields
    const groomName = data?.info?.groom ?? null;
    const brideName = data?.info?.bride ?? null;
    const groomBirthDate = data?.info?.groomBirthDate ?? null;
    const brideBirthDate = data?.info?.brideBirthDate ?? null;
    const weddingDate = data?.info?.date ?? null;
    const region = data?.region ?? null;
    const lang = data?.lang ?? null;
    const guestCount = data?.guests?.length ?? 0;
    const budget = data?.budget ?? 0;
    const onboardingComplete = data?.onboardingComplete ?? false;
    const checklistProgress = typeof progress === "number" ? progress : 0;

    // Upsert user_sessions
    const db = createDb();
    await db
      .insert(userSessions)
      .values({
        id: userId,
        weddingData: safeData as unknown as Record<string, unknown>,
        groomName,
        brideName,
        groomBirthDate,
        brideBirthDate,
        weddingDate,
        region,
        lang,
        guestCount,
        checklistProgress,
        budget,
        onboardingComplete,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userSessions.id,
        set: {
          weddingData: safeData as unknown as Record<string, unknown>,
          groomName,
          brideName,
          groomBirthDate,
          brideBirthDate,
          weddingDate,
          region,
          lang,
          guestCount,
          checklistProgress,
          budget,
          onboardingComplete,
          updatedAt: new Date(),
        },
      });

    return Response.json({ ok: true, syncedAt: new Date().toISOString() }, { headers: CORS_HEADERS });
  } catch (err: unknown) {
    console.error("Sync error:", err);
    return Response.json({ error: "internal_error" }, { status: 500, headers: CORS_HEADERS });
  }
}

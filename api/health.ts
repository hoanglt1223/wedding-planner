import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const checks: Record<string, string> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV ?? "development",
  };

  // Database check
  const dbUrl = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (dbUrl) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(dbUrl);
      await sql`SELECT 1`;
      checks.database = "connected";
    } catch {
      checks.database = "error";
    }
  } else {
    checks.database = "not_configured";
  }

  // Redis check
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (redisUrl && redisToken) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.ping();
      checks.redis = "connected";
    } catch {
      checks.redis = "error";
    }
  } else {
    checks.redis = "not_configured";
  }

  return res.status(200).json(checks);
}

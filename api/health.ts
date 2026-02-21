export default {
  async fetch(_request: Request): Promise<Response> {
    const checks: Record<string, string> = {
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL_ENV ?? "development",
    };

    // Database check
    if (process.env.DATABASE_URL) {
      try {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL);
        await sql`SELECT 1`;
        checks.database = "connected";
      } catch {
        checks.database = "error";
      }
    } else {
      checks.database = "not_configured";
    }

    // Redis check
    if (
      process.env.UPSTASH_REDIS_REST_URL &&
      process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      try {
        const { Redis } = await import("@upstash/redis");
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        await redis.ping();
        checks.redis = "connected";
      } catch {
        checks.redis = "error";
      }
    } else {
      checks.redis = "not_configured";
    }

    return Response.json(checks);
  },
};

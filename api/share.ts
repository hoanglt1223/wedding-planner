import { createRedis } from "../src/lib/redis.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  try {
    let redis: ReturnType<typeof createRedis>;
    try { redis = createRedis(); } catch {
      return Response.json({ error: "redis_not_configured" }, { status: 503, headers: CORS_HEADERS });
    }

    if (request.method === "POST") {
      const body = (await request.json()) as { data?: string };
      if (!body.data || typeof body.data !== "string") {
        return Response.json({ error: "Missing data" }, { status: 400, headers: CORS_HEADERS });
      }
      if (body.data.length > 15_000) {
        return Response.json({ error: "Data too large" }, { status: 413, headers: CORS_HEADERS });
      }
      const id = crypto.randomUUID().slice(0, 8);
      await redis.set(`share:${id}`, body.data, { ex: 600 });
      return Response.json({ id }, { headers: CORS_HEADERS });
    }

    if (request.method === "GET") {
      const url = new URL(request.url, "http://n");
      const id = url.searchParams.get("id");
      if (!id || id.length > 36) {
        return Response.json({ error: "Missing id" }, { status: 400, headers: CORS_HEADERS });
      }
      const data = await redis.get<string>(`share:${id}`);
      if (!data) {
        return Response.json({ error: "expired" }, { status: 404, headers: CORS_HEADERS });
      }
      return Response.json({ data }, { headers: CORS_HEADERS });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS_HEADERS });
  } catch {
    return Response.json({ error: "Server error" }, { status: 500, headers: CORS_HEADERS });
  }
}

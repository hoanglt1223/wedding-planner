import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createRedis } from "../src/lib/redis.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    let redis: ReturnType<typeof createRedis>;
    try { redis = createRedis(); } catch {
      return res.status(503).json({ error: "redis_not_configured" });
    }

    if (req.method === "POST") {
      const body = req.body as { data?: string };
      if (!body?.data || typeof body.data !== "string") {
        return res.status(400).json({ error: "Missing data" });
      }
      if (body.data.length > 15_000) {
        return res.status(413).json({ error: "Data too large" });
      }
      const id = crypto.randomUUID().slice(0, 8);
      await redis.set(`share:${id}`, body.data, { ex: 600 });
      return res.status(200).json({ id });
    }

    if (req.method === "GET") {
      const id = req.query.id;
      const idStr = Array.isArray(id) ? id[0] : id;
      if (!idStr || idStr.length > 36) {
        return res.status(400).json({ error: "Missing id" });
      }
      const data = await redis.get<string>(`share:${idStr}`);
      if (!data) {
        return res.status(404).json({ error: "expired" });
      }
      return res.status(200).json({ data });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
}

import { eq } from "drizzle-orm";
import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { adminSessions } from "../../src/db/schema.js";
import { parseCookies, getAdminCorsHeaders, getHeader, setCors } from "./_auth.js";

const cors = getAdminCorsHeaders("GET, POST, OPTIONS");

async function handleLogin(req: VercelRequest, res: VercelResponse): Promise<void> {
  const ip = getHeader(req, "x-forwarded-for") ?? "anonymous";
  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "admin_login_rl" });
    const { success } = await rl.limit(ip);
    if (!success) { res.status(429).json({ error: "rate_limited" }); return; }
  } catch { /* Redis unavailable — skip rate limiting */ }

  const body = req.body as { password?: string } | undefined;
  if (!body || typeof body !== "object") {
    res.status(400).json({ error: "invalid_json" }); return;
  }

  const expected = process.env.ADMIN_PASSWORD ?? "";
  const supplied = body.password ?? "";
  // Constant-time comparison to prevent timing attacks
  let match = supplied.length === expected.length ? 1 : 0;
  const len = Math.max(supplied.length, expected.length);
  for (let i = 0; i < len; i++) match &= (supplied.charCodeAt(i % supplied.length) === expected.charCodeAt(i % expected.length)) ? 1 : 0;
  if (!supplied || !expected || !match) {
    res.status(401).json({ error: "invalid_password" }); return;
  }

  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const db = createDb();
  await db.insert(adminSessions).values({ id, createdAt: new Date(), expiresAt });

  const cookie = `admin_session=${id}; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=86400`;
  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ ok: true });
}

async function handleLogout(req: VercelRequest, res: VercelResponse): Promise<void> {
  const cookies = parseCookies(getHeader(req, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (sessionId) {
    const db = createDb();
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
  }
  const clearCookie = "admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=0";
  res.setHeader("Set-Cookie", clearCookie);
  res.status(200).json({ ok: true });
}

async function handleVerify(req: VercelRequest, res: VercelResponse): Promise<void> {
  const cookies = parseCookies(getHeader(req, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (!sessionId) { res.status(401).json({ authenticated: false }); return; }

  const db = createDb();
  const [row] = await db.select().from(adminSessions).where(eq(adminSessions.id, sessionId)).limit(1);
  if (!row || row.expiresAt < new Date()) {
    res.status(401).json({ authenticated: false }); return;
  }
  res.status(200).json({ authenticated: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, cors);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const action = (req.query.action as string) ?? "";

    if (req.method === "POST" && action === "login") return handleLogin(req, res);
    if (req.method === "POST" && action === "logout") return handleLogout(req, res);
    if (req.method === "GET" && action === "verify") return handleVerify(req, res);

    return res.status(400).json({ error: "invalid_action" });
  } catch (err) {
    console.error("Admin auth error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

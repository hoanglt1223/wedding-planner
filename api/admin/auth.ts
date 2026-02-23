import { eq } from "drizzle-orm";
import { Ratelimit } from "@upstash/ratelimit";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { adminSessions } from "../../src/db/schema.js";
import { parseCookies, getAdminCorsHeaders, getHeader } from "./_auth.js";

const cors = getAdminCorsHeaders("GET, POST, OPTIONS");

async function handleLogin(request: Request): Promise<Response> {
  const ip = getHeader(request, "x-forwarded-for") ?? "anonymous";
  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "admin_login_rl" });
    const { success } = await rl.limit(ip);
    if (!success) return Response.json({ error: "rate_limited" }, { status: 429, headers: cors });
  } catch { /* Redis unavailable — skip rate limiting */ }

  let body: { password?: string };
  try { body = (await request.json()) as { password?: string }; }
  catch { return Response.json({ error: "invalid_json" }, { status: 400, headers: cors }); }

  const expected = process.env.ADMIN_PASSWORD ?? "";
  const supplied = body.password ?? "";
  // Constant-time comparison: always compare full length to prevent timing attacks
  let match = supplied.length === expected.length ? 1 : 0;
  const len = Math.max(supplied.length, expected.length);
  for (let i = 0; i < len; i++) match &= (supplied.charCodeAt(i % supplied.length) === expected.charCodeAt(i % expected.length)) ? 1 : 0;
  if (!supplied || !expected || !match) {
    return Response.json({ error: "invalid_password" }, { status: 401, headers: cors });
  }

  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const db = createDb();
  await db.insert(adminSessions).values({ id, createdAt: new Date(), expiresAt });

  const cookie = `admin_session=${id}; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=86400`;
  return Response.json({ ok: true }, { headers: { ...cors, "Set-Cookie": cookie } });
}

async function handleLogout(request: Request): Promise<Response> {
  const cookies = parseCookies(getHeader(request, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (sessionId) {
    const db = createDb();
    await db.delete(adminSessions).where(eq(adminSessions.id, sessionId));
  }
  const clearCookie = "admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=0";
  return Response.json({ ok: true }, { headers: { ...cors, "Set-Cookie": clearCookie } });
}

async function handleVerify(request: Request): Promise<Response> {
  const cookies = parseCookies(getHeader(request, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (!sessionId) return Response.json({ authenticated: false }, { status: 401, headers: cors });

  const db = createDb();
  const [row] = await db.select().from(adminSessions).where(eq(adminSessions.id, sessionId)).limit(1);
  if (!row || row.expiresAt < new Date()) {
    return Response.json({ authenticated: false }, { status: 401, headers: cors });
  }
  return Response.json({ authenticated: true }, { headers: cors });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  try {
    const url = new URL(request.url, "http://n");
    const action = url.searchParams.get("action") ?? "";

    if (request.method === "POST" && action === "login") return handleLogin(request);
    if (request.method === "POST" && action === "logout") return handleLogout(request);
    if (request.method === "GET" && action === "verify") return handleVerify(request);

    return Response.json({ error: "invalid_action" }, { status: 400, headers: cors });
  } catch (err) {
    console.error("Admin auth error:", err);
    return Response.json({ error: "internal_error" }, { status: 500, headers: cors });
  }
}

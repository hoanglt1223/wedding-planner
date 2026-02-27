import { sql, eq, desc, asc, ilike, or, count, gt } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { userSessions, analyticsEvents, adminSessions } from "../../src/db/schema.js";
import { parseCookies, getAdminCorsHeaders, getHeader, setCors, verifyAdminSession } from "./_auth.js";

const cors = getAdminCorsHeaders("GET, POST, OPTIONS");

// --- Auth actions (no session required) ---

async function handleLogin(req: VercelRequest, res: VercelResponse) {
  const ip = getHeader(req, "x-forwarded-for") ?? "anonymous";
  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "admin_login_rl" });
    const { success } = await rl.limit(ip);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const body = req.body as { password?: string } | undefined;
  if (!body || typeof body !== "object") return res.status(400).json({ error: "invalid_json" });

  const expected = process.env.ADMIN_PASSWORD ?? "";
  const supplied = body.password ?? "";
  let match = supplied.length === expected.length ? 1 : 0;
  const len = Math.max(supplied.length, expected.length);
  for (let i = 0; i < len; i++) match &= (supplied.charCodeAt(i % supplied.length) === expected.charCodeAt(i % expected.length)) ? 1 : 0;
  if (!supplied || !expected || !match) return res.status(401).json({ error: "invalid_password" });

  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const db = createDb();
  await db.insert(adminSessions).values({ id, createdAt: new Date(), expiresAt });
  res.setHeader("Set-Cookie", `admin_session=${id}; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=86400`);
  return res.status(200).json({ ok: true });
}

async function handleLogout(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(getHeader(req, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (sessionId) { const db = createDb(); await db.delete(adminSessions).where(eq(adminSessions.id, sessionId)); }
  res.setHeader("Set-Cookie", "admin_session=; HttpOnly; Secure; SameSite=Lax; Path=/api/admin; Max-Age=0");
  return res.status(200).json({ ok: true });
}

async function handleVerify(req: VercelRequest, res: VercelResponse) {
  const cookies = parseCookies(getHeader(req, "cookie") ?? "");
  const sessionId = cookies["admin_session"];
  if (!sessionId) return res.status(401).json({ authenticated: false });
  const db = createDb();
  const [row] = await db.select().from(adminSessions).where(eq(adminSessions.id, sessionId)).limit(1);
  if (!row || row.expiresAt < new Date()) return res.status(401).json({ authenticated: false });
  return res.status(200).json({ authenticated: true });
}

// --- Data actions (session required) ---

async function dashboard(res: VercelResponse) {
  const db = createDb();
  const [total, today, week, month, progress, budget, onboarded, regionRes, langRes] = await Promise.all([
    db.select({ c: sql<number>`count(*)::int` }).from(userSessions),
    db.select({ c: sql<number>`count(*)::int` }).from(userSessions).where(sql`updated_at > now() - interval '1 day'`),
    db.select({ c: sql<number>`count(*)::int` }).from(userSessions).where(sql`updated_at > now() - interval '7 days'`),
    db.select({ c: sql<number>`count(*)::int` }).from(userSessions).where(sql`updated_at > now() - interval '30 days'`),
    db.select({ a: sql<number>`avg(checklist_progress)::float` }).from(userSessions).where(sql`onboarding_complete = true`),
    db.select({ a: sql<number>`avg(budget)::float` }).from(userSessions).where(sql`budget > 0`),
    db.select({ c: sql<number>`count(*)::int` }).from(userSessions).where(sql`onboarding_complete = true`),
    db.select({ region: userSessions.region, count: sql<number>`count(*)::int` }).from(userSessions).groupBy(userSessions.region),
    db.select({ lang: userSessions.lang, count: sql<number>`count(*)::int` }).from(userSessions).groupBy(userSessions.lang),
  ]);
  const regionBreakdown: Record<string, number> = {};
  for (const r of regionRes) { if (r.region) regionBreakdown[r.region] = r.count; }
  const langBreakdown: Record<string, number> = {};
  for (const l of langRes) { if (l.lang) langBreakdown[l.lang] = l.count; }
  return res.status(200).json({
    totalUsers: total[0]?.c ?? 0, activeToday: today[0]?.c ?? 0, activeWeek: week[0]?.c ?? 0,
    activeMonth: month[0]?.c ?? 0, avgProgress: progress[0]?.a ?? 0, avgBudget: budget[0]?.a ?? 0,
    onboardedCount: onboarded[0]?.c ?? 0, regionBreakdown, langBreakdown,
  });
}

const SORT_MAP: Record<string, AnyColumn> = {
  updated_at: userSessions.updatedAt, created_at: userSessions.createdAt,
  groom_name: userSessions.groomName, bride_name: userSessions.brideName,
  checklist_progress: userSessions.checklistProgress, budget: userSessions.budget,
};

async function users(req: VercelRequest, res: VercelResponse) {
  const page = Math.max(1, parseInt((req.query.page as string) ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) ?? "50")));
  const search = (req.query.search as string) ?? "";
  const sortCol = SORT_MAP[(req.query.sort as string) ?? ""] ?? userSessions.updatedAt;
  const orderFn = req.query.order === "asc" ? asc : desc;
  const where = search ? or(ilike(userSessions.groomName, `%${search}%`), ilike(userSessions.brideName, `%${search}%`)) : undefined;
  const db = createDb();
  const [rows, totalRes] = await Promise.all([
    db.select({
      id: userSessions.id, groomName: userSessions.groomName, brideName: userSessions.brideName,
      weddingDate: userSessions.weddingDate, region: userSessions.region, lang: userSessions.lang,
      guestCount: userSessions.guestCount, checklistProgress: userSessions.checklistProgress,
      budget: userSessions.budget, onboardingComplete: userSessions.onboardingComplete, updatedAt: userSessions.updatedAt,
    }).from(userSessions).where(where).orderBy(orderFn(sortCol)).limit(limit).offset((page - 1) * limit),
    db.select({ count: count() }).from(userSessions).where(where),
  ]);
  return res.status(200).json({ users: rows, total: totalRes[0]?.count ?? 0, page, limit });
}

async function userDetail(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string | undefined;
  if (!id) return res.status(400).json({ error: "missing_id" });
  const db = createDb();
  const [user] = await db.select().from(userSessions).where(eq(userSessions.id, id)).limit(1);
  if (!user) return res.status(404).json({ error: "not_found" });
  return res.status(200).json(user);
}

async function analytics(req: VercelRequest, res: VercelResponse) {
  const now = new Date();
  const fromStr = (req.query.from as string) ?? new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
  const toStr = (req.query.to as string) ?? now.toISOString().split("T")[0];
  const fromDate = new Date(fromStr + "T00:00:00Z");
  const toDate = new Date(toStr + "T23:59:59Z");
  const db = createDb();
  const [eventsByType, dailyEvents, dailyUsers] = await Promise.all([
    db.select({ type: analyticsEvents.eventType, count: sql<number>`count(*)::int` })
      .from(analyticsEvents).where(sql`created_at between ${fromDate} and ${toDate}`)
      .groupBy(analyticsEvents.eventType).orderBy(sql`count(*) desc`),
    db.select({ day: sql<string>`date(created_at)::text`, count: sql<number>`count(*)::int` })
      .from(analyticsEvents).where(sql`created_at between ${fromDate} and ${toDate}`)
      .groupBy(sql`date(created_at)`).orderBy(sql`date(created_at)`),
    db.select({ day: sql<string>`date(created_at)::text`, count: sql<number>`count(distinct user_id)::int` })
      .from(analyticsEvents).where(sql`created_at between ${fromDate} and ${toDate}`)
      .groupBy(sql`date(created_at)`).orderBy(sql`date(created_at)`),
  ]);
  return res.status(200).json({ eventsByType, dailyEvents, dailyUsers, from: fromStr, to: toStr });
}

const ENV_KEYS = ["DATABASE_URL", "POSTGRES_URL", "KV_REST_API_URL", "KV_REST_API_TOKEN", "ADMIN_PASSWORD", "Z_AI_KEY"] as const;

async function system(res: VercelResponse) {
  let dbStatus = "ok", redisStatus = "ok", activeSessions = 0, lastSync: string | null = null;
  try {
    const db = createDb();
    await db.select({ one: sql<number>`1` }).from(userSessions).limit(1);
    const [s] = await db.select({ count: count() }).from(adminSessions).where(gt(adminSessions.expiresAt, new Date()));
    activeSessions = s?.count ?? 0;
    const [sync] = await db.select({ m: sql<string>`max(updated_at)::text` }).from(userSessions);
    lastSync = sync?.m ?? null;
  } catch { dbStatus = "error"; }
  try { const redis = createRedis(); await redis.ping(); } catch { redisStatus = "error"; }
  const envVars: Record<string, string> = {};
  for (const k of ENV_KEYS) envVars[k] = process.env[k] ? "set" : "missing";
  return res.status(200).json({ db: dbStatus, redis: redisStatus, activeSessions, lastSync, envVars, version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local" });
}

// --- Router ---

const AUTH_ACTIONS = new Set(["login", "logout", "verify"]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res, cors);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const action = (req.query.action as string) ?? "";

    // Auth actions — no session required
    if (req.method === "POST" && action === "login") return handleLogin(req, res);
    if (req.method === "POST" && action === "logout") return handleLogout(req, res);
    if (req.method === "GET" && action === "verify") return handleVerify(req, res);

    // Data actions — session required
    if (!AUTH_ACTIONS.has(action)) {
      if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
      if (!(await verifyAdminSession(req))) return res.status(401).json({ error: "unauthorized" });
    }

    if (action === "dashboard") return dashboard(res);
    if (action === "users") return users(req, res);
    if (action === "user-detail") return userDetail(req, res);
    if (action === "analytics") return analytics(req, res);
    if (action === "system") return system(res);

    return res.status(400).json({ error: "invalid_action" });
  } catch (err) {
    console.error("Admin error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

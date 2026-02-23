import { sql, eq, desc, asc, ilike, or, count, gt } from "drizzle-orm";
import type { AnyColumn } from "drizzle-orm";
import { createDb } from "../../src/db/index.js";
import { createRedis } from "../../src/lib/redis.js";
import { userSessions, analyticsEvents, adminSessions } from "../../src/db/schema.js";
import { getAdminCorsHeaders, verifyAdminSession, unauthorizedResponse } from "./_auth.js";

const cors = getAdminCorsHeaders();

async function dashboard(): Promise<Response> {
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
  return Response.json({
    totalUsers: total[0]?.c ?? 0, activeToday: today[0]?.c ?? 0, activeWeek: week[0]?.c ?? 0,
    activeMonth: month[0]?.c ?? 0, avgProgress: progress[0]?.a ?? 0, avgBudget: budget[0]?.a ?? 0,
    onboardedCount: onboarded[0]?.c ?? 0, regionBreakdown, langBreakdown,
  }, { headers: cors });
}

const SORT_MAP: Record<string, AnyColumn> = {
  updated_at: userSessions.updatedAt, created_at: userSessions.createdAt,
  groom_name: userSessions.groomName, bride_name: userSessions.brideName,
  checklist_progress: userSessions.checklistProgress, budget: userSessions.budget,
};

async function users(url: URL): Promise<Response> {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50")));
  const search = url.searchParams.get("search") ?? "";
  const sortCol = SORT_MAP[url.searchParams.get("sort") ?? ""] ?? userSessions.updatedAt;
  const orderFn = url.searchParams.get("order") === "asc" ? asc : desc;
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
  return Response.json({ users: rows, total: totalRes[0]?.count ?? 0, page, limit }, { headers: cors });
}

async function userDetail(url: URL): Promise<Response> {
  const id = url.searchParams.get("id");
  if (!id) return Response.json({ error: "missing_id" }, { status: 400, headers: cors });
  const db = createDb();
  const [user] = await db.select().from(userSessions).where(eq(userSessions.id, id)).limit(1);
  if (!user) return Response.json({ error: "not_found" }, { status: 404, headers: cors });
  return Response.json(user, { headers: cors });
}

async function analytics(url: URL): Promise<Response> {
  const now = new Date();
  const fromStr = url.searchParams.get("from") ?? new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
  const toStr = url.searchParams.get("to") ?? now.toISOString().split("T")[0];
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
  return Response.json({ eventsByType, dailyEvents, dailyUsers, from: fromStr, to: toStr }, { headers: cors });
}

const ENV_KEYS = ["DATABASE_URL", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "ADMIN_PASSWORD", "Z_AI_KEY"] as const;

async function system(): Promise<Response> {
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
  return Response.json({ db: dbStatus, redis: redisStatus, activeSessions, lastSync, envVars, version: process.env.VERCEL_GIT_COMMIT_SHA ?? "local" }, { headers: cors });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "GET") return Response.json({ error: "method_not_allowed" }, { status: 405, headers: cors });
  if (!(await verifyAdminSession(request))) return unauthorizedResponse(cors);

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get("action") ?? "";
    if (action === "dashboard") return dashboard();
    if (action === "users") return users(url);
    if (action === "user-detail") return userDetail(url);
    if (action === "analytics") return analytics(url);
    if (action === "system") return system();
    return Response.json({ error: "invalid_action" }, { status: 400, headers: cors });
  } catch (err) {
    console.error("Admin data error:", err);
    return Response.json({ error: "internal_error" }, { status: 500, headers: cors });
  }
}

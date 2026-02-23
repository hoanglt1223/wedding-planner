import { and, eq, gt } from "drizzle-orm";
import { createDb } from "../../src/db/index.js";
import { adminSessions } from "../../src/db/schema.js";

/** Safely get a header — works with both Web API Headers and Node.js plain objects */
export function getHeader(request: Request, name: string): string | null {
  if (typeof request.headers?.get === "function") return request.headers.get(name);
  const v = (request.headers as unknown as Record<string, string | string[]>)[name.toLowerCase()];
  return typeof v === "string" ? v : Array.isArray(v) ? v[0] ?? null : null;
}

export function parseCookies(header: string): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, v.join("=")];
    })
  );
}

export function getCorsOrigin(): string {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (url) return `https://${url}`;
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "*";
}

export function getAdminCorsHeaders(methods = "GET, OPTIONS"): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": getCorsOrigin(),
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function verifyAdminSession(request: Request): Promise<boolean> {
  try {
    const cookieHeader = getHeader(request, "cookie") ?? "";
    const cookies = parseCookies(cookieHeader);
    const sessionId = cookies["admin_session"];
    if (!sessionId) return false;

    const db = createDb();
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(and(eq(adminSessions.id, sessionId), gt(adminSessions.expiresAt, new Date())))
      .limit(1);

    return !!session;
  } catch {
    return false;
  }
}

export function unauthorizedResponse(corsHeaders: Record<string, string>): Response {
  return Response.json({ error: "unauthorized" }, { status: 401, headers: corsHeaders });
}

import { and, eq, gt } from "drizzle-orm";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createDb } from "../../src/db/index.js";
import { adminSessions } from "../../src/db/schema.js";

export function getHeader(req: VercelRequest, name: string): string | null {
  const v = req.headers[name.toLowerCase()];
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

export function setCors(res: VercelResponse, headers: Record<string, string>): void {
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
}

export async function verifyAdminSession(req: VercelRequest): Promise<boolean> {
  try {
    const cookieHeader = getHeader(req, "cookie") ?? "";
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

export function unauthorizedResponse(res: VercelResponse, corsHeaders: Record<string, string>): void {
  setCors(res, corsHeaders);
  res.status(401).json({ error: "unauthorized" });
}

import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { eq, count } from "drizzle-orm";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { weddingPhotos } from "../src/db/schema.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_PHOTOS = 100;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const TOKEN_TTL = 60 * 60 * 24; // 24 hours

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

function getParam(req: VercelRequest, key: string): string {
  const val = req.query[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
}

async function handleCreateToken(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { userId?: string };
  if (!body?.userId) return res.status(400).json({ error: "userId_required" });
  const redis = createRedis();
  const token = nanoid(16);
  await redis.set(`photo_token:${token}`, body.userId, { ex: TOKEN_TTL });
  return res.status(200).json({ token });
}

async function handleGetUploadUrl(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { token?: string; filename?: string };
  if (!body?.token || !body?.filename) {
    return res.status(400).json({ error: "token_and_filename_required" });
  }

  const redis = createRedis();

  // Rate limit: 10 uploads/min per token
  try {
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "photo_upload_rl" });
    const { success } = await rl.limit(body.token);
    if (!success) return res.status(429).json({ error: "rate_limited" });
  } catch { /* Redis unavailable */ }

  const userId = await redis.get<string>(`photo_token:${body.token}`);
  if (!userId) return res.status(401).json({ error: "invalid_or_expired_token" });

  const db = createDb();
  const [row] = await db.select({ cnt: count() }).from(weddingPhotos).where(eq(weddingPhotos.userId, userId));
  if ((row?.cnt ?? 0) >= MAX_PHOTOS) return res.status(400).json({ error: "photo_limit_reached" });

  const ext = body.filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const pathname = `weddings/${userId}/${nanoid(8)}.${ext}`;
  const clientToken = await generateClientTokenFromReadWriteToken({
    pathname,
    maximumSizeInBytes: MAX_SIZE_BYTES,
    allowedContentTypes: ALLOWED_TYPES,
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return res.status(200).json({ clientToken, pathname });
}

async function handleConfirm(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { token?: string; blobUrl?: string; uploaderName?: string };
  if (!body?.token || !body?.blobUrl) {
    return res.status(400).json({ error: "token_and_blobUrl_required" });
  }

  const redis = createRedis();
  const userId = await redis.get<string>(`photo_token:${body.token}`);
  if (!userId) return res.status(401).json({ error: "invalid_or_expired_token" });

  const db = createDb();
  const [photo] = await db.insert(weddingPhotos).values({
    userId,
    blobUrl: body.blobUrl,
    uploaderName: (body.uploaderName ?? "").trim().slice(0, 100) || null,
    approved: true,
  }).returning({ id: weddingPhotos.id });

  return res.status(200).json({ id: photo.id });
}

async function handleList(req: VercelRequest, res: VercelResponse) {
  const userId = getParam(req, "userId");
  if (!userId) return res.status(400).json({ error: "userId_required" });
  const db = createDb();
  const photos = await db
    .select()
    .from(weddingPhotos)
    .where(eq(weddingPhotos.userId, userId))
    .orderBy(weddingPhotos.createdAt);
  return res.status(200).json({ photos });
}

async function handleModerate(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { photoId?: string; approved?: boolean; userId?: string };
  if (!body?.photoId || !body?.userId || body.approved === undefined) {
    return res.status(400).json({ error: "photoId_userId_approved_required" });
  }
  const db = createDb();
  const [photo] = await db.select({ userId: weddingPhotos.userId }).from(weddingPhotos).where(eq(weddingPhotos.id, body.photoId)).limit(1);
  if (!photo) return res.status(404).json({ error: "not_found" });
  if (photo.userId !== body.userId) return res.status(403).json({ error: "forbidden" });
  await db.update(weddingPhotos).set({ approved: body.approved }).where(eq(weddingPhotos.id, body.photoId));
  return res.status(200).json({ ok: true });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const action = getParam(req, "action");

    if (req.method === "POST" && action === "create-token") return handleCreateToken(req, res);
    if (req.method === "POST" && action === "get-upload-url") return handleGetUploadUrl(req, res);
    if (req.method === "POST" && action === "confirm") return handleConfirm(req, res);
    if (req.method === "GET") return handleList(req, res);
    if (req.method === "PATCH" && action === "moderate") return handleModerate(req, res);

    return res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    console.error("Photos API error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

import { Ratelimit } from "@upstash/ratelimit";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nanoid } from "nanoid";
import { eq, and } from "drizzle-orm";
import { createDb } from "../src/db/index.js";
import { createRedis } from "../src/lib/redis.js";
import { weddingTasks } from "../src/db/schema.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function setCors(res: VercelResponse): void {
  for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

const VALID_STATUSES = ["pending", "in_progress", "done"] as const;

async function rateLimit(key: string): Promise<boolean> {
  try {
    const redis = createRedis();
    const rl = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "tasks_rl" });
    const { success } = await rl.limit(key);
    return success;
  } catch { return true; /* Redis unavailable — skip */ }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const db = createDb();

    if (req.method === "GET") {
      const userIdParam = req.query.userId;
      const tokenParam = req.query.token;
      const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
      const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

      if (userId) {
        if (!await rateLimit(userId)) return res.status(429).json({ error: "rate_limited" });
        const tasks = await db.select().from(weddingTasks).where(eq(weddingTasks.userId, userId));
        return res.status(200).json({ tasks });
      }

      if (token) {
        if (!await rateLimit(token)) return res.status(429).json({ error: "rate_limited" });
        const tasks = await db.select().from(weddingTasks).where(eq(weddingTasks.assigneeToken, token));
        const assigneeName = tasks[0]?.assigneeName ?? "";
        return res.status(200).json({ tasks, assigneeName });
      }

      return res.status(400).json({ error: "userId or token required" });
    }

    if (req.method === "POST") {
      const body = req.body as { userId?: string; title?: string; description?: string; assigneeName?: string; dueDate?: string; category?: string };
      if (!body?.userId || !body?.title?.trim()) return res.status(400).json({ error: "userId and title required" });
      if (!await rateLimit(body.userId)) return res.status(429).json({ error: "rate_limited" });

      const count = await db.$count(weddingTasks, eq(weddingTasks.userId, body.userId));
      if (count >= 200) return res.status(400).json({ error: "max_tasks_reached" });

      const [task] = await db.insert(weddingTasks).values({
        userId: body.userId,
        title: body.title.trim().slice(0, 200),
        description: (body.description ?? "").trim().slice(0, 1000) || null,
        assigneeName: body.assigneeName?.trim().slice(0, 100) || null,
        assigneeToken: body.assigneeName ? nanoid(12) : null,
        dueDate: body.dueDate || null,
        category: body.category?.trim() || null,
        status: "pending",
      }).returning();
      return res.status(201).json({ task });
    }

    if (req.method === "PATCH") {
      const action = Array.isArray(req.query.action) ? req.query.action[0] : req.query.action;

      if (action === "status") {
        const body = req.body as { token?: string; taskId?: string; status?: string };
        if (!body?.token || !body?.taskId || !body?.status) return res.status(400).json({ error: "token, taskId, status required" });
        if (!VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) return res.status(400).json({ error: "invalid_status" });
        if (!await rateLimit(body.token)) return res.status(429).json({ error: "rate_limited" });

        const [task] = await db.select().from(weddingTasks).where(eq(weddingTasks.id, body.taskId)).limit(1);
        if (!task || task.assigneeToken !== body.token) return res.status(403).json({ error: "forbidden" });

        await db.update(weddingTasks).set({
          status: body.status,
          completedAt: body.status === "done" ? new Date() : null,
        }).where(and(eq(weddingTasks.id, body.taskId), eq(weddingTasks.assigneeToken, body.token)));
        return res.status(200).json({ ok: true });
      }

      // action=update (couple updates task)
      const body = req.body as { userId?: string; taskId?: string; title?: string; description?: string; assigneeName?: string; dueDate?: string; category?: string; status?: string };
      if (!body?.userId || !body?.taskId) return res.status(400).json({ error: "userId and taskId required" });
      if (!await rateLimit(body.userId)) return res.status(429).json({ error: "rate_limited" });

      const [task] = await db.select().from(weddingTasks).where(eq(weddingTasks.id, body.taskId)).limit(1);
      if (!task || task.userId !== body.userId) return res.status(403).json({ error: "forbidden" });

      const updates: Record<string, unknown> = {};
      if (body.title) updates.title = body.title.trim().slice(0, 200);
      if (body.description !== undefined) updates.description = body.description.trim().slice(0, 1000) || null;
      if (body.assigneeName !== undefined) updates.assigneeName = body.assigneeName.trim().slice(0, 100) || null;
      if (body.dueDate !== undefined) updates.dueDate = body.dueDate || null;
      if (body.category !== undefined) updates.category = body.category.trim() || null;
      if (body.status && VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) updates.status = body.status;

      await db.update(weddingTasks).set(updates).where(eq(weddingTasks.id, body.taskId));
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = req.body as { userId?: string; taskId?: string };
      if (!body?.userId || !body?.taskId) return res.status(400).json({ error: "userId and taskId required" });
      if (!await rateLimit(body.userId)) return res.status(429).json({ error: "rate_limited" });

      const [task] = await db.select().from(weddingTasks).where(eq(weddingTasks.id, body.taskId)).limit(1);
      if (!task || task.userId !== body.userId) return res.status(403).json({ error: "forbidden" });

      await db.delete(weddingTasks).where(eq(weddingTasks.id, body.taskId));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "method_not_allowed" });
  } catch (err) {
    console.error("Tasks error:", err);
    return res.status(500).json({ error: "internal_error" });
  }
}

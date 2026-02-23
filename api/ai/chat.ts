export const config = { maxDuration: 30 };

import type { VercelRequest, VercelResponse } from "@vercel/node";

const ZHIPU_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const FETCH_TIMEOUT_MS = 25_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const apiKey = process.env.Z_AI_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Z_AI_KEY not configured" });
  }

  try {
    const body = req.body as { prompt?: string; budget?: string; lang?: string };
    const { prompt, budget, lang = "vi" } = body ?? {};

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let fetchRes: Response;
    try {
      fetchRes = await fetch(ZHIPU_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Accept-Language": "en-US,en",
        },
        body: JSON.stringify({
          model: "glm-5",
          messages: [
            {
              role: "system",
              content: lang === "en"
                ? `Expert Vietnamese wedding consultant with 20 years of experience across all 3 regions of Vietnam. Provide detailed advice with VND pricing. Respond in English. Budget: ${budget}.`
                : `Chuyên gia đám cưới VN 20 năm kinh nghiệm. 3 miền. Chi tiết, có giá VNĐ. Budget: ${budget}.`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 2000,
          temperature: 1.0,
        }),
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return res.status(504).json({
          error: lang === "en"
            ? "ZhipuAI timed out after 25s. Please try again."
            : "ZhipuAI timeout sau 25s. Thử lại sau.",
        });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!fetchRes.ok) {
      const text = await fetchRes.text();
      return res.status(502).json({ error: `ZhipuAI API ${fetchRes.status}: ${text}` });
    }

    const data = await fetchRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

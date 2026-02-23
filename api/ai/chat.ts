export const config = { maxDuration: 30 };

const ZHIPU_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const FETCH_TIMEOUT_MS = 25_000;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.Z_AI_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Z_AI_KEY not configured" },
      { status: 500 },
    );
  }

  try {
    const body = (await req.json()) as { prompt?: string; budget?: string; lang?: string };
    const { prompt, budget, lang = "vi" } = body;

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(ZHIPU_URL, {
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
        return Response.json(
          { error: lang === "en" ? "ZhipuAI timed out after 25s. Please try again." : "ZhipuAI timeout sau 25s. Thử lại sau." },
          { status: 504 },
        );
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: `ZhipuAI API ${res.status}: ${text}` },
        { status: 502 },
      );
    }

    const data = await res.json();
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

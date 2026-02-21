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
    const body = (await req.json()) as { prompt?: string; budget?: string };
    const { prompt, budget } = body;

    if (!prompt) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const res = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "glm-5.0",
          messages: [
            {
              role: "system",
              content: `Chuyên gia đám cưới VN 20 năm kinh nghiệm. 3 miền. Chi tiết, có giá VNĐ. Budget: ${budget}.`,
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      },
    );

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

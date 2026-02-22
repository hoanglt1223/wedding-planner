import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { createRedis } from "../src/lib/redis";
import { getZodiac, getSoundElement, getStemBranch } from "../src/lib/astrology";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface ReadingRequest {
  birthDate: string;
  birthHour: number | null;
  gender: string;
  currentYear: number;
}

/** Map hour (0-23) to Earthly Branch name */
function getHourBranch(hour: number): string {
  const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  const index = Math.floor(((hour + 1) % 24) / 2);
  return branches[index];
}

function buildPrompt(body: ReadingRequest): { system: string; user: string } {
  const year = parseInt(body.birthDate.slice(0, 4));
  const zodiac = getZodiac(year);
  const soundElement = getSoundElement(year);
  const stemBranch = getStemBranch(year);
  const currentStemBranch = getStemBranch(body.currentYear);
  const currentZodiac = getZodiac(body.currentYear);

  const hourLabel = body.birthHour !== null
    ? `Giờ ${getHourBranch(body.birthHour)}`
    : "Không rõ giờ sinh";

  const genderLabel = body.gender === "female" ? "Nữ" : "Nam";

  const system = `Bạn là chuyên gia Tử Vi Việt Nam, am hiểu sâu về Địa Chi, Thiên Can, Ngũ Hành Nạp Âm.
Viết bài phân tích tử vi bằng tiếng Việt, dùng thuật ngữ truyền thống với dấu tiếng Việt đầy đủ.
Giọng văn: ấm áp, khích lệ, dùng xu hướng thay vì tiên đoán tuyệt đối.
Độ dài: 400-500 từ.`;

  const user = `Phân tích tử vi cá nhân:
- Năm sinh: ${year} (${stemBranch})
- Con giáp: ${zodiac.name} (${zodiac.chi})
- Nạp Âm: ${soundElement.name} — Mệnh ${soundElement.label}
- Giờ sinh: ${hourLabel}
- Giới tính: ${genderLabel}
- Năm hiện tại: ${body.currentYear} (${currentStemBranch}) — Năm ${currentZodiac.name}

Viết 5 phần:
1. 🔮 Tổng quan vận mệnh ${body.currentYear}
2. 💕 Tình duyên & hôn nhân
3. 💼 Sự nghiệp & tài lộc
4. 🏥 Sức khỏe
5. 💡 Lời khuyên đặc biệt`;

  return { system, user };
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405, headers: CORS_HEADERS });
    }

    try {
      const redis = createRedis();

      // Rate limit: 5 requests per IP per day (sliding window)
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, "1 d"),
        prefix: "astro_rl",
      });
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return Response.json(
          { error: "rate_limited", message: "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai." },
          { status: 429, headers: CORS_HEADERS }
        );
      }

      // Parse and validate body
      const body = await request.json() as ReadingRequest;
      if (!body.birthDate || !body.gender || !body.currentYear) {
        return Response.json({ error: "missing_fields" }, { status: 400, headers: CORS_HEADERS });
      }

      // Redis cache check
      const hourKey = body.birthHour !== null ? String(body.birthHour) : "x";
      const cacheKey = `astro:reading:${body.birthDate}:${hourKey}:${body.gender}:${body.currentYear}`;
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        return Response.json({ text: cached, cached: true }, { headers: CORS_HEADERS });
      }

      // Check API key before calling OpenAI
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return Response.json({ error: "ai_not_configured" }, { status: 503, headers: CORS_HEADERS });
      }

      // Build prompt and call OpenAI
      const prompt = buildPrompt(body);
      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      if (!text) {
        return Response.json({ error: "empty_response" }, { status: 500, headers: CORS_HEADERS });
      }

      // Cache result for 300 days
      await redis.set(cacheKey, text, { ex: 86400 * 300 });

      return Response.json({ text, cached: false }, { headers: CORS_HEADERS });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        return Response.json({ error: "openai_rate_limited" }, { status: 429, headers: CORS_HEADERS });
      }
      if (status === 503) {
        return Response.json({ error: "ai_unavailable" }, { status: 503, headers: CORS_HEADERS });
      }
      console.error("Astrology reading error:", err);
      return Response.json({ error: "generation_failed" }, { status: 500, headers: CORS_HEADERS });
    }
  },
};

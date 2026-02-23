import { Ratelimit } from "@upstash/ratelimit";
import { createRedis } from "../src/lib/redis";
import { getZodiac, getSoundElement, getStemBranch } from "../src/lib/astrology";

const ZHIPU_URL = "https://api.z.ai/api/paas/v4/chat/completions";
const FETCH_TIMEOUT_MS = 25_000;

function getCorsOrigin(): string {
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (url) return `https://${url}`;
  return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "*";
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": getCorsOrigin(),
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface ReadingRequest {
  birthDate: string;
  birthHour: number | null;
  gender: string;
  currentYear: number;
  lang?: string;
}

/** Map hour (0-23) to Earthly Branch name */
function getHourBranch(hour: number): string {
  const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  const index = Math.floor(((hour + 1) % 24) / 2);
  return branches[index];
}

function buildPrompt(body: ReadingRequest): { system: string; user: string } {
  const lang = body.lang || "vi";
  const year = parseInt(body.birthDate.slice(0, 4));
  const zodiac = getZodiac(year);
  const soundElement = getSoundElement(year);
  const stemBranch = getStemBranch(year);
  const currentStemBranch = getStemBranch(body.currentYear);
  const currentZodiac = getZodiac(body.currentYear);

  const hourLabel = lang === "en"
    ? (body.birthHour !== null ? `${getHourBranch(body.birthHour)} hour` : "Unknown birth hour")
    : (body.birthHour !== null ? `Giờ ${getHourBranch(body.birthHour)}` : "Không rõ giờ sinh");

  const genderLabel = lang === "en"
    ? (body.gender === "female" ? "Female" : "Male")
    : (body.gender === "female" ? "Nữ" : "Nam");

  const system = lang === "en"
    ? `You are a Vietnamese astrology expert with deep knowledge of Earthly Branches (Dia Chi), Heavenly Stems (Thien Can), and Five Elements (Ngu Hanh Nap Am).
Write a personal astrology analysis in fluent English, using traditional Vietnamese terminology with translations in parentheses.
Tone: warm, encouraging, use tendencies rather than absolute predictions.
Length: 400-500 words.`
    : `Bạn là chuyên gia Tử Vi Việt Nam, am hiểu sâu về Địa Chi, Thiên Can, Ngũ Hành Nạp Âm.
Viết bài phân tích tử vi bằng tiếng Việt, dùng thuật ngữ truyền thống với dấu tiếng Việt đầy đủ.
Giọng văn: ấm áp, khích lệ, dùng xu hướng thay vì tiên đoán tuyệt đối.
Độ dài: 400-500 từ.`;

  const user = lang === "en"
    ? `Personal astrology analysis:
- Birth year: ${year} (${stemBranch})
- Zodiac: ${zodiac.name} (${zodiac.chi})
- Nap Am: ${soundElement.name} — ${soundElement.label} element
- Birth hour: ${hourLabel}
- Gender: ${genderLabel}
- Current year: ${body.currentYear} (${currentStemBranch}) — Year of the ${currentZodiac.name}

Write 5 sections:
1. 🔮 Overall fortune for ${body.currentYear}
2. 💕 Love & marriage
3. 💼 Career & wealth
4. 🏥 Health
5. 💡 Special advice`
    : `Phân tích tử vi cá nhân:
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
        const lang = ((await request.clone().json()) as ReadingRequest).lang || "vi";
        return Response.json(
          {
            error: "rate_limited",
            message: lang === "en"
              ? "You've used all your readings for today. Please try again tomorrow."
              : "Bạn đã hết lượt xem hôm nay. Vui lòng thử lại ngày mai.",
          },
          { status: 429, headers: CORS_HEADERS }
        );
      }

      // Parse and validate body
      const body = await request.json() as ReadingRequest;
      if (!body.birthDate || !body.gender || !body.currentYear) {
        return Response.json({ error: "missing_fields" }, { status: 400, headers: CORS_HEADERS });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(body.birthDate)) {
        return Response.json({ error: "invalid_birth_date" }, { status: 400, headers: CORS_HEADERS });
      }
      const birthYear = parseInt(body.birthDate.slice(0, 4));
      if (isNaN(birthYear) || birthYear < 1900 || birthYear > 2100) {
        return Response.json({ error: "invalid_birth_date" }, { status: 400, headers: CORS_HEADERS });
      }
      if (body.birthHour !== null && (typeof body.birthHour !== "number" || body.birthHour < 0 || body.birthHour > 23)) {
        return Response.json({ error: "invalid_birth_hour" }, { status: 400, headers: CORS_HEADERS });
      }
      if (!["male", "female"].includes(body.gender)) {
        return Response.json({ error: "invalid_gender" }, { status: 400, headers: CORS_HEADERS });
      }

      // Redis cache check (include lang to separate cached responses)
      const lang = body.lang || "vi";
      const hourKey = body.birthHour !== null ? String(body.birthHour) : "x";
      const cacheKey = `astro:reading:${body.birthDate}:${hourKey}:${body.gender}:${body.currentYear}:${lang}`;
      const cached = await redis.get<string>(cacheKey);
      if (cached) {
        return Response.json({ text: cached, cached: true }, { headers: CORS_HEADERS });
      }

      // Check API key before calling ZhipuAI
      const apiKey = process.env.Z_AI_KEY;
      if (!apiKey) {
        return Response.json({ error: "ai_not_configured" }, { status: 503, headers: CORS_HEADERS });
      }

      // Build prompt and call ZhipuAI
      const prompt = buildPrompt(body);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      let aiRes: Response;
      try {
        aiRes = await fetch(ZHIPU_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "glm-5",
            messages: [
              { role: "system", content: prompt.system },
              { role: "user", content: prompt.user },
            ],
            max_tokens: 800,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return Response.json({ error: "ai_timeout" }, { status: 504, headers: CORS_HEADERS });
        }
        throw err;
      } finally {
        clearTimeout(timer);
      }

      if (!aiRes.ok) {
        const errText = await aiRes.text();
        console.error("ZhipuAI error:", aiRes.status, errText);
        return Response.json({ error: "generation_failed" }, { status: 502, headers: CORS_HEADERS });
      }

      const data = await aiRes.json() as { choices?: { message?: { content?: string } }[] };
      const text = data.choices?.[0]?.message?.content ?? "";
      if (!text) {
        return Response.json({ error: "empty_response" }, { status: 500, headers: CORS_HEADERS });
      }

      // Cache result for 300 days
      await redis.set(cacheKey, text, { ex: 86400 * 300 });

      return Response.json({ text, cached: false }, { headers: CORS_HEADERS });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        return Response.json({ error: "zhipu_rate_limited" }, { status: 429, headers: CORS_HEADERS });
      }
      if (status === 503) {
        return Response.json({ error: "ai_unavailable" }, { status: 503, headers: CORS_HEADERS });
      }
      console.error("Astrology reading error:", err);
      return Response.json({ error: "generation_failed" }, { status: 500, headers: CORS_HEADERS });
    }
  },
};

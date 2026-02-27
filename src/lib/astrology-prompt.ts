import { getZodiac, getSoundElement, getStemBranch } from "./astrology.js";

function getHourBranch(hour: number): string {
  const branches = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
  return branches[Math.floor(((hour + 1) % 24) / 2)];
}

export interface ReadingInput {
  birthDate: string;
  birthHour: number | null;
  gender: string;
  currentYear: number;
  lang?: string;
}

export function buildAstrologyPrompt(body: ReadingInput): { system: string; user: string } {
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

  const sys = lang === "en"
    ? `You are a Vietnamese astrology expert with deep knowledge of Earthly Branches (Dia Chi), Heavenly Stems (Thien Can), and Five Elements (Ngu Hanh Nap Am).
Write a personal astrology analysis in fluent English, using traditional Vietnamese terminology with translations in parentheses.
Tone: warm, encouraging, use tendencies rather than absolute predictions.
Length: 400-500 words.`
    : `Bạn là chuyên gia Tử Vi Việt Nam, am hiểu sâu về Địa Chi, Thiên Can, Ngũ Hành Nạp Âm.
Viết bài phân tích tử vi bằng tiếng Việt, dùng thuật ngữ truyền thống với dấu tiếng Việt đầy đủ.
Giọng văn: ấm áp, khích lệ, dùng xu hướng thay vì tiên đoán tuyệt đối.
Độ dài: 400-500 từ.`;

  const usr = lang === "en"
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

  return { system: sys, user: usr };
}

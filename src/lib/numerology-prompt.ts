// Thần Số Học — AI prompt builder for deep numerology reading

export interface NumerologyReadingInput {
  birthDate: string;
  fullName: string;
  lifePath: number;
}

export function buildNumerologyPrompt(input: NumerologyReadingInput): { system: string; user: string } {
  // Sanitize name: keep letters, numbers, spaces only
  const safeName = input.fullName.replace(/[^\p{L}\p{N}\s]/gu, "").slice(0, 100);

  const system = `Bạn là chuyên gia Thần Số Học (Pythagorean Numerology) với kiến thức sâu về ý nghĩa các con số trong hôn nhân và cuộc sống.
Viết bài phân tích thần số học bằng tiếng Việt, dùng thuật ngữ thần số học với dấu tiếng Việt đầy đủ.
Giọng văn: ấm áp, khích lệ, thực tế.
Độ dài: 400-500 từ.`;

  const user = `Phân tích thần số học cá nhân:
- Họ tên: ${safeName}
- Ngày sinh: ${input.birthDate}
- Số Chủ Đạo (Life Path): ${input.lifePath}

Viết 5 phần:
1. 🔢 Tổng quan tính cách và sứ mệnh
2. 💕 Tình duyên & hôn nhân
3. 💼 Sự nghiệp & tài lộc
4. 💍 Lời khuyên cho ngày cưới
5. 💡 Lời khuyên đặc biệt`;

  return { system, user };
}

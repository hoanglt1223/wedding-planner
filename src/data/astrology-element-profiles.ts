// Vietnamese Ngũ Hành (Five Elements) personality profiles
// Keys match ELEMENT_LABEL keys in astrology.ts: metal, wood, water, fire, earth
// Colors/numbers reference ELEMENT_COLORS/ELEMENT_NUMBERS/ELEMENT_SEASONS from astrology-feng-shui.ts

export interface ElementProfile {
  key: string;
  label: string;
  emoji: string;
  coreTraits: string[];
  marriageTraits: string;
  healthTendencies: string;
  luckyColors: string[];
  unluckyColors: string[];
  luckyNumbers: number[];
  luckyDirections: string[];
  season: string;
}

export const ELEMENT_PROFILES: ElementProfile[] = [
  {
    key: "metal",
    label: "Kim",
    emoji: "🪙",
    coreTraits: ["Cứng rắn", "Quyết đoán", "Nguyên tắc", "Kiên định"],
    marriageTraits: "Bảo vệ bạn đời mạnh mẽ và trung thành. Đôi khi cứng nhắc, thiếu linh hoạt — cần học cách nhượng bộ trong hôn nhân.",
    healthTendencies: "Cần chú ý phổi, đường hô hấp và da. Nên tập thở sâu, yoga, hạn chế môi trường ô nhiễm.",
    luckyColors: ["Trắng", "Bạc", "Vàng nhạt"],
    unluckyColors: ["Đỏ", "Cam"],
    luckyNumbers: [4, 9],
    luckyDirections: ["Tây", "Tây Bắc"],
    season: "Thu (tháng 7-9 âm lịch)",
  },
  {
    key: "wood",
    label: "Mộc",
    emoji: "🌳",
    coreTraits: ["Nhân từ", "Phát triển", "Sáng tạo", "Kiên trì"],
    marriageTraits: "Nuôi dưỡng và chăm sóc gia đình tận tụy. Là người bạn đời hỗ trợ; cần không gian phát triển cá nhân bên cạnh tình yêu.",
    healthTendencies: "Cần chú ý gan, mật và hệ thần kinh. Nên vận động ngoài trời, ăn uống xanh lành mạnh.",
    luckyColors: ["Xanh lá", "Xanh lục"],
    unluckyColors: ["Trắng", "Xám"],
    luckyNumbers: [3, 8],
    luckyDirections: ["Đông", "Đông Nam"],
    season: "Xuân (tháng 1-3 âm lịch)",
  },
  {
    key: "water",
    label: "Thủy",
    emoji: "💧",
    coreTraits: ["Thông minh", "Linh hoạt", "Giao tiếp tốt", "Đa cảm"],
    marriageTraits: "Thích nghi tốt với bạn đời, tình cảm phong phú và sâu sắc. Dễ bị ảnh hưởng bởi môi trường, cần bạn đời ổn định.",
    healthTendencies: "Cần chú ý thận, bàng quang và hệ tiết niệu. Nên uống đủ nước, giữ ấm cơ thể, tránh ẩm lạnh.",
    luckyColors: ["Đen", "Xanh dương", "Xanh đậm"],
    unluckyColors: ["Vàng", "Nâu"],
    luckyNumbers: [1, 6],
    luckyDirections: ["Bắc"],
    season: "Đông (tháng 10-12 âm lịch)",
  },
  {
    key: "fire",
    label: "Hỏa",
    emoji: "🔥",
    coreTraits: ["Nhiệt huyết", "Năng động", "Lãnh đạo", "Bốc đồng"],
    marriageTraits: "Đam mê và nhiệt tình trong tình yêu, thích làm chủ tình huống. Hôn nhân cần kiểm soát nóng giận và học cách lắng nghe.",
    healthTendencies: "Cần chú ý tim, huyết áp và hệ tuần hoàn. Nên tránh stress, tập thiền, hạn chế đồ cay nóng.",
    luckyColors: ["Đỏ", "Hồng", "Cam", "Tím"],
    unluckyColors: ["Xanh lam", "Đen"],
    luckyNumbers: [2, 7],
    luckyDirections: ["Nam"],
    season: "Hạ (tháng 4-6 âm lịch)",
  },
  {
    key: "earth",
    label: "Thổ",
    emoji: "🪨",
    coreTraits: ["Ổn định", "Đáng tin", "Thực tế", "Kiên nhẫn"],
    marriageTraits: "Người bạn đời đáng tin cậy nhất, ưu tiên an toàn và ổn định gia đình. Hôn nhân bền vững nhưng cần chủ động đổi mới.",
    healthTendencies: "Cần chú ý dạ dày, tỳ vị và hệ tiêu hóa. Nên ăn uống điều độ, tránh lo lắng thái quá, duy trì lối sống đều đặn.",
    luckyColors: ["Vàng", "Nâu", "Be"],
    unluckyColors: ["Xanh lá"],
    luckyNumbers: [2, 5],
    luckyDirections: ["Đông Bắc", "Tây Nam"],
    season: "Giao mùa (cuối mỗi mùa)",
  },
];

/** Get element profile by key ("metal", "wood", "water", "fire", "earth") */
export function getElementProfile(key: string): ElementProfile | undefined {
  return ELEMENT_PROFILES.find((p) => p.key === key);
}

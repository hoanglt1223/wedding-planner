// Phong Thủy calculations: Cung Mệnh (Bát Trạch), hướng nhà, màu sắc, con số

export interface CungMenh {
  number: number;
  name: string;
  hanh: string;
  huong: string;
  group: "Đông Tứ Trạch" | "Tây Tứ Trạch";
}

const CUNG_MAP: Record<number, CungMenh> = {
  1: { number: 1, name: "Khảm", hanh: "Thủy", huong: "Bắc", group: "Đông Tứ Trạch" },
  2: { number: 2, name: "Khôn", hanh: "Thổ", huong: "Tây Nam", group: "Tây Tứ Trạch" },
  3: { number: 3, name: "Chấn", hanh: "Mộc", huong: "Đông", group: "Đông Tứ Trạch" },
  4: { number: 4, name: "Tốn", hanh: "Mộc", huong: "Đông Nam", group: "Đông Tứ Trạch" },
  6: { number: 6, name: "Càn", hanh: "Kim", huong: "Tây Bắc", group: "Tây Tứ Trạch" },
  7: { number: 7, name: "Đoài", hanh: "Kim", huong: "Tây", group: "Tây Tứ Trạch" },
  8: { number: 8, name: "Cấn", hanh: "Thổ", huong: "Đông Bắc", group: "Tây Tứ Trạch" },
  9: { number: 9, name: "Ly", hanh: "Hỏa", huong: "Nam", group: "Đông Tứ Trạch" },
};

const DONG_HUONG = ["Bắc", "Đông", "Đông Nam", "Nam"];
const TAY_HUONG = ["Tây", "Tây Bắc", "Tây Nam", "Đông Bắc"];

function digitSum(year: number): number {
  let s = year;
  while (s >= 10) s = String(s).split("").reduce((a, d) => a + Number(d), 0);
  return s;
}

export function getCungMenh(birthYear: number, gender: "nam" | "nu"): CungMenh {
  const ds = digitSum(birthYear);
  let num: number;
  if (gender === "nam") {
    num = (11 - ds) % 9;
    if (num === 0) num = 9;
    if (num === 5) num = 2; // Nam cung 5 → Khôn
  } else {
    num = (ds + 4) % 9;
    if (num === 0) num = 9;
    if (num === 5) num = 8; // Nữ cung 5 → Cấn
  }
  return CUNG_MAP[num];
}

export function getLuckyDirections(cung: CungMenh): string[] {
  return cung.group === "Đông Tứ Trạch" ? DONG_HUONG : TAY_HUONG;
}

export function getUnluckyDirections(cung: CungMenh): string[] {
  return cung.group === "Đông Tứ Trạch" ? TAY_HUONG : DONG_HUONG;
}

export const HANH_COLORS: Record<string, { colors: string[]; hex: string[] }> = {
  Kim: { colors: ["Trắng", "Bạc", "Vàng nhạt"], hex: ["#f5f5f5", "#c0c0c0", "#ffd700"] },
  Mộc: { colors: ["Xanh lá", "Xanh lục"], hex: ["#4caf50", "#2e7d32"] },
  Thủy: { colors: ["Đen", "Xanh dương", "Xanh đậm"], hex: ["#212121", "#1976d2", "#0d47a1"] },
  Hỏa: { colors: ["Đỏ", "Hồng", "Cam", "Tím"], hex: ["#e53935", "#ec407a", "#ff9800", "#9c27b0"] },
  Thổ: { colors: ["Vàng", "Nâu", "Be"], hex: ["#fbc02d", "#795548", "#d7ccc8"] },
};

export const HANH_NUMBERS: Record<string, number[]> = {
  Kim: [4, 9], Mộc: [3, 8], Thủy: [1, 6], Hỏa: [2, 7], Thổ: [5, 10],
};

export const HANH_SEASONS: Record<string, string> = {
  Kim: "Thu (tháng 7-9 âm lịch)", Mộc: "Xuân (tháng 1-3 âm lịch)",
  Thủy: "Đông (tháng 10-12 âm lịch)", Hỏa: "Hạ (tháng 4-6 âm lịch)",
  Thổ: "Giao mùa (cuối mỗi mùa)",
};

/** Sinh hành to support Mệnh */
export const HANH_SINH_ME: Record<string, string> = {
  Kim: "Thổ", Mộc: "Thủy", Thủy: "Kim", Hỏa: "Mộc", Thổ: "Hỏa",
};

export function isCungHop(cung1: CungMenh, cung2: CungMenh): boolean {
  return cung1.group === cung2.group;
}

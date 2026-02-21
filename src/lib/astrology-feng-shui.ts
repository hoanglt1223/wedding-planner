// Phong Thủy calculations: Cung Mệnh (Bát Trạch), hướng nhà, màu sắc, con số

export interface Palace {
  number: number;
  name: string;
  element: string;
  direction: string;
  group: "east" | "west";
}

export const GROUP_LABEL: Record<string, string> = {
  east: "Đông Tứ Trạch",
  west: "Tây Tứ Trạch",
};

const PALACE_MAP: Record<number, Palace> = {
  1: { number: 1, name: "Khảm", element: "water", direction: "Bắc", group: "east" },
  2: { number: 2, name: "Khôn", element: "earth", direction: "Tây Nam", group: "west" },
  3: { number: 3, name: "Chấn", element: "wood", direction: "Đông", group: "east" },
  4: { number: 4, name: "Tốn", element: "wood", direction: "Đông Nam", group: "east" },
  6: { number: 6, name: "Càn", element: "metal", direction: "Tây Bắc", group: "west" },
  7: { number: 7, name: "Đoài", element: "metal", direction: "Tây", group: "west" },
  8: { number: 8, name: "Cấn", element: "earth", direction: "Đông Bắc", group: "west" },
  9: { number: 9, name: "Ly", element: "fire", direction: "Nam", group: "east" },
};

const EAST_DIRECTIONS = ["Bắc", "Đông", "Đông Nam", "Nam"];
const WEST_DIRECTIONS = ["Tây", "Tây Bắc", "Tây Nam", "Đông Bắc"];

function digitSum(year: number): number {
  let s = year;
  while (s >= 10) s = String(s).split("").reduce((a, d) => a + Number(d), 0);
  return s;
}

export function getCungMenh(birthYear: number, gender: "male" | "female"): Palace {
  const ds = digitSum(birthYear);
  let num: number;
  if (gender === "male") {
    num = (11 - ds) % 9;
    if (num === 0) num = 9;
    if (num === 5) num = 2; // Nam cung 5 → Khôn
  } else {
    num = (ds + 4) % 9;
    if (num === 0) num = 9;
    if (num === 5) num = 8; // Nữ cung 5 → Cấn
  }
  return PALACE_MAP[num];
}

export function getLuckyDirections(cung: Palace): string[] {
  return cung.group === "east" ? EAST_DIRECTIONS : WEST_DIRECTIONS;
}

export function getUnluckyDirections(cung: Palace): string[] {
  return cung.group === "east" ? WEST_DIRECTIONS : EAST_DIRECTIONS;
}

export const ELEMENT_COLORS: Record<string, { colors: string[]; hex: string[] }> = {
  metal: { colors: ["Trắng", "Bạc", "Vàng nhạt"], hex: ["#f5f5f5", "#c0c0c0", "#ffd700"] },
  wood: { colors: ["Xanh lá", "Xanh lục"], hex: ["#4caf50", "#2e7d32"] },
  water: { colors: ["Đen", "Xanh dương", "Xanh đậm"], hex: ["#212121", "#1976d2", "#0d47a1"] },
  fire: { colors: ["Đỏ", "Hồng", "Cam", "Tím"], hex: ["#e53935", "#ec407a", "#ff9800", "#9c27b0"] },
  earth: { colors: ["Vàng", "Nâu", "Be"], hex: ["#fbc02d", "#795548", "#d7ccc8"] },
};

export const ELEMENT_NUMBERS: Record<string, number[]> = {
  metal: [4, 9], wood: [3, 8], water: [1, 6], fire: [2, 7], earth: [5, 10],
};

export const ELEMENT_SEASONS: Record<string, string> = {
  metal: "Thu (tháng 7-9 âm lịch)", wood: "Xuân (tháng 1-3 âm lịch)",
  water: "Đông (tháng 10-12 âm lịch)", fire: "Hạ (tháng 4-6 âm lịch)",
  earth: "Giao mùa (cuối mỗi mùa)",
};

/** Element that generates/supports the destiny element */
export const ELEMENT_GENERATING_ME: Record<string, string> = {
  metal: "earth", wood: "water", water: "metal", fire: "wood", earth: "fire",
};

export function isPalaceCompatible(cung1: Palace, cung2: Palace): boolean {
  return cung1.group === cung2.group;
}

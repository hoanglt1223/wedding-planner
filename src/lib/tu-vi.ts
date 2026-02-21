// Tử Vi Khoa Học — Core calculations
// Can Chi, Ngũ Hành, Nạp Âm, Tam Tai, Thái Tuế, Tam Hợp, Lục Hợp, Kim Lâu

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const CON_GIAP = ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"];
const CON_GIAP_EMOJI = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐴", "🐐", "🐒", "🐓", "🐕", "🐖"];

// Nạp Âm: 30 pairs for 60-year cycle [display name, base element]
const NAP_AM: [string, string][] = [
  ["Hải Trung Kim", "Kim"], ["Lư Trung Hỏa", "Hỏa"], ["Đại Lâm Mộc", "Mộc"],
  ["Lộ Bàng Thổ", "Thổ"], ["Kiếm Phong Kim", "Kim"], ["Sơn Đầu Hỏa", "Hỏa"],
  ["Giản Hạ Thủy", "Thủy"], ["Thành Đầu Thổ", "Thổ"], ["Bạch Lạp Kim", "Kim"],
  ["Dương Liễu Mộc", "Mộc"], ["Tuyền Trung Thủy", "Thủy"], ["Ốc Thượng Thổ", "Thổ"],
  ["Tích Lịch Hỏa", "Hỏa"], ["Tùng Bách Mộc", "Mộc"], ["Trường Lưu Thủy", "Thủy"],
  ["Sa Trung Kim", "Kim"], ["Sơn Hạ Hỏa", "Hỏa"], ["Bình Địa Mộc", "Mộc"],
  ["Bích Thượng Thổ", "Thổ"], ["Kim Bạch Kim", "Kim"], ["Phú Đăng Hỏa", "Hỏa"],
  ["Thiên Hà Thủy", "Thủy"], ["Đại Dịch Thổ", "Thổ"], ["Thoa Xuyến Kim", "Kim"],
  ["Tang Đố Mộc", "Mộc"], ["Đại Khê Thủy", "Thủy"], ["Sa Trung Thổ", "Thổ"],
  ["Thiên Thượng Hỏa", "Hỏa"], ["Thạch Lựu Mộc", "Mộc"], ["Đại Hải Thủy", "Thủy"],
];

export const HANH_EMOJI: Record<string, string> = {
  Kim: "🪙", Mộc: "🌳", Thủy: "💧", Hỏa: "🔥", Thổ: "🪨",
};
export const HANH_COLOR: Record<string, string> = {
  Kim: "text-yellow-600", Mộc: "text-green-600", Thủy: "text-blue-600",
  Hỏa: "text-red-600", Thổ: "text-amber-700",
};
export const HANH_BG: Record<string, string> = {
  Kim: "bg-yellow-50", Mộc: "bg-green-50", Thủy: "bg-blue-50",
  Hỏa: "bg-red-50", Thổ: "bg-amber-50",
};

// Tương Sinh: A sinh B
const SINH: Record<string, string> = {
  Kim: "Thủy", Thủy: "Mộc", Mộc: "Hỏa", Hỏa: "Thổ", Thổ: "Kim",
};
// Tương Khắc: A khắc B
export const KHAC: Record<string, string> = {
  Kim: "Mộc", Mộc: "Thổ", Thổ: "Thủy", Thủy: "Hỏa", Hỏa: "Kim",
};

// Tam Tai groups: birth Chi → 3 calamity Chi values
const TAM_TAI: Record<number, number[]> = {
  8: [2, 3, 4], 0: [2, 3, 4], 4: [2, 3, 4],
  2: [8, 9, 10], 6: [8, 9, 10], 10: [8, 9, 10],
  5: [11, 0, 1], 9: [11, 0, 1], 1: [11, 0, 1],
  11: [5, 6, 7], 3: [5, 6, 7], 7: [5, 6, 7],
};

// Lục Hợp pairs (Chi indices)
const LUC_HOP: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
// Lục Xung pairs
const LUC_XUNG: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
// Lục Hại pairs
const LUC_HAI: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
// Tam Hợp groups (Chi indices)
const TAM_HOP: number[][] = [[8, 0, 4], [2, 6, 10], [5, 9, 1], [11, 3, 7]];

// ─── Basic getters ───
export function getCanIndex(year: number) { return (year + 6) % 10; }
export function getChiIndex(year: number) { return (year + 8) % 12; }
export function getCanChi(year: number) {
  return `${THIEN_CAN[getCanIndex(year)]} ${DIA_CHI[getChiIndex(year)]}`;
}
export function getZodiac(year: number) {
  const i = getChiIndex(year);
  return { name: CON_GIAP[i], emoji: CON_GIAP_EMOJI[i], chi: DIA_CHI[i], chiIndex: i };
}
export function getNapAm(year: number) {
  const pos = ((year - 4) % 60 + 60) % 60;
  const [name, hanh] = NAP_AM[Math.floor(pos / 2)];
  return { name, hanh, emoji: HANH_EMOJI[hanh], color: HANH_COLOR[hanh] };
}
export function getDiaChi(index: number) { return DIA_CHI[index]; }

// ─── Ngũ Hành relations ───
export type CompatType = "tuong-sinh" | "binh-hoa" | "tuong-khac";
export function getHanhRelation(h1: string, h2: string): { type: CompatType; label: string; desc: string } {
  if (h1 === h2) return { type: "binh-hoa", label: "Bình Hòa", desc: "Cùng hành, hài hòa tốt đẹp" };
  if (SINH[h1] === h2) return { type: "tuong-sinh", label: "Tương Sinh", desc: `${h1} sinh ${h2} — rất tốt` };
  if (SINH[h2] === h1) return { type: "tuong-sinh", label: "Tương Sinh", desc: `${h2} sinh ${h1} — rất tốt` };
  return { type: "tuong-khac", label: "Tương Khắc", desc: `${h1} khắc ${h2}` };
}
export function getSinhHanh(hanh: string) { return SINH[hanh]; }

// ─── Tam Tai / Thái Tuế ───
export function isTamTai(birthYear: number, targetYear: number) {
  return TAM_TAI[getChiIndex(birthYear)]?.includes(getChiIndex(targetYear)) ?? false;
}
export function getTamTaiYears(birthYear: number, fromYear: number, count = 6): number[] {
  const results: number[] = [];
  for (let y = fromYear; results.length < count && y < fromYear + 60; y++) {
    if (isTamTai(birthYear, y)) results.push(y);
  }
  return results;
}
export function isThaiTue(birthYear: number, targetYear: number) {
  return getChiIndex(birthYear) === getChiIndex(targetYear);
}
export function isXungThaiTue(birthYear: number, targetYear: number) {
  return (getChiIndex(birthYear) + 6) % 12 === getChiIndex(targetYear);
}

// ─── Tam Hợp / Lục Hợp / Lục Xung / Lục Hại ───
function checkPair(pairs: [number, number][], a: number, b: number) {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}
export function isLucHop(y1: number, y2: number) { return checkPair(LUC_HOP, getChiIndex(y1), getChiIndex(y2)); }
export function isLucXung(y1: number, y2: number) { return checkPair(LUC_XUNG, getChiIndex(y1), getChiIndex(y2)); }
export function isLucHai(y1: number, y2: number) { return checkPair(LUC_HAI, getChiIndex(y1), getChiIndex(y2)); }
export function isTamHop(y1: number, y2: number) {
  const [a, b] = [getChiIndex(y1), getChiIndex(y2)];
  return TAM_HOP.some((g) => g.includes(a) && g.includes(b));
}
export function getTamHopGroup(year: number): string[] {
  const chi = getChiIndex(year);
  const group = TAM_HOP.find((g) => g.includes(chi));
  return group ? group.map((i) => `${CON_GIAP_EMOJI[i]} ${CON_GIAP[i]} (${DIA_CHI[i]})`) : [];
}

// ─── Kim Lâu ───
export function getKimLau(birthYear: number, weddingYear: number) {
  const tuoiMu = weddingYear - birthYear + 1;
  let pos = tuoiMu % 9;
  if (pos === 0) pos = 9;
  const BAD: Record<number, string> = {
    1: "Khắc phu/thê (khắc vợ/chồng)",
    3: "Khắc tự (khắc con cái)",
    6: "Khắc lục thân (khắc gia đạo)",
    8: "Khắc bản thân",
  };
  return { tuoiMu, pos, isKimLau: pos in BAD, desc: BAD[pos] ?? "An toàn" };
}

// ─── Compatible years ───
export function getCompatibleYears(birthYear: number, range = 15) {
  const myHanh = getNapAm(birthYear).hanh;
  const results: { year: number; canChi: string; hanh: string; emoji: string; relation: string }[] = [];
  for (let y = birthYear - range; y <= birthYear + range; y++) {
    if (y === birthYear) continue;
    const na = getNapAm(y);
    const rel = getHanhRelation(myHanh, na.hanh);
    if (rel.type !== "tuong-khac") {
      results.push({ year: y, canChi: getCanChi(y), hanh: na.hanh, emoji: na.emoji, relation: rel.label });
    }
  }
  return results;
}

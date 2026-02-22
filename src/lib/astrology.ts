// Tử Vi Khoa Học — Core calculations
// Can Chi, Ngũ Hành, Nạp Âm, Tam Tai, Thái Tuế, Tam Hợp, Lục Hợp, Kim Lâu

const HEAVENLY_STEMS = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const EARTHLY_BRANCHES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const ZODIAC_ANIMALS = ["Chuột", "Trâu", "Hổ", "Mèo", "Rồng", "Rắn", "Ngựa", "Dê", "Khỉ", "Gà", "Chó", "Lợn"];
const ZODIAC_EMOJIS = ["🐀", "🐂", "🐅", "🐇", "🐉", "🐍", "🐴", "🐐", "🐒", "🐓", "🐕", "🐖"];

// Nạp Âm: 30 pairs for 60-year cycle [display name, base element (Vietnamese)]
const SOUND_ELEMENTS: [string, string][] = [
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

// Map Vietnamese element names to English keys
const VN_TO_EN: Record<string, string> = {
  Kim: "metal", Mộc: "wood", Thủy: "water", Hỏa: "fire", Thổ: "earth",
};

export const ELEMENT_LABEL: Record<string, string> = {
  metal: "Kim", wood: "Mộc", water: "Thủy", fire: "Hỏa", earth: "Thổ",
};

export const ELEMENT_EMOJI: Record<string, string> = {
  metal: "🪙", wood: "🌳", water: "💧", fire: "🔥", earth: "🪨",
};
export const ELEMENT_TEXT_CLASS: Record<string, string> = {
  metal: "text-yellow-600", wood: "text-green-600", water: "text-blue-600",
  fire: "text-red-600", earth: "text-amber-700",
};
export const ELEMENT_BG_CLASS: Record<string, string> = {
  metal: "bg-yellow-50", wood: "bg-green-50", water: "bg-blue-50",
  fire: "bg-red-50", earth: "bg-amber-50",
};

// Tương Sinh: A sinh B
const GENERATING_CYCLE: Record<string, string> = {
  metal: "water", water: "wood", wood: "fire", fire: "earth", earth: "metal",
};
// Tương Khắc: A khắc B
export const OVERCOMING_CYCLE: Record<string, string> = {
  metal: "wood", wood: "earth", earth: "water", water: "fire", fire: "metal",
};

// Tam Tai groups: birth Chi → 3 calamity Chi values
const THREE_DISASTERS: Record<number, number[]> = {
  8: [2, 3, 4], 0: [2, 3, 4], 4: [2, 3, 4],
  2: [8, 9, 10], 6: [8, 9, 10], 10: [8, 9, 10],
  5: [11, 0, 1], 9: [11, 0, 1], 1: [11, 0, 1],
  11: [5, 6, 7], 3: [5, 6, 7], 7: [5, 6, 7],
};

// Lục Hợp pairs (Chi indices)
const SIX_HARMONIES: [number, number][] = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
// Lục Xung pairs
const SIX_CONFLICTS: [number, number][] = [[0, 6], [1, 7], [2, 8], [3, 9], [4, 10], [5, 11]];
// Lục Hại pairs
const SIX_HARMS: [number, number][] = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
// Tam Hợp groups (Chi indices)
const THREE_HARMONIES: number[][] = [[8, 0, 4], [2, 6, 10], [5, 9, 1], [11, 3, 7]];

// ─── Basic getters ───
export function getStemIndex(year: number) { return (year + 6) % 10; }
export function getBranchIndex(year: number) { return (year + 8) % 12; }
export function getStemBranch(year: number) {
  return `${HEAVENLY_STEMS[getStemIndex(year)]} ${EARTHLY_BRANCHES[getBranchIndex(year)]}`;
}
export function getZodiac(year: number) {
  const i = getBranchIndex(year);
  return { name: ZODIAC_ANIMALS[i], emoji: ZODIAC_EMOJIS[i], chi: EARTHLY_BRANCHES[i], chiIndex: i };
}
export function getSoundElement(year: number) {
  const pos = ((year - 4) % 60 + 60) % 60;
  const [name, vnElement] = SOUND_ELEMENTS[Math.floor(pos / 2)];
  const element = VN_TO_EN[vnElement];
  return { name, element, emoji: ELEMENT_EMOJI[element], color: ELEMENT_TEXT_CLASS[element], label: vnElement };
}
export function getEarthlyBranch(index: number) { return EARTHLY_BRANCHES[index]; }

// ─── Ngũ Hành relations ───
export type CompatType = "generating" | "neutral" | "overcoming";
export function getElementRelation(h1: string, h2: string): { type: CompatType; label: string; desc: string } {
  const l1 = ELEMENT_LABEL[h1] ?? h1;
  const l2 = ELEMENT_LABEL[h2] ?? h2;
  if (h1 === h2) return { type: "neutral", label: "Bình Hòa", desc: "Cùng hành, hài hòa tốt đẹp" };
  if (GENERATING_CYCLE[h1] === h2) return { type: "generating", label: "Tương Sinh", desc: `${l1} sinh ${l2} — rất tốt` };
  if (GENERATING_CYCLE[h2] === h1) return { type: "generating", label: "Tương Sinh", desc: `${l2} sinh ${l1} — rất tốt` };
  return { type: "overcoming", label: "Tương Khắc", desc: `${l1} khắc ${l2}` };
}
export function getGeneratingElement(element: string) { return GENERATING_CYCLE[element]; }

// ─── Tam Tai / Thái Tuế ───
export function isThreeDisasters(birthYear: number, targetYear: number) {
  return THREE_DISASTERS[getBranchIndex(birthYear)]?.includes(getBranchIndex(targetYear)) ?? false;
}
export function getThreeDisasterYears(birthYear: number, fromYear: number, count = 6): number[] {
  const results: number[] = [];
  for (let y = fromYear; results.length < count && y < fromYear + 60; y++) {
    if (isThreeDisasters(birthYear, y)) results.push(y);
  }
  return results;
}
export function isGrandDuke(birthYear: number, targetYear: number) {
  return getBranchIndex(birthYear) === getBranchIndex(targetYear);
}
export function isGrandDukeClash(birthYear: number, targetYear: number) {
  return (getBranchIndex(birthYear) + 6) % 12 === getBranchIndex(targetYear);
}

// ─── Tam Hợp / Lục Hợp / Lục Xung / Lục Hại ───
function checkPair(pairs: [number, number][], a: number, b: number) {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}
export function isSixHarmony(y1: number, y2: number) { return checkPair(SIX_HARMONIES, getBranchIndex(y1), getBranchIndex(y2)); }
export function isSixConflict(y1: number, y2: number) { return checkPair(SIX_CONFLICTS, getBranchIndex(y1), getBranchIndex(y2)); }
export function isSixHarm(y1: number, y2: number) { return checkPair(SIX_HARMS, getBranchIndex(y1), getBranchIndex(y2)); }
export function isThreeHarmony(y1: number, y2: number) {
  const [a, b] = [getBranchIndex(y1), getBranchIndex(y2)];
  return THREE_HARMONIES.some((g) => g.includes(a) && g.includes(b));
}
export function getThreeHarmonyGroup(year: number): string[] {
  const chi = getBranchIndex(year);
  const group = THREE_HARMONIES.find((g) => g.includes(chi));
  return group ? group.map((i) => `${ZODIAC_EMOJIS[i]} ${ZODIAC_ANIMALS[i]} (${EARTHLY_BRANCHES[i]})`) : [];
}

// ─── Kim Lâu ───
export function getGoldenLock(birthYear: number, weddingYear: number) {
  const lunarAge = weddingYear - birthYear + 1;
  let pos = lunarAge % 9;
  if (pos === 0) pos = 9;
  const BAD: Record<number, string> = {
    1: "Khắc phu/thê (khắc vợ/chồng)",
    3: "Khắc tự (khắc con cái)",
    6: "Khắc lục thân (khắc gia đạo)",
    8: "Khắc bản thân",
  };
  return { lunarAge, pos, isKimLau: pos in BAD, desc: BAD[pos] ?? "An toàn" };
}

// ─── Compatible years ───
export function getCompatibleYears(birthYear: number, range = 15) {
  const myElement = getSoundElement(birthYear).element;
  const results: { year: number; stemBranch: string; element: string; emoji: string; relation: string }[] = [];
  for (let y = birthYear - range; y <= birthYear + range; y++) {
    if (y === birthYear) continue;
    const na = getSoundElement(y);
    const rel = getElementRelation(myElement, na.element);
    if (rel.type !== "overcoming") {
      results.push({ year: y, stemBranch: getStemBranch(y), element: na.element, emoji: na.emoji, relation: rel.label });
    }
  }
  return results;
}

/** Extract birth year from "YYYY-MM-DD" date string, returns 0 if invalid */
export function getBirthYear(birthDate: string): number {
  if (!birthDate || birthDate.length < 4) return 0;
  return parseInt(birthDate.slice(0, 4)) || 0;
}

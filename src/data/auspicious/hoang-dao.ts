// Hoàng Đạo / Hắc Đạo calculation
// 12 celestial officials cycle, 6 auspicious (indices 0,1,4,5,7,10)

const HOANG_DAO_INDICES = new Set([0, 1, 4, 5, 7, 10]);

// Month start Chi for Thanh Long (index 0 of cycle)
// Months 1&7=Tý(0), 2&8=Dần(2), 3&9=Thìn(4), 4&10=Ngọ(6), 5&11=Thân(8), 6&12=Tuất(10)
const MONTH_START_CHI = [0, 2, 4, 6, 8, 10, 0, 2, 4, 6, 8, 10];

export function isHoangDao(lunarMonth: number, dayChiIndex: number): boolean {
  const monthOffset = MONTH_START_CHI[(lunarMonth - 1) % 12];
  const thanIndex = (dayChiIndex - monthOffset + 12) % 12;
  return HOANG_DAO_INDICES.has(thanIndex);
}

// Names of 12 celestial officials (for detail display)
export const CELESTIAL_NAMES = [
  "Thanh Long",
  "Minh Đường",
  "Thiên Hình",
  "Chu Tước",
  "Kim Quỹ",
  "Bảo Quang",
  "Bạch Hổ",
  "Ngọc Đường",
  "Thiên Lao",
  "Nguyên Vũ",
  "Tư Mệnh",
  "Câu Trần",
];

export function getCelestialName(lunarMonth: number, dayChiIndex: number): string {
  const monthOffset = MONTH_START_CHI[(lunarMonth - 1) % 12];
  const thanIndex = (dayChiIndex - monthOffset + 12) % 12;
  return CELESTIAL_NAMES[thanIndex];
}

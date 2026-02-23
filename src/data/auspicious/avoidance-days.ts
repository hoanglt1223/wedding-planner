const TAM_NUONG = new Set([3, 7, 13, 18, 22, 27]);
const NGUYET_KY = new Set([5, 14, 23]);

export function isTamNuong(lunarDay: number): boolean {
  return TAM_NUONG.has(lunarDay);
}

export function isNguyetKy(lunarDay: number): boolean {
  return NGUYET_KY.has(lunarDay);
}

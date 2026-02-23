import type { DateInfo, MonthData } from "./types";
import { toLunar, getDayCanChiStr, getDayChiIndex } from "./lunar-service";
import { isHoangDao, getCelestialName } from "./hoang-dao";
import { isTamNuong, isNguyetKy } from "./avoidance-days";

export function getDateInfo(day: number, month: number, year: number, lang = "vi"): DateInfo {
  const lunar = toLunar(day, month, year);
  const canChi = getDayCanChiStr(day, month, year);
  const dayChiIdx = getDayChiIndex(day, month, year);

  const tamNuong = isTamNuong(lunar.day);
  const nguyetKy = isNguyetKy(lunar.day);
  const hoangDao = isHoangDao(lunar.month, dayChiIdx);
  const en = lang === "en";

  const reasons: string[] = [];
  let level: "good" | "neutral" | "avoid" = "neutral";

  if (tamNuong) {
    reasons.push(en ? "Tam Nuong Day — avoid weddings" : "Ngày Tam Nương — kiêng cưới hỏi");
    level = "avoid";
  }
  if (nguyetKy) {
    reasons.push(en ? "Nguyet Ky Day — avoid new undertakings" : "Ngày Nguyệt Kỵ — không nên khởi sự");
    if (level !== "avoid") level = "avoid";
  }
  if (!tamNuong && !nguyetKy && hoangDao) {
    reasons.push(en
      ? `Hoang Dao Day (${getCelestialName(lunar.month, dayChiIdx)})`
      : `Ngày Hoàng Đạo (${getCelestialName(lunar.month, dayChiIdx)})`);
    level = "good";
  }
  if (!tamNuong && !nguyetKy && !hoangDao) {
    reasons.push(en ? "Hac Dao Day" : "Ngày Hắc Đạo");
    level = "neutral";
  }

  return {
    solar: { day, month, year },
    lunar: { day: lunar.day, month: lunar.month, year: lunar.year, leap: lunar.leap },
    canChi,
    isHoangDao: hoangDao,
    isTamNuong: tamNuong,
    isNguyetKy: nguyetKy,
    auspiciousLevel: level,
    reasons,
  };
}

export function getMonthData(month: number, year: number, lang = "vi"): MonthData {
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: DateInfo[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(getDateInfo(d, month, year, lang));
  }

  return { year, month, days, firstDayOfWeek: firstDay.getDay() };
}

export { getElement, getCompatibility, getElementEmoji, getElementNameEn } from "./ngu-hanh";
export type { DateInfo, MonthData, ElementCompatibility } from "./types";

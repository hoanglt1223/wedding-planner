// Wrapper around @min98/vnlunar for comprehensive lunar calendar data
import {
  getFullInfo,
  get_lunar_date,
  get_can_chi,
  get_auspicious_hours,
  get_day_of_week,
  CAN, CHI, CHI_ANIMALS, WEEKDAYS, SOLAR_TERMS,
} from "@min98/vnlunar";
import type {
  FullDateInfo,
  LunarDate,
  Star12Info,
  God12Info,
  Construction12Info,
  Mansion28Info,
  NayinInfo,
  DayTypeInfo,
  GodDirectionInfo,
  ConflictingAgeInfo,
  DirectionInfo,
} from "@min98/vnlunar";

export type {
  FullDateInfo,
  LunarDate,
  Star12Info,
  God12Info,
  Construction12Info,
  Mansion28Info,
  NayinInfo,
  DayTypeInfo,
  GodDirectionInfo,
  ConflictingAgeInfo,
  DirectionInfo,
};

export { CAN, CHI, CHI_ANIMALS, WEEKDAYS, SOLAR_TERMS };

// Get full lunar info for a solar date
export function getLunarInfo(day: number, month: number, year: number): FullDateInfo {
  return getFullInfo(day, month, year);
}

// Get lunar date only (lighter call)
export function getLunarDateOnly(day: number, month: number, year: number): LunarDate {
  return get_lunar_date(day, month, year);
}

// Get Can Chi for a date (requires LunarDate)
export function getCanChi(day: number, month: number, year: number) {
  const lunar = get_lunar_date(day, month, year);
  return get_can_chi(lunar);
}

// Get auspicious hours string (requires jd from lunar date)
export function getAuspiciousHours(day: number, month: number, year: number): string {
  const lunar = get_lunar_date(day, month, year);
  return get_auspicious_hours(lunar.jd);
}

// Get day of week in Vietnamese (requires jd)
export function getDayOfWeek(day: number, month: number, year: number): string {
  const lunar = get_lunar_date(day, month, year);
  return get_day_of_week(lunar.jd);
}

// Generate all dates for a month with basic lunar info
export interface MonthDayInfo {
  day: number;
  month: number;
  year: number;
  lunar: LunarDate;
  dayOfWeek: number; // 0=Sun
}

export function getMonthDays(month: number, year: number): MonthDayInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: MonthDayInfo[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const lunar = get_lunar_date(d, month, year);
    const dow = new Date(year, month - 1, d).getDay();
    result.push({ day: d, month, year, lunar, dayOfWeek: dow });
  }
  return result;
}

// Lunar month names in Vietnamese
const LUNAR_MONTH_NAMES = [
  "Giêng", "Hai", "Ba", "Tư", "Năm", "Sáu",
  "Bảy", "Tám", "Chín", "Mười", "Một (11)", "Chạp",
];

export function getLunarMonthName(lunarMonth: number): string {
  return LUNAR_MONTH_NAMES[(lunarMonth - 1) % 12] || `${lunarMonth}`;
}

// Element emoji mapping
const ELEMENT_EMOJI: Record<string, string> = {
  "Thủy": "💧", "Hỏa": "🔥", "Mộc": "🌳", "Kim": "⚔️", "Thổ": "🏔️",
};

export function getElementEmoji(element: string): string {
  return ELEMENT_EMOJI[element] || "☯";
}

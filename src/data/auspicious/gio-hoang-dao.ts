// Gio Hoang Dao (Auspicious Hours) calculation
// Same 12-celestial-official cycle as Hoang Dao days, but applied to 2-hour periods
// The starting position depends on the day's Earthly Branch (Chi)

import { CELESTIAL_NAMES } from "./hoang-dao";

const HOANG_DAO_INDICES = new Set([0, 1, 4, 5, 7, 10]);

// Each Chi of the day starts Thanh Long at a specific hour Chi
// Day Chi -> Hour Chi where Thanh Long (index 0) begins
// Tý/Ngọ->Tý(0), Sửu/Mùi->Dần(2), Dần/Thân->Thìn(4),
// Mão/Dậu->Ngọ(6), Thìn/Tuất->Thân(8), Tỵ/Hợi->Tuất(10)
const DAY_CHI_TO_START: number[] = [0, 2, 4, 6, 8, 10, 0, 2, 4, 6, 8, 10];

const CHI_NAMES = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
const HOUR_RANGES = [
  "23:00-01:00", "01:00-03:00", "03:00-05:00", "05:00-07:00",
  "07:00-09:00", "09:00-11:00", "11:00-13:00", "13:00-15:00",
  "15:00-17:00", "17:00-19:00", "19:00-21:00", "21:00-23:00",
];

export interface HourInfo {
  chiIndex: number;
  chiName: string;
  timeRange: string;
  isHoangDao: boolean;
  celestialName: string;
  /** Only Hoang Dao hours suitable for weddings (daytime: Dần-Tuất, skip Tý/Sửu/Hợi) */
  suitableForWedding: boolean;
}

export function getHoangDaoHours(dayChiIndex: number): HourInfo[] {
  const startChi = DAY_CHI_TO_START[dayChiIndex];
  const hours: HourInfo[] = [];

  for (let i = 0; i < 12; i++) {
    const thanIndex = (i - startChi + 12) % 12;
    const isHD = HOANG_DAO_INDICES.has(thanIndex);
    // Suitable for wedding: Hoang Dao + daytime hours (Dần=2 through Tuất=10, skip Tý=0, Sửu=1, Hợi=11)
    const isDaytime = i >= 2 && i <= 10;
    hours.push({
      chiIndex: i,
      chiName: CHI_NAMES[i],
      timeRange: HOUR_RANGES[i],
      isHoangDao: isHD,
      celestialName: CELESTIAL_NAMES[thanIndex],
      suitableForWedding: isHD && isDaytime,
    });
  }

  return hours;
}

/** Get only daytime Hoang Dao hours suitable for wedding ceremonies */
export function getWeddingHours(dayChiIndex: number): HourInfo[] {
  return getHoangDaoHours(dayChiIndex).filter((h) => h.suitableForWedding);
}

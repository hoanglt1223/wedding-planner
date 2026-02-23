import { getLunarDate, getDayCanChi, CHI } from "@dqcai/vn-lunar";

export interface LunarDateResult {
  day: number;
  month: number;
  year: number;
  leap: boolean;
  jd: number;
}

export function toLunar(day: number, month: number, year: number): LunarDateResult {
  const result = getLunarDate(day, month, year);
  return {
    day: result.day,
    month: result.month,
    year: result.year,
    leap: result.leap,
    jd: result.jd,
  };
}

export function getDayCanChiStr(day: number, month: number, year: number): string {
  const lunar = getLunarDate(day, month, year);
  return getDayCanChi(lunar.jd);
}

export function getDayChiIndex(day: number, month: number, year: number): number {
  const canChiStr = getDayCanChiStr(day, month, year);
  const parts = canChiStr.split(" ");
  const chi = parts[parts.length - 1];
  const idx = CHI.indexOf(chi);
  return idx >= 0 ? idx : 0;
}

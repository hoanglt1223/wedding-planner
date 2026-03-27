// Wedding Day Scoring — composite score combining base day quality + personal factors
import type { DateInfo } from "./types";
import { getElement, getCompatibility } from "./ngu-hanh";
import { isThreeDisasters, isGrandDuke, isGrandDukeClash, getGoldenLock } from "@/lib/astrology";
import { getDayChiIndex } from "./lunar-service";
import { getWeddingHours } from "./gio-hoang-dao";

export interface ScoredDate extends DateInfo {
  score: number;            // 0-100 composite
  personalWarnings: string[];
  elementMatch: string;     // "tuong-sinh" | "tuong-khac" | "neutral"
  weddingHourCount: number; // number of suitable Hoang Dao hours
}

export interface ScoringInput {
  brideYear: number;
  groomYear: number;
  weddingYear: number;
  lang?: string;
}

/**
 * Score a single date for wedding suitability, combining:
 * - Base day quality (Hoang Dao, Tam Nuong, Nguyet Ky)
 * - Personal element match (couple's Ngu Hanh vs day)
 * - Year-level penalties (Tam Tai, Thai Tue, Kim Lau)
 * - Available auspicious hours
 */
export function scoreDate(dateInfo: DateInfo, input: ScoringInput): ScoredDate {
  const { brideYear, groomYear, weddingYear } = input;
  const en = input.lang === "en";
  const warnings: string[] = [];
  let score = 50; // base

  // --- Base day quality (±30) ---
  if (dateInfo.isTamNuong) {
    score -= 40;
    // warning already in dateInfo.reasons
  }
  if (dateInfo.isNguyetKy) {
    score -= 30;
  }
  if (dateInfo.isHoangDao) {
    score += 30;
  } else if (!dateInfo.isTamNuong && !dateInfo.isNguyetKy) {
    score -= 10; // Hac Dao mild penalty
  }

  // --- Personal year-level factors (±20 total) ---
  if (isThreeDisasters(brideYear, weddingYear)) {
    score -= 10;
    warnings.push(en ? "Bride: Tam Tai year" : "Cô dâu: Năm Tam Tai");
  }
  if (isThreeDisasters(groomYear, weddingYear)) {
    score -= 10;
    warnings.push(en ? "Groom: Tam Tai year" : "Chú rể: Năm Tam Tai");
  }
  if (isGrandDuke(brideYear, weddingYear) || isGrandDukeClash(brideYear, weddingYear)) {
    score -= 5;
    warnings.push(en ? "Bride: Thai Tue conflict" : "Cô dâu: Phạm/Xung Thái Tuế");
  }
  if (isGrandDuke(groomYear, weddingYear) || isGrandDukeClash(groomYear, weddingYear)) {
    score -= 5;
    warnings.push(en ? "Groom: Thai Tue conflict" : "Chú rể: Phạm/Xung Thái Tuế");
  }
  const brideKL = getGoldenLock(brideYear, weddingYear);
  const groomKL = getGoldenLock(groomYear, weddingYear);
  if (brideKL.isKimLau) {
    score -= 5;
    warnings.push(en ? `Bride: Kim Lau (${brideKL.desc})` : `Cô dâu: Kim Lâu (${brideKL.desc})`);
  }
  if (groomKL.isKimLau) {
    score -= 5;
    warnings.push(en ? `Groom: Kim Lau (${groomKL.desc})` : `Chú rể: Kim Lâu (${groomKL.desc})`);
  }

  // --- Ngu Hanh element match (+10) ---
  const brideEl = getElement(brideYear);
  const groomEl = getElement(groomYear);
  const compat = getCompatibility(brideEl, groomEl);
  let elementMatch = compat.relationship;
  if (compat.favorable) score += 5;
  else score -= 5;

  // --- Auspicious hours bonus (+10) ---
  const dayChiIdx = getDayChiIndex(
    dateInfo.solar.day, dateInfo.solar.month, dateInfo.solar.year,
  );
  const weddingHours = getWeddingHours(dayChiIdx);
  const hourCount = weddingHours.length;
  if (hourCount >= 3) score += 10;
  else if (hourCount >= 2) score += 5;

  return {
    ...dateInfo,
    score: Math.max(0, Math.min(100, score)),
    personalWarnings: warnings,
    elementMatch,
    weddingHourCount: hourCount,
  };
}

/** Score all dates in a month */
export function scoreMonth(
  days: DateInfo[],
  input: ScoringInput,
): ScoredDate[] {
  return days.map((d) => scoreDate(d, input));
}

/** Get top N best dates from scored array */
export function getTopDates(scored: ScoredDate[], n = 5): ScoredDate[] {
  return [...scored]
    .filter((d) => d.auspiciousLevel !== "avoid")
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

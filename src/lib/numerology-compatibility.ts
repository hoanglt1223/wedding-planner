// Thần Số Học — Couple Compatibility & Wedding Date Scoring

import type { NumerologyProfile } from "./numerology";
import { calcUniversalDayNumber, reduceToSingleDigit } from "./numerology";

export interface CompatibilityResult {
  score: number; // 0-100
  level: "excellent" | "good" | "moderate" | "challenging";
  breakdown: { label: string; weight: number; harmony: number }[];
}

// Complementary number pairs (high harmony)
const COMPLEMENTARY_PAIRS = new Set([
  "1-2", "1-5", "1-9", "2-6", "2-8", "3-5", "3-6", "3-9",
  "4-6", "4-8", "5-7", "6-9", "7-9",
]);

function pairKey(a: number, b: number): string {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

function numberHarmony(a: number, b: number): number {
  if (a === b) return 100;
  const rA = a > 9 ? reduceToSingleDigit(a) : a;
  const rB = b > 9 ? reduceToSingleDigit(b) : b;
  if (rA === rB) return 90;
  if (COMPLEMENTARY_PAIRS.has(pairKey(rA, rB))) return 80;
  return 50;
}

const WEIGHTS: { label: string; key: keyof NumerologyProfile; weight: number }[] = [
  { label: "Số Chủ Đạo", key: "lifePath", weight: 0.4 },
  { label: "Số Biểu Đạt", key: "expression", weight: 0.2 },
  { label: "Số Linh Hồn", key: "soulUrge", weight: 0.2 },
  { label: "Số Ngày Sinh", key: "birthday", weight: 0.1 },
  { label: "Số Năm", key: "personalYear", weight: 0.1 },
];

/** Calculate weighted compatibility score between two profiles */
export function calcCompatibility(
  profile1: NumerologyProfile,
  profile2: NumerologyProfile,
): CompatibilityResult {
  const breakdown = WEIGHTS.map(({ label, key, weight }) => ({
    label,
    weight: Math.round(weight * 100),
    harmony: numberHarmony(profile1[key] as number, profile2[key] as number),
  }));

  const score = Math.round(
    breakdown.reduce((s, b) => s + b.harmony * (b.weight / 100), 0),
  );

  const level: CompatibilityResult["level"] =
    score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 55 ? "moderate" : "challenging";

  return { score, level, breakdown };
}

export interface WeddingDateScore {
  score: number;
  universalDay: number;
  harmony1: number;
  harmony2: number;
}

/** Score a wedding date against both partners' Life Path numbers */
export function calcWeddingDateScore(
  dateStr: string,
  lifePath1: number,
  lifePath2: number,
): WeddingDateScore {
  const universalDay = calcUniversalDayNumber(dateStr);
  const harmony1 = numberHarmony(universalDay, lifePath1);
  const harmony2 = numberHarmony(universalDay, lifePath2);
  const score = Math.round(harmony1 * 0.5 + harmony2 * 0.5);
  return { score, universalDay, harmony1, harmony2 };
}

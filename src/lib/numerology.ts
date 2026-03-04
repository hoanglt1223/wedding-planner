// Thần Số Học — Pythagorean Numerology Engine
// Core calculations: Life Path, Expression, Soul Urge, Personality, Birthday,
// Personal Year, Maturity, Challenge, Universal Day Number

// Pythagorean letter-to-number map: A=1..I=9, J=1..R=9, S=1..Z=8
const PYTHAGOREAN_MAP: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);
const MASTER_NUMBERS = new Set([11, 22, 33]);

/** Strip Vietnamese diacritics: Đ→D, đ→d, then NFD normalize */
export function stripDiacritics(text: string): string {
  return text
    .replace(/Đ/g, "D")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sumDigits(n: number): number {
  let s = 0;
  const abs = Math.abs(n);
  for (const ch of String(abs)) s += Number(ch);
  return s;
}

/** Reduce to single digit, preserving master numbers 11/22/33 */
export function reduceToSingleDigit(n: number): number {
  let val = Math.abs(n);
  while (val > 9 && !MASTER_NUMBERS.has(val)) {
    val = sumDigits(val);
  }
  return val;
}

function letterValue(char: string): number {
  return PYTHAGOREAN_MAP[char.toUpperCase()] ?? 0;
}

function prepareLetters(fullName: string): string {
  return stripDiacritics(fullName).toUpperCase().replace(/[^A-Z]/g, "");
}

/** Life Path: reduce month, day, year separately, then sum and reduce */
export function calcLifePath(birthDate: string): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  if (!y || !m || !d) return 0;
  const rMonth = reduceToSingleDigit(m);
  const rDay = reduceToSingleDigit(d);
  const rYear = reduceToSingleDigit(y);
  return reduceToSingleDigit(rMonth + rDay + rYear);
}

/** Expression (Destiny): sum all letters of full name */
export function calcExpression(fullName: string): number {
  const letters = prepareLetters(fullName);
  if (!letters) return 0;
  const total = [...letters].reduce((s, ch) => s + letterValue(ch), 0);
  return reduceToSingleDigit(total);
}

/** Soul Urge (Heart's Desire): sum vowels only */
export function calcSoulUrge(fullName: string): number {
  const letters = prepareLetters(fullName);
  if (!letters) return 0;
  const total = [...letters].filter((ch) => VOWELS.has(ch)).reduce((s, ch) => s + letterValue(ch), 0);
  return reduceToSingleDigit(total);
}

/** Personality: sum consonants only */
export function calcPersonality(fullName: string): number {
  const letters = prepareLetters(fullName);
  if (!letters) return 0;
  const total = [...letters].filter((ch) => !VOWELS.has(ch)).reduce((s, ch) => s + letterValue(ch), 0);
  return reduceToSingleDigit(total);
}

/** Birthday Number: reduce day of birth */
export function calcBirthday(birthDate: string): number {
  const day = parseInt(birthDate.split("-")[2]);
  if (!day) return 0;
  return reduceToSingleDigit(day);
}

/** Personal Year: birth month + birth day + target year digits */
export function calcPersonalYear(birthDate: string, year?: number): number {
  const [, m, d] = birthDate.split("-").map(Number);
  if (!m || !d) return 0;
  const targetYear = year ?? new Date().getFullYear();
  return reduceToSingleDigit(
    reduceToSingleDigit(m) + reduceToSingleDigit(d) + reduceToSingleDigit(targetYear),
  );
}

/** Maturity Number: Life Path + Expression, reduced */
export function calcMaturity(lifePath: number, expression: number): number {
  return reduceToSingleDigit(lifePath + expression);
}

/** Challenge Numbers: 4 numbers from differences of birth date parts */
export function calcChallenge(birthDate: string): number[] {
  const [y, m, d] = birthDate.split("-").map(Number);
  if (!y || !m || !d) return [0, 0, 0, 0];
  const rM = reduceToSingleDigit(m);
  const rD = reduceToSingleDigit(d);
  const rY = reduceToSingleDigit(y);
  const c1 = Math.abs(rM - rD);
  const c2 = Math.abs(rD - rY);
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(rM - rY);
  return [c1, c2, c3, c4];
}

export interface NumerologyProfile {
  lifePath: number;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
  personalMonth: number;
  maturity: number;
  challenges: number[];
}

/** Calculate all 8 core numbers from birth date + full name */
export function calcFullProfile(birthDate: string, fullName: string, year?: number): NumerologyProfile {
  const lifePath = calcLifePath(birthDate);
  const expression = calcExpression(fullName);
  return {
    lifePath,
    expression,
    soulUrge: calcSoulUrge(fullName),
    personality: calcPersonality(fullName),
    birthday: calcBirthday(birthDate),
    personalYear: calcPersonalYear(birthDate, year),
    personalMonth: calcPersonalMonth(birthDate, year),
    maturity: calcMaturity(lifePath, expression),
    challenges: calcChallenge(birthDate),
  };
}

/** Personal Month: Personal Year + calendar month, reduced */
export function calcPersonalMonth(birthDate: string, year?: number, month?: number): number {
  const targetYear = year ?? new Date().getFullYear();
  const targetMonth = month ?? (new Date().getMonth() + 1);
  const py = calcPersonalYear(birthDate, targetYear);
  return reduceToSingleDigit(py + reduceToSingleDigit(targetMonth));
}

/** Universal Day Number: reduce full date (day + month + year) */
export function calcUniversalDayNumber(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return 0;
  return reduceToSingleDigit(
    reduceToSingleDigit(d) + reduceToSingleDigit(m) + reduceToSingleDigit(y),
  );
}

/** Get locale string by language */
export function getLocale(lang: string): string {
  return lang === "en" ? "en-US" : "vi-VN";
}

/** Get currency suffix by language */
export function getCurrencySymbol(lang: string): string {
  return lang === "en" ? " VND" : "đ";
}

/** Format number as locale string (e.g. 200,000,000 or 200.000.000) */
export function formatMoney(n: number, lang = "vi"): string {
  return new Intl.NumberFormat(getLocale(lang)).format(Math.round(n));
}

/** Format number in short form (e.g. 200tr/200M, 1tỷ/1B, 500k) */
export function formatShort(n: number, lang = "vi"): string {
  if (lang === "en") {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
    return String(n);
  }
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + "tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "tr";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return String(n);
}

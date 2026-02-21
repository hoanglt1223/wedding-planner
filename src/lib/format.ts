/** Format number as vi-VN locale (e.g. 200.000.000) */
export function formatMoney(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}

/** Format number in short form (e.g. 200tr, 1tỷ, 500k) */
export function formatShort(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(".0", "") + "tỷ";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(".0", "") + "tr";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "k";
  return String(n);
}

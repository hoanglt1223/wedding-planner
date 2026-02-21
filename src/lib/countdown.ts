export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  passed: boolean;
}

export function getCountdown(dateStr: string): CountdownResult | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, passed: true };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes, passed: false };
}

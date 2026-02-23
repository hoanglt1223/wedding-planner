export interface DateInfo {
  solar: { day: number; month: number; year: number };
  lunar: { day: number; month: number; year: number; leap: boolean };
  canChi: string;
  isHoangDao: boolean;
  isTamNuong: boolean;
  isNguyetKy: boolean;
  auspiciousLevel: "good" | "neutral" | "avoid";
  reasons: string[];
}

export interface MonthData {
  year: number;
  month: number;
  days: DateInfo[];
  firstDayOfWeek: number; // 0=Sun..6=Sat
}

export interface ElementCompatibility {
  brideElement: string;
  groomElement: string;
  relationship: "tuong-sinh" | "tuong-khac" | "neutral";
  description: string;
  favorable: boolean;
}

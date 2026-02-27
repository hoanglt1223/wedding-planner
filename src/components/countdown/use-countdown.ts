import { useState, useEffect } from "react";

export type CountdownStatus = "no-date" | "counting" | "today" | "past";

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: CountdownStatus;
}

function computeCountdown(weddingDate: string): CountdownValues {
  if (!weddingDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "no-date" };
  }

  const target = Date.parse(weddingDate);
  if (isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "no-date" };
  }

  const now = Date.now();
  const targetDate = new Date(weddingDate);
  const nowDate = new Date(now);
  const isToday =
    targetDate.getFullYear() === nowDate.getFullYear() &&
    targetDate.getMonth() === nowDate.getMonth() &&
    targetDate.getDate() === nowDate.getDate();

  if (isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "today" };
  }

  const diffMs = target - now;
  if (diffMs < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "past" };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, status: "counting" };
}

export function useCountdown(weddingDate: string): CountdownValues {
  const [values, setValues] = useState<CountdownValues>(() =>
    computeCountdown(weddingDate)
  );

  useEffect(() => {
    // Tick immediately on mount or when weddingDate changes via interval callback
    const interval = setInterval(() => {
      setValues(computeCountdown(weddingDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  return values;
}

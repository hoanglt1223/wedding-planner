import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { getCountdown, type CountdownResult } from "@/lib/countdown";

interface HeaderProps {
  progressPct: number;
  done: number;
  total: number;
  weddingDate: string;
}

export function Header({ progressPct, done, total, weddingDate }: HeaderProps) {
  const [countdown, setCountdown] = useState<CountdownResult | null>(() =>
    getCountdown(weddingDate)
  );

  useEffect(() => {
    setCountdown(getCountdown(weddingDate));
    const id = setInterval(() => {
      setCountdown(getCountdown(weddingDate));
    }, 60000);
    return () => clearInterval(id);
  }, [weddingDate]);

  return (
    <header className="text-center px-3 py-5 pb-4 bg-gradient-to-br from-[#8b1a2b] to-[#c0392b] text-white rounded-b-2xl mb-3">
      <h1 className="text-[clamp(1.3rem,4vw,1.9rem)] font-bold">
        Vietnamese Wedding Planner
      </h1>
      <div className="mt-2 mb-0.5">
        <Progress value={progressPct} className="h-[7px] bg-white/20" />
      </div>
      <div className="text-[0.72rem] opacity-75 text-right">
        {progressPct}% ({done}/{total})
      </div>
      {countdown && (
        <div className="text-[0.78rem] text-white/85 mt-1 text-center">
          {countdown.passed
            ? "Chuc mung ngay cuoi!"
            : `Con ${countdown.days} ngay ${countdown.hours} gio ${countdown.minutes} phut nua`}
        </div>
      )}
    </header>
  );
}

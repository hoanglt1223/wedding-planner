import { useState } from "react";
import { DAILY_TIPS } from "@/data/daily-tips";
import { DAILY_TIPS_EN } from "@/data/daily-tips.en";

function getDayOfYear() {
  return Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
}

interface DailyTipProps {
  lang?: string;
}

export function DailyTip({ lang = "vi" }: DailyTipProps) {
  const tips = lang === "en" ? DAILY_TIPS_EN : DAILY_TIPS;
  const [dayOfYear] = useState(getDayOfYear);
  const tip = tips[dayOfYear % tips.length];

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      <p className="text-xs font-semibold text-muted-foreground mb-1">
        {lang === "en" ? "Daily Tip" : "Mẹo hôm nay"}
      </p>
      <div className="flex items-start gap-2">
        <span className="text-xl shrink-0">{tip.icon}</span>
        <p className="text-sm leading-relaxed">{tip.text}</p>
      </div>
    </div>
  );
}

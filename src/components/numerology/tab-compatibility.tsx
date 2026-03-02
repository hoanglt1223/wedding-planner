import { useMemo } from "react";
import type { NumerologyProfile } from "@/lib/numerology";
import { calcCompatibility } from "@/lib/numerology-compatibility";
import { getNumberHarmony } from "@/data/numerology-compatibility";

interface TabCompatibilityProps {
  profile1: NumerologyProfile;
  profile2: NumerologyProfile;
  brideName: string;
  groomName: string;
}

const LEVEL_CONFIG = {
  excellent: { color: "text-green-600", bg: "bg-green-100", ring: "border-green-500", label: "Rất tương hợp" },
  good: { color: "text-blue-600", bg: "bg-blue-100", ring: "border-blue-500", label: "Tương hợp" },
  moderate: { color: "text-amber-600", bg: "bg-amber-100", ring: "border-amber-500", label: "Trung bình" },
  challenging: { color: "text-red-600", bg: "bg-red-100", ring: "border-red-500", label: "Thách thức" },
};

export function TabCompatibility({ profile1, profile2, brideName, groomName }: TabCompatibilityProps) {
  const result = useMemo(() => calcCompatibility(profile1, profile2), [profile1, profile2]);
  const cfg = LEVEL_CONFIG[result.level];
  const lifePathHarmony = useMemo(
    () => getNumberHarmony(profile1.lifePath, profile2.lifePath),
    [profile1.lifePath, profile2.lifePath],
  );

  return (
    <div className="space-y-3">
      {/* Score circle */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-5 text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${cfg.ring} mb-2`}>
          <span className={`text-3xl font-bold ${cfg.color}`}>{result.score}</span>
        </div>
        <div className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {brideName || "Cô dâu"} & {groomName || "Chú rể"}
        </p>
      </div>

      {/* Breakdown */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2.5">
        <h4 className="text-sm font-bold">📊 Chi tiết tương hợp</h4>
        {result.breakdown.map((b) => (
          <div key={b.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{b.label} ({b.weight}%)</span>
              <span className="font-bold">{b.harmony}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${b.harmony >= 80 ? "bg-green-500" : b.harmony >= 60 ? "bg-amber-500" : "bg-red-400"}`}
                style={{ width: `${b.harmony}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Life Path harmony detail */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">💑 Số Chủ Đạo: {profile1.lifePath} & {profile2.lifePath}</h4>
        <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          lifePathHarmony.harmony >= 80 ? "bg-green-100 text-green-700" :
          lifePathHarmony.harmony >= 60 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
        }`}>
          {lifePathHarmony.label} — {lifePathHarmony.harmony}%
        </div>
        <p className="text-sm text-muted-foreground">{lifePathHarmony.description}</p>
      </div>
    </div>
  );
}

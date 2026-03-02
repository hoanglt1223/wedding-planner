import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcFullProfile } from "@/lib/numerology";
import { getNumerologyProfile } from "@/data/numerology-profiles";
import { AiNumerologyCard } from "./ai-numerology-card";
import { ToggleBtn } from "./toggle-btn";

interface TabPersonalProfileProps {
  info: CoupleInfo;
  fullNames: { bride: string; groom: string };
}

export function TabPersonalProfile({ info, fullNames }: TabPersonalProfileProps) {
  const [active, setActive] = useState<"bride" | "groom">("bride");

  const birthDate = active === "bride" ? info.brideBirthDate : info.groomBirthDate;
  const displayName = active === "bride"
    ? (fullNames.bride || info.bride || "Cô dâu")
    : (fullNames.groom || info.groom || "Chú rể");
  const fullName = active === "bride"
    ? (fullNames.bride || info.bride || "")
    : (fullNames.groom || info.groom || "");

  const profile = useMemo(() => calcFullProfile(birthDate, fullName), [birthDate, fullName]);
  const numProfile = useMemo(() => getNumerologyProfile(profile.lifePath), [profile.lifePath]);

  const LABELS: [string, number][] = [
    ["Chủ Đạo", profile.lifePath], ["Biểu Đạt", profile.expression],
    ["Linh Hồn", profile.soulUrge], ["Nhân Cách", profile.personality],
    ["Ngày Sinh", profile.birthday], ["Năm", profile.personalYear],
    ["Trưởng Thành", profile.maturity], ["Thử Thách", profile.challenges[0]],
  ];

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex gap-2">
        <ToggleBtn active={active === "bride"} onClick={() => setActive("bride")}
          label={fullNames.bride || info.bride || "Cô dâu"} />
        <ToggleBtn active={active === "groom"} onClick={() => setActive("groom")}
          label={fullNames.groom || info.groom || "Chú rể"} />
      </div>

      {/* Hero card */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 text-center">
        <div className="text-4xl mb-1">{numProfile.emoji}</div>
        <div className="text-lg font-bold">{displayName}</div>
        <div className="text-base font-semibold text-primary mt-1">
          Số Chủ Đạo: {profile.lifePath} — {numProfile.name}
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 mt-2">
          {numProfile.keywords.map((kw) => (
            <span key={kw} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{kw}</span>
          ))}
        </div>
      </div>

      {/* 8-number grid */}
      <div className="grid grid-cols-4 gap-2">
        {LABELS.map(([label, val]) => (
          <div key={label} className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-2 text-center">
            <div className="text-lg font-bold text-primary">{val}</div>
            <div className="text-[10px] text-muted-foreground leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Traits */}
      <Card title="🎯 Đặc điểm tính cách">
        <div className="flex flex-wrap gap-1.5">
          {numProfile.traits.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-muted text-xs">{t}</span>
          ))}
        </div>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-2">
        <Card title="💪 Điểm mạnh">
          {numProfile.strengths.map((s) => <p key={s} className="text-xs text-green-700">✓ {s}</p>)}
        </Card>
        <Card title="⚠️ Cần cải thiện">
          {numProfile.weaknesses.map((w) => <p key={w} className="text-xs text-amber-700">• {w}</p>)}
        </Card>
      </div>

      {/* Marriage */}
      <Card title="💍 Xu hướng hôn nhân">
        <p className="text-sm">{numProfile.marriageDisposition}</p>
      </Card>

      {/* AI Card */}
      <AiNumerologyCard birthDate={birthDate} fullName={fullName} lifePath={profile.lifePath} />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
      <h4 className="text-sm font-bold">{title}</h4>
      {children}
    </div>
  );
}

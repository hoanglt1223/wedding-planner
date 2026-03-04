import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcFullProfile } from "@/lib/numerology";
import { getNumerologyProfile } from "@/data/numerology-profiles";
import { NUMBER_POSITION_INFO, getNumberMeaning } from "@/data/numerology-meanings";
import { AiNumerologyCard } from "./ai-numerology-card";
import { ToggleBtn } from "./toggle-btn";

interface TabPersonalProfileProps {
  info: CoupleInfo;
  fullNames: { bride: string; groom: string };
}

type NumberKey = "lifePath" | "expression" | "soulUrge" | "personality" | "birthday" | "personalYear" | "personalMonth" | "maturity" | "challenge";

export function TabPersonalProfile({ info, fullNames }: TabPersonalProfileProps) {
  const [active, setActive] = useState<"bride" | "groom">("bride");
  const [expanded, setExpanded] = useState<NumberKey | null>(null);

  const birthDate = active === "bride" ? info.brideBirthDate : info.groomBirthDate;
  const displayName = active === "bride"
    ? (fullNames.bride || info.bride || "Cô dâu")
    : (fullNames.groom || info.groom || "Chú rể");
  const fullName = active === "bride"
    ? (fullNames.bride || info.bride || "")
    : (fullNames.groom || info.groom || "");

  const profile = useMemo(() => calcFullProfile(birthDate, fullName), [birthDate, fullName]);
  const numProfile = useMemo(() => getNumerologyProfile(profile.lifePath), [profile.lifePath]);

  const LABELS: { key: NumberKey; val: number }[] = [
    { key: "lifePath", val: profile.lifePath },
    { key: "expression", val: profile.expression },
    { key: "soulUrge", val: profile.soulUrge },
    { key: "personality", val: profile.personality },
    { key: "birthday", val: profile.birthday },
    { key: "personalYear", val: profile.personalYear },
    { key: "personalMonth", val: profile.personalMonth },
    { key: "maturity", val: profile.maturity },
    { key: "challenge", val: profile.challenges[0] },
  ];

  const handleToggle = (key: NumberKey) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex gap-2">
        <ToggleBtn active={active === "bride"} onClick={() => { setActive("bride"); setExpanded(null); }}
          label={fullNames.bride || info.bride || "Cô dâu"} />
        <ToggleBtn active={active === "groom"} onClick={() => { setActive("groom"); setExpanded(null); }}
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

      {/* Number grid — tappable */}
      <div className="text-xs text-muted-foreground text-center">Nhấn vào từng số để xem giải thích chi tiết</div>
      <div className="grid grid-cols-3 gap-2">
        {LABELS.map(({ key, val }) => {
          const pos = NUMBER_POSITION_INFO[key];
          const isOpen = expanded === key;
          return (
            <button
              key={key}
              onClick={() => handleToggle(key)}
              className={`bg-[var(--theme-surface)] rounded-lg border p-2 text-center transition-colors ${
                isOpen ? "border-primary ring-1 ring-primary/30" : "border-[var(--theme-border)] hover:border-primary/50"
              }`}
            >
              <div className="text-lg font-bold text-primary">{val}</div>
              <div className="text-[10px] text-muted-foreground leading-tight">{pos?.icon} {pos?.label ?? key}</div>
            </button>
          );
        })}
      </div>

      {/* Expanded explanation */}
      {expanded && (
        <ExpandedCard numberKey={expanded} value={LABELS.find(l => l.key === expanded)!.val} />
      )}

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

function ExpandedCard({ numberKey, value }: { numberKey: NumberKey; value: number }) {
  const pos = NUMBER_POSITION_INFO[numberKey];
  const meaning = getNumberMeaning(value);

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-primary/30 p-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{pos?.icon}</span>
        <div>
          <h4 className="text-sm font-bold">{pos?.label} — Số {value}</h4>
          <p className="text-xs text-muted-foreground">{pos?.desc}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h5 className="text-xs font-semibold text-primary mb-0.5">🔢 Ý nghĩa số {value}</h5>
          <p className="text-xs text-foreground/80 leading-relaxed">{meaning.general}</p>
        </div>
        <div>
          <h5 className="text-xs font-semibold text-pink-600 mb-0.5">💕 Trong tình yêu</h5>
          <p className="text-xs text-foreground/80 leading-relaxed">{meaning.inLove}</p>
        </div>
        {(numberKey === "personalMonth") && (
          <div>
            <h5 className="text-xs font-semibold text-blue-600 mb-0.5">🗓️ Ảnh hưởng tháng này</h5>
            <p className="text-xs text-foreground/80 leading-relaxed">{meaning.monthInfluence}</p>
          </div>
        )}
      </div>
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

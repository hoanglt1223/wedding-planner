import type { ZodiacProfile } from "@/data/astrology-zodiac-profiles";

interface Props {
  profile: ZodiacProfile;
  zodiac: { name: string; chi: string; emoji: string };
}

export function PersonalitySection({ profile, zodiac }: Props) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">🎭 Tính Cách — {zodiac.emoji} {zodiac.name}</h3>

      {/* Trait chips */}
      <div className="flex flex-wrap gap-1.5">
        {profile.traits.map((t) => (
          <span key={t} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
            {t}
          </span>
        ))}
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <div className="font-medium text-green-600 mb-1">✅ Điểm mạnh</div>
          {profile.strengths.map((s) => (
            <div key={s} className="text-muted-foreground">• {s}</div>
          ))}
        </div>
        <div>
          <div className="font-medium text-amber-600 mb-1">⚠️ Điểm yếu</div>
          {profile.weaknesses.map((w) => (
            <div key={w} className="text-muted-foreground">• {w}</div>
          ))}
        </div>
      </div>

      {/* Marriage disposition */}
      <div className="text-xs bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)] rounded-lg p-3">
        <div className="font-medium text-[var(--theme-note-text)] mb-1">💍 Hôn nhân</div>
        <div className="text-muted-foreground">{profile.marriageDisposition}</div>
      </div>
    </div>
  );
}

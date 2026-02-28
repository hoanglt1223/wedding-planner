import { computeBadgeStatuses } from "@/lib/progress-calculator";
import type { WeddingState } from "@/types/wedding";

interface BadgeDisplayProps {
  state: WeddingState;
  progressPct: number;
  lang: string;
}

export function BadgeDisplay({ state, progressPct, lang }: BadgeDisplayProps) {
  const badges = computeBadgeStatuses(state, progressPct, lang);
  const en = lang === "en";
  const unlocked = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {en ? "Achievements" : "Thành tựu"}
        </h3>
        <span className="text-xs text-muted-foreground">
          {unlocked}/{badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {badges.map(({ badge, unlocked: isUnlocked }) => (
          <div
            key={badge.id}
            className={`flex items-center gap-2 rounded-lg border p-2 transition-all ${
              isUnlocked
                ? "border-[var(--theme-primary)]/30 bg-[var(--theme-primary)]/5"
                : "border-muted bg-muted/30 opacity-40 grayscale"
            }`}
          >
            <span className="text-xl">{badge.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">{badge.name}</p>
              <p className="text-2xs text-muted-foreground truncate">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

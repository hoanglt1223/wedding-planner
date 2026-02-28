import { computeSectionProgress } from "@/lib/progress-calculator";
import type { WeddingState } from "@/types/wedding";

interface SectionProgressProps {
  state: WeddingState;
  lang: string;
}

export function SectionProgress({ state, lang }: SectionProgressProps) {
  const sections = computeSectionProgress(state, lang);
  const en = lang === "en";

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">
        {en ? "Progress" : "Tiến độ"}
      </h3>

      <div className="space-y-2">
        {sections.map((section) => (
          <div key={section.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <span>{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </span>
              <span className="text-muted-foreground">
                {section.done}/{section.total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--theme-primary)] transition-all duration-500"
                style={{ width: `${section.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

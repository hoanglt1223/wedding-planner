import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import type { ChecklistPeriod, ChecklistItem } from "@/data/planning-checklist-items";

interface ChecklistPeriodSectionProps {
  period: ChecklistPeriod;
  checkedItems: Record<string, boolean>;
  onToggle: (itemId: string) => void;
  isActive: boolean;
  isPast: boolean;
  lang: string;
}

const CATEGORY_COLORS: Record<ChecklistItem["category"], string> = {
  planning: "text-blue-600 bg-blue-50",
  budget: "text-green-600 bg-green-50",
  guests: "text-purple-600 bg-purple-50",
  tradition: "text-amber-600 bg-amber-50",
  logistics: "text-sky-600 bg-sky-50",
  beauty: "text-pink-600 bg-pink-50",
  general: "text-gray-600 bg-gray-50",
};

export function ChecklistPeriodSection({
  period,
  checkedItems,
  onToggle,
  isActive,
  isPast,
  lang,
}: ChecklistPeriodSectionProps) {
  const [open, setOpen] = useState(isActive);

  const total = period.items.length;
  const done = period.items.filter((item) => checkedItems[item.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isComplete = done === total && total > 0;

  const label = lang === "en" ? period.labelEn : period.labelVi;

  return (
    <div
      className={`rounded-xl border transition-colors ${
        isActive
          ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/5 shadow-sm"
          : isPast
            ? "border-[var(--theme-border)] bg-[var(--theme-surface)]/50"
            : "border-[var(--theme-border)] bg-[var(--theme-surface)]"
      }`}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full flex items-center gap-3 px-4 py-3 text-left">
          {/* Chevron */}
          <span
            className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}
          >
            ▶
          </span>

          {/* Icon */}
          <span className="text-xl">{period.icon}</span>

          {/* Label */}
          <span className={`flex-1 font-semibold text-sm ${isComplete ? "line-through text-muted-foreground" : ""}`}>
            {label}
          </span>

          {/* Progress badge */}
          <span
            className={`text-2xs font-medium px-2 py-0.5 rounded-full ${
              isComplete
                ? "bg-green-100 text-green-700"
                : isActive
                  ? "bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {done}/{total}
          </span>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-3 space-y-1">
            {/* Progress bar */}
            {total > 0 && (
              <div className="w-full h-1 rounded-full bg-muted mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isComplete ? "#22c55e" : "var(--theme-primary)",
                  }}
                />
              </div>
            )}

            {/* Items */}
            <ul className="space-y-1">
              {period.items.map((item) => {
                const checked = checkedItems[item.id] ?? false;
                return (
                  <li key={item.id}>
                    <label className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(item.id)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[var(--theme-primary)]"
                      />
                      <span className="text-base shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-sm leading-relaxed ${checked ? "line-through text-muted-foreground" : ""}`}>
                          {lang === "en" ? item.textEn : item.textVi}
                        </span>
                        <span className={`ml-2 text-2xs px-1.5 py-0.5 rounded ${CATEGORY_COLORS[item.category]}`}>
                          {lang === "en" ? item.category : item.category}
                        </span>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

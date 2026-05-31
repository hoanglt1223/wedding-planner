import { useMemo } from "react";
import { PLANNING_CHECKLIST_PERIODS, getTotalChecklistItems } from "@/data/planning-checklist-items";
import { ChecklistPeriodSection } from "./checklist-period-section";
import { t } from "@/lib/i18n";
import { ProgressRing } from "@/components/home/progress-ring";

interface PlanningChecklistProps {
  weddingDate: string;
  checkedItems: Record<string, boolean>;
  onToggle: (itemId: string) => void;
  lang: string;
}

/** Calculate days remaining until the wedding */
function getDaysRemaining(weddingDate: string): number {
  if (!weddingDate) return Infinity;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(weddingDate);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

/** Format days remaining into human-readable text */
function formatDaysRemaining(days: number, lang: string): string {
  if (days < 0) {
    return lang === "en" ? "Wedding has passed" : "Đã qua ngày cưới";
  }
  if (days === 0) return lang === "en" ? "Wedding day!" : "Ngày cưới!";
  if (days === 1) return lang === "en" ? "Tomorrow!" : "Ngày mai!";
  if (days < 7) {
    const weeks = Math.floor(days / 7);
    const remain = days % 7;
    if (weeks === 0) return lang === "en" ? `${days} days left` : `Còn ${days} ngày`;
    return lang === "en"
      ? `${weeks}w ${remain}d left`
      : `Còn ${weeks} tuần ${remain} ngày`;
  }
  if (days < 30) return lang === "en" ? `${Math.round(days / 7)} weeks left` : `Còn ${Math.round(days / 7)} tuần`;
  if (days < 365) return lang === "en" ? `${Math.round(days / 30)} months left` : `Còn ${Math.round(days / 30)} tháng`;
  return lang === "en" ? `${(days / 365).toFixed(1)} years left` : `Còn ${(days / 365).toFixed(1)} năm`;
}

export function PlanningChecklist({
  weddingDate,
  checkedItems,
  onToggle,
  lang,
}: PlanningChecklistProps) {
  const daysRemaining = useMemo(() => getDaysRemaining(weddingDate), [weddingDate]);

  const totalItems = getTotalChecklistItems();
  const totalChecked = PLANNING_CHECKLIST_PERIODS.reduce(
    (sum, p) => sum + p.items.filter((item) => checkedItems[item.id]).length,
    0,
  );
  const overallPct = totalItems > 0 ? Math.round((totalChecked / totalItems) * 100) : 0;

  const noDate = !weddingDate;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t("📋 Lịch Trình Lên Kế Hoạch", lang)}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "en"
                ? "What to do at each stage before the wedding"
                : "Việc cần làm ở mỗi giai đoạn trước ngày cưới"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing percentage={overallPct} size={56} strokeWidth={6} />
          </div>
        </div>

        {/* Days remaining */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
          <span className="text-lg">
            {noDate ? "📅" : daysRemaining <= 0 ? "💒" : "⏰"}
          </span>
          <span className="text-sm font-medium">
            {noDate
              ? (lang === "en" ? "Set your wedding date to see personalized timeline" : "Chọn ngày cưới để xem lịch trình phù hợp")
              : formatDaysRemaining(daysRemaining, lang)}
          </span>
        </div>
      </div>

      {/* No date warning */}
      {noDate && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-center">
          <span className="text-2xl">💡</span>
          <p className="text-sm text-amber-700 mt-1">
            {lang === "en"
              ? "Set your wedding date in settings to unlock the planning timeline"
              : "Chọn ngày cưới trong cài đặt để kích hoạt lịch trình lên kế hoạch"}
          </p>
        </div>
      )}

      {/* Period sections */}
      <div className="space-y-2">
        {PLANNING_CHECKLIST_PERIODS.map((period) => {
          // isActive = the period whose daysBefore threshold matches current daysRemaining
          const isActive =
            !noDate &&
            daysRemaining > 0 &&
            (() => {
              // Find the period where this is the "current" one
              const sortedDesc = PLANNING_CHECKLIST_PERIODS
                .filter((p) => p.daysBefore > 0)
                .sort((a, b) => a.daysBefore - b.daysBefore);
              // Current = first period where daysBefore >= daysRemaining
              const current = sortedDesc.find((p) => p.daysBefore >= daysRemaining);
              return current?.id === period.id;
            })();

          const isPast = !noDate && daysRemaining <= 0 && period.daysBefore > 0;

          return (
            <ChecklistPeriodSection
              key={period.id}
              period={period}
              checkedItems={checkedItems}
              onToggle={onToggle}
              isActive={isActive}
              isPast={isPast}
              lang={lang}
            />
          );
        })}
      </div>

      {/* Overall stats footer */}
      <p className="text-center text-2xs text-muted-foreground">
        {lang === "en"
          ? `${totalChecked}/${totalItems} tasks completed (${overallPct}%)`
          : `${totalChecked}/${totalItems} việc đã hoàn thành (${overallPct}%)`}
      </p>
    </div>
  );
}

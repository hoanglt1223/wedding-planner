import { t } from "@/lib/i18n";
import { useCountdown } from "./use-countdown";
import { CountdownDisplay } from "./countdown-display";
import { ReminderBanner } from "./reminder-banner";
import { REMINDER_DEFINITIONS } from "@/data/reminder-definitions";

const MILESTONE_IDS = ["m-25", "m-50", "m-75", "m-100"];

function getMilestoneMessage(pct: number, lang: string): string | null {
  if (pct >= 100) return lang === "en" ? "🎉 All tasks done! You're ready!" : "🎉 Hoàn thành 100%! Sẵn sàng rồi!";
  if (pct >= 75) return lang === "en" ? "🌟 75% complete — almost there!" : "🌟 Hoàn thành 75% — sắp xong rồi!";
  if (pct >= 50) return lang === "en" ? "✨ Halfway there!" : "✨ Đã hoàn thành một nửa!";
  if (pct >= 25) return lang === "en" ? "👏 25% done, keep going!" : "👏 Hoàn thành 25%, tiếp tục nhé!";
  return null;
}

function getMilestoneId(pct: number): string {
  if (pct >= 100) return MILESTONE_IDS[3];
  if (pct >= 75) return MILESTONE_IDS[2];
  if (pct >= 50) return MILESTONE_IDS[1];
  return MILESTONE_IDS[0];
}

interface CountdownWidgetProps {
  weddingDate: string;
  progress: { done: number; total: number; pct: number };
  dismissedReminders: string[];
  onDismiss: (id: string) => void;
  lang: string;
}

export function CountdownWidget({
  weddingDate,
  progress,
  dismissedReminders,
  onDismiss,
  lang,
}: CountdownWidgetProps) {
  const { days, hours, minutes, seconds, status } = useCountdown(weddingDate);

  // Milestone celebration banner
  const milestoneMsg =
    progress.pct >= 25 ? getMilestoneMessage(progress.pct, lang) : null;
  const milestoneId = progress.pct >= 25 ? getMilestoneId(progress.pct) : null;
  const showMilestone =
    milestoneMsg && milestoneId && !dismissedReminders.includes(milestoneId);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm px-4 py-3 mb-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 text-center">
        {t("Nhắc nhở", lang)}
      </p>

      <CountdownDisplay
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        status={status}
        lang={lang}
      />

      {showMilestone && milestoneId && (
        <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm">
          <span className="flex-1 text-green-800">{milestoneMsg}</span>
          <button
            onClick={() => onDismiss(milestoneId)}
            className="shrink-0 text-green-500 hover:text-green-700 text-xs underline"
          >
            {t("Bỏ qua", lang)}
          </button>
        </div>
      )}

      {status === "counting" && (
        <ReminderBanner
          reminders={REMINDER_DEFINITIONS}
          daysRemaining={days}
          dismissedIds={dismissedReminders}
          onDismiss={onDismiss}
          lang={lang}
        />
      )}
    </div>
  );
}

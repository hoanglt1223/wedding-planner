import { t } from "@/lib/i18n";
import type { ReminderDefinition } from "@/data/reminder-definitions";

interface ReminderBannerProps {
  reminders: ReminderDefinition[];
  daysRemaining: number;
  dismissedIds: string[];
  onDismiss: (id: string) => void;
  lang: string;
}

export function ReminderBanner({
  reminders,
  daysRemaining,
  dismissedIds,
  onDismiss,
  lang,
}: ReminderBannerProps) {
  // Show reminders where threshold >= days remaining and not dismissed
  const active = reminders
    .filter(
      (r) => r.daysBeforeWedding >= daysRemaining && !dismissedIds.includes(r.id)
    )
    .sort((a, b) => a.daysBeforeWedding - b.daysBeforeWedding)
    .slice(0, 2); // show at most 2

  if (active.length === 0) return null;

  return (
    <div className="mt-2 space-y-1.5">
      {active.map((reminder) => (
        <div
          key={reminder.id}
          className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-sm"
        >
          <span className="shrink-0 text-base leading-5">{reminder.icon}</span>
          <span className="flex-1 text-amber-800 leading-5">
            {lang === "en" ? reminder.messageEn : reminder.messageVi}
          </span>
          <button
            onClick={() => onDismiss(reminder.id)}
            className="shrink-0 text-amber-500 hover:text-amber-700 text-xs leading-5 underline"
            aria-label={t("Bỏ qua", lang)}
          >
            {t("Bỏ qua", lang)}
          </button>
        </div>
      ))}
    </div>
  );
}

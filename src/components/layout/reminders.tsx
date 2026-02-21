import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import type { CoupleInfo } from "@/types/wedding";

interface RemindersProps {
  info: CoupleInfo;
}

interface Reminder {
  label: string;
  daysLeft: number;
  icon: string;
}

function getReminders(info: CoupleInfo): Reminder[] {
  const reminders: Reminder[] = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const addReminder = (label: string, dateStr: string, icon: string) => {
    if (!dateStr) return;
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return;
    const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
    if (diff >= 0 && diff <= 90) {
      reminders.push({ label, daysLeft: diff, icon });
    }
  };

  addReminder("Dạm ngõ", info.engagementDate, "🏠");
  addReminder("Đám hỏi", info.betrothalDate, "💍");
  addReminder("Ngày cưới", info.date, "💒");

  if (info.date) {
    const wd = new Date(info.date + "T00:00:00");
    if (!isNaN(wd.getTime())) {
      const offsets: [number, string, string][] = [
        [90, "Book nhà hàng & studio", "🏛️"],
        [60, "Gửi thiệp mời", "💌"],
        [30, "Thử váy & vest", "👗"],
        [14, "Xác nhận vendor", "📞"],
        [7, "Tổng duyệt", "📋"],
        [3, "Chuẩn bị lễ vật", "🎁"],
      ];
      offsets.forEach(([daysBefore, label, icon]) => {
        const d = new Date(wd);
        d.setDate(d.getDate() - daysBefore);
        const diff = Math.ceil((d.getTime() - now.getTime()) / 86400000);
        if (diff >= 0 && diff <= 90) {
          reminders.push({ label, daysLeft: diff, icon });
        }
      });
    }
  }

  return reminders.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function RemindersBell({ info }: RemindersProps) {
  const reminders = getReminders(info);
  const hasUrgent = reminders.some((r) => r.daysLeft <= 7);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Nhắc nhở"
        >
          <Bell className="h-4 w-4" />
          {reminders.length > 0 && (
            <span
              className={`absolute top-1 right-1 h-2 w-2 rounded-full ${hasUrgent ? "bg-red-500" : "bg-amber-400"}`}
            />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
          Nhắc nhở ({reminders.length})
        </p>
        {reminders.length === 0 ? (
          <p className="text-xs text-muted-foreground px-2 py-1">Không có nhắc nhở nào.</p>
        ) : (
          <ul className="space-y-0.5 max-h-64 overflow-y-auto">
            {reminders.map((r, i) => (
              <li
                key={i}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                  r.daysLeft <= 3
                    ? "bg-red-50 text-red-700"
                    : r.daysLeft <= 7
                    ? "bg-amber-50 text-amber-700"
                    : "hover:bg-muted"
                }`}
              >
                <span>{r.icon}</span>
                <span className="flex-1">{r.label}</span>
                <span className="font-medium shrink-0">
                  {r.daysLeft === 0 ? "Hôm nay!" : `${r.daysLeft}d`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Keep backward-compat export for any remaining references
export { RemindersBell as Reminders };

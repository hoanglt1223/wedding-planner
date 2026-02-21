import type { CoupleInfo } from "@/types/wedding";

interface RemindersProps {
  info: CoupleInfo;
}

interface Reminder {
  label: string;
  date: Date;
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
      reminders.push({ label, date: d, daysLeft: diff, icon });
    }
  };

  // Add event dates
  addReminder("Dạm ngõ", info.engagementDate, "🏠");
  addReminder("Đám hỏi", info.betrothalDate, "💍");
  addReminder("Ngày cưới", info.date, "💒");

  // Add milestone reminders relative to wedding date
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
          reminders.push({ label, date: d, daysLeft: diff, icon });
        }
      });
    }
  }

  return reminders.sort((a, b) => a.daysLeft - b.daysLeft);
}

export function Reminders({ info }: RemindersProps) {
  const reminders = getReminders(info);

  if (reminders.length === 0) return null;

  // Only show the most urgent 3
  const urgent = reminders.slice(0, 3);

  return (
    <div className="flex flex-wrap justify-center gap-1.5 mt-1.5">
      {urgent.map((r, i) => (
        <span
          key={i}
          className={`text-[0.65rem] rounded-full px-2 py-0.5 ${
            r.daysLeft <= 3
              ? "bg-red-500/30 text-red-100"
              : r.daysLeft <= 7
              ? "bg-amber-500/30 text-amber-100"
              : "bg-white/15 text-white/80"
          }`}
        >
          {r.icon} {r.label} — {r.daysLeft === 0 ? "Hôm nay!" : `${r.daysLeft}d`}
        </span>
      ))}
    </div>
  );
}

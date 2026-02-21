import type { CoupleInfo } from "@/types/wedding";

interface EventTimelineProps {
  info: CoupleInfo;
}

export function EventTimeline({ info }: EventTimelineProps) {
  const fmDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "";

  const events = [
    { label: "Dạm Ngõ", date: info.engagementDate, icon: "🏠", color: "bg-amber-500" },
    { label: "Đám Hỏi", date: info.betrothalDate, icon: "💍", color: "bg-pink-500" },
    { label: "Ngày Cưới", date: info.date, icon: "💒", color: "bg-red-500" },
  ].filter((e) => e.date);

  if (events.length === 0) return null;

  return (
    <div className="rounded-xl bg-white p-4 shadow print-clean">
      <h2 className="text-sm sm:text-base font-bold mb-3 border-b border-gray-200 pb-1">
        🎬 Lịch Trình Sự Kiện
      </h2>
      <div className="relative pl-6">
        {/* Timeline line */}
        <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-gray-200" />

        {events.map((ev, i) => (
          <div key={i} className="relative mb-4 last:mb-0">
            {/* Timeline dot */}
            <div
              className={`absolute -left-3.5 top-1 w-3 h-3 rounded-full ${ev.color} border-2 border-white shadow`}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {ev.icon} {ev.label}
                </span>
                <span className="text-xs text-gray-500">{fmDate(ev.date)}</span>
              </div>
              <div className="text-[0.7rem] text-gray-400 mt-0.5">
                {(() => {
                  const d = new Date(ev.date + "T00:00:00");
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const diff = Math.ceil(
                    (d.getTime() - now.getTime()) / 86400000,
                  );
                  if (diff < 0) return "Đã qua";
                  if (diff === 0) return "Hôm nay!";
                  return `Còn ${diff} ngày`;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

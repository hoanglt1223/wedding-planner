import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { TimelineEntry } from "@/types/wedding";

const CATEGORY_COLORS: Record<TimelineEntry["category"], { bg: string; text: string; dot: string }> = {
  ceremony: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  reception: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  prep: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  other: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

const CATEGORY_LABELS: Record<TimelineEntry["category"], { vi: string; en: string }> = {
  ceremony: { vi: "Nghi lễ", en: "Ceremony" },
  reception: { vi: "Tiệc", en: "Reception" },
  prep: { vi: "Chuẩn bị", en: "Prep" },
  other: { vi: "Khác", en: "Other" },
};

interface WeddingDayScheduleProps {
  entries: TimelineEntry[];
  lang?: string;
}

export function WeddingDaySchedule({ entries, lang = "vi" }: WeddingDayScheduleProps) {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const en = lang === "en";

  const sorted = [...entries].sort((a, b) => a.time.localeCompare(b.time));
  const preview = sorted.slice(0, 5);
  const hasMore = sorted.length > 5;

  // Group by category for summary
  const categoryCounts = sorted.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <h3 className="text-sm font-semibold">
              {en ? "Wedding Day Schedule" : "Lịch Trình Ngày Cưới"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {sorted.length > 0
                ? en
                  ? `${sorted.length} events`
                  : `${sorted.length} sự kiện`
                : en
                  ? "No events yet"
                  : "Chưa có sự kiện"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Category dots summary */}
          {sorted.length > 0 && (
            <div className="flex gap-1">
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const colors = CATEGORY_COLORS[cat as TimelineEntry["category"]];
                return (
                  <span
                    key={cat}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${colors?.bg} ${colors?.text}`}
                  >
                    {count}
                  </span>
                );
              })}
            </div>
          )}
          <span className="text-muted-foreground text-sm">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {sorted.length > 0 ? (
            <>
              {/* Timeline entries */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[27px] top-2 bottom-2 w-px bg-gray-200" />

                <div className="space-y-1">
                  {preview.map((entry) => {
                    const colors = CATEGORY_COLORS[entry.category];
                    const label = CATEGORY_LABELS[entry.category];
                    return (
                      <div key={entry.id} className="flex items-start gap-2.5 relative">
                        {/* Time */}
                        <span className="text-xs font-mono font-bold text-muted-foreground w-[46px] text-right shrink-0 pt-1.5">
                          {entry.time}
                        </span>

                        {/* Dot */}
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${colors.dot}`} />

                        {/* Content */}
                        <div className={`flex-1 min-w-0 rounded-lg px-2.5 py-1.5 ${colors.bg}`}>
                          <p className={`text-sm font-medium leading-tight ${colors.text}`}>
                            {entry.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] ${colors.text} opacity-70`}>
                              {en ? label.en : label.vi}
                            </span>
                            {entry.location && (
                              <span className="text-[10px] text-muted-foreground truncate">
                                📍 {entry.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* View all link */}
              {hasMore && (
                <button
                  onClick={() => void navigate({ to: "/app/planning" as never })}
                  className="w-full text-center text-xs text-[var(--theme-primary)] hover:underline py-1"
                >
                  {en ? `View all ${sorted.length} events →` : `Xem tất cả ${sorted.length} sự kiện →`}
                </button>
              )}

              {/* Full timeline link */}
              {!hasMore && (
                <button
                  onClick={() => void navigate({ to: "/app/planning" as never })}
                  className="w-full text-center text-xs text-[var(--theme-primary)] hover:underline py-1"
                >
                  {en ? "View full timeline →" : "Xem lịch trình đầy đủ →"}
                </button>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center py-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-2">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-sm font-medium mb-1">
                {en ? "Plan your wedding day" : "Lên lịch trình ngày cưới"}
              </p>
              <p className="text-xs text-muted-foreground max-w-[200px] mb-3">
                {en
                  ? "Add timeline events to see your schedule here"
                  : "Thêm sự kiện vào lịch trình để xem tại đây"}
              </p>
              <button
                onClick={() => void navigate({ to: "/app/planning" as never })}
                className="text-xs text-[var(--theme-primary)] hover:underline"
              >
                {en ? "Go to Timeline →" : "Đến Lịch Trình →"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

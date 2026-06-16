import { useState, useEffect } from "react";
import type { CoupleInfo } from "@/types/wedding";

interface CeremonyCountdown {
  key: string;
  labelVi: string;
  labelEn: string;
  icon: string;
  date: string;
}

function computeDays(dateStr: string): { days: number; status: "no-date" | "counting" | "today" | "past" } {
  if (!dateStr) return { days: 0, status: "no-date" };
  const target = Date.parse(dateStr);
  if (isNaN(target)) return { days: 0, status: "no-date" };

  const now = Date.now();
  const targetDate = new Date(dateStr);
  const nowDate = new Date(now);
  const isToday =
    targetDate.getFullYear() === nowDate.getFullYear() &&
    targetDate.getMonth() === nowDate.getMonth() &&
    targetDate.getDate() === nowDate.getDate();

  if (isToday) return { days: 0, status: "today" };

  const diffMs = target - now;
  if (diffMs < 0) return { days: Math.abs(Math.floor(diffMs / 86400000)), status: "past" };

  return { days: Math.floor(diffMs / 86400000), status: "counting" };
}

function getStatusColor(status: string, days: number): string {
  if (status === "past") return "text-gray-400";
  if (status === "today") return "text-pink-600";
  if (days <= 7) return "text-red-500";
  if (days <= 30) return "text-orange-500";
  return "text-green-600";
}

function getStatusBg(status: string, days: number): string {
  if (status === "past") return "bg-gray-50";
  if (status === "today") return "bg-pink-50";
  if (days <= 7) return "bg-red-50";
  if (days <= 30) return "bg-orange-50";
  return "bg-green-50";
}

interface MultiEventCountdownProps {
  info: CoupleInfo;
  lang?: string;
}

export function MultiEventCountdown({ info, lang = "vi" }: MultiEventCountdownProps) {
  const [expanded, setExpanded] = useState(false);
  const [, setTick] = useState(0);
  const en = lang === "en";

  // Re-render every 60s to update day counts
  useEffect(() => {
    const interval = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const ceremonies: CeremonyCountdown[] = [
    {
      key: "engagement",
      labelVi: "Lễ Ăn Hỏi",
      labelEn: "Engagement",
      icon: "💍",
      date: info.engagementDate,
    },
    {
      key: "betrothal",
      labelVi: "Lễ Đám Hỏi",
      labelEn: "Betrothal",
      icon: "🎁",
      date: info.betrothalDate,
    },
    {
      key: "wedding",
      labelVi: "Ngày Cưới",
      labelEn: "Wedding Day",
      icon: "💒",
      date: info.date,
    },
  ];

  // Filter to only show ceremonies that have dates set
  const withDates = ceremonies.filter((c) => c.date);
  const upcoming = withDates.filter((c) => computeDays(c.date).status === "counting" || computeDays(c.date).status === "today");
  const past = withDates.filter((c) => computeDays(c.date).status === "past");
  const noDate = ceremonies.filter((c) => !c.date);

  // Don't render if only wedding date exists (already shown by main countdown)
  if (withDates.length <= 1) return null;

  const nextCeremony = upcoming[0];

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Header — always visible */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🗓️</span>
          <div>
            <h3 className="text-sm font-semibold">
              {en ? "Ceremony Countdowns" : "Đếm Ngược Các Lễ"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {upcoming.length > 0
                ? en
                  ? `Next: ${nextCeremony?.labelEn}`
                  : `Sắp tới: ${nextCeremony?.labelVi}`
                : en
                  ? "All ceremonies completed"
                  : "Tất cả lễ đã hoàn thành"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {upcoming.length > 0 && nextCeremony && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${getStatusBg("counting", computeDays(nextCeremony.date).days)} ${getStatusColor("counting", computeDays(nextCeremony.date).days)}`}
            >
              {en
                ? `${computeDays(nextCeremony.date).days}d`
                : `${computeDays(nextCeremony.date).days}n`}
            </span>
          )}
          <span className="text-muted-foreground text-sm">
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {/* Upcoming ceremonies */}
          {upcoming.map((ceremony) => {
            const { days, status } = computeDays(ceremony.date);
            return (
              <div
                key={ceremony.key}
                className={`flex items-center gap-3 p-3 rounded-lg ${getStatusBg(status, days)}`}
              >
                <span className="text-xl">{ceremony.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {en ? ceremony.labelEn : ceremony.labelVi}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ceremony.date}
                  </p>
                </div>
                <div className="text-right">
                  {status === "today" ? (
                    <span className="text-sm font-bold text-pink-600">
                      {en ? "Today!" : "Hôm nay!"}
                    </span>
                  ) : (
                    <>
                      <span className={`text-lg font-bold ${getStatusColor(status, days)}`}>
                        {days}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {en ? "days" : "ngày"}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Past ceremonies */}
          {past.map((ceremony) => (
            <div
              key={ceremony.key}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 opacity-60"
            >
              <span className="text-xl">{ceremony.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 line-through">
                  {en ? ceremony.labelEn : ceremony.labelVi}
                </p>
                <p className="text-xs text-muted-foreground">{ceremony.date}</p>
              </div>
              <span className="text-xs text-gray-400">
                {en ? "Completed" : "Đã qua"}
              </span>
            </div>
          ))}

          {/* Dates not set */}
          {noDate.length > 0 && (
            <div className="pt-1 border-t border-dashed" style={{ borderColor: "var(--theme-border)" }}>
              <p className="text-[10px] text-muted-foreground mb-1">
                {en ? "No date set:" : "Chưa có ngày:"}
              </p>
              <div className="flex flex-wrap gap-1">
                {noDate.map((c) => (
                  <span
                    key={c.key}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {c.icon} {en ? c.labelEn : c.labelVi}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

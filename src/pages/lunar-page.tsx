import { useState, useMemo } from "react";
import { t } from "@/lib/i18n";
import { getMonthDays, getLunarInfo, getLunarMonthName } from "@/lib/lunar-calendar";
import type { FullDateInfo } from "@/lib/lunar-calendar";
import { LunarDayCell } from "@/components/lunar/lunar-day-cell";
import { LunarDateDetail } from "@/components/lunar/lunar-date-detail";
import type { CoupleInfo } from "@/types/wedding";

interface LunarPageProps {
  info: CoupleInfo;
  lang: string;
}

const DOW_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTH_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];
const MONTH_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseSavedDates(info: CoupleInfo): Set<string> {
  const s = new Set<string>();
  for (const d of [info.date, info.betrothalDate, info.engagementDate]) {
    if (d) {
      const [y, m, day] = d.split("-").map(Number);
      if (y && m && day) s.add(`${day}/${m}/${y}`);
    }
  }
  return s;
}

export function LunarPage({ info, lang }: LunarPageProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selectedInfo, setSelectedInfo] = useState<FullDateInfo | null>(null);

  const en = lang === "en";
  const dow = en ? DOW_EN : DOW_VI;
  const monthName = en ? MONTH_EN[month - 1] : MONTH_VI[month - 1];

  const savedDates = useMemo(() => parseSavedDates(info), [info]);

  // Get all days + their full lunar info for the month
  const { days, fullInfoMap, firstDow, lunarSummary } = useMemo(() => {
    const days = getMonthDays(month, year);
    const fullInfoMap = new Map<number, FullDateInfo>();
    for (const d of days) {
      try {
        fullInfoMap.set(d.day, getLunarInfo(d.day, d.month, d.year));
      } catch { /* skip invalid dates */ }
    }
    const firstDow = days.length > 0 ? days[0].dayOfWeek : 0;

    // Determine lunar month range for header subtitle
    const firstLunar = days[0]?.lunar;
    const lastLunar = days[days.length - 1]?.lunar;
    let lunarSummary = "";
    if (firstLunar && lastLunar) {
      const m1 = getLunarMonthName(firstLunar.month);
      const m2 = getLunarMonthName(lastLunar.month);
      lunarSummary = m1 === m2
        ? `${en ? "Lunar" : "ÂL"} ${en ? "month" : "tháng"} ${m1}`
        : `${en ? "Lunar" : "ÂL"} ${m1} — ${m2}`;
    }
    return { days, fullInfoMap, firstDow, lunarSummary };
  }, [month, year, en]);

  const todayKey = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  // Today's full info for quick glance panel
  const todayInfo = useMemo(() => {
    try {
      return getLunarInfo(now.getDate(), now.getMonth() + 1, now.getFullYear());
    } catch { return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }
  function goToday() {
    setMonth(now.getMonth() + 1);
    setYear(now.getFullYear());
  }

  return (
    <div className="space-y-3 pb-8">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-xl font-bold text-primary">
          {en ? "🌙 Lunar Calendar" : "🌙 Lịch Âm"}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {en
            ? "Can Chi · Hoang Dao · 12 Stars · 28 Mansions · Directions"
            : "Can Chi · Hoàng Đạo · Sao 12 · Nhị Thập Bát Tú · Hướng"}
        </p>
      </div>

      {/* Today quick glance */}
      {todayInfo && (
        <TodayGlance info={todayInfo} lang={lang} onClick={() => setSelectedInfo(todayInfo)} />
      )}

      {/* Calendar */}
      <div className="p-3 max-w-lg mx-auto">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition" aria-label="Previous month">
            ‹
          </button>
          <div className="text-center">
            <button onClick={goToday} className="font-semibold text-base hover:text-[var(--theme-primary)] transition-colors" title={en ? "Go to today" : "Về hôm nay"}>
              {monthName}, {year}
            </button>
            {lunarSummary && (
              <p className="text-[11px] text-muted-foreground">{lunarSummary}</p>
            )}
          </div>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition" aria-label="Next month">
            ›
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dow.map(d => (
            <div key={d} className={`text-center text-[11px] font-semibold py-1 ${d === "CN" || d === "Sun" ? "text-red-500" : "text-gray-500"}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDow }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {days.map((di) => {
            const key = `${di.day}/${di.month}/${di.year}`;
            const fi = fullInfoMap.get(di.day) ?? null;
            return (
              <LunarDayCell
                key={di.day}
                dayInfo={di}
                fullInfo={fi}
                isToday={key === todayKey}
                isSelected={selectedInfo?.solar.day === di.day && selectedInfo?.solar.month === di.month}
                isSavedDate={savedDates.has(key)}
                onClick={() => fi && setSelectedInfo(fi)}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-600 justify-center flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            {t("Hoàng Đạo", lang)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            {t("Hắc Đạo", lang)}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            {en ? "Saved date" : "Ngày đã chọn"}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-muted-foreground px-4">
        {en
          ? "Reference data from Vietnamese lunar calendar traditions. Powered by vnlunar."
          : "Dữ liệu tham khảo từ lịch âm Việt Nam truyền thống. Sử dụng vnlunar."}
      </div>

      {/* Detail modal */}
      <LunarDateDetail info={selectedInfo} lang={lang} onClose={() => setSelectedInfo(null)} />
    </div>
  );
}

// Compact today info card
function TodayGlance({ info, lang, onClick }: { info: FullDateInfo; lang: string; onClick: () => void }) {
  const en = lang === "en";
  const { solar, lunar, can_chi, day_type, god_directions, auspicious_hours } = info;
  const isGood = day_type.good;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 transition hover:shadow-sm"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <div>
            <p className="text-sm font-semibold">
              {en ? "Today" : "Hôm nay"} — {solar.day}/{solar.month}/{solar.year}
            </p>
            <p className="text-xs text-muted-foreground">
              {en ? "Lunar" : "ÂL"} {lunar.day}/{lunar.month} · {can_chi.day}
            </p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isGood ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {day_type.type}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
        <span>⏰ {en ? "Good hours" : "Giờ tốt"}: {auspicious_hours}</span>
        <span>🧭 {en ? "Joy" : "Hỷ Thần"}: {god_directions.joy_god} · {en ? "Wealth" : "Tài Thần"}: {god_directions.wealth_god}</span>
      </div>
      <p className="text-[10px] text-muted-foreground/60 mt-1">{en ? "Tap for details" : "Nhấn để xem chi tiết"}</p>
    </button>
  );
}

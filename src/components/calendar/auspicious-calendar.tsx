import { useState, useMemo } from "react";
import { t } from "@/lib/i18n";
import { getMonthData } from "@/data/auspicious";
import type { DateInfo } from "@/data/auspicious/types";
import { DayCell } from "./day-cell";
import { DateDetailModal } from "./date-detail-modal";
import { CoupleCompatibility } from "./couple-compatibility";

interface AuspiciousCalendarProps {
  lang: string;
  brideBirthDate?: string;
  groomBirthDate?: string;
  weddingDate?: string;
  betrothalDate?: string;
  engagementDate?: string;
}

const DOW_VI = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseSavedDates(dates: (string | undefined)[]): Set<string> {
  const s = new Set<string>();
  for (const d of dates) {
    if (d) {
      // "YYYY-MM-DD" → "D/M/YYYY"
      const parts = d.split("-");
      if (parts.length === 3) s.add(`${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}`);
    }
  }
  return s;
}

function extractYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const y = parseInt(dateStr.split("-")[0]);
  return isNaN(y) ? null : y;
}

const MONTH_NAMES_VI = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];
const MONTH_NAMES_EN = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

export function AuspiciousCalendar({
  lang,
  brideBirthDate,
  groomBirthDate,
  weddingDate,
  betrothalDate,
  engagementDate,
}: AuspiciousCalendarProps) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState<DateInfo | null>(null);

  const monthData = useMemo(() => {
    try {
      return getMonthData(month, year, lang);
    } catch {
      return null;
    }
  }, [month, year, lang]);

  const savedDates = useMemo(
    () => parseSavedDates([weddingDate, betrothalDate, engagementDate]),
    [weddingDate, betrothalDate, engagementDate]
  );

  const brideBirthYear = useMemo(() => extractYear(brideBirthDate), [brideBirthDate]);
  const groomBirthYear = useMemo(() => extractYear(groomBirthDate), [groomBirthDate]);

  const dow = lang === "vi" ? DOW_VI : DOW_EN;
  const monthName = lang === "vi" ? MONTH_NAMES_VI[month - 1] : MONTH_NAMES_EN[month - 1];

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const todayKey = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;

  return (
    <div className="p-3 max-w-lg mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-center">
          <span className="font-semibold text-base">{monthName}, {year}</span>
        </div>
        <button
          onClick={nextMonth}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dow.map(d => (
          <div key={d} className="text-center text-[11px] font-semibold text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {monthData ? (
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: monthData.firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {monthData.days.map((di) => {
            const key = `${di.solar.day}/${di.solar.month}/${di.solar.year}`;
            return (
              <DayCell
                key={di.solar.day}
                dateInfo={di}
                isToday={key === todayKey}
                isSelected={selected?.solar.day === di.solar.day}
                isSavedDate={savedDates.has(key)}
                onClick={() => setSelected(di)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          {lang === "vi" ? "Không thể tải lịch" : "Calendar unavailable"}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-600 justify-center flex-wrap">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          {t("Hoàng Đạo", lang)}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          {t("Tam Nương", lang)} / {t("Nguyệt Kỵ", lang)}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 inline-block" />
          {t("Bình thường", lang)}
        </span>
        <span className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          {lang === "vi" ? "Ngày đã chọn" : "Saved date"}
        </span>
      </div>

      {/* Couple compatibility */}
      <CoupleCompatibility
        brideBirthYear={brideBirthYear}
        groomBirthYear={groomBirthYear}
        lang={lang}
      />

      {/* Date detail modal */}
      <DateDetailModal
        dateInfo={selected}
        lang={lang}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

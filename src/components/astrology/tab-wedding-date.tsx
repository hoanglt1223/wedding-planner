import { useState, useMemo } from "react";
import { getMonthData, scoreMonth, getTopDates } from "@/data/auspicious";
import type { ScoredDate } from "@/data/auspicious";
import { WeddingDateCalendar } from "./wedding-date-calendar";
import { WeddingDateDetail } from "./wedding-date-detail";

interface TabWeddingDateProps {
  brideYear: number;
  groomYear: number;
  weddingYear: number;
  lang?: string;
}

export function TabWeddingDate({ brideYear, groomYear, weddingYear, lang = "vi" }: TabWeddingDateProps) {
  const en = lang === "en";
  const now = new Date();
  const [year, setYear] = useState(weddingYear || now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const monthData = useMemo(() => getMonthData(month, year, lang), [month, year, lang]);
  const scoredDays = useMemo(() =>
    scoreMonth(monthData.days, { brideYear, groomYear, weddingYear: year, lang }),
    [monthData.days, brideYear, groomYear, year, lang],
  );
  const topDates = useMemo(() => getTopDates(scoredDays), [scoredDays]);
  const selectedDate: ScoredDate | null = selectedDay ? scoredDays[selectedDay - 1] ?? null : null;

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  };

  return (
    <div className="space-y-3">
      {/* Top picks */}
      {topDates.length > 0 && (
        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
          <h4 className="text-sm font-bold mb-2">
            {en ? `Top dates in ${month}/${year}` : `Ngày đẹp trong tháng ${month}/${year}`}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {topDates.map((d) => (
              <button
                key={d.solar.day}
                onClick={() => setSelectedDay(d.solar.day)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  d.solar.day === selectedDay
                    ? "bg-primary text-primary-foreground"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {d.solar.day}/{month} ({d.score}{en ? "pts" : "đ"})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <WeddingDateCalendar
        year={year}
        month={month}
        scoredDays={scoredDays}
        firstDayOfWeek={monthData.firstDayOfWeek}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        lang={lang}
      />

      {/* Detail panel */}
      {selectedDate && <WeddingDateDetail date={selectedDate} lang={lang} />}

      {/* Disclaimer */}
      <div className="text-center text-[10px] text-muted-foreground px-4">
        {en
          ? "Scores combine Hoang Dao, Tam Nuong, Nguyet Ky, Ngu Hanh, Tam Tai, Kim Lau, and auspicious hours. For reference only."
          : "Điểm kết hợp Hoàng Đạo, Tam Nương, Nguyệt Kỵ, Ngũ Hành, Tam Tai, Kim Lâu, và giờ hoàng đạo. Chỉ mang tính tham khảo."}
      </div>
    </div>
  );
}

import type { ScoredDate } from "@/data/auspicious";

interface WeddingDateCalendarProps {
  year: number;
  month: number;
  scoredDays: ScoredDate[];
  firstDayOfWeek: number;
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  lang?: string;
}

const WEEKDAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEKDAYS_EN = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS_VI = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

function getDayColor(d: ScoredDate): string {
  if (d.auspiciousLevel === "avoid") return "bg-red-200 text-red-900";
  if (d.score >= 75) return "bg-green-500 text-white";
  if (d.score >= 60) return "bg-green-200 text-green-900";
  if (d.score >= 40) return "bg-gray-100 text-gray-700";
  return "bg-amber-100 text-amber-800";
}

export function WeddingDateCalendar({
  year, month, scoredDays, firstDayOfWeek, selectedDay,
  onSelectDay, onPrevMonth, onNextMonth, lang = "vi",
}: WeddingDateCalendarProps) {
  const en = lang === "en";
  const weekdays = en ? WEEKDAYS_EN : WEEKDAYS_VI;
  // Convert Sunday=0 to Monday-based offset
  const offset = (firstDayOfWeek + 6) % 7;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={onPrevMonth} className="px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80">
          &larr;
        </button>
        <span className="text-sm font-bold">
          {en ? `${year}/${month}` : `${MONTHS_VI[month]} ${year}`}
        </span>
        <button onClick={onNextMonth} className="px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80">
          &rarr;
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">{d}</div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {scoredDays.map((ds) => {
          const isSelected = ds.solar.day === selectedDay;
          return (
            <button
              key={ds.solar.day}
              onClick={() => onSelectDay(ds.solar.day)}
              className={`aspect-square rounded-lg text-xs font-medium flex flex-col items-center justify-center transition-all leading-tight ${
                isSelected ? "ring-2 ring-primary ring-offset-1" : ""
              } ${getDayColor(ds)}`}
            >
              <span>{ds.solar.day}</span>
              <span className="text-[8px] opacity-70">{ds.lunar.day}/{ds.lunar.month}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {[
          { color: "bg-green-500", label: en ? "Excellent" : "Rất tốt" },
          { color: "bg-green-200", label: en ? "Good" : "Tốt" },
          { color: "bg-gray-100", label: en ? "Neutral" : "Bình thường" },
          { color: "bg-amber-100", label: en ? "Caution" : "Cân nhắc" },
          { color: "bg-red-200", label: en ? "Avoid" : "Nên tránh" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1">
            <div className={`w-3 h-3 rounded ${l.color}`} />
            <span className="text-[10px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

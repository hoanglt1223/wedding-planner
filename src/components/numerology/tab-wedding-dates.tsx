import { useState, useMemo } from "react";
import { calcWeddingDateScore } from "@/lib/numerology-compatibility";
import { getWeddingDayMeaning } from "@/data/numerology-wedding";

interface TabWeddingDatesProps {
  lifePath1: number;
  lifePath2: number;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const SUIT_COLORS = {
  excellent: "bg-green-500 text-white",
  good: "bg-green-200 text-green-900",
  neutral: "bg-gray-100 text-gray-700",
  avoid: "bg-red-200 text-red-900",
};

function pad(n: number) { return String(n).padStart(2, "0"); }

export function TabWeddingDates({ lifePath1, lifePath2 }: TabWeddingDatesProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Mon=0

  const dayScores = useMemo(() => {
    const scores: { day: number; score: number; universalDay: number; harmony1: number; harmony2: number }[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${pad(month)}-${pad(d)}`;
      const result = calcWeddingDateScore(dateStr, lifePath1, lifePath2);
      scores.push({ day: d, ...result });
    }
    return scores;
  }, [year, month, daysInMonth, lifePath1, lifePath2]);

  const selectedScore = selectedDay ? dayScores[selectedDay - 1] : null;
  const selectedMeaning = selectedScore ? getWeddingDayMeaning(selectedScore.universalDay) : null;

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1); setSelectedDay(null); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1); setSelectedDay(null); };

  return (
    <div className="space-y-3">
      {/* Month nav */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80">←</button>
          <span className="text-sm font-bold">{MONTHS_VI[month]} {year}</span>
          <button onClick={nextMonth} className="px-3 py-1 rounded-lg bg-muted text-sm font-medium hover:bg-muted/80">→</button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground">{d}</div>)}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
          {dayScores.map((ds) => {
            const meaning = getWeddingDayMeaning(ds.universalDay);
            const isSelected = ds.day === selectedDay;
            return (
              <button
                key={ds.day}
                onClick={() => setSelectedDay(ds.day)}
                className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                  isSelected ? "ring-2 ring-primary ring-offset-1" : ""
                } ${SUIT_COLORS[meaning.suitability]}`}
              >
                {ds.day}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-3 mt-2 justify-center">
          {(["excellent", "good", "neutral", "avoid"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${SUIT_COLORS[s]}`} />
              <span className="text-[10px] text-muted-foreground">
                {s === "excellent" ? "Rất tốt" : s === "good" ? "Tốt" : s === "neutral" ? "Bình thường" : "Nên tránh"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedScore && selectedMeaning && (
        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold">
              📅 Ngày {selectedDay}/{month}/{year}
            </h4>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${SUIT_COLORS[selectedMeaning.suitability]}`}>
              {selectedMeaning.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Số Ngày Vũ Trụ: <strong>{selectedScore.universalDay}</strong></p>
          <p className="text-sm">{selectedMeaning.description}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted rounded-lg p-2 text-center">
              <div className="text-xs text-muted-foreground">Hợp cô dâu</div>
              <div className="text-sm font-bold">{selectedScore.harmony1}%</div>
            </div>
            <div className="bg-muted rounded-lg p-2 text-center">
              <div className="text-xs text-muted-foreground">Hợp chú rể</div>
              <div className="text-sm font-bold">{selectedScore.harmony2}%</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">💡 {selectedMeaning.weddingTip}</p>
        </div>
      )}
    </div>
  );
}

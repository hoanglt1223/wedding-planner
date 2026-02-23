import type { DateInfo } from "@/data/auspicious/types";

interface DayCellProps {
  dateInfo: DateInfo;
  isToday: boolean;
  isSelected: boolean;
  isSavedDate?: boolean;
  onClick: () => void;
}

const LEVEL_STYLES: Record<string, string> = {
  good: "ring-2 ring-green-500 bg-green-50",
  avoid: "ring-2 ring-red-500 bg-red-50",
  neutral: "hover:bg-gray-50",
};

const LEVEL_DOT: Record<string, string> = {
  good: "bg-green-500",
  avoid: "bg-red-500",
  neutral: "bg-gray-300",
};

export function DayCell({ dateInfo, isToday, isSelected, isSavedDate, onClick }: DayCellProps) {
  const { solar, lunar, auspiciousLevel } = dateInfo;
  const levelStyle = LEVEL_STYLES[auspiciousLevel] ?? "";
  const dotColor = LEVEL_DOT[auspiciousLevel] ?? "bg-gray-300";

  let containerCls =
    "relative flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all p-1 min-h-[52px] select-none " +
    levelStyle;

  if (isSelected) containerCls += " ring-2 ring-offset-1 ring-blue-500";
  if (isToday) containerCls += " font-bold";
  if (isSavedDate) containerCls += " outline outline-2 outline-yellow-400";

  const lunarLabel = lunar.leap ? `(${lunar.day}/${lunar.month}*)` : `${lunar.day}/${lunar.month}`;

  return (
    <div className={containerCls} onClick={onClick} title={dateInfo.canChi}>
      {/* Solar date */}
      <span className={`text-sm leading-tight ${isToday ? "text-blue-600" : ""}`}>
        {solar.day}
      </span>

      {/* Lunar date */}
      <span className="text-[10px] text-gray-500 leading-tight">{lunarLabel}</span>

      {/* Level indicator dot */}
      <span className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${dotColor}`} />

      {/* Saved date star */}
      {isSavedDate && (
        <span className="absolute top-0.5 left-0.5 text-[8px] text-yellow-500">★</span>
      )}
    </div>
  );
}

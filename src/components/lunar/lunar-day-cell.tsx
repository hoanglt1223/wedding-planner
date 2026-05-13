import type { MonthDayInfo } from "@/lib/lunar-calendar";
import type { FullDateInfo } from "@min98/vnlunar";

interface LunarDayCellProps {
  dayInfo: MonthDayInfo;
  fullInfo: FullDateInfo | null;
  isToday: boolean;
  isSelected: boolean;
  isSavedDate: boolean;
  onClick: () => void;
}

export function LunarDayCell({ dayInfo, fullInfo, isToday, isSelected, isSavedDate, onClick }: LunarDayCellProps) {
  const isGood = fullInfo?.day_type.good ?? false;
  const isBad = fullInfo?.day_type.bad ?? false;
  const lunarDay = dayInfo.lunar.day;
  const lunarMonth = dayInfo.lunar.month;

  // Show lunar month on 1st day of lunar month
  const lunarLabel = lunarDay === 1
    ? `${lunarDay}/${lunarMonth}`
    : `${lunarDay}`;

  let ringCls = "";
  if (isGood && !isBad) ringCls = "ring-1 ring-green-400 bg-green-50/60";
  else if (isBad) ringCls = "ring-1 ring-red-300 bg-red-50/40";

  let containerCls =
    "relative flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all p-0.5 min-h-[52px] select-none " +
    ringCls;

  if (isSelected) containerCls += " ring-2 ring-offset-1 ring-blue-500";
  if (isToday) containerCls += " font-bold";
  if (isSavedDate) containerCls += " outline outline-2 outline-yellow-400";

  // Dot color for day type
  const dotCls = isGood ? "bg-green-500" : isBad ? "bg-red-400" : "bg-gray-300";

  return (
    <div className={containerCls} onClick={onClick} title={fullInfo?.can_chi.day}>
      {/* Solar date */}
      <span className={`text-sm leading-tight ${isToday ? "text-blue-600" : ""}`}>
        {dayInfo.day}
      </span>

      {/* Lunar date */}
      <span className={`text-[10px] leading-tight ${lunarDay === 1 ? "text-red-500 font-semibold" : "text-gray-500"}`}>
        {lunarLabel}
      </span>

      {/* Day type dot */}
      <span className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${dotCls}`} />

      {/* Saved date star */}
      {isSavedDate && (
        <span className="absolute top-0 left-0.5 text-[8px] text-yellow-500">★</span>
      )}
    </div>
  );
}

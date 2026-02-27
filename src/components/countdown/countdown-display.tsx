import { t } from "@/lib/i18n";
import type { CountdownStatus } from "./use-countdown";

interface CountdownDisplayProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: CountdownStatus;
  lang: string;
}

interface DigitBoxProps {
  value: number;
  label: string;
  colorClass: string;
}

function DigitBox({ value, label, colorClass }: DigitBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`text-2xl font-bold w-14 h-14 flex items-center justify-center rounded-xl ${colorClass} text-white shadow-md`}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
}

function getColorClass(days: number): string {
  if (days > 30) return "bg-green-500";
  if (days > 7) return "bg-orange-400";
  return "bg-red-500";
}

export function CountdownDisplay({
  days,
  hours,
  minutes,
  seconds,
  status,
  lang,
}: CountdownDisplayProps) {
  if (status === "no-date") {
    return (
      <div className="text-center py-3 text-gray-400 text-sm italic">
        {t("Chưa chọn ngày cưới", lang)}
      </div>
    );
  }

  if (status === "past") {
    return (
      <div className="text-center py-3 text-gray-500 text-sm font-medium">
        {t("Đám cưới đã qua!", lang)}
      </div>
    );
  }

  if (status === "today") {
    return (
      <div className="text-center py-3">
        <span className="text-2xl animate-bounce inline-block">💒</span>
        <p className="text-pink-600 font-bold text-lg mt-1">
          {lang === "en" ? "Today is the day!" : "Hôm nay là ngày cưới!"}
        </p>
      </div>
    );
  }

  const colorClass = getColorClass(days);
  const showDetailed = days < 7;

  return (
    <div className="flex items-center justify-center gap-3 py-2">
      <DigitBox value={days} label={t("ngày", lang)} colorClass={colorClass} />
      {showDetailed && (
        <>
          <span className="text-gray-400 font-bold text-lg mb-4">:</span>
          <DigitBox value={hours} label={t("giờ", lang)} colorClass={colorClass} />
          <span className="text-gray-400 font-bold text-lg mb-4">:</span>
          <DigitBox value={minutes} label={t("phút", lang)} colorClass={colorClass} />
          <span className="text-gray-400 font-bold text-lg mb-4">:</span>
          <DigitBox value={seconds} label={t("giây", lang)} colorClass={colorClass} />
        </>
      )}
    </div>
  );
}

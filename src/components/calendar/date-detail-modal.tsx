import { useEffect, useCallback } from "react";
import { t } from "@/lib/i18n";
import type { DateInfo } from "@/data/auspicious/types";

interface DateDetailModalProps {
  dateInfo: DateInfo | null;
  lang: string;
  onClose: () => void;
}

const LEVEL_COLOR: Record<string, string> = {
  good: "text-green-600",
  avoid: "text-red-600",
  neutral: "text-gray-600",
};

const LEVEL_LABEL: Record<string, Record<string, string>> = {
  good: { vi: "Ngày Hoàng Đạo ✓", en: "Auspicious Day ✓" },
  avoid: { vi: "Ngày cần tránh ✗", en: "Day to avoid ✗" },
  neutral: { vi: "Ngày Hắc Đạo", en: "Inauspicious Day" },
};

export function DateDetailModal({ dateInfo, lang, onClose }: DateDetailModalProps) {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (!dateInfo) return;
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [dateInfo, handleEsc]);

  if (!dateInfo) return null;

  const { solar, lunar, canChi, auspiciousLevel, reasons, isHoangDao, isTamNuong, isNguyetKy } = dateInfo;
  const en = lang === "en";

  const lvLabel = LEVEL_LABEL[auspiciousLevel]?.[lang as "vi" | "en"] ??
    LEVEL_LABEL[auspiciousLevel]?.vi ?? "";
  const lvColor = LEVEL_COLOR[auspiciousLevel] ?? "text-gray-600";

  const leapStr = en ? "leap" : "nhuận";
  const calStr = en ? "Lunar" : "ÂL";
  const lunarLabel = lunar.leap
    ? `${lunar.day}/${lunar.month}* (${leapStr}) ${calStr} ${lunar.year}`
    : `${lunar.day}/${lunar.month} ${calStr} ${lunar.year}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-5 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-lg font-semibold">
              {solar.day}/{solar.month}/{solar.year}
            </p>
            <p className="text-sm text-gray-500">{lunarLabel}</p>
            <p className="text-sm text-gray-600 mt-0.5 italic">{canChi}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2"
            aria-label={t("Đóng", lang)}
          >
            ×
          </button>
        </div>

        {/* Auspicious status */}
        <div className={`text-sm font-medium mb-3 ${lvColor}`}>{lvLabel}</div>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isHoangDao && !isTamNuong && !isNguyetKy && (
            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
              {t("Hoàng Đạo", lang)}
            </span>
          )}
          {isTamNuong && (
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
              {t("Tam Nương", lang)}
            </span>
          )}
          {isNguyetKy && (
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs">
              {t("Nguyệt Kỵ", lang)}
            </span>
          )}
          {!isHoangDao && !isTamNuong && !isNguyetKy && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
              {t("Hắc Đạo", lang)}
            </span>
          )}
        </div>

        {/* Reasons */}
        {reasons.length > 0 && (
          <ul className="text-sm text-gray-700 space-y-1 mb-4">
            {reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={onClose}
          className="w-full mt-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition"
        >
          {t("Đóng", lang)}
        </button>
      </div>
    </div>
  );
}

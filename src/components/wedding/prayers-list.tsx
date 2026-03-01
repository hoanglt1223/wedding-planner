import { useState } from "react";
import type { PrayerItem } from "@/types/wedding";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";

interface PrayersListProps {
  prayers: PrayerItem[];
  lang?: string;
}

export function PrayersList({ prayers, lang = "vi" }: PrayersListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">
      <h2 className="text-base font-bold text-primary mb-2">
        {t("📜 Văn Khấn & Lời Phát Biểu", lang)}
      </h2>
      <div className="space-y-1.5">
        {prayers.map((item, i) => {
          const isOpen = expandedIndex === i;
          const isPrayer = item.type === "prayer";
          return (
            <div key={i} className="rounded-lg border border-[var(--theme-border)] overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedIndex(isOpen ? null : i)}
              >
                <span className="text-base shrink-0">{item.emoji}</span>
                <span className="text-sm font-semibold text-gray-800 flex-1 leading-snug">
                  {item.title}
                </span>
                <Badge
                  className={`text-2xs px-1.5 py-0.5 h-auto shrink-0 ${
                    isPrayer
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-blue-100 text-blue-800 border-blue-300"
                  }`}
                  variant="outline"
                >
                  {isPrayer ? t("Văn khấn", lang) : t("Phát biểu", lang)}
                </Badge>
                <span className="text-sm text-gray-400 shrink-0">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-0 border-t border-[var(--theme-border)]">
                  <div className="text-xs text-gray-500 mt-2 mb-1">
                    <span className="font-semibold">{t("Dịp sử dụng", lang)}:</span> {item.occasion}
                  </div>
                  {item.note && (
                    <div className="text-xs text-gray-500 mb-2">
                      <span className="font-semibold">{t("Hướng dẫn", lang)}:</span> {item.note}
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-2.5 mt-1 ${
                      isPrayer
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line">
                      {item.text}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

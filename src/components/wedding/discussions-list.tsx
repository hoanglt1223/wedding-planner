import { useState } from "react";
import type { DiscussionItem } from "@/types/wedding";
import { t } from "@/lib/i18n";

interface DiscussionsListProps {
  discussions: DiscussionItem[];
  lang?: string;
}

export function DiscussionsList({ discussions, lang = "vi" }: DiscussionsListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">
      <h2 className="text-base font-bold text-primary mb-2">{t("💬 Hai Nhà Cần Bàn", lang)}</h2>
      <div className="space-y-1.5">
        {discussions.map((item, i) => {
          const isOpen = expandedIndex === i;
          return (
            <div key={i} className="rounded-lg border border-[var(--theme-border)] overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedIndex(isOpen ? null : i)}
              >
                <span className="text-base shrink-0">{item.emoji}</span>
                <span className="text-sm font-semibold text-gray-800 flex-1 leading-snug">
                  {item.question}
                </span>
                <span className="text-sm text-gray-400 shrink-0">{isOpen ? "▲" : "▼"}</span>
              </button>
              {isOpen && (
                <div className="px-3 pb-3 pt-0 border-t border-[var(--theme-border)]">
                  <p className="text-sm text-gray-600 leading-relaxed mt-2 mb-2">{item.detail}</p>
                  {item.tips && item.tips.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <div className="text-xs font-semibold text-blue-700 mb-1">💡 {t("Gợi ý", lang)}</div>
                      <div className="space-y-0.5">
                        {item.tips.map((tip, j) => (
                          <div key={j} className="text-xs text-blue-600 leading-relaxed">• {tip}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

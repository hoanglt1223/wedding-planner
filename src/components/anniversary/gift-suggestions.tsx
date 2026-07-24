/**
 * Anniversary Gift Suggestions Component
 * Displays traditional gift ideas based on wedding anniversary year
 */

import { useState } from "react";
import { Gift, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { getAnniversaryGift } from "@/data/anniversary-gifts";
import type { AppTheme } from "@/data/themes";

interface GiftSuggestionsProps {
  weddingDate: string;
  lang: "vi" | "en";
  theme: AppTheme;
}

export function GiftSuggestions({ weddingDate, lang, theme }: GiftSuggestionsProps) {
  const en = lang === "en";
  const [selectedYear, setSelectedYear] = useState(1);

  // Calculate years since wedding
  const yearsSinceWedding = weddingDate
    ? Math.floor((Date.now() - new Date(weddingDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  const gift = getAnniversaryGift(selectedYear);

  const years = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60];

  function handlePreviousYear() {
    const currentIndex = years.indexOf(selectedYear);
    if (currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1]);
    }
  }

  function handleNextYear() {
    const currentIndex = years.indexOf(selectedYear);
    if (currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1]);
    }
  }

  const themeColor = theme.primary || "#ec4899";

  if (!gift) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Gift className="w-4 h-4" style={{ color: themeColor }} />
          {en ? "Gift Suggestions" : "Gợi Ý Quà Tặng"}
        </h3>
        <span className="text-xs text-muted-foreground">
          {selectedYear} {en ? "years" : "năm"}
        </span>
      </div>

      <div
        className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg p-4 border-2"
        style={{ borderColor: themeColor }}
      >
        {/* Year Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousYear}
            disabled={years.indexOf(selectedYear) === 0}
            className="p-1 rounded hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: themeColor }}>
              {selectedYear}
            </div>
            <div className="text-xs text-muted-foreground">
              {en ? "Year Anniversary" : "Năm Kỷ Niệm"}
            </div>
          </div>

          <button
            onClick={handleNextYear}
            disabled={years.indexOf(selectedYear) === years.length - 1}
            className="p-1 rounded hover:bg-white dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Traditional Theme */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              {en ? "Traditional Theme" : "Chủ Đề Truyền Thống"}
            </div>
            <div className="font-semibold text-base">{gift.theme}</div>
          </div>

          {gift.modernTheme && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {en ? "Modern Theme" : "Chủ Đề Hiện Đại"}
              </div>
              <div className="font-medium text-sm">{gift.modernTheme}</div>
            </div>
          )}

          {gift.color && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {en ? "Color" : "Màu Sắc"}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700"
                  style={{ backgroundColor: gift.color.toLowerCase() }}
                />
                <span className="text-sm">{gift.color}</span>
              </div>
            </div>
          )}

          {gift.flower && (
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                {en ? "Flower" : "Hoa"}
              </div>
              <div className="text-sm">{gift.flower}</div>
            </div>
          )}

          {/* Gift Ideas */}
          <div className="pt-3 border-t border-pink-200 dark:border-pink-800">
            <div className="flex items-center gap-1 text-xs font-medium mb-2" style={{ color: themeColor }}>
              <Sparkles className="w-3 h-3" />
              {en ? "Gift Ideas" : "Ý Tưởng Quà Tặng"}
            </div>
            <ul className="space-y-1.5">
              {gift.ideas.map((idea, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-pink-500 mt-0.5">•</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Year Indicator */}
          {yearsSinceWedding > 0 && selectedYear === yearsSinceWedding && (
            <div className="mt-3 pt-3 border-t border-pink-200 dark:border-pink-800">
              <div
                className="text-xs px-2 py-1 rounded-md text-center font-medium"
                style={{
                  backgroundColor: themeColor + "20",
                  color: themeColor
                }}
              >
                {en
                  ? "🎉 Your Current Anniversary!"
                  : "🎉 Kỷ Niệm Năm Của Bạn!"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Year Selector */}
      <div className="flex flex-wrap gap-1">
        {years.slice(0, 8).map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              selectedYear === year
                ? "bg-pink-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {year}y
          </button>
        ))}
      </div>
    </div>
  );
}
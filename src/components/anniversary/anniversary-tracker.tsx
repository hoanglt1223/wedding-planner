/**
 * Anniversary Tracker Main Component
 * Combines countdown, important dates list, and gift suggestions
 */

import { DateCountdown } from "./date-countdown";
import { ImportantDatesList } from "./important-dates-list";
import { GiftSuggestions } from "./gift-suggestions";
import type { ImportantDate } from "@/types/wedding";
import type { AppTheme } from "@/data/themes";
import { Heart, Calendar, Gift } from "lucide-react";

interface AnniversaryTrackerProps {
  dates: ImportantDate[];
  weddingDate: string;
  lang: "vi" | "en";
  theme: AppTheme;
  onAddDate: (date: Omit<ImportantDate, "id">) => void;
  onUpdateDate: (id: number, date: Partial<ImportantDate>) => void;
  onRemoveDate: (id: number) => void;
}

export function AnniversaryTracker({
  dates,
  weddingDate,
  lang,
  theme,
  onAddDate,
  onUpdateDate,
  onRemoveDate,
}: AnniversaryTrackerProps) {
  const en = lang === "en";

  // Auto-add wedding date as anniversary if not present (planned feature)
  // const hasWeddingAnniversary = dates.some(
  //   (d) => d.type === "anniversary" && d.title === (en ? "Wedding Day" : "Ngày cưới")
  // );

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-pink-500" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {en ? "Anniversary & Important Dates" : "Kỷ Niệm & Ngày Quan Trọng"}
          </h2>
          <Heart className="w-6 h-6 text-pink-500" />
        </div>
        <p className="text-sm text-muted-foreground">
          {en
            ? "Track your special moments and plan for future celebrations"
            : "Theo dõi khoảnh khắc đặc biệt và lên kế hoạch cho các lễ kỷ niệm"}
        </p>
      </div>

      {/* Countdown Section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold">
            {en ? "Upcoming Celebrations" : "Lễ Kỷ Niệm Sắp Tới"}
          </h3>
        </div>
        <DateCountdown dates={dates} weddingDate={weddingDate} lang={lang} />
      </section>

      {/* Gift Suggestions */}
      {weddingDate && (
        <section>
          <GiftSuggestions weddingDate={weddingDate} lang={lang} theme={theme} />
        </section>
      )}

      {/* Important Dates Management */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold">
            {en ? "Manage Important Dates" : "Quản Lý Ngày Quan Trọng"}
          </h3>
        </div>
        <ImportantDatesList
          dates={dates}
          lang={lang}
          onAdd={onAddDate}
          onUpdate={onUpdateDate}
          onRemove={onRemoveDate}
        />
      </section>

      {/* Tips */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          {en ? "Tips for Remembering Important Dates" : "Mẹo Để Nhớ Ngày Quan Trọng"}
        </h4>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>
              {en
                ? "Set reminders 1-2 weeks before important dates to prepare gifts and plans"
                : "Đặt nhắc nhở 1-2 tuần trước ngày quan trọng để chuẩn bị quà và kế hoạch"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>
              {en
                ? "Recurring annual dates (anniversaries) will automatically calculate each year"
                : "Ngày tái diễn hàng năm (kỷ niệm) sẽ tự động tính toán mỗi năm"}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500 mt-0.5">•</span>
            <span>
              {en
                ? "Traditional gift themes can help inspire meaningful presents"
                : "Chủ đề quà tặng truyền thống có thể giúp gợi ý quà ý nghĩa"}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
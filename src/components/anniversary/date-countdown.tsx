/**
 * Anniversary Date Countdown Component
 * Displays countdown to important dates (anniversaries, milestones)
 */

import { useMemo } from "react";
import type { ImportantDate } from "@/types/wedding";
import { Heart, Calendar, Gift } from "lucide-react";

interface DateCountdownProps {
  dates: ImportantDate[];
  weddingDate: string;
  lang: "vi" | "en";
}

export function DateCountdown({ dates, weddingDate: _weddingDate, lang }: DateCountdownProps) {
  const en = lang === "en";

  // Calculate upcoming important dates
  const upcomingDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const processedDates = dates
      .filter((d) => d.date && d.date.length > 0)
      .map((date) => {
        const eventDate = new Date(date.date);
        const thisYear = new Date(eventDate);
        thisYear.setFullYear(today.getFullYear());

        const nextYear = new Date(eventDate);
        nextYear.setFullYear(today.getFullYear() + 1);

        // If this year's date has passed, use next year
        const targetDate = thisYear < today ? nextYear : thisYear;

        const daysUntil = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...date,
          targetDate: targetDate.toISOString().split("T")[0],
          daysUntil,
          isPast: daysUntil < 0,
        };
      })
      .filter((d) => !d.isPast && d.daysUntil <= 365) // Show dates within next year
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3); // Show next 3 upcoming dates

    return processedDates;
  }, [dates]);

  if (upcomingDates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {en ? "No upcoming dates to display" : "Không có ngày nào sắp tới"}
        </p>
        <p className="text-xs mt-1">
          {en ? "Add your important dates to see countdowns here" : "Thêm ngày quan trọng để xem đếm ngược"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-500" />
        {en ? "Upcoming Dates" : "Ngày Sắp Tới"}
      </h3>

      {upcomingDates.map((date) => {
        return (
          <div
            key={date.id}
            className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950 rounded-lg p-3 border border-pink-200 dark:border-pink-800"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="font-medium text-sm">{date.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {new Date(date.targetDate).toLocaleDateString(
                    lang === "en" ? "en-US" : "vi-VN",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </div>
                {date.notes && (
                  <div className="text-xs text-muted-foreground mt-1 italic">
                    "{date.notes}"
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {date.daysUntil}
                </div>
                <div className="text-xs text-muted-foreground">
                  {en ? "days left" : "còn lại"}
                </div>
              </div>
            </div>

            {date.type === "anniversary" && date.daysUntil <= 30 && (
              <div className="mt-2 pt-2 border-t border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                  <Gift className="w-3 h-3" />
                  {en ? "Gift ideas available" : "Ý tưởng quà tặng"}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
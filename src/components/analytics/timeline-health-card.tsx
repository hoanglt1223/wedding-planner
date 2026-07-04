import { useMemo } from "react";
import type { WeddingState } from "@/types/wedding";

interface TimelineHealthCardProps {
  state: WeddingState;
  lang?: string;
  detailed?: boolean;
}

export function TimelineHealthCard({ state, lang = "vi", detailed = false }: TimelineHealthCardProps) {
  const en = lang === "en";
  const checkedItems = state.checkedItems || {};
  const timelineEntries = state.timelineEntries || [];
  const weddingDate = state.info.date;

  const analytics = useMemo(() => {
    const totalItems = Object.keys(checkedItems).length;
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Days until wedding
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const wedding = new Date(weddingDate + "T00:00:00");
    const daysUntil = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Timeline events count
    const totalEvents = timelineEntries.length;
    const ceremonyEvents = timelineEntries.filter(e => e.category === "ceremony").length;
    const receptionEvents = timelineEntries.filter(e => e.category === "reception").length;
    const prepEvents = timelineEntries.filter(e => e.category === "prep").length;

    // Time-based health
    let healthStatus = "neutral";
    let healthColor = "#f59e0b";
    if (totalItems === 0) {
      healthStatus = "none";
      healthColor = "#6b7280";
    } else if (daysUntil <= 0) {
      // Wedding day or past
      healthStatus = completionRate >= 100 ? "complete" : "late";
      healthColor = completionRate >= 100 ? "#22c55e" : "#ef4444";
    } else if (daysUntil <= 30) {
      // Within 1 month
      if (completionRate >= 90) {
        healthStatus = "ready";
        healthColor = "#22c55e";
      } else if (completionRate >= 70) {
        healthStatus = "on-track";
        healthColor = "#3b82f6";
      } else {
        healthStatus = "behind";
        healthColor = "#ef4444";
      }
    } else if (daysUntil <= 90) {
      // Within 3 months
      if (completionRate >= 60) {
        healthStatus = "good";
        healthColor = "#22c55e";
      } else if (completionRate >= 40) {
        healthStatus = "on-track";
        healthColor = "#3b82f6";
      } else {
        healthStatus = "needs-work";
        healthColor = "#f59e0b";
      }
    } else {
      // More than 3 months
      if (completionRate >= 30) {
        healthStatus = "ahead";
        healthColor = "#22c55e";
      } else if (completionRate >= 10) {
        healthStatus = "good-start";
        healthColor = "#3b82f6";
      } else {
        healthStatus = "early";
        healthColor = "#6b7280";
      }
    }

    return {
      totalItems,
      completedItems,
      completionRate,
      daysUntil,
      totalEvents,
      ceremonyEvents,
      receptionEvents,
      prepEvents,
      healthStatus,
      healthColor,
    };
  }, [checkedItems, timelineEntries, weddingDate]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">📅 {en ? "Timeline Analytics" : "Phân Tích Lịch Trình"}</h3>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: analytics.healthColor + "20",
            color: analytics.healthColor,
          }}
        >
          {analytics.healthStatus === "complete" && (en ? "Complete" : "Hoàn thành")}
          {analytics.healthStatus === "ready" && (en ? "Ready" : "Sẵn sàng")}
          {analytics.healthStatus === "ahead" && (en ? "Ahead" : "Đ超前")}
          {analytics.healthStatus === "good" && (en ? "Good" : "Tốt")}
          {analytics.healthStatus === "good-start" && (en ? "Good Start" : "Khởi đầu tốt")}
          {analytics.healthStatus === "on-track" && (en ? "On Track" : "Đúng tiến độ")}
          {analytics.healthStatus === "behind" && (en ? "Behind" : "Chậm tiến độ")}
          {analytics.healthStatus === "needs-work" && (en ? "Needs Work" : "Cần làm thêm")}
          {analytics.healthStatus === "late" && (en ? "Overdue" : "Quá hạn")}
          {analytics.healthStatus === "early" && (en ? "Early Stage" : "Giai đoạn đầu")}
          {analytics.healthStatus === "none" && (en ? "Not Started" : "Chưa bắt đầu")}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Tasks" : "Tác vụ"}</p>
          <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
            {analytics.completedItems}/{analytics.totalItems}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Events" : "Sự kiện"}</p>
          <p className="text-base font-bold text-blue-600">
            {analytics.totalEvents}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Days Left" : "Còn lại"}</p>
          <p className="text-base font-bold text-amber-600">
            {analytics.daysUntil}
          </p>
        </div>
      </div>

      {/* Completion rate bar */}
      {analytics.totalItems > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{en ? "Completion" : "Hoàn thành"}</span>
            <span className="font-medium" style={{ color: analytics.healthColor }}>
              {analytics.completionRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${analytics.completionRate}%`,
                backgroundColor: analytics.healthColor,
              }}
            />
          </div>
        </div>
      )}

      {detailed && (
        <>
          {/* Event breakdown */}
          {analytics.totalEvents > 0 && (
            <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
              <p className="text-xs text-muted-foreground mb-1">{en ? "Event Categories" : "Phân loại sự kiện"}</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-muted-foreground">{en ? "Ceremony" : "Nghi lễ"}</p>
                  <p className="font-medium">{analytics.ceremonyEvents}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{en ? "Reception" : "Tiệc"}</p>
                  <p className="font-medium">{analytics.receptionEvents}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{en ? "Prep" : "Chuẩn bị"}</p>
                  <p className="font-medium">{analytics.prepEvents}</p>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{en ? "💡 Insights" : "💡 Gợi ý"}</p>
            {analytics.totalItems === 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "Start checking off tasks to track your progress." : "Bắt đầu đánh dấu các tác vụ để theo dõi tiến độ."}
              </p>
            )}
            {analytics.totalItems > 0 && analytics.daysUntil <= 30 && analytics.completionRate < 70 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "🚨 Less than 30 days! Focus on completing critical tasks immediately." : "🚨 Còn dưới 30 ngày! Hãy tập trung hoàn thành các tác vụ quan trọng ngay."}
              </p>
            )}
            {analytics.totalItems > 0 && analytics.daysUntil <= 0 && analytics.completionRate < 100 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "⏰ Wedding day! Focus on enjoying the moment. Remaining tasks can wait." : "⏰ Đã đến ngày cưới! Hãy tận hưởng khoảnh khắc này. Các tác vụ còn lại có thể đợi."}
              </p>
            )}
            {analytics.totalItems > 0 && analytics.daysUntil > 90 && analytics.completionRate < 20 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "✅ You have plenty of time! Start with vendor bookings and venue selection." : "✅ Bạn còn nhiều thời gian! Hãy bắt đầu từ việc đặt nhà cung cấp và chọn địa điểm."}
              </p>
            )}
            {analytics.totalItems > 0 && analytics.completionRate >= 90 && analytics.daysUntil > 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "🎉 Excellent progress! Focus on final details and enjoy the planning." : "🎉 Tiến độ tuyệt vời! Hãy tập trung vào các chi tiết cuối cùng và tận hưởng quá trình này."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

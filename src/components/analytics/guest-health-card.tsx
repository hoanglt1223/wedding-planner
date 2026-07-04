import { useMemo } from "react";
import type { WeddingState } from "@/types/wedding";

interface GuestHealthCardProps {
  state: WeddingState;
  lang?: string;
  detailed?: boolean;
}

export function GuestHealthCard({ state, lang = "vi", detailed = false }: GuestHealthCardProps) {
  const en = lang === "en";
  const guests = state.guests || [];

  const analytics = useMemo(() => {
    const totalGuests = guests.length;
    const brideSide = guests.filter(g => g.side === "bride").length;
    const groomSide = guests.filter(g => g.side === "groom").length;
    const withRSVP = guests.filter(g => g.rsvpToken).length;
    const withDietary = guests.filter(g => g.dietary).length;
    const withPlusOne = guests.filter(g => g.plusOneName).length;

    // RSVP rate
    const rsvpRate = totalGuests > 0 ? (withRSVP / totalGuests) * 100 : 0;

    // Dietary breakdown
    const dietaryBreakdown: Record<string, number> = {};
    guests.forEach(g => {
      if (g.dietary) {
        dietaryBreakdown[g.dietary] = (dietaryBreakdown[g.dietary] || 0) + 1;
      }
    });

    // Table distribution
    const tableGroups: Record<string, number> = {};
    guests.forEach(g => {
      if (g.tableGroup) {
        tableGroups[g.tableGroup] = (tableGroups[g.tableGroup] || 0) + 1;
      }
    });

    // Health status
    let healthStatus = "neutral";
    let healthColor = "#f59e0b";
    if (totalGuests === 0) {
      healthStatus = "none";
      healthColor = "#6b7280";
    } else if (rsvpRate >= 90) {
      healthStatus = "excellent";
      healthColor = "#22c55e";
    } else if (rsvpRate >= 75) {
      healthStatus = "good";
      healthColor = "#3b82f6";
    } else if (rsvpRate >= 50) {
      healthStatus = "moderate";
      healthColor = "#f59e0b";
    } else {
      healthStatus = "low";
      healthColor = "#ef4444";
    }

    return {
      totalGuests,
      brideSide,
      groomSide,
      withRSVP,
      withDietary,
      withPlusOne,
      rsvpRate,
      dietaryBreakdown,
      tableGroups,
      healthStatus,
      healthColor,
      expectedGuests: totalGuests + withPlusOne,
    };
  }, [guests]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">👥 {en ? "Guest Analytics" : "Phân Tích Khách Mời"}</h3>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: analytics.healthColor + "20",
            color: analytics.healthColor,
          }}
        >
          {analytics.healthStatus === "excellent" && (en ? "Excellent" : "Xuất sắc")}
          {analytics.healthStatus === "good" && (en ? "Good Progress" : "Tiến triển tốt")}
          {analytics.healthStatus === "moderate" && (en ? "Moderate" : "Trung bình")}
          {analytics.healthStatus === "low" && (en ? "Needs Work" : "Cần cải thiện")}
          {analytics.healthStatus === "none" && (en ? "No Guests" : "Chưa có khách")}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Total" : "Tổng"}</p>
          <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
            {analytics.totalGuests}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "RSVP'd" : "Đã RSVP"}</p>
          <p className="text-base font-bold text-green-600">
            {analytics.withRSVP}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "+1s" : "Đi kèm"}</p>
          <p className="text-base font-bold text-blue-600">
            {analytics.withPlusOne}
          </p>
        </div>
      </div>

      {/* Side distribution */}
      {analytics.totalGuests > 0 && (
        <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
          <p className="text-xs text-muted-foreground mb-1">{en ? "Side Distribution" : "Phân bố theo bên"}</p>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>♀ {en ? "Bride" : "Cô dâu"}</span>
                <span className="font-medium">{analytics.brideSide}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-pink-400"
                  style={{
                    width: `${analytics.totalGuests > 0 ? (analytics.brideSide / analytics.totalGuests) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>♂ {en ? "Groom" : "Chú rể"}</span>
                <span className="font-medium">{analytics.groomSide}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-400"
                  style={{
                    width: `${analytics.totalGuests > 0 ? (analytics.groomSide / analytics.totalGuests) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RSVP rate bar */}
      {analytics.totalGuests > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{en ? "RSVP Rate" : "Tỷ lệ RSVP"}</span>
            <span className="font-medium" style={{ color: analytics.healthColor }}>
              {analytics.rsvpRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${analytics.rsvpRate}%`,
                backgroundColor: analytics.healthColor,
              }}
            />
          </div>
        </div>
      )}

      {detailed && (
        <>
          {/* Dietary restrictions */}
          {analytics.withDietary > 0 && (
            <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
              <p className="text-xs text-muted-foreground mb-1">{en ? "Dietary Needs" : "Nhu cầu ăn uống"}</p>
              <div className="flex flex-wrap gap-1">
                {Object.entries(analytics.dietaryBreakdown).map(([diet, count]) => (
                  <span
                    key={diet}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "var(--theme-primary-light, var(--theme-primary)15)",
                      color: "var(--theme-primary)",
                    }}
                  >
                    {diet}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{en ? "💡 Insights" : "💡 Gợi ý"}</p>
            {analytics.totalGuests === 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "Add guests to start tracking RSVPs and dietary needs." : "Thêm khách mời để bắt đầu theo dõi RSVP và nhu cầu ăn uống."}
              </p>
            )}
            {analytics.totalGuests > 0 && analytics.rsvpRate < 50 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "📧 Consider sending RSVP reminders to increase response rate." : "📧 Cần gửi nhắc nhở RSVP để tăng tỷ lệ phản hồi."}
              </p>
            )}
            {analytics.totalGuests > 0 && analytics.rsvpRate >= 90 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "✅ Great! Most guests have responded. Time to finalize catering!" : "✅ Tuyệt! Đa số khách đã phản hồi. Đã đến lúc chốt dịch vụ ăn uống!"}
              </p>
            )}
            {analytics.withDietary > 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? `🥗 ${analytics.withDietary} guests have dietary restrictions. Inform your caterer.` : `🥗 ${analytics.withDietary} khách có chế độ ăn đặc biệt. Hãy thông báo cho nhà cung cấp.`}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

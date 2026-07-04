import { useMemo } from "react";
import { formatMoney } from "@/lib/format";
import type { WeddingState } from "@/types/wedding";

interface VendorHealthCardProps {
  state: WeddingState;
  lang?: string;
  detailed?: boolean;
}

export function VendorHealthCard({ state, lang = "vi", detailed = false }: VendorHealthCardProps) {
  const en = lang === "en";
  const vendors = state.vendors || [];
  const vendorPayments = state.vendorPayments || [];

  const analytics = useMemo(() => {
    const totalVendors = vendors.length;
    const newVendors = vendors.filter(v => v.status === "new").length;
    const contacted = vendors.filter(v => v.status === "contacted").length;
    const quoted = vendors.filter(v => v.status === "quoted").length;
    const booked = vendors.filter(v => v.status === "booked").length;
    const confirmed = vendors.filter(v => v.status === "confirmed").length;
    const paid = vendors.filter(v => v.status === "paid").length;

    const bookedOrConfirmed = booked + confirmed + paid;
    const bookingRate = totalVendors > 0 ? (bookedOrConfirmed / totalVendors) * 100 : 0;

    // Payment analytics
    const totalBudget = vendors.reduce((sum, v) => sum + (v.budget || 0), 0);
    const totalPaid = vendorPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalDeposits = vendors.reduce((sum, v) => sum + (v.deposit || 0), 0);
    const paymentRate = totalBudget > 0 ? (totalPaid / totalBudget) * 100 : 0;

    // Category breakdown
    const categoryBreakdown: Record<string, { total: number; booked: number }> = {};
    vendors.forEach(v => {
      if (!categoryBreakdown[v.category]) {
        categoryBreakdown[v.category] = { total: 0, booked: 0 };
      }
      categoryBreakdown[v.category].total++;
      if (v.status === "booked" || v.status === "confirmed" || v.status === "paid") {
        categoryBreakdown[v.category].booked++;
      }
    });

    // Health status
    let healthStatus = "neutral";
    let healthColor = "#f59e0b";
    if (totalVendors === 0) {
      healthStatus = "none";
      healthColor = "#6b7280";
    } else if (bookingRate >= 90) {
      healthStatus = "excellent";
      healthColor = "#22c55e";
    } else if (bookingRate >= 75) {
      healthStatus = "good";
      healthColor = "#3b82f6";
    } else if (bookingRate >= 50) {
      healthStatus = "moderate";
      healthColor = "#f59e0b";
    } else {
      healthStatus = "needs-attention";
      healthColor = "#ef4444";
    }

    return {
      totalVendors,
      newVendors,
      contacted,
      quoted,
      booked,
      confirmed,
      paid,
      bookedOrConfirmed,
      bookingRate,
      totalBudget,
      totalPaid,
      totalDeposits,
      paymentRate,
      categoryBreakdown,
      healthStatus,
      healthColor,
      remainingBudget: totalBudget - totalPaid,
    };
  }, [vendors, vendorPayments]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">🤝 {en ? "Vendor Analytics" : "Phân Tích Nhà Cung Cấp"}</h3>
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
          {analytics.healthStatus === "needs-attention" && (en ? "Needs Attention" : "Cần chú ý")}
          {analytics.healthStatus === "none" && (en ? "No Vendors" : "Chưa có NCC")}
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
            {analytics.totalVendors}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Booked" : "Đã đặt"}</p>
          <p className="text-base font-bold text-green-600">
            {analytics.bookedOrConfirmed}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Quotes" : "Báo giá"}</p>
          <p className="text-base font-bold text-blue-600">
            {analytics.quoted}
          </p>
        </div>
      </div>

      {/* Booking rate bar */}
      {analytics.totalVendors > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{en ? "Booking Rate" : "Tỷ lệ đặt"}</span>
            <span className="font-medium" style={{ color: analytics.healthColor }}>
              {analytics.bookingRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${analytics.bookingRate}%`,
                backgroundColor: analytics.healthColor,
              }}
            />
          </div>
        </div>
      )}

      {detailed && (
        <>
          {/* Status breakdown */}
          {analytics.totalVendors > 0 && (
            <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
              <p className="text-xs text-muted-foreground mb-1">{en ? "Status Breakdown" : "Phân loại trạng thái"}</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "New" : "Mới"}</span>
                  <span className="font-medium">{analytics.newVendors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Contacted" : "Đã LH"}</span>
                  <span className="font-medium">{analytics.contacted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Quoted" : "Báo giá"}</span>
                  <span className="font-medium">{analytics.quoted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Booked" : "Đã đặt"}</span>
                  <span className="font-medium">{analytics.booked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Confirmed" : "Xác nhận"}</span>
                  <span className="font-medium">{analytics.confirmed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Paid" : "Đã TT"}</span>
                  <span className="font-medium">{analytics.paid}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment summary */}
          {analytics.totalBudget > 0 && (
            <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
              <p className="text-xs text-muted-foreground mb-1">{en ? "Payment Summary" : "Tóm tắt thanh toán"}</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{en ? "Total Budget" : "Tổng ngân sách"}</span>
                  <span className="font-medium">{formatMoney(analytics.totalBudget, lang)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">{en ? "Paid" : "Đã trả"}</span>
                  <span className="font-medium">{formatMoney(analytics.totalPaid, lang)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-amber-600">{en ? "Deposits" : "Tiền cọc"}</span>
                  <span className="font-medium">{formatMoney(analytics.totalDeposits, lang)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600">{en ? "Remaining" : "Còn lại"}</span>
                  <span className="font-medium">{formatMoney(analytics.remainingBudget, lang)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Category breakdown */}
          {Object.keys(analytics.categoryBreakdown).length > 0 && (
            <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
              <p className="text-xs text-muted-foreground mb-1">{en ? "By Category" : "Theo danh mục"}</p>
              <div className="space-y-1 text-xs">
                {Object.entries(analytics.categoryBreakdown).map(([category, data]) => {
                  const rate = data.total > 0 ? (data.booked / data.total) * 100 : 0;
                  return (
                    <div key={category} className="flex items-center gap-2">
                      <span className="flex-1 truncate">{category}</span>
                      <span className="text-muted-foreground">{data.booked}/{data.total}</span>
                      <span className="font-medium" style={{ color: rate >= 75 ? "#22c55e" : rate >= 50 ? "#f59e0b" : "#ef4444" }}>
                        {rate.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{en ? "💡 Insights" : "💡 Gợi ý"}</p>
            {analytics.totalVendors === 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "Add vendors to track bookings and payments." : "Thêm nhà cung cấp để theo dõi việc đặt chỗ và thanh toán."}
              </p>
            )}
            {analytics.totalVendors > 0 && analytics.bookingRate < 50 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "📞 Follow up with pending vendors to secure bookings and lock in prices." : "📞 Hãy liên hệ với các nhà cung cấp chưa chốt để đảm bảo đặt chỗ và giá."}
              </p>
            )}
            {analytics.totalVendors > 0 && analytics.bookingRate >= 75 && analytics.totalBudget > 0 && analytics.paymentRate < 50 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "💰 Most vendors booked! Start planning payment schedule to avoid last-minute rush." : "💰 Đã đặt đa số nhà cung cấp! Hãy lên lịch thanh toán để tránh vội vàng phút chót."}
              </p>
            )}
            {analytics.totalVendors > 0 && analytics.bookingRate >= 90 && analytics.paymentRate >= 75 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "🎉 Excellent! Most vendors booked and paid. Focus on final confirmations." : "🎉 Tuyệt vời! Đã đặt và thanh toán đa số nhà cung cấp. Hãy tập trung xác nhận cuối cùng."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

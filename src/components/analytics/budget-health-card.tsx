import { useMemo } from "react";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import type { WeddingState } from "@/types/wedding";

interface BudgetHealthCardProps {
  state: WeddingState;
  lang?: string;
  detailed?: boolean;
}

export function BudgetHealthCard({ state, lang = "vi", detailed = false }: BudgetHealthCardProps) {
  const en = lang === "en";
  const expenseLog = state.expenseLog || [];
  const cur = getCurrencySymbol(lang);

  const analytics = useMemo(() => {
    const totalSpent = expenseLog.reduce((sum, e) => sum + e.amount, 0);
    const paidExpenses = expenseLog.filter(e => e.paid).reduce((sum, e) => sum + e.amount, 0);
    const unpaidExpenses = totalSpent - paidExpenses;

    // Category breakdown
    const categorySpending: Record<string, number> = {};
    expenseLog.forEach(e => {
      categorySpending[e.category] = (categorySpending[e.category] || 0) + e.amount;
    });

    // Calculate average per category
    const avgSpend = expenseLog.length > 0 ? totalSpent / expenseLog.length : 0;
    const highestExpense = expenseLog.length > 0 ? Math.max(...expenseLog.map(e => e.amount)) : 0;
    const lowestExpense = expenseLog.length > 0 ? Math.min(...expenseLog.map(e => e.amount)) : 0;

    // Budget health
    let healthStatus = "neutral";
    let healthColor = "#f59e0b";
    if (state.budget > 0) {
      const utilization = (totalSpent / state.budget) * 100;
      if (utilization > 100) {
        healthStatus = "over";
        healthColor = "#ef4444";
      } else if (utilization > 90) {
        healthStatus = "warning";
        healthColor = "#f59e0b";
      } else if (utilization > 50) {
        healthStatus = "good";
        healthColor = "#22c55e";
      } else {
        healthStatus = "on-track";
        healthColor = "#3b82f6";
      }
    }

    return {
      totalSpent,
      paidExpenses,
      unpaidExpenses,
      categorySpending,
      avgSpend,
      highestExpense,
      lowestExpense,
      healthStatus,
      healthColor,
      budgetUtilization: state.budget > 0 ? (totalSpent / state.budget) * 100 : 0,
      remaining: state.budget - totalSpent,
    };
  }, [expenseLog, state.budget]);

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">💰 {en ? "Budget Analytics" : "Phân Tích Ngân Sách"}</h3>
        <div
          className="px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: analytics.healthColor + "20",
            color: analytics.healthColor,
          }}
        >
          {analytics.healthStatus === "over" && (en ? "Over Budget" : "Vượt ngân sách")}
          {analytics.healthStatus === "warning" && (en ? "Near Limit" : "Gần hạn mức")}
          {analytics.healthStatus === "good" && (en ? "On Track" : "Đúng tiến độ")}
          {analytics.healthStatus === "on-track" && (en ? "Good Start" : "Khởi đầu tốt")}
          {analytics.healthStatus === "neutral" && (en ? "Not Set" : "Chưa đặt")}
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Total Spent" : "Đã chi"}</p>
          <p className="text-base font-bold" style={{ color: "var(--theme-primary)" }}>
            {formatMoney(analytics.totalSpent, lang)}
            {cur}
          </p>
        </div>
        <div
          className="p-2 rounded-lg text-center"
          style={{ backgroundColor: "var(--theme-surface-muted)" }}
        >
          <p className="text-xs text-muted-foreground">{en ? "Remaining" : "Còn lại"}</p>
          <p className="text-base font-bold text-green-600">
            {formatMoney(Math.max(0, analytics.remaining), lang)}
            {cur}
          </p>
        </div>
      </div>

      {/* Budget utilization bar */}
      {state.budget > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-muted-foreground">{en ? "Budget Used" : "Đã dùng"}</span>
            <span className="font-medium" style={{ color: analytics.healthColor }}>
              {analytics.budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, analytics.budgetUtilization)}%`,
                backgroundColor: analytics.healthColor,
              }}
            />
          </div>
        </div>
      )}

      {detailed && (
        <>
          {/* Payment status */}
          <div className="mb-3 p-2 rounded-lg" style={{ backgroundColor: "var(--theme-surface-muted)" }}>
            <p className="text-xs text-muted-foreground mb-1">{en ? "Payment Status" : "Trạng thái thanh toán"}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-green-600">{en ? "Paid" : "Đã trả"}</span>
                  <span className="font-medium">{formatMoney(analytics.paidExpenses, lang)}{cur}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-600">{en ? "Unpaid" : "Chưa trả"}</span>
                  <span className="font-medium">{formatMoney(analytics.unpaidExpenses, lang)}{cur}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{en ? "💡 Insights" : "💡 Gợi ý"}</p>
            {expenseLog.length === 0 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "Start tracking expenses to see analytics" : "Bắt đầu ghi chi phí để xem phân tích"}
              </p>
            )}
            {expenseLog.length > 0 && analytics.budgetUtilization > 90 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "⚠️ You're approaching your budget limit. Review remaining expenses carefully." : "⚠️ Bạn đang gần giới hạn ngân sách. Hãy xem xét lại các chi phí còn lại."}
              </p>
            )}
            {expenseLog.length > 0 && analytics.budgetUtilization > 100 && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "🚨 Over budget! Consider adjusting expenses or increasing budget." : "🚨 Vượt ngân sách! Cần điều chỉnh chi phí hoặc tăng ngân sách."}
              </p>
            )}
            {expenseLog.length > 0 && analytics.budgetUtilization < 50 && new Date(state.info.date) > new Date() && (
              <p className="text-xs" style={{ color: "var(--theme-note-text)" }}>
                {en ? "✅ Good! You're under budget and have plenty of room for remaining expenses." : "✅ Tốt! Bạn đang dưới ngân sách và còn nhiều dư cho các chi phí còn lại."}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

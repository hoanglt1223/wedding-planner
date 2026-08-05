import { useState, useMemo } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { PaymentSummaryCards } from "@/components/payments/payment-summary-cards";
import { UpcomingPaymentsList } from "@/components/payments/upcoming-payments-list";
import { PaymentTimeline } from "@/components/payments/payment-timeline";
import { CashFlowChart } from "@/components/payments/cash-flow-chart";
import type { PaymentMilestone } from "@/types/contracts";

type ViewMode = "summary" | "list" | "timeline" | "cashflow";

export function PaymentDashboardPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const lang = state.lang || "vi";
  const en = lang === "en";

  const contracts = state.contracts || [];

  // Extract all payment milestones from all contracts
  const allPayments = useMemo(() => {
    const payments: Array<PaymentMilestone & { contractId: number; vendorName: string; vendorCategory: string }> = [];

    contracts.forEach(contract => {
      contract.paymentMilestones.forEach(milestone => {
        payments.push({
          ...milestone,
          contractId: contract.id,
          vendorName: contract.vendorName,
          vendorCategory: contract.vendorCategory,
        });
      });
    });

    return payments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [contracts]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const overdue = allPayments.filter(p =>
      p.status === "pending" && new Date(p.dueDate) < now
    );

    const dueThisMonth = allPayments.filter(p =>
      p.status === "pending" &&
      new Date(p.dueDate) >= startOfMonth &&
      new Date(p.dueDate) <= endOfMonth
    );

    const upcoming = allPayments.filter(p =>
      p.status === "pending" && new Date(p.dueDate) > now
    ).slice(0, 5); // Next 5 upcoming

    return {
      overdueCount: overdue.length,
      overdueAmount: overdue.reduce((sum, p) => sum + p.amount, 0),
      dueThisMonthCount: dueThisMonth.length,
      dueThisMonthAmount: dueThisMonth.reduce((sum, p) => sum + p.amount, 0),
      upcomingPayments: upcoming,
      totalPending: allPayments.filter(p => p.status === "pending").length,
    };
  }, [allPayments]);

  const handleMarkAsPaid = (payment: PaymentMilestone & { contractId: number }) => {
    const contract = contracts.find(c => c.id === payment.contractId);
    if (!contract) return;

    // Update the payment milestone status
    const updatedMilestones = contract.paymentMilestones.map(m =>
      m.id === payment.id ? { ...m, status: "paid" as const, paidDate: new Date().toISOString().split('T')[0] } : m
    );

    // Recalculate total paid
    const totalPaid = updatedMilestones
      .filter(m => m.status === "paid")
      .reduce((sum, m) => sum + m.amount, 0);

    store.updateContract(contract.id, {
      paymentMilestones: updatedMilestones,
      totalPaid,
    });
  };

  const viewModes: Array<{ id: ViewMode; labelVi: string; labelEn: string; icon: string }> = [
    { id: "summary", labelVi: "Tổng Quan", labelEn: "Summary", icon: "📊" },
    { id: "list", labelVi: "Danh Sách", labelEn: "List", icon: "📋" },
    { id: "timeline", labelVi: "Timeline", labelEn: "Timeline", icon: "📅" },
    { id: "cashflow", labelVi: "Dòng Tiền", labelEn: "Cash Flow", icon: "💰" },
  ];

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">
            {en ? "💳 Payment Dashboard" : "💳 Theo Dõi Thanh Toán"}
          </h2>
          <p className="text-xs text-muted-foreground">
            {en
              ? "Track all upcoming payments and cash flow"
              : "Theo dõi tất cả khoản thanh toán và dòng tiền"}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-1">
          {viewModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-3 py-1.5 text-xs rounded transition-colors ${
                viewMode === mode.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {mode.icon} {en ? mode.labelEn : mode.labelVi}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      {viewMode === "summary" && (
        <>
          <PaymentSummaryCards stats={stats} lang={lang} />

          {/* Quick Actions */}
          {stats.overdueCount > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-red-700 dark:text-red-400">
                    {en ? `⚠️ ${stats.overdueCount} Overdue Payments` : `⚠️ ${stats.overdueCount} Khoản Thanh Toán Quá Hạn`}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-500 mt-1">
                    {en
                      ? `Total: ${stats.overdueAmount.toLocaleString()}₫`
                      : `Tổng: ${stats.overdueAmount.toLocaleString()}₫`}
                  </p>
                </div>
                <button
                  onClick={() => setViewMode("list")}
                  className="text-xs px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  {en ? "Review Now" : "Xem Ngay"}
                </button>
              </div>
            </div>
          )}

          {/* Next 5 Upcoming Payments */}
          {stats.upcomingPayments.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {en ? "📅 Upcoming Payments" : "📅 Sắp Đến Hạn"}
              </h3>
              <UpcomingPaymentsList
                payments={stats.upcomingPayments}
                onMarkAsPaid={handleMarkAsPaid}
                lang={lang}
              />
            </div>
          )}
        </>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <UpcomingPaymentsList
          payments={allPayments.filter(p => p.status === "pending")}
          onMarkAsPaid={handleMarkAsPaid}
          lang={lang}
          showAll
        />
      )}

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <PaymentTimeline
          payments={allPayments}
          onMarkAsPaid={handleMarkAsPaid}
          lang={lang}
        />
      )}

      {/* Cash Flow View */}
      {viewMode === "cashflow" && (
        <CashFlowChart
          payments={allPayments}
          contracts={contracts}
          lang={lang}
        />
      )}

      {/* Empty State */}
      {allPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">💳</div>
          <p className="font-medium text-sm mb-1">
            {en ? "No payments to track" : "Không có khoản thanh toán nào"}
          </p>
          <p className="text-xs text-muted-foreground">
            {en
              ? "Add contracts with payment milestones to track them here"
              : "Thêm hợp đồng với mốc thanh toán để theo dõi tại đây"}
          </p>
        </div>
      )}
    </div>
  );
}
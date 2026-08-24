import { useState } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Bell, TrendingUp } from "lucide-react";
import { PaymentSummaryCard } from "@/components/payment-schedule/payment-summary-card";
import { PaymentTimeline } from "@/components/payment-schedule/payment-timeline";
import { PaymentCalendar } from "@/components/payment-schedule/payment-calendar";
import { PaymentAlerts } from "@/components/payment-schedule/payment-alerts";

export function PaymentSchedulePage() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang || "vi";
  const en = lang === "en";

  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Get all vendor payments
  const allPayments = state.payments || [];

  // Combine vendor payments with expense log payments
  const combinedPayments: Array<{
    id: number;
    vendorId?: number;
    vendorName?: string;
    amount: number;
    date: string;
    dueDate: string;
    method: "cash" | "bank_transfer" | "card" | "other";
    note: string;
    paid: boolean;
    description?: string;
  }> = [];

  // Add vendor payments
  allPayments.forEach(payment => {
    combinedPayments.push({
      id: payment.id,
      vendorId: payment.vendorId,
      vendorName: payment.vendorName || (en ? "Vendor" : "Nhà cung cấp"),
      amount: payment.amount,
      date: payment.date,
      dueDate: payment.dueDate,
      method: payment.method,
      note: payment.note,
      paid: payment.paid || false,
      description: payment.description
    });
  });

  // Add expense log entries that have due dates
  const expenseLog = state.expenseLog || [];
  expenseLog.forEach((expense, index) => {
    if (expense.dueDate) {
      combinedPayments.push({
        id: 100000 + index, // Unique ID for expense payments
        vendorName: expense.description || expense.category,
        amount: expense.amount,
        date: expense.date,
        dueDate: expense.dueDate,
        method: "other",
        note: expense.description || "",
        paid: expense.paid || false,
        description: expense.vendorName
      });
    }
  });

  // Sort by due date
  combinedPayments.sort((a, b) =>
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Navigate months
  const navigateMonth = (direction: number) => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const handleViewDetails = (paymentId: number) => {
    // Navigate to vendor or expense details
    const payment = combinedPayments.find(p => p.id === paymentId);
    if (payment && payment.id >= 100000) {
      // This is an expense payment, could navigate to budget page
      console.log("Navigate to budget for expense:", paymentId);
    } else {
      // This is a vendor payment
      console.log("Navigate to vendor for payment:", paymentId);
    }
  };

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-primary)]">
            {en ? "💳 Payment Schedule" : "💳 Lịch Thanh Toán"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {en ? "Track and manage all your wedding payments" : "Theo dõi và quản lý tất cả thanh toán đám cưới"}
          </p>
        </div>
      </div>

      {/* Payment Alerts */}
      {combinedPayments.length > 0 && (
        <PaymentAlerts
          payments={combinedPayments}
          onViewDetails={handleViewDetails}
          lang={lang}
        />
      )}

      {/* Summary Cards */}
      {combinedPayments.length > 0 && (
        <PaymentSummaryCard payments={combinedPayments} lang={lang} />
      )}

      {/* Empty State */}
      {combinedPayments.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              {en ? "No Payments Scheduled" : "Chưa Có Thanh Toán Lịch"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {en
                ? "Start by adding vendor payments or expense due dates to track your wedding financial timeline."
                : "Bắt đầu bằng cách thêm thanh toán nhà cung cấp hoặc ngày đáo hạn chi tiêu để theo dõi dòng tiền đám cưới."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                onClick={() => {/* Navigate to vendors */}}
                className="bg-[var(--theme-surface)]"
              >
                {en ? "Manage Vendors" : "Quản Lý Nhà Cung Cấp"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {/* Navigate to budget */}}
                className="bg-[var(--theme-surface)]"
              >
                {en ? "Go to Budget" : "Đến Ngân Sách"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      {combinedPayments.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">{en ? "Overview" : "Tổng Quan"}</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">{en ? "Timeline" : "Dòng Thời Gian"}</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">{en ? "Calendar" : "Lịch"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {en ? "📊 Payment Overview" : "📊 Tổng Quan Thanh Toán"}
                </h3>

                {/* Quick stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)]">
                    <div className="text-sm text-muted-foreground mb-1">
                      {en ? "Total Payments" : "Tổng Thanh Toán"}
                    </div>
                    <div className="text-2xl font-bold text-[var(--theme-primary)]">
                      {combinedPayments.length}
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)]">
                    <div className="text-sm text-muted-foreground mb-1">
                      {en ? "Paid" : "Đã Trả"}
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {combinedPayments.filter(p => p.paid).length}
                    </div>
                  </div>

                  <div className="p-4 bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)]">
                    <div className="text-sm text-muted-foreground mb-1">
                      {en ? "Pending" : "Chờ Trả"}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {combinedPayments.filter(p => !p.paid).length}
                    </div>
                  </div>
                </div>

                {/* Payment status distribution */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">
                    {en ? "Payment Status" : "Trạng Thái Thanh Toán"}
                  </h4>
                  <div className="space-y-2">
                    {combinedPayments.slice(0, 5).map(payment => {
                      const isPaid = payment.paid;
                      const isOverdue = new Date(payment.dueDate) < new Date() && !isPaid;

                      return (
                        <div key={payment.id} className="flex items-center justify-between text-sm py-2 border-b">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{payment.vendorName}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(payment.dueDate).toLocaleDateString(
                                lang === "vi" ? "vi-VN" : "en-US",
                                { month: "short", day: "numeric", year: "numeric" }
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--theme-primary)]">
                              {payment.amount.toLocaleString()}₫
                            </span>
                            {isPaid ? (
                              <span className="text-green-600 text-xs">✓</span>
                            ) : isOverdue ? (
                              <span className="text-red-600 text-xs">!</span>
                            ) : (
                              <span className="text-yellow-600 text-xs">⏳</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {combinedPayments.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        {en ? `+ ${combinedPayments.length - 5} more payments` : `+ ${combinedPayments.length - 5} thanh toán nữa`}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <PaymentTimeline
              payments={combinedPayments}
              onViewDetails={handleViewDetails}
              lang={lang}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                ← {en ? "Previous" : "Tháng Trước"}
              </Button>
              <h3 className="text-lg font-semibold">
                {selectedMonth.toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
                  month: "long",
                  year: "numeric"
                })}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                {en ? "Next" : "Tháng Sau"} →
              </Button>
            </div>
            <PaymentCalendar
              payments={combinedPayments}
              month={selectedMonth}
              lang={lang}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, AlertTriangle } from "lucide-react";
import type { VendorPayment } from "@/types/wedding";

interface PaymentSummaryCardProps {
  payments: VendorPayment[];
  lang: string;
}

export function PaymentSummaryCard({ payments, lang }: PaymentSummaryCardProps) {
  const en = lang === "en";

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString() + "₫";
  };

  const now = new Date();

  // Calculate summary metrics
  const totalUpcoming = payments
    .filter(p => !p.paid && new Date(p.dueDate) >= now)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => !p.paid && new Date(p.dueDate) < now)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPaid = payments
    .filter(p => p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  const upcomingCount = payments.filter(p => !p.paid && new Date(p.dueDate) >= now).length;
  const overdueCount = payments.filter(p => !p.paid && new Date(p.dueDate) < now).length;

  // Next 7 days total
  const next7DaysTotal = payments
    .filter(p => {
      if (p.paid) return false;
      const dueDate = new Date(p.dueDate);
      const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Monthly breakdown
  const getMonthlyTotal = (monthOffset: number) => {
    const targetMonth = new Date();
    targetMonth.setMonth(targetMonth.getMonth() + monthOffset);

    return payments
      .filter(p => {
        if (p.paid) return false;
        const dueDate = new Date(p.dueDate);
        return dueDate.getMonth() === targetMonth.getMonth() &&
               dueDate.getFullYear() === targetMonth.getFullYear();
      })
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const thisMonthTotal = getMonthlyTotal(0);
  const nextMonthTotal = getMonthlyTotal(1);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Upcoming */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {en ? "Upcoming Payments" : "Sắp Tới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalUpcoming)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {upcomingCount} {en ? "payments" : "thanh toán"}
          </div>
        </CardContent>
      </Card>

      {/* Next 7 Days */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {en ? "Next 7 Days" : "7 Ngày Tới"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(next7DaysTotal)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {en ? "Immediate attention" : "Cần chú ý"}
          </div>
        </CardContent>
      </Card>

      {/* Overdue */}
      {overdueCount > 0 && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {en ? "Overdue" : "Quá Hạn"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalOverdue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {overdueCount} {en ? "payments" : "thanh toán"}
            </div>
          </CardContent>
        </Card>
      )}

      {/* This Month */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            {en ? "This Month" : "Tháng Này"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(thisMonthTotal)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {en ? "Current month" : "Tháng hiện tại"}
          </div>
        </CardContent>
      </Card>

      {/* Total Paid */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingDown className="w-4 h-4" />
            {en ? "Already Paid" : "Đã Trả"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(totalPaid)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {en ? "Completed" : "Hoàn thành"}
          </div>
        </CardContent>
      </Card>

      {/* Next Month */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {en ? "Next Month" : "Tháng Sau"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {formatCurrency(nextMonthTotal)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {en ? "Plan ahead" : "Lập kế hoạch"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
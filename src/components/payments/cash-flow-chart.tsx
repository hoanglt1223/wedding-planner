import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { PaymentMilestone, WeddingContract } from "@/types/contracts";

interface PaymentWithContract extends PaymentMilestone {
  contractId: number;
  vendorName: string;
  vendorCategory: string;
}

interface CashFlowChartProps {
  payments: PaymentWithContract[];
  contracts: WeddingContract[];
  lang: string;
}

export function CashFlowChart({ payments, contracts, lang }: CashFlowChartProps) {
  const en = lang === "en";

  // Group pending payments by month
  const monthlyData = payments
    .filter((p) => p.status === "pending")
    .reduce((acc, payment) => {
      const date = new Date(payment.dueDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          total: 0,
          count: 0,
          payments: [],
        };
      }

      acc[monthKey].total += payment.amount;
      acc[monthKey].count += 1;
      acc[monthKey].payments.push(payment);

      return acc;
    }, {} as Record<string, { total: number; count: number; payments: PaymentWithContract[] }>);

  const sortedMonths = Object.keys(monthlyData).sort();

  // Find max for scaling
  const maxAmount = Math.max(...Object.values(monthlyData).map((d) => d.total), 1);

  function getMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
      month: "short",
      year: "2-digit",
    });
  }

  function getBarWidth(amount: number): number {
    return Math.max((amount / maxAmount) * 100, 5); // Min 5% width
  }

  function getBarColor(amount: number, index: number): string {
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    return colors[index % colors.length];
  }

  // Calculate total cash flow
  const totalCashFlow = Object.values(monthlyData).reduce((sum, month) => sum + month.total, 0);

  if (sortedMonths.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-3xl mb-2">💰</div>
        <p className="text-sm font-medium">
          {en ? "No upcoming cash flow" : "Không có dòng tiền sắp tới"}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">
            {en ? "Total Cash Flow" : "Tổng Dòng Tiền"}
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatMoney(totalCashFlow, lang)}₫
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-muted-foreground mb-1">
            {en ? "Average Monthly" : "Trung Bình Tháng"}
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatMoney(totalCashFlow / sortedMonths.length, lang)}₫
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-4">
        <h3 className="text-sm font-medium mb-4">
          {en ? "Monthly Payment Schedule" : "Lịch Trả Góp Hàng Tháng"}
        </h3>

        <div className="space-y-3">
          {sortedMonths.map((monthKey, index) => {
            const data = monthlyData[monthKey];
            const barWidth = getBarWidth(data.total);
            const barColor = getBarColor(data.total, index);

            return (
              <div key={monthKey} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{getMonthLabel(monthKey)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {data.count} {en ? "payment" : "khoản"}
                    </span>
                    <span className="font-semibold">
                      {formatMoney(data.total, lang)}₫
                    </span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-500`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Payment Details */}
                <div className="space-y-1">
                  {data.payments
                    .sort((a, b) => b.amount - a.amount)
                    .slice(0, 3)
                    .map((payment) => (
                      <div
                        key={`${payment.contractId}-${payment.id}`}
                        className="flex items-center justify-between text-xs text-muted-foreground"
                      >
                        <span className="truncate flex-1">
                          {payment.vendorName} - {payment.title}
                        </span>
                        <span className="ml-2">{formatMoney(payment.amount, lang)}₫</span>
                      </div>
                    ))}
                  {data.payments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      + {data.payments.length - 3} {en ? "more" : "thêm"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-medium mb-2">
          {en ? "💡 Cash Flow Insights" : "💡 Thông Tin Dòng Tiền"}
        </h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>
            {en ? "• Peak payment month:" : "• Tháng chi trả cao nhất:"}{" "}
            <span className="font-medium text-foreground">
              {getMonthLabel(sortedMonths.reduce((max, month) =>
                monthlyData[month].total > monthlyData[max].total ? month : max
              ))}
            </span>
          </div>
          <div>
            {en ? "• Total months with payments:" : "• Tổng số tháng có chi trả:"}{" "}
            <span className="font-medium text-foreground">{sortedMonths.length}</span>
          </div>
          <div>
            {en ? "• Largest single payment:" : "• Khoản thanh toán lớn nhất:"}{" "}
            <span className="font-medium text-foreground">
              {formatMoney(
                Math.max(...Object.values(monthlyData).flatMap((d) => d.payments.map((p) => p.amount))),
                lang
              )}
              ₫
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
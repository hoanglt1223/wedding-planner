import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { PaymentMilestone } from "@/types/contracts";

interface PaymentWithContract extends PaymentMilestone {
  contractId: number;
  vendorName: string;
  vendorCategory: string;
}

interface PaymentTimelineProps {
  payments: PaymentWithContract[];
  onMarkAsPaid: (payment: PaymentWithContract) => void;
  lang: string;
}

export function PaymentTimeline({ payments, onMarkAsPaid, lang }: PaymentTimelineProps) {
  const en = lang === "en";

  // Group payments by month
  const groupedPayments = payments.reduce((acc, payment) => {
    const date = new Date(payment.dueDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(payment);
    return acc;
  }, {} as Record<string, PaymentWithContract[]>);

  const sortedMonths = Object.keys(groupedPayments).sort();

  function getMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
      year: "numeric",
      month: "long",
    });
  }

  function getDaysUntilDue(dueDate: string): number {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getStatusColor(payment: PaymentWithContract): string {
    if (payment.status === "paid") return "bg-green-100 text-green-700 border-green-200";
    if (payment.status === "overdue") return "bg-red-100 text-red-700 border-red-200";

    const days = getDaysUntilDue(payment.dueDate);
    if (days < 0) return "bg-red-100 text-red-700 border-red-200";
    if (days <= 7) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  }

  function getStatusLabel(payment: PaymentWithContract): string {
    if (payment.status === "paid") return en ? "Paid" : "Đã trả";
    if (payment.status === "overdue") return en ? "Overdue" : "Quá hạn";

    const days = getDaysUntilDue(payment.dueDate);
    if (days < 0) return en ? "Overdue" : "Quá hạn";
    if (days <= 7) return en ? "Due Soon" : "Sắp đến hạn";
    return en ? "Upcoming" : "Sắp tới";
  }

  if (sortedMonths.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-3xl mb-2">📅</div>
        <p className="text-sm font-medium">{en ? "No payment timeline" : "Không có timeline thanh toán"}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedMonths.map((monthKey) => {
        const monthPayments = groupedPayments[monthKey];
        const totalAmount = monthPayments.reduce(
          (sum, p) => sum + (p.status === "paid" ? 0 : p.amount),
          0
        );
        const paidAmount = monthPayments.reduce(
          (sum, p) => sum + (p.status === "paid" ? p.amount : 0),
          0
        );

        return (
          <div key={monthKey} className="space-y-2">
            {/* Month Header */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="font-medium text-sm">{getMonthLabel(monthKey)}</div>
              <div className="text-xs text-muted-foreground">
                {en ? "Total:" : "Tổng:"} {formatMoney(totalAmount + paidAmount, lang)}₫
              </div>
            </div>

            {/* Payments */}
            <div className="space-y-2">
              {monthPayments
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((payment) => (
                  <Card key={`${payment.contractId}-${payment.id}`} className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Status Badge */}
                        <div className="mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(payment)}`}
                          >
                            {getStatusLabel(payment)}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {payment.vendorCategory}
                          </span>
                        </div>

                        {/* Vendor & Title */}
                        <div className="font-medium text-sm mb-1">
                          {payment.vendorName}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {payment.title}
                        </div>

                        {/* Date & Amount */}
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">{en ? "Due:" : "Đến hạn:"} </span>
                            <span className="font-medium">
                              {new Date(payment.dueDate).toLocaleDateString(
                                lang === "en" ? "en-US" : "vi-VN",
                                { month: "short", day: "numeric" }
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">{en ? "Amount:" : "Số tiền:"} </span>
                            <span
                              className={`font-semibold ${
                                payment.status === "paid" ? "text-green-600" : ""
                              }`}
                            >
                              {formatMoney(payment.amount, lang)}₫
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mark Paid Button */}
                      {payment.status !== "paid" && (
                        <button
                          onClick={() => onMarkAsPaid(payment)}
                          className="flex-shrink-0 text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          {en ? "Mark Paid" : "Đã trả"}
                        </button>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
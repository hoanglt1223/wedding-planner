import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { PaymentMilestone } from "@/types/contracts";

interface PaymentWithContract extends PaymentMilestone {
  contractId: number;
  vendorName: string;
  vendorCategory: string;
}

interface UpcomingPaymentsListProps {
  payments: PaymentWithContract[];
  onMarkAsPaid: (payment: PaymentWithContract) => void;
  lang: string;
  showAll?: boolean;
}

export function UpcomingPaymentsList({
  payments,
  onMarkAsPaid,
  lang,
  showAll = false,
}: UpcomingPaymentsListProps) {
  const en = lang === "en";

  if (payments.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-sm font-medium">
          {en ? "All caught up!" : "Không có khoản thanh toán nào!"}
        </p>
        <p className="text-xs text-muted-foreground">
          {en ? "No pending payments to track" : "Không có khoản thanh toán nào cần theo dõi"}
        </p>
      </Card>
    );
  }

  // Sort by due date
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Display limited or all payments
  const displayPayments = showAll ? sortedPayments : sortedPayments.slice(0, 5);

  function getDaysUntilDue(dueDate: string): number {
    const now = new Date();
    const due = new Date(dueDate);
    return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  function getUrgencyLevel(days: number): { color: string; label: string } {
    if (days < 0) return { color: "text-red-600 bg-red-50", label: en ? "Overdue" : "Quá hạn" };
    if (days <= 3) return { color: "text-orange-600 bg-orange-50", label: en ? "Urgent" : "Khẩn cấp" };
    if (days <= 7) return { color: "text-amber-600 bg-amber-50", label: en ? "Soon" : "Sắp đến hạn" };
    return { color: "text-green-600 bg-green-50", label: en ? "On Track" : "Đúng hạn" };
  }

  return (
    <div className="space-y-2">
      {displayPayments.map((payment) => {
        const daysUntil = getDaysUntilDue(payment.dueDate);
        const urgency = getUrgencyLevel(daysUntil);

        return (
          <Card
            key={`${payment.contractId}-${payment.id}`}
            className="p-3 hover:border-primary transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${urgency.color}`}>
                    {urgency.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {payment.vendorCategory}
                  </span>
                </div>

                {/* Vendor & Payment */}
                <div className="font-medium text-sm mb-1">
                  {payment.vendorName}
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {payment.title}
                </div>

                {/* Amount & Due Date */}
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">
                      {en ? "Amount:" : "Số tiền:"}
                    </span>{" "}
                    <span className="font-semibold">
                      {formatMoney(payment.amount, lang)}₫
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      {en ? "Due:" : "Đến hạn:"}
                    </span>{" "}
                    <span className={daysUntil < 0 ? "text-red-600 font-medium" : ""}>
                      {new Date(payment.dueDate).toLocaleDateString(
                        lang === "en" ? "en-US" : "vi-VN",
                        { month: "short", day: "numeric" }
                      )}
                      {daysUntil >= 0 && (
                        <span className="text-muted-foreground">
                          {" "}
                          ({en ? `in ${daysUntil}d` : `còn ${daysUntil}n`}
                          )
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {payment.notes && (
                  <div className="text-xs text-muted-foreground mt-2 italic">
                    {payment.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={() => onMarkAsPaid(payment)}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                {en ? "Mark Paid" : "Đã trả"}
              </button>
            </div>
          </Card>
        );
      })}

      {!showAll && payments.length > 5 && (
        <div className="text-center text-xs text-muted-foreground">
          {en
            ? `+ ${payments.length - 5} more payments`
            : `+ ${payments.length - 5} khoản nữa`}
        </div>
      )}
    </div>
  );
}
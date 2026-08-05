import { Card } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";

interface PaymentStats {
  overdueCount: number;
  overdueAmount: number;
  dueThisMonthCount: number;
  dueThisMonthAmount: number;
  upcomingPayments: Array<{
    id: number;
    title: string;
    amount: number;
    dueDate: string;
  }>;
  totalPending: number;
}

interface PaymentSummaryCardsProps {
  stats: PaymentStats;
  lang: string;
}

export function PaymentSummaryCards({ stats, lang }: PaymentSummaryCardsProps) {
  const en = lang === "en";

  const cards = [
    {
      title: en ? "Overdue" : "Quá Hạn",
      amount: stats.overdueAmount,
      count: stats.overdueCount,
      icon: "⚠️",
      color: stats.overdueCount > 0 ? "text-red-600" : "text-gray-600",
      bgColor: stats.overdueCount > 0 ? "bg-red-50" : "bg-gray-50",
      borderColor: stats.overdueCount > 0 ? "border-red-200" : "border-gray-200",
    },
    {
      title: en ? "Due This Month" : "Đến Hạn Tháng Này",
      amount: stats.dueThisMonthAmount,
      count: stats.dueThisMonthCount,
      icon: "📅",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      title: en ? "Total Pending" : "Tổng Chưa Thanh Toán",
      amount: stats.overdueAmount + stats.dueThisMonthAmount,
      count: stats.totalPending,
      icon: "💳",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`p-4 ${card.bgColor} ${card.borderColor} border`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-xs font-medium text-muted-foreground">
              {card.title}
            </span>
          </div>
          <div className={`text-2xl font-bold ${card.color}`}>
            {formatMoney(card.amount, lang)}₫
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {card.count} {en ? "payments" : "khoản"}
          </div>
        </Card>
      ))}
    </div>
  );
}
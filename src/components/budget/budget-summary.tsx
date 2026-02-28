import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { ExpenseEntry } from "@/types/wedding";

interface BudgetSummaryProps {
  expenseLog: ExpenseEntry[];
  budget: number;
  lang: string;
}

export function BudgetSummary({ expenseLog, budget, lang }: BudgetSummaryProps) {
  const cur = getCurrencySymbol(lang);
  const totalPaid = expenseLog.filter((e) => e.paid).reduce((sum, e) => sum + e.amount, 0);
  const totalUnpaid = expenseLog.filter((e) => !e.paid).reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = totalPaid + totalUnpaid;
  const overBudgetAmt = Math.max(0, totalSpent - budget);

  const cards = [
    {
      label: t("Đã thanh toán", lang),
      value: totalPaid,
      color: "text-green-600",
      bg: "bg-green-50",
      icon: "✅",
    },
    {
      label: t("Chưa thanh toán", lang),
      value: totalUnpaid,
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "⏳",
    },
    ...(overBudgetAmt > 0
      ? [{
          label: t("Vượt ngân sách", lang),
          value: overBudgetAmt,
          color: "text-red-600",
          bg: "bg-red-50",
          icon: "⚠️",
        }]
      : []),
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} rounded-lg p-3 text-center ${cards.length === 3 && card.icon === "⚠️" ? "col-span-2" : ""}`}
        >
          <div className="text-lg mb-0.5">{card.icon}</div>
          <div className={`text-sm font-bold ${card.color}`}>
            {formatMoney(card.value, lang)}{cur}
          </div>
          <div className="text-xs text-muted-foreground">{card.label}</div>
        </div>
      ))}
    </div>
  );
}

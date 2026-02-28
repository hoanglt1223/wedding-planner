import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import type { ExpenseEntry } from "@/types/wedding";

interface BudgetOverviewProps {
  budget: number;
  expenseLog: ExpenseEntry[];
  lang: string;
}

export function BudgetOverview({ budget, expenseLog, lang }: BudgetOverviewProps) {
  const cur = getCurrencySymbol(lang);
  const totalSpent = expenseLog.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - totalSpent;
  const pct = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 100) : 0;
  const overBudget = totalSpent > budget;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <h3 className="text-sm font-semibold mb-2">{t("Tổng quan ngân sách", lang)}</h3>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${overBudget ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex justify-between text-xs">
        <span>
          {t("Đã chi:", lang)}{" "}
          <b className={overBudget ? "text-red-500" : "text-green-600"}>
            {formatMoney(totalSpent, lang)}{cur}
          </b>
        </span>
        <span>
          {t("Ngân sách:", lang)}{" "}
          <b>{formatMoney(budget, lang)}{cur}</b>
        </span>
      </div>

      <div className="text-center text-xs mt-1">
        {overBudget ? (
          <span className="text-red-500 font-semibold">
            ⚠️ {t("Vượt ngân sách:", lang)} {formatMoney(totalSpent - budget, lang)}{cur}
          </span>
        ) : (
          <span className="text-muted-foreground">
            {t("Còn lại:", lang)} <b className="text-green-600">{formatMoney(remaining, lang)}{cur}</b>
            {budget > 0 && ` (${100 - pct}%)`}
          </span>
        )}
      </div>
    </div>
  );
}

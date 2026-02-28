import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import { getExpenseCategories } from "@/data/resolve-data";
import { getBudgetCategories } from "@/data/resolve-data";
import type { ExpenseEntry } from "@/types/wedding";

interface CategoryBreakdownProps {
  budget: number;
  budgetOverrides: Record<string, number>;
  expenseLog: ExpenseEntry[];
  lang: string;
}

export function CategoryBreakdown({ budget, budgetOverrides, expenseLog, lang }: CategoryBreakdownProps) {
  const cur = getCurrencySymbol(lang);
  const expCategories = getExpenseCategories(lang);
  const budCategories = getBudgetCategories(lang);

  // Sum expenses per category
  const spentByCategory: Record<string, number> = {};
  for (const e of expenseLog) {
    spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
  }

  // Get allocated amount per category from budget categories
  const allocations: Record<string, number> = {};
  for (const bc of budCategories) {
    const pct = budgetOverrides[bc.key] ?? bc.percentage;
    allocations[bc.key] = (budget * pct) / 100;
  }

  // Filter to categories with either allocation or expenses
  const rows = expCategories.filter(
    (cat) => allocations[cat.key] || spentByCategory[cat.key],
  );

  if (rows.length === 0) return null;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <h3 className="text-sm font-semibold mb-2">{t("Chi tiết theo hạng mục", lang)}</h3>
      <div className="space-y-2">
        {rows.map((cat) => {
          const spent = spentByCategory[cat.key] || 0;
          const allocated = allocations[cat.key] || 0;
          const pct = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;
          const over = spent > allocated && allocated > 0;

          return (
            <div key={cat.key}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span>{cat.icon} {cat.label}</span>
                <span className={over ? "text-red-500 font-semibold" : "text-muted-foreground"}>
                  {formatMoney(spent, lang)} / {formatMoney(allocated, lang)}{cur}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? "bg-red-500" : "bg-[var(--theme-primary)]"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

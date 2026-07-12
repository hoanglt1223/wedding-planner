import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { BudgetCategory } from "@/types/wedding";

interface BudgetVsActualChartProps {
  categories: BudgetCategory[];
  budgetOverrides: Record<string, number>;
  categoryExpenses: Record<string, number>;
  totalBudget: number;
  lang?: string;
}

export function BudgetVsActualChart({
  categories,
  budgetOverrides,
  categoryExpenses,
  totalBudget,
  lang = "vi",
}: BudgetVsActualChartProps) {
  const en = lang === "en";

  if (totalBudget === 0) return null;

  const data = categories
    .map((cat) => {
      const pct = budgetOverrides[cat.key] ?? cat.percentage;
      const allocated = (totalBudget * pct) / 100;
      const spent = categoryExpenses[cat.key] || 0;
      const usagePct = allocated > 0 ? (spent / allocated) * 100 : 0;
      const overBudget = spent > allocated && allocated > 0;

      return {
        key: cat.key,
        label: cat.label,
        color: cat.color,
        allocated,
        spent,
        usagePct,
        overBudget,
      };
    })
    .filter((d) => d.allocated > 0 || d.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  if (data.length === 0) return null;

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          {en ? "📊 Budget vs Actual" : "📊 Ngân Sách vs Thực Tế"}
        </h3>
        <div className="space-y-3">
          {data.map((item) => {
            const maxVal = Math.max(item.allocated, item.spent);
            const allocWidth = maxVal > 0 ? (item.allocated / maxVal) * 100 : 0;
            const spentWidth = maxVal > 0 ? (item.spent / maxVal) * 100 : 0;

            return (
              <div key={item.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium truncate max-w-[120px]">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatMoney(item.allocated, lang)}₫
                    </span>
                    <span
                      className={`font-medium ${
                        item.overBudget ? "text-red-500" : "text-green-600"
                      }`}
                    >
                      {formatMoney(item.spent, lang)}₫
                    </span>
                  </div>
                </div>

                <div className="relative h-4 bg-muted rounded overflow-hidden flex">
                  <div
                    className="h-full bg-blue-200 opacity-60 transition-all"
                    style={{ width: `${allocWidth}%` }}
                    title={`${en ? "Allocated" : "Phân bổ"}: ${formatMoney(item.allocated, lang)}₫`}
                  />
                  <div
                    className={`absolute top-0 left-0 h-full transition-all ${
                      item.overBudget
                        ? "bg-red-400"
                        : item.usagePct > 80
                        ? "bg-amber-400"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${spentWidth}%` }}
                    title={`${en ? "Spent" : "Đã chi"}: ${formatMoney(item.spent, lang)}₫`}
                  />
                </div>

                {item.spent > 0 && (
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>
                      {en ? "Usage" : "Đã dùng"}: {item.usagePct.toFixed(1)}%
                    </span>
                    {item.overBudget && (
                      <span className="text-red-500 font-medium">
                        {en ? "Over budget" : "Vượt ngân sách"}:{" "}
                        {formatMoney(item.spent - item.allocated, lang)}₫
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-blue-200 opacity-60" />
              <span className="text-muted-foreground">{en ? "Allocated" : "Phân bổ"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-green-500" />
              <span className="text-muted-foreground">{en ? "Spent" : "Đã chi"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

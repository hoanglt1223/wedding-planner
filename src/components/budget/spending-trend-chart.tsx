import { Card, CardContent } from "@/components/ui/card";
import { formatMoney } from "@/lib/format";
import type { ExpenseEntry } from "@/types/wedding";

interface SpendingTrendChartProps {
  expenses: ExpenseEntry[];
  lang?: string;
}

export function SpendingTrendChart({ expenses, lang = "vi" }: SpendingTrendChartProps) {
  const en = lang === "en";

  if (expenses.length === 0) return null;

  const monthlyData = expenses.reduce((acc, exp) => {
    const date = new Date(exp.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, total: 0, count: 0 };
    }
    acc[monthKey].total += exp.amount;
    acc[monthKey].count += 1;
    return acc;
  }, {} as Record<string, { month: string; total: number; count: number }>);

  const sortedMonths = Object.values(monthlyData).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  if (sortedMonths.length === 0) return null;

  const maxMonthly = Math.max(...sortedMonths.map(d => d.total));

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "vi-VN", {
      year: "numeric",
      month: "short"
    });
  };

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          {en ? "📈 Monthly Spending Trend" : "📈 Xuất Chi Theo Tháng"}
        </h3>

        <div className="space-y-3">
          {sortedMonths.map((data) => {
            const barHeight = maxMonthly > 0 ? (data.total / maxMonthly) * 100 : 0;

            return (
              <div key={data.month} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{formatMonth(data.month)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {data.count} {en ? "expenses" : "chi tiêu"}
                    </span>
                    <span className="font-semibold text-[var(--theme-primary)]">
                      {formatMoney(data.total, lang)}₫
                    </span>
                  </div>
                </div>

                <div className="relative h-8 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-t from-[var(--theme-primary)] to-[var(--theme-primary)] opacity-80 transition-all rounded"
                    style={{
                      width: `${barHeight}%`,
                      minHeight: "4px"
                    }}
                    title={`${formatMoney(data.total, lang)}₫`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {sortedMonths.length > 1 && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>{en ? "Average monthly" : "Trung bình tháng"}:</span>
              <span className="font-semibold text-[var(--theme-primary)]">
                {formatMoney(
                  sortedMonths.reduce((sum, d) => sum + d.total, 0) / sortedMonths.length,
                  lang
                )}₫
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>{en ? "Total period" : "Tổng cả kỳ"}:</span>
              <span className="font-semibold">
                {formatMoney(
                  sortedMonths.reduce((sum, d) => sum + d.total, 0),
                  lang
                )}₫
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

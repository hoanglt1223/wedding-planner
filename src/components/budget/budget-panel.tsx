import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUDGET_CATEGORIES } from "@/data/budget-categories";
import { formatMoney } from "@/lib/format";
import { BudgetCategoryRow } from "./budget-category-row";

interface BudgetPanelProps {
  budget: number;
  categoryOverrides: Record<string, number>;
  expenses: Record<string, number>;
  onSetBudget: (bud: number) => void;
  onSetCategoryPercent: (key: string, pct: number) => void;
  onSetExpense: (key: string, amount: number) => void;
}

const PRESETS: [string, number][] = [
  ["100tr", 100e6],
  ["150tr", 150e6],
  ["200tr", 200e6],
  ["300tr", 300e6],
  ["500tr", 500e6],
  ["1tỷ", 1e9],
];

export function BudgetPanel({
  budget,
  categoryOverrides,
  expenses,
  onSetBudget,
  onSetCategoryPercent,
  onSetExpense,
}: BudgetPanelProps) {
  const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onSetBudget(parseInt(raw) || 0);
  };

  const totalPct = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (categoryOverrides[c.key] ?? c.percentage),
    0
  );
  const totalAllocated = budget * totalPct / 100;
  const remaining = budget - totalAllocated;
  const overBudget = totalPct > 100;
  const totalExpenses = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (expenses[c.key] || 0),
    0
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">💰 Ngân Sách</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 text-center font-bold text-[#c0392b] text-[1rem]"
          value={formatMoney(budget)}
          onChange={handleBudgetInput}
          onFocus={(e) => e.target.select()}
        />

        <div className="flex flex-wrap justify-center gap-1 my-1">
          {PRESETS.map(([label, value]) => (
            <span
              key={label}
              className="cursor-pointer text-blue-500 font-semibold hover:underline text-[0.75rem] px-1.5 py-0.5 rounded hover:bg-blue-50"
              onClick={() => onSetBudget(value)}
            >
              {label}
            </span>
          ))}
        </div>

        {budget === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-base font-semibold mb-1">Thiết lập ngân sách cưới</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-3">
              Chọn mức ngân sách để xem phân bổ chi phí hợp lý
            </p>
          </div>
        ) : (
          <>
            <div>
              {BUDGET_CATEGORIES.map((cat) => {
                const pct = categoryOverrides[cat.key] ?? cat.percentage;
                const amount = budget * pct / 100;
                return (
                  <BudgetCategoryRow
                    key={cat.key}
                    category={cat}
                    percentage={pct}
                    amount={amount}
                    expense={expenses[cat.key] || 0}
                    onChange={onSetCategoryPercent}
                    onExpenseChange={onSetExpense}
                  />
                );
              })}
            </div>

            <div className="mt-2 p-2.5 bg-gray-50 rounded-lg text-center text-[0.78rem] sm:text-[0.82rem] leading-relaxed">
              Tổng:{" "}
              <b className={overBudget ? "text-red-500" : ""}>{totalPct}%</b>
              {" = "}
              <b className="text-[#c0392b]">{formatMoney(totalAllocated)}đ</b>
              <br className="sm:hidden" />
              <span className="hidden sm:inline">{" | "}</span>
              <span className="sm:hidden"> </span>
              Còn:{" "}
              <b className={remaining >= 0 ? "text-green-600" : "text-red-500"}>
                {formatMoney(remaining)}đ
              </b>
            </div>
            <div className="mt-1 p-2.5 bg-amber-50 rounded-lg text-center text-[0.78rem] sm:text-[0.82rem]">
              Đã chi:{" "}
              <b className={totalExpenses > budget ? "text-red-500" : "text-amber-600"}>
                {formatMoney(totalExpenses)}đ
              </b>
              {" / "}
              <b>{formatMoney(budget)}đ</b>
              {totalExpenses > 0 && budget > 0 && (
                <span className="ml-1 text-[0.72rem]">
                  ({Math.round((totalExpenses / budget) * 100)}%)
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

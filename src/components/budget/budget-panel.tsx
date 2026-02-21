import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUDGET_CATEGORIES } from "@/data/budget-categories";
import { formatMoney } from "@/lib/format";
import { BudgetCategoryRow } from "./budget-category-row";

interface BudgetPanelProps {
  budget: number;
  categoryOverrides: Record<string, number>;
  onSetBudget: (bud: number) => void;
  onSetCategoryPercent: (key: string, pct: number) => void;
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
  onSetBudget,
  onSetCategoryPercent,
}: BudgetPanelProps) {
  const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onSetBudget(parseInt(raw) || 0);
  };

  const totalPct = BUDGET_CATEGORIES.reduce(
    (sum, c) => sum + (categoryOverrides[c.k] ?? c.p),
    0
  );
  const totalAllocated = budget * totalPct / 100;
  const remaining = budget - totalAllocated;
  const overBudget = totalPct > 100;

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

        <div className="text-center text-[0.75rem] text-gray-400 my-1 space-x-1">
          {PRESETS.map(([label, value], i) => (
            <span key={label}>
              {i > 0 && <span className="text-gray-300">|</span>}
              <span
                className="cursor-pointer text-blue-500 font-semibold hover:underline ml-1"
                onClick={() => onSetBudget(value)}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        <div>
          {BUDGET_CATEGORIES.map((cat) => {
            const pct = categoryOverrides[cat.k] ?? cat.p;
            const amount = budget * pct / 100;
            return (
              <BudgetCategoryRow
                key={cat.k}
                category={cat}
                percentage={pct}
                amount={amount}
                onChange={onSetCategoryPercent}
              />
            );
          })}
        </div>

        <div className="mt-2 p-[10px] bg-gray-50 rounded-lg text-center text-[0.82rem]">
          Tổng:{" "}
          <b className={overBudget ? "text-red-500" : ""}>{totalPct}%</b>
          {" = "}
          <b className="text-[#c0392b]">{formatMoney(totalAllocated)}đ</b>
          {" | Còn: "}
          <b className={remaining >= 0 ? "text-green-600" : "text-red-500"}>
            {formatMoney(remaining)}đ
          </b>
        </div>
      </CardContent>
    </Card>
  );
}

import type { BudgetCategory } from "@/types/wedding";
import { formatMoney, formatShort } from "@/lib/format";

interface BudgetCategoryRowProps {
  category: BudgetCategory;
  percentage: number;
  amount: number;
  expense: number;
  onChange: (key: string, value: number) => void;
  onExpenseChange: (key: string, amount: number) => void;
}

export function BudgetCategoryRow({
  category,
  percentage,
  amount,
  expense,
  onChange,
  onExpenseChange,
}: BudgetCategoryRowProps) {
  const barWidth = Math.min(percentage, 100);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center py-[5px] gap-1 border-b border-[var(--theme-border)] text-sm">
        <span className="font-semibold">{category.label}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-12 p-[2px] border border-gray-300 rounded-[3px] text-right text-xs"
            value={percentage}
            min={0}
            max={100}
            onChange={(e) => onChange(category.key, parseFloat(e.target.value) || 0)}
          />
          <span className="text-xs text-gray-400">%</span>
          <span className="text-[var(--theme-primary)] font-bold min-w-[45px] text-right">
            {formatShort(amount)}
          </span>
        </div>
      </div>
      <div className="h-[4px] bg-gray-200 rounded-[2px] my-[2px]">
        <div
          className="h-full rounded-[2px] transition-all"
          style={{ width: `${barWidth}%`, background: category.color }}
        />
      </div>
      <div className="flex items-center justify-end gap-1 text-xs text-gray-500 pb-1">
        <span>Đã chi:</span>
        <input
          type="text"
          className="w-20 p-[2px] border border-gray-200 rounded text-right text-xs"
          value={expense ? formatMoney(expense) : ""}
          placeholder="0"
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            onExpenseChange(category.key, parseInt(raw) || 0);
          }}
          onFocus={(e) => e.target.select()}
        />
        <span className={expense > amount ? "text-red-500 font-semibold" : "text-gray-400"}>
          / {formatShort(amount)}
        </span>
      </div>
    </div>
  );
}

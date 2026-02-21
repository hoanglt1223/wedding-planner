import type { BudgetCategory } from "@/types/wedding";
import { formatShort } from "@/lib/format";

interface BudgetCategoryRowProps {
  category: BudgetCategory;
  percentage: number;
  amount: number;
  onChange: (key: string, value: number) => void;
}

export function BudgetCategoryRow({
  category,
  percentage,
  amount,
  onChange,
}: BudgetCategoryRowProps) {
  const barWidth = Math.min(percentage, 100);

  return (
    <div>
      <div className="flex justify-between items-center py-[5px] border-b border-[#f0e8e0] text-[0.8rem]">
        <span className="font-semibold">{category.l}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            className="w-[50px] p-[2px] border border-gray-300 rounded-[3px] text-right text-[0.78rem]"
            value={percentage}
            min={0}
            max={100}
            onChange={(e) => onChange(category.k, parseFloat(e.target.value) || 0)}
          />
          <span className="text-[0.68rem] text-gray-400">%</span>
          <span className="text-[#c0392b] font-bold min-w-[50px] text-right">
            {formatShort(amount)}
          </span>
        </div>
      </div>
      <div className="h-[4px] bg-gray-200 rounded-[2px] my-[2px]">
        <div
          className="h-full rounded-[2px] transition-all"
          style={{ width: `${barWidth}%`, background: category.cl }}
        />
      </div>
    </div>
  );
}

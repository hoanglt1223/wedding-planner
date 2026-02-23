import { getBudgetCategories } from "@/data/resolve-data";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import { BudgetCategoryRow } from "./budget-category-row";

interface BudgetPanelProps {
  budget: number;
  categoryOverrides: Record<string, number>;
  expenses: Record<string, number>;
  onSetBudget: (bud: number) => void;
  onSetCategoryPercent: (key: string, pct: number) => void;
  onSetExpense: (key: string, amount: number) => void;
  lang?: string;
}

const PRESETS_VI: [string, number][] = [
  ["100tr", 100e6], ["150tr", 150e6], ["200tr", 200e6],
  ["300tr", 300e6], ["500tr", 500e6], ["1tỷ", 1e9],
];
const PRESETS_EN: [string, number][] = [
  ["100M", 100e6], ["150M", 150e6], ["200M", 200e6],
  ["300M", 300e6], ["500M", 500e6], ["1B", 1e9],
];

export function BudgetPanel({
  budget,
  categoryOverrides,
  expenses,
  onSetBudget,
  onSetCategoryPercent,
  onSetExpense,
  lang = "vi",
}: BudgetPanelProps) {
  const categories = getBudgetCategories(lang);
  const presets = lang === "en" ? PRESETS_EN : PRESETS_VI;
  const cur = getCurrencySymbol(lang);

  const handleBudgetInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    onSetBudget(parseInt(raw) || 0);
  };

  const totalPct = categories.reduce(
    (sum, c) => sum + (categoryOverrides[c.key] ?? c.percentage),
    0
  );
  const totalAllocated = budget * totalPct / 100;
  const remaining = budget - totalAllocated;
  const overBudget = totalPct > 100;
  const totalExpenses = categories.reduce(
    (sum, c) => sum + (expenses[c.key] || 0),
    0
  );

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <div className="pb-2">
        <h2 className="text-base font-semibold">{t("💰 Ngân Sách", lang)}</h2>
      </div>
      <div className="space-y-1">
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 text-center font-bold text-[var(--theme-primary)] text-base"
          value={formatMoney(budget, lang)}
          onChange={handleBudgetInput}
          onFocus={(e) => e.target.select()}
        />

        <div className="flex flex-wrap justify-center gap-1 my-1">
          {presets.map(([label, value]) => (
            <span
              key={label}
              className="cursor-pointer text-blue-500 font-semibold hover:underline text-xs px-1.5 py-0.5 rounded hover:bg-blue-50"
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
            <h3 className="text-base font-semibold mb-1">{t("Thiết lập ngân sách cưới", lang)}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-3">
              {lang === "en" ? "Choose a budget level to see cost allocation" : "Chọn mức ngân sách để xem phân bổ chi phí hợp lý"}
            </p>
          </div>
        ) : (
          <>
            <div>
              {categories.map((cat) => {
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
                    lang={lang}
                  />
                );
              })}
            </div>

            <div className="mt-2 p-2.5 bg-[var(--theme-surface-muted)] rounded-lg text-center text-xs sm:text-sm leading-relaxed">
              {t("Tổng:", lang)}{" "}
              <b className={overBudget ? "text-red-500" : ""}>{totalPct}%</b>
              {" = "}
              <b className="text-[var(--theme-primary)]">{formatMoney(totalAllocated, lang)}{cur}</b>
              <br className="sm:hidden" />
              <span className="hidden sm:inline">{" | "}</span>
              <span className="sm:hidden"> </span>
              {t("Còn:", lang)}{" "}
              <b className={remaining >= 0 ? "text-green-600" : "text-red-500"}>
                {formatMoney(remaining, lang)}{cur}
              </b>
            </div>
            <div className="mt-1 p-2.5 bg-amber-50 rounded-lg text-center text-xs sm:text-sm">
              {t("Đã chi:", lang)}{" "}
              <b className={totalExpenses > budget ? "text-red-500" : "text-amber-600"}>
                {formatMoney(totalExpenses, lang)}{cur}
              </b>
              {" / "}
              <b>{formatMoney(budget, lang)}{cur}</b>
              {totalExpenses > 0 && budget > 0 && (
                <span className="ml-1 text-xs">
                  ({Math.round((totalExpenses / budget) * 100)}%)
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

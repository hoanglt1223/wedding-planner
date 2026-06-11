import { useState } from "react";
import type { BudgetCategory } from "@/types/wedding";
import { formatMoney, getCurrencySymbol } from "@/lib/format";

interface SegmentData {
  key: string;
  label: string;
  color: string;
  allocated: number;
  spent: number;
  pct: number;
}

interface BudgetDonutChartProps {
  budget: number;
  categories: BudgetCategory[];
  budgetOverrides: Record<string, number>;
  expenseLog: { category: string; amount: number }[];
  lang?: string;
}

function buildSegments(
  budget: number,
  categories: BudgetCategory[],
  budgetOverrides: Record<string, number>,
  expenseLog: { category: string; amount: number }[],
): SegmentData[] {
  const spentByCategory: Record<string, number> = {};
  for (const e of expenseLog) {
    spentByCategory[e.category] = (spentByCategory[e.category] || 0) + e.amount;
  }

  return categories
    .map((cat) => {
      const pct = budgetOverrides[cat.key] ?? cat.percentage;
      const allocated = (budget * pct) / 100;
      return {
        key: cat.key,
        label: cat.label,
        color: cat.color,
        allocated,
        spent: spentByCategory[cat.key] || 0,
        pct,
      };
    })
    .filter((s) => s.pct > 0);
}

function buildConicGradient(segments: SegmentData[], totalPct: number): string {
  const stops: string[] = [];
  let cumulative = 0;

  for (const seg of segments) {
    const end = cumulative + seg.pct;
    stops.push(`${seg.color} ${cumulative}% ${end}%`);
    cumulative = end;
  }

  // Fill remaining (if totalPct < 100) with transparent
  if (totalPct < 100) {
    stops.push(`transparent ${totalPct}% 100%`);
  }

  return `conic-gradient(${stops.join(", ")})`;
}

export function BudgetDonutChart({
  budget,
  categories,
  budgetOverrides,
  expenseLog,
  lang = "vi",
}: BudgetDonutChartProps) {
  const en = lang === "en";
  const cur = getCurrencySymbol(lang);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const segments = buildSegments(budget, categories, budgetOverrides, expenseLog);
  const totalPct = segments.reduce((s, seg) => s + seg.pct, 0);
  const totalSpent = segments.reduce((s, seg) => s + seg.spent, 0);
  const gradient = buildConicGradient(segments, totalPct);

  const hovered = hoveredKey ? segments.find((s) => s.key === hoveredKey) : null;

  if (budget === 0 || segments.length === 0) return null;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <h3 className="text-sm font-semibold mb-3">
        {en ? "Budget Allocation" : "Phân Bổ Ngân Sách"}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Donut */}
        <div className="relative shrink-0">
          <div
            className="w-40 h-40 rounded-full"
            style={{ background: gradient }}
          />
          {/* Inner hole */}
          <div
            className="absolute inset-6 rounded-full flex flex-col items-center justify-center"
            style={{ backgroundColor: "var(--theme-surface)" }}
          >
            {hovered ? (
              <>
                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                  {hovered.label}
                </span>
                <span className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>
                  {hovered.pct}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatMoney(hovered.allocated, lang)}{cur}
                </span>
              </>
            ) : (
              <>
                <span className="text-xs text-muted-foreground">
                  {en ? "Total" : "Tổng"}
                </span>
                <span className="text-lg font-bold" style={{ color: "var(--theme-primary)" }}>
                  {totalPct}%
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {formatMoney(budget, lang)}{cur}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0 space-y-1 w-full">
          {segments.map((seg) => {
            const isHovered = hoveredKey === seg.key;
            const overBudget = seg.spent > seg.allocated && seg.allocated > 0;

            return (
              <button
                key={seg.key}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-xs transition-colors ${
                  isHovered ? "bg-[var(--theme-surface-muted)]" : "hover:bg-[var(--theme-surface-muted)]"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="flex-1 text-left truncate">{seg.label}</span>
                <span className="font-medium tabular-nums shrink-0">
                  {seg.pct}%
                </span>
                {seg.spent > 0 && (
                  <span
                    className={`text-[10px] tabular-nums shrink-0 ${
                      overBudget ? "text-red-500 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    {formatMoney(seg.spent, lang)}
                  </span>
                )}
              </button>
            );
          })}

          {/* Total spent */}
          {totalSpent > 0 && (
            <div className="flex items-center justify-between px-2 pt-1 mt-1 border-t text-xs">
              <span className="text-muted-foreground">
                {en ? "Total spent" : "Tổng đã chi"}
              </span>
              <span
                className={`font-semibold ${
                  totalSpent > budget ? "text-red-500" : "text-amber-600"
                }`}
              >
                {formatMoney(totalSpent, lang)}{cur}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

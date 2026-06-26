import type { RegistryItem } from "@/types/wedding";
import { formatMoney, getCurrencySymbol } from "@/lib/format";

interface RegistrySummaryProps {
  items: RegistryItem[];
  lang: string;
}

export function RegistrySummary({ items, lang }: RegistrySummaryProps) {
  const en = lang === "en";
  const cur = getCurrencySymbol(lang);

  const total = items.length;
  const fulfilled = items.filter((i) => i.fulfilled).length;
  const remaining = total - fulfilled;
  const pct = total > 0 ? Math.round((fulfilled / total) * 100) : 0;

  const totalValue = items.reduce((s, i) => s + (i.price || 0), 0);
  const fulfilledValue = items.filter((i) => i.fulfilled).reduce((s, i) => s + (i.price || 0), 0);

  if (total === 0) return null;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-semibold" style={{ color: "var(--theme-primary)" }}>
        {en ? "📊 Registry Summary" : "📊 Tổng Quan Registry"}
      </h3>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-blue-600">{total}</div>
          <div className="text-[10px] text-blue-500">{en ? "Items" : "Mục"}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-green-600">{fulfilled}</div>
          <div className="text-[10px] text-green-500">{en ? "Fulfilled" : "Đã nhận"}</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-2.5 text-center">
          <div className="text-lg font-bold text-amber-600">{remaining}</div>
          <div className="text-[10px] text-amber-500">{en ? "Remaining" : "Còn lại"}</div>
        </div>
      </div>

      {/* Value summary */}
      {totalValue > 0 && (
        <div className="flex items-center justify-between text-xs pt-1 border-t border-dashed">
          <span className="text-muted-foreground">
            {en ? "Total value" : "Tổng giá trị"}
          </span>
          <span className="font-semibold">{formatMoney(totalValue, lang)}{cur}</span>
        </div>
      )}
      {fulfilledValue > 0 && totalValue > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {en ? "Received value" : "Giá trị đã nhận"}
          </span>
          <span className="font-semibold text-green-600">{formatMoney(fulfilledValue, lang)}{cur}</span>
        </div>
      )}
    </div>
  );
}

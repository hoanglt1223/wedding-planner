import { useState } from "react";
import { formatMoney, getCurrencySymbol } from "@/lib/format";
import { t } from "@/lib/i18n";
import { getExpenseCategories } from "@/data/resolve-data";
import type { ExpenseEntry } from "@/types/wedding";

interface ExpenseListProps {
  expenseLog: ExpenseEntry[];
  lang: string;
  onEdit: (entry: ExpenseEntry) => void;
  onRemove: (id: number) => void;
  onTogglePaid: (id: number, paid: boolean) => void;
}

type SortKey = "date" | "amount" | "category";

export function ExpenseList({ expenseLog, lang, onEdit, onRemove, onTogglePaid }: ExpenseListProps) {
  const [sortBy, setSortBy] = useState<SortKey>("date");
  const [filterCat, setFilterCat] = useState("");
  const [filterPaid, setFilterPaid] = useState<"" | "paid" | "unpaid">("");
  const categories = getExpenseCategories(lang);
  const cur = getCurrencySymbol(lang);

  const catMap = Object.fromEntries(categories.map((c) => [c.key, c]));

  let filtered = [...expenseLog];
  if (filterCat) filtered = filtered.filter((e) => e.category === filterCat);
  if (filterPaid === "paid") filtered = filtered.filter((e) => e.paid);
  if (filterPaid === "unpaid") filtered = filtered.filter((e) => !e.paid);

  filtered.sort((a, b) => {
    if (sortBy === "date") return b.date.localeCompare(a.date);
    if (sortBy === "amount") return b.amount - a.amount;
    return a.category.localeCompare(b.category);
  });

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <h3 className="text-sm font-semibold mb-2">{t("Danh sách chi phí", lang)}</h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="text-xs border rounded px-1.5 py-1"
        >
          <option value="date">{t("Ngày", lang)}</option>
          <option value="amount">{t("Số tiền", lang)}</option>
          <option value="category">{t("Hạng mục", lang)}</option>
        </select>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="text-xs border rounded px-1.5 py-1"
        >
          <option value="">{t("Tất cả", lang)}</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
          ))}
        </select>
        <select
          value={filterPaid}
          onChange={(e) => setFilterPaid(e.target.value as "" | "paid" | "unpaid")}
          className="text-xs border rounded px-1.5 py-1"
        >
          <option value="">{t("Tất cả", lang)}</option>
          <option value="paid">{t("Đã thanh toán", lang)}</option>
          <option value="unpaid">{t("Chưa thanh toán", lang)}</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-6">
          {t("Chưa có chi phí nào", lang)}
        </p>
      ) : (
        <div className="space-y-1.5">
          {filtered.map((entry) => {
            const cat = catMap[entry.category];
            return (
              <div
                key={entry.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 text-sm"
              >
                <span className="text-base shrink-0">{cat?.icon || "📦"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium truncate">{entry.description}</span>
                    {entry.paid && <span className="text-green-600 text-xs">✓</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.date}{entry.vendorName ? ` · ${entry.vendorName}` : ""}
                  </div>
                </div>
                <span className="font-semibold text-xs whitespace-nowrap">
                  {formatMoney(entry.amount, lang)}{cur}
                </span>
                <div className="flex gap-0.5 shrink-0">
                  <button
                    onClick={() => onTogglePaid(entry.id, !entry.paid)}
                    className="p-1 rounded hover:bg-muted text-xs"
                    title={entry.paid ? t("Chưa thanh toán", lang) : t("Đã thanh toán", lang)}
                  >
                    {entry.paid ? "↩" : "✓"}
                  </button>
                  <button onClick={() => onEdit(entry)} className="p-1 rounded hover:bg-muted text-xs">✏️</button>
                  <button onClick={() => onRemove(entry.id)} className="p-1 rounded hover:bg-muted text-xs text-red-500">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

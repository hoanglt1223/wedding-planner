import { useState } from "react";
import { t } from "@/lib/i18n";
import { getExpenseCategories } from "@/data/resolve-data";
import { BudgetOverview } from "./budget-overview";
import { BudgetSummary } from "./budget-summary";
import { CategoryBreakdown } from "./category-breakdown";
import { ExpenseList } from "./expense-list";
import { ExpenseForm } from "./expense-form";
import { BudgetPanel } from "./budget-panel";
import type { WeddingState, ExpenseEntry } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface ExpenseTrackerProps {
  state: WeddingState;
  store: WeddingStore;
}

const INJECTION_CHARS = /^[=+\-@]/;
function sanitize(v: string) { return INJECTION_CHARS.test(v) ? `'${v}` : v; }
function escCsv(v: string) {
  const s = sanitize(v);
  return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
}

export function ExpenseTracker({ state, store }: ExpenseTrackerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExpenseEntry | null>(null);
  const [showAllocation, setShowAllocation] = useState(false);
  const lang = state.lang;
  const expenseLog = state.expenseLog || [];

  function handleEdit(entry: ExpenseEntry) {
    setEditing(entry);
    setShowForm(true);
  }

  function handleExportCsv() {
    const categories = getExpenseCategories(lang);
    const catMap = Object.fromEntries(categories.map((c) => [c.key, c.label]));
    const BOM = "\uFEFF";
    const headers = lang === "en"
      ? ["Date", "Category", "Description", "Vendor", "Amount", "Paid"]
      : ["Ngày", "Hạng mục", "Mô tả", "Nhà cung cấp", "Số tiền", "Đã TT"];
    const rows = expenseLog.map((e) => [
      escCsv(e.date), escCsv(catMap[e.category] || e.category),
      escCsv(e.description), escCsv(e.vendorName || ""),
      String(e.amount), e.paid ? (lang === "en" ? "Yes" : "Có") : (lang === "en" ? "No" : "Chưa"),
    ]);
    const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <BudgetOverview budget={state.budget} expenseLog={expenseLog} lang={lang} />
      <BudgetSummary expenseLog={expenseLog} budget={state.budget} lang={lang} />
      <CategoryBreakdown
        budget={state.budget}
        budgetOverrides={state.budgetOverrides}
        expenseLog={expenseLog}
        lang={lang}
      />

      {/* Allocation toggle */}
      <button
        onClick={() => setShowAllocation(!showAllocation)}
        className="w-full text-xs text-center text-[var(--theme-primary)] py-1 hover:underline"
      >
        {showAllocation ? t("Ẩn phân bổ ngân sách", lang) : t("Xem phân bổ ngân sách", lang)}
      </button>
      {showAllocation && (
        <BudgetPanel
          budget={state.budget}
          categoryOverrides={state.budgetOverrides}
          expenses={state.expenses || {}}
          onSetBudget={store.setBudget}
          onSetCategoryPercent={store.setCategoryPercent}
          onSetExpense={store.setExpense}
          lang={lang}
        />
      )}

      {/* Form toggle / form */}
      {showForm ? (
        <ExpenseForm
          key={editing?.id ?? "new"}
          lang={lang}
          editing={editing}
          onSubmit={store.addExpense}
          onUpdate={store.updateExpense}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex-1 bg-[var(--theme-primary)] text-white rounded-lg py-2 text-sm font-medium hover:opacity-90"
          >
            + {t("Thêm chi phí", lang)}
          </button>
          {expenseLog.length > 0 && (
            <button
              onClick={handleExportCsv}
              className="text-xs px-3 py-2 border rounded-lg hover:bg-muted transition-colors"
            >
              ⬇️ CSV
            </button>
          )}
        </div>
      )}

      <ExpenseList
        expenseLog={expenseLog}
        lang={lang}
        onEdit={handleEdit}
        onRemove={store.removeExpense}
        onTogglePaid={(id, paid) => store.updateExpense(id, { paid })}
      />
    </div>
  );
}

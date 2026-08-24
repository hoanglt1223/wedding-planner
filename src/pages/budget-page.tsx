import { useState, useMemo } from "react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { BudgetTracker } from "@/components/budget/budget-tracker";
import { ExpenseForm } from "@/components/budget/expense-form";
import { CategoryBreakdown } from "@/components/budget/category-breakdown";
import { BudgetVsActualChart } from "@/components/budget/budget-vs-actual-chart";
import { SpendingTrendChart } from "@/components/budget/spending-trend-chart";
import { BudgetHealthCard } from "@/components/budget/budget-health-card";
import { BudgetHealthAlerts } from "@/components/budget/budget-health-alerts";
import { calculateBudgetHealth } from "@/lib/budget-health";
import { getBudgetCategories } from "@/data/resolve-data";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export function BudgetPage() {
  const { state, addExpense, updateExpense, removeExpense } = useWeddingStoreContext();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<number | null>(null);
  const lang = state.lang || "vi";
  const en = lang === "en";

  const expenses = state.expenseLog || [];
  const totalBudget = state.budget || 0;

  const totalSpent = useMemo(() =>
    expenses.reduce((sum, exp) => sum + exp.amount, 0), [expenses]);

  const remaining = totalBudget - totalSpent;
  const overBudget = totalSpent > totalBudget;

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return totals;
  }, [expenses]);

  const budgetCategories = useMemo(() => getBudgetCategories(lang), [lang]);

  // Calculate budget health alerts
  const budgetHealth = useMemo(() =>
    calculateBudgetHealth(totalBudget, expenses, lang as "vi" | "en"),
    [totalBudget, expenses, lang]
  );

  // Collect all active alerts
  const activeAlerts = useMemo(() => {
    const alerts: Array<typeof budgetHealth.overall> = [];
    if (budgetHealth.overall) {
      alerts.push(budgetHealth.overall);
    }
    budgetHealth.categories.forEach(cat => {
      if (cat.alert) {
        alerts.push(cat.alert);
      }
    });
    return alerts.filter(alert => alert !== null);
  }, [budgetHealth]);

  const handleEditExpense = (expense: import("@/types/wedding").ExpenseEntry) => {
    if (editingExpense !== null) {
      updateExpense(editingExpense, expense);
    }
    setEditingExpense(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--theme-primary)]">
            {en ? "💰 Budget & Expenses" : "💰 Ngân Sách & Chi Tiêu"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {en ? "Track your wedding spending" : "Theo dõi chi tiêu đám cưới"}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]"
        >
          <Plus className="w-4 h-4 mr-2" />
          {en ? "Add Expense" : "Thêm Chi Tiêu"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {en ? "Total Budget" : "Tổng Ngân Sách"}
            </span>
          </div>
          <div className="text-2xl font-bold">
            {totalBudget.toLocaleString()}₫
          </div>
        </div>

        <div className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-xs text-muted-foreground">
              {en ? "Total Spent" : "Đã Chi Tiêu"}
            </span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {totalSpent.toLocaleString()}₫
          </div>
        </div>

        <div className={`bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-4 ${overBudget ? 'border-red-300' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className={`w-4 h-4 ${overBudget ? 'text-red-500' : 'text-green-500'}`} />
            <span className="text-xs text-muted-foreground">
              {en ? "Remaining" : "Còn Lại"}
            </span>
          </div>
          <div className={`text-2xl font-bold ${overBudget ? 'text-red-600' : 'text-green-600'}`}>
            {remaining.toLocaleString()}₫
          </div>
        </div>
      </div>

      {/* Budget Health Alerts */}
      {activeAlerts.length > 0 && (
        <BudgetHealthAlerts
          alerts={activeAlerts}
          lang={lang}
        />
      )}

      {totalBudget > 0 && (
        <div className="bg-[var(--theme-surface)] rounded-lg border border-[var(--theme-border)] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {en ? "Budget Utilization" : "Sử Dụng Ngân Sách"}
            </span>
            <span className={`text-sm font-bold ${overBudget ? 'text-red-600' : ''}`}>
              {((totalSpent / totalBudget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-[var(--theme-primary)]'}`}
              style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {Object.keys(categoryTotals).length > 0 && (
        <CategoryBreakdown
          categoryTotals={categoryTotals}
          totalBudget={totalBudget}
          lang={lang}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {expenses.length > 0 && (
          <SpendingTrendChart expenses={expenses} lang={lang} />
        )}
        {totalBudget > 0 && (
          <BudgetHealthCard
            categories={budgetCategories}
            budgetOverrides={state.budgetOverrides || {}}
            categoryExpenses={categoryTotals}
            totalBudget={totalBudget}
            totalSpent={totalSpent}
            lang={lang}
          />
        )}
      </div>

      {totalBudget > 0 && budgetCategories.length > 0 && (
        <BudgetVsActualChart
          categories={budgetCategories}
          budgetOverrides={state.budgetOverrides || {}}
          categoryExpenses={categoryTotals}
          totalBudget={totalBudget}
          lang={lang}
        />
      )}

      <BudgetTracker
        expenses={expenses}
        onEdit={(id) => setEditingExpense(id)}
        onDelete={removeExpense}
        lang={lang}
      />

      {(showForm || editingExpense !== null) && (
        <ExpenseForm
          expense={editingExpense !== null ? expenses.find(e => e.id === editingExpense) : undefined}
          onSave={handleEditExpense}
          onSaveNew={addExpense}
          onCancel={() => {
            setShowForm(false);
            setEditingExpense(null);
          }}
          lang={lang}
        />
      )}
    </div>
  );
}

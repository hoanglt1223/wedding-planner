import { Card, CardContent } from "@/components/ui/card";
import type { BudgetCategory } from "@/types/wedding";

interface BudgetHealthCardProps {
  categories: BudgetCategory[];
  budgetOverrides: Record<string, number>;
  categoryExpenses: Record<string, number>;
  totalBudget: number;
  totalSpent: number;
  lang?: string;
}

type HealthStatus = "healthy" | "warning" | "critical";

interface CategoryHealth {
  key: string;
  label: string;
  allocated: number;
  spent: number;
  status: HealthStatus;
}

export function BudgetHealthCard({
  categories,
  budgetOverrides,
  categoryExpenses,
  totalBudget,
  totalSpent,
  lang = "vi",
}: BudgetHealthCardProps) {
  const en = lang === "en";

  if (totalBudget === 0) return null;

  const categoryHealth: CategoryHealth[] = categories
    .map((cat) => {
      const pct = budgetOverrides[cat.key] ?? cat.percentage;
      const allocated = (totalBudget * pct) / 100;
      const spent = categoryExpenses[cat.key] || 0;
      const usagePct = allocated > 0 ? (spent / allocated) * 100 : 0;

      let status: HealthStatus = "healthy";
      if (spent > allocated && allocated > 0) {
        status = "critical";
      } else if (usagePct > 80) {
        status = "warning";
      }

      return {
        key: cat.key,
        label: cat.label,
        allocated,
        spent,
        status,
      };
    })
    .filter((c) => c.allocated > 0 || c.spent > 0);

  const overallUsagePct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  let overallStatus: HealthStatus = "healthy";
  if (totalSpent > totalBudget) {
    overallStatus = "critical";
  } else if (overallUsagePct > 80) {
    overallStatus = "warning";
  }

  const criticalCount = categoryHealth.filter((c) => c.status === "critical").length;
  const warningCount = categoryHealth.filter((c) => c.status === "warning").length;
  const healthyCount = categoryHealth.filter((c) => c.status === "healthy").length;

  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getStatusIcon = (status: HealthStatus) => {
    switch (status) {
      case "healthy":
        return "✅";
      case "warning":
        return "⚠️";
      case "critical":
        return "🚨";
    }
  };

  const getStatusLabel = (status: HealthStatus) => {
    if (en) {
      switch (status) {
        case "healthy":
          return "Good";
        case "warning":
          return "Watch";
        case "critical":
          return "Over Budget";
      }
    } else {
      switch (status) {
        case "healthy":
          return "Tốt";
        case "warning":
          return "Cần chú ý";
        case "critical":
          return "Vượt ngân sách";
      }
    }
  };

  const getInsights = () => {
    const insights: string[] = [];

    if (overallStatus === "critical") {
      insights.push(en ? "Total spending exceeds budget" : "Tổng chi tiêu vượt ngân sách");
    } else if (overallStatus === "warning") {
      insights.push(en ? "Approaching budget limit" : "Đ nearing hạn mức ngân sách");
    } else {
      insights.push(en ? "Budget is on track" : "Ngân sách ổn định");
    }

    if (criticalCount > 0) {
      insights.push(
        en
          ? `${criticalCount} categories over budget`
          : `${criticalCount} danh mục vượt ngân sách`
      );
    }

    if (warningCount > 0) {
      insights.push(
        en
          ? `${warningCount} categories near limit`
          : `${warningCount} danh mục gần đạt hạn mức`
      );
    }

    return insights;
  };

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          {en ? "💡 Budget Health" : "💡 Sức Khỏe Ngân Sách"}
        </h3>

        <div className={`p-3 rounded-lg border mb-3 ${getStatusColor(overallStatus)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getStatusIcon(overallStatus)}</span>
              <span className="font-semibold">{getStatusLabel(overallStatus)}</span>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">
                {en ? "Used" : "Đã dùng"}
              </div>
              <div className="font-bold">
                {overallUsagePct.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-current opacity-80 transition-all"
              style={{ width: `${Math.min(overallUsagePct, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-2 mb-3">
          {getInsights().map((insight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{insight}</span>
            </div>
          ))}
        </div>

        {categoryHealth.length > 0 && (
          <div className="pt-3 border-t">
            <div className="text-xs font-medium mb-2 text-muted-foreground">
              {en ? "Category Breakdown" : "Chi Tiết Danh Mục"}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 rounded bg-green-50">
                <div className="text-lg font-bold text-green-600">{healthyCount}</div>
                <div className="text-muted-foreground">
                  {en ? "Good" : "Tốt"}
                </div>
              </div>
              <div className="text-center p-2 rounded bg-amber-50">
                <div className="text-lg font-bold text-amber-600">{warningCount}</div>
                <div className="text-muted-foreground">
                  {en ? "Watch" : "Chú ý"}
                </div>
              </div>
              <div className="text-center p-2 rounded bg-red-50">
                <div className="text-lg font-bold text-red-600">{criticalCount}</div>
                <div className="text-muted-foreground">
                  {en ? "Over" : "Vượt"}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

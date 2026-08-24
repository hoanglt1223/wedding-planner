import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, TrendingUp, Wallet, CheckCircle2 } from "lucide-react"
import type { WeddingState } from "@/types/wedding"

interface BudgetHealthDashboardProps {
  budget: number
  expenses: WeddingState["expenseLog"]
  lang?: "vi" | "en"
}

interface CategoryHealth {
  category: string
  budget: number
  spent: number
  remaining: number
  percentage: number
  status: "healthy" | "warning" | "over" | "empty"
}

const BUDGET_CATEGORIES = [
  { key: "venue", labelVi: "Địa điểm", labelEn: "Venue", defaultPct: 25 },
  { key: "catering", labelVi: "Ẩm thực", labelEn: "Catering", defaultPct: 30 },
  { key: "photo", labelVi: "Chụp ảnh", labelEn: "Photography", defaultPct: 10 },
  { key: "outfit", labelVi: "Trang phục", labelEn: "Outfits", defaultPct: 8 },
  { key: "decoration", labelVi: "Trang trí", labelEn: "Decoration", defaultPct: 7 },
  { key: "music", labelVi: "Âm nhạc", labelEn: "Music/Entertainment", defaultPct: 5 },
  { key: "gifts", labelVi: "Quà tặng", labelEn: "Gifts/Favors", defaultPct: 5 },
  { key: "transport", labelVi: "Vận chuyển", labelEn: "Transportation", defaultPct: 4 },
  { key: "other", labelVi: "Khác", labelEn: "Other", defaultPct: 6 },
]

function formatCurrency(amount: number, lang: "vi" | "en"): string {
  if (lang === "vi") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function calculateCategoryHealth(
  category: typeof BUDGET_CATEGORIES[0],
  totalBudget: number,
  expenses: WeddingState["expenseLog"]
): CategoryHealth {
  const categoryBudget = (category.defaultPct / 100) * totalBudget
  const spent = expenses
    .filter((e) => e.category === category.key)
    .reduce((sum, e) => sum + e.amount, 0)

  const remaining = categoryBudget - spent
  const percentage = categoryBudget > 0 ? (spent / categoryBudget) * 100 : 0

  let status: CategoryHealth["status"] = "healthy"
  if (spent === 0) status = "empty"
  else if (percentage >= 100) status = "over"
  else if (percentage >= 85) status = "warning"

  return {
    category: category.key,
    budget: categoryBudget,
    spent,
    remaining,
    percentage,
    status,
  }
}

function getProgressColor(status: CategoryHealth["status"]): string {
  switch (status) {
    case "healthy": return "bg-green-500"
    case "warning": return "bg-amber-500"
    case "over": return "bg-red-500"
    case "empty": return "bg-slate-300"
  }
}

function getStatusBadge(status: CategoryHealth["status"], lang: "vi" | "en"): { label: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  switch (status) {
    case "healthy":
      return { label: lang === "vi" ? "Tốt" : "Good", variant: "outline" as const }
    case "warning":
      return { label: lang === "vi" ? "Cảnh báo" : "Warning", variant: "secondary" as const }
    case "over":
      return { label: lang === "vi" ? "Vượt" : "Over", variant: "destructive" as const }
    case "empty":
      return { label: lang === "vi" ? "Chưa chi" : "No spend", variant: "outline" as const }
  }
}

export function BudgetHealthDashboard({ budget, expenses, lang = "vi" }: BudgetHealthDashboardProps) {
  const isVietnamese = lang === "vi" || lang === undefined

  if (budget <= 0) {
    return null
  }

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const totalRemaining = budget - totalSpent
  const overallPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0

  let overallStatus: "healthy" | "warning" | "over" = "healthy"
  if (overallPercentage >= 100) overallStatus = "over"
  else if (overallPercentage >= 85) overallStatus = "warning"

  const categoryHealth = BUDGET_CATEGORIES.map((cat) =>
    calculateCategoryHealth(cat, budget, expenses)
  ).filter((ch) => ch.budget > 0)

  const warningCount = categoryHealth.filter((ch) => ch.status === "warning" || ch.status === "over").length
  const overBudgetCount = categoryHealth.filter((ch) => ch.status === "over").length

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-2 text-lg">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            {isVietnamese ? "Tình Trình Ngân Sách" : "Budget Health"}
          </div>
          {(overBudgetCount > 0 || warningCount > 0) && (
            <Badge variant={overBudgetCount > 0 ? "destructive" : "secondary"} className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {overBudgetCount > 0
                ? `${overBudgetCount} ${isVietnamese ? "vượt" : "over"}`
                : `${warningCount} ${isVietnamese ? "cảnh báo" : "warn"}`}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Budget Summary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {isVietnamese ? "Tổng chi tiêu" : "Total Spent"}
            </span>
            <span className="text-lg font-bold text-primary">
              {formatCurrency(totalSpent, lang)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{overallPercentage.toFixed(1)}%</span>
              <span>{formatCurrency(totalRemaining, lang)} {isVietnamese ? "còn lại" : "left"}</span>
            </div>
            <Progress
              value={Math.min(overallPercentage, 100)}
              className="h-2"
              indicatorClassName={
                overallStatus === "over"
                  ? "bg-red-500"
                  : overallStatus === "warning"
                    ? "bg-amber-500"
                    : "bg-green-500"
              }
            />
          </div>

          {overallStatus === "over" && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle className="h-3.5 w-3.5" />
              {isVietnamese
                ? "Đã vượt ngân sách tổng!"
                : "Over total budget!"}
            </div>
          )}

          {overallStatus === "warning" && overallPercentage < 100 && (
            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              <TrendingUp className="h-3.5 w-3.5" />
              {isVietnamese
                ? "Gần hết ngân sách"
                : "Approaching budget limit"}
            </div>
          )}
        </div>

        <Separator />

        {/* Category Breakdown */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase">
            {isVietnamese ? "Theo danh mục" : "By Category"}
          </p>

          <div className="space-y-2.5">
            {categoryHealth.map((health) => {
              const categoryDef = BUDGET_CATEGORIES.find((c) => c.key === health.category)!
              const statusBadge = getStatusBadge(health.status, lang)

              return (
                <div key={health.category} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium">
                      {isVietnamese ? categoryDef.labelVi : categoryDef.labelEn}
                    </span>
                    <div className="flex items-center gap-2">
                      {health.status !== "empty" && (
                        <span className="text-xs text-muted-foreground">
                          {health.percentage.toFixed(0)}%
                        </span>
                      )}
                      <Badge variant={statusBadge.variant} className="text-[10px] px-1.5 py-0 h-4">
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(health.percentage, 100)}
                    className="h-1.5"
                    indicatorClassName={getProgressColor(health.status)}
                  />

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{formatCurrency(health.spent, lang)} / {formatCurrency(health.budget, lang)}</span>
                    {health.remaining > 0 ? (
                      <span className="text-green-600">
                        {formatCurrency(health.remaining, lang)} {isVietnamese ? "còn" : "left"}
                      </span>
                    ) : health.remaining < 0 ? (
                      <span className="text-red-600">
                        {formatCurrency(Math.abs(health.remaining), lang)} {isVietnamese ? "vượt" : "over"}
                      </span>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {overBudgetCount === 0 && warningCount === 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCircle2 className="h-4 w-4" />
            {isVietnamese
              ? "Tất cả danh mục trong giới hạn"
              : "All categories on track"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

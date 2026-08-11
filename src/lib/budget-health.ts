import type { ExpenseEntry } from "@/types/wedding";

export interface BudgetHealthAlert {
  level: "warning" | "danger" | "critical";
  message: string;
  percentage: number;
  overspent: number;
  category?: string;
}

export interface BudgetHealthSummary {
  overall: BudgetHealthAlert | null;
  categories: Array<{
    category: string;
    spent: number;
    budget: number;
    percentage: number;
    alert: BudgetHealthAlert | null;
  }>;
}

const BUDGET_CATEGORIES = {
  venue: { budget: 30, vi: "Địa điểm", en: "Venue" },
  catering: { budget: 25, vi: "Ẩm thực", en: "Catering" },
  attire: { budget: 10, vi: "Trang phục", en: "Attire" },
  decorations: { budget: 10, vi: "Trang trí", en: "Decorations" },
  photography: { budget: 10, vi: "Chụp ảnh", en: "Photography" },
  music: { budget: 5, vi: "Âm nhạc", en: "Music" },
  transportation: { budget: 5, vi: "Vận chuyển", en: "Transportation" },
  gifts: { budget: 3, vi: "Quà tặng", en: "Gifts" },
  other: { budget: 2, vi: "Khác", en: "Other" },
};

export function calculateBudgetHealth(
  totalBudget: number,
  expenseLog: ExpenseEntry[],
  lang: "vi" | "en" = "vi"
): BudgetHealthSummary {
  const totalSpent = expenseLog.reduce((sum, e) => sum + e.amount, 0);
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const overspent = Math.max(0, totalSpent - totalBudget);

  // Calculate overall health alert
  let overallAlert: BudgetHealthAlert | null = null;
  if (percentage >= 100) {
    overallAlert = {
      level: percentage >= 110 ? "critical" : "danger",
      message: lang === "en"
        ? `Budget exceeded by ${((percentage - 100) / 100 * totalBudget).toLocaleString()}₫`
        : `Vượt ngân sách ${((percentage - 100) / 100 * totalBudget).toLocaleString()}₫`,
      percentage,
      overspent,
    };
  } else if (percentage >= 90) {
    overallAlert = {
      level: "warning",
      message: lang === "en"
        ? `Only ${(100 - percentage).toFixed(1)}% budget remaining`
        : `Chỉ còn ${(100 - percentage).toFixed(1)}% ngân sách`,
      percentage,
      overspent: 0,
    };
  } else if (percentage >= 75) {
    overallAlert = {
      level: "warning",
      message: lang === "en"
        ? `${(100 - percentage).toFixed(1)}% budget used - monitor spending`
        : `Đã dùng ${(100 - percentage).toFixed(1)}% ngân sách - theo dõi chi tiêu`,
      percentage,
      overspent: 0,
    };
  }

  // Calculate per-category health
  const categoryBreakdown: BudgetHealthSummary["categories"] = [];

  for (const [key, config] of Object.entries(BUDGET_CATEGORIES)) {
    const categoryBudget = (config.budget / 100) * totalBudget;
    const categorySpent = expenseLog
      .filter(e => e.category === key)
      .reduce((sum, e) => sum + e.amount, 0);
    const categoryPercentage = categoryBudget > 0 ? (categorySpent / categoryBudget) * 100 : 0;

    let categoryAlert: BudgetHealthAlert | null = null;
    if (categoryPercentage >= 100) {
      categoryAlert = {
        level: categoryPercentage >= 120 ? "critical" : "danger",
        message: lang === "en"
          ? `${config.en} budget exceeded`
          : `Vượt ngân sách ${config.vi}`,
        percentage: categoryPercentage,
        overspent: categorySpent - categoryBudget,
        category: key,
      };
    } else if (categoryPercentage >= 90) {
      categoryAlert = {
        level: "warning",
        message: lang === "en"
          ? `${config.en} almost at budget limit`
          : `${config.vi} gần đến giới hạn ngân sách`,
        percentage: categoryPercentage,
        overspent: 0,
        category: key,
      };
    }

    categoryBreakdown.push({
      category: key,
      spent: categorySpent,
      budget: categoryBudget,
      percentage: categoryPercentage,
      alert: categoryAlert,
    });
  }

  return {
    overall: overallAlert,
    categories: categoryBreakdown,
  };
}

export function getAlertColor(level: BudgetHealthAlert["level"]): string {
  switch (level) {
    case "warning":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "danger":
      return "text-red-600 bg-red-50 border-red-200";
    case "critical":
      return "text-red-700 bg-red-100 border-red-300 font-bold";
    default:
      return "";
  }
}

export function getAlertIcon(level: BudgetHealthAlert["level"]): string {
  switch (level) {
    case "warning":
      return "⚠️";
    case "danger":
      return "🔴";
    case "critical":
      return "🚨";
    default:
      return "";
  }
}
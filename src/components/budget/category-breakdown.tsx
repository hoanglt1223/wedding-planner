import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryBreakdownProps {
  categoryTotals: Record<string, number>;
  totalBudget: number;
  lang: string;
}

export function CategoryBreakdown({ categoryTotals, totalBudget, lang }: CategoryBreakdownProps) {
  const en = lang === "en";

  const getCategoryInfo = (category: string) => {
    const info: Record<string, { vi: string; en: string; emoji: string }> = {
      venue: { vi: "Địa điểm", en: "Venue", emoji: "🏛️" },
      catering: { vi: "Ẩm thực", en: "Catering", emoji: "🍽️" },
      attire: { vi: "Trang phục", en: "Attire", emoji: "👗" },
      decorations: { vi: "Trang trí", en: "Decorations", emoji: "🎀" },
      photography: { vi: "Chụp ảnh", en: "Photography", emoji: "📸" },
      music: { vi: "Âm nhạc", en: "Music", emoji: "🎵" },
      transportation: { vi: "Vận chuyển", en: "Transportation", emoji: "🚐" },
      gifts: { vi: "Quà tặng", en: "Gifts", emoji: "🎁" },
      other: { vi: "Khác", en: "Other", emoji: "📦" },
    };
    return info[category] || { vi: category, en: category, emoji: "📦" };
  };

  const totalSpent = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .map(([category, amount]) => ({ category, amount }));

  return (
    <Card className="border-[var(--theme-border)]">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">
          {en ? "📊 Spending by Category" : "📊 Chi Tiêu Theo Danh Mục"}
        </h3>
        <div className="space-y-3">
          {sortedCategories.map(({ category, amount }) => {
            const info = getCategoryInfo(category);
            const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            const budgetPercentage = totalBudget > 0 ? (amount / totalBudget) * 100 : 0;

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{info.emoji}</span>
                    <span className="font-medium">{en ? info.en : info.vi}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {amount.toLocaleString()}₫
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}% {en ? "of total" : "tổng chi"}
                    </div>
                  </div>
                </div>
                {totalBudget > 0 && (
                  <Progress
                    value={Math.min(budgetPercentage, 100)}
                    className="h-2"
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

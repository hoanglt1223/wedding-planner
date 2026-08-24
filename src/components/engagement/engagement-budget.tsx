/**
 * Engagement Budget Component
 * Budget tracking for engagement ceremony
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, AlertCircle, Target } from "lucide-react";
import { useState } from "react";

interface EngagementGiftItem {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  quantity: number;
  estimatedCost: number;
  prepared: boolean;
  notes: string;
}

interface EngagementBudgetProps {
  budget: number;
  gifts: EngagementGiftItem[];
  totalGiftCost: number;
  onSetBudget: (budget: number) => void;
  lang: "vi" | "en";
}

export function EngagementBudget({ budget, gifts, totalGiftCost, onSetBudget, lang }: EngagementBudgetProps) {
  const en = lang === "en";

  const [editBudget, setEditBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  const remainingBudget = budget - totalGiftCost;
  const budgetUsed = budget > 0 ? (totalGiftCost / budget) * 100 : 0;
  const isOverBudget = totalGiftCost > budget;
  const hasBudget = budget > 0;

  const handleSaveBudget = () => {
    const parsed = parseInt(tempBudget);
    if (!isNaN(parsed) && parsed >= 0) {
      onSetBudget(parsed);
      setEditBudget(false);
    }
  };

  // Calculate category breakdown
  const categoryBreakdown = gifts.reduce((acc, gift) => {
    if (!acc[gift.category]) {
      acc[gift.category] = 0;
    }
    acc[gift.category] += gift.estimatedCost;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Budget Overview */}
      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {en ? "Engagement Budget" : "Ngân sách đính hôn"}
              </CardTitle>
              <CardDescription>
                {en ? "Track your engagement ceremony expenses" : "Theo dõi chi tiêu lễ đính hôn"}
              </CardDescription>
            </div>
            {!editBudget && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditBudget(true);
                  setTempBudget(budget.toString());
                }}
              >
                {en ? "Edit Budget" : "Chỉnh sửa"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget Input */}
          {editBudget && (
            <div className="flex gap-2">
              <div className="flex-1">
                <Label>{en ? "Total Budget (₫)" : "Tổng ngân sách (₫)"}</Label>
                <Input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleSaveBudget} className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]">
                  {en ? "Save" : "Lưu"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditBudget(false);
                    setTempBudget(budget.toString());
                  }}
                >
                  {en ? "Cancel" : "Hủy"}
                </Button>
              </div>
            </div>
          )}

          {/* Budget Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {en ? "Total Budget" : "Tổng ngân sách"}
              </p>
              <p className="text-xl font-bold">
                {budget.toLocaleString()}₫
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {en ? "Gift Costs" : "Chi phí quà"}
              </p>
              <p className="text-xl font-bold text-red-600">
                {totalGiftCost.toLocaleString()}₫
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {en ? "Remaining" : "Còn lại"}
              </p>
              <p className={`text-xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                {remainingBudget.toLocaleString()}₫
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {hasBudget && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {en ? "Budget Used" : "Đã sử dụng"}
                </span>
                <span className={`font-semibold ${isOverBudget ? "text-red-600" : ""}`}>
                  {budgetUsed.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={Math.min(budgetUsed, 100)}
                className={isOverBudget ? "bg-red-100" : ""}
              />
              {isOverBudget && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {en
                      ? `Over budget by ${(totalGiftCost - budget).toLocaleString()}₫`
                      : `Vượt ngân sách ${(totalGiftCost - budget).toLocaleString()}₫`}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {sortedCategories.length > 0 && (
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {en ? "Cost Breakdown" : "Phân tích chi phí"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedCategories.map(([category, cost]) => {
                const percentage = totalGiftCost > 0 ? (cost / totalGiftCost) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cost.toLocaleString()}₫</span>
                        <span className="text-xs text-muted-foreground">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-900">
                {en ? "Budget Tips" : "Mẹo ngân sách"}
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• {en ? "Set budget before shopping for gifts" : "Đặt ngân sách trước khi mua quà"}</li>
                <li>• {en ? "Traditional items (betel, tea) are usually affordable" : "Đồ truyền thống (trầu, trà) thường hợp lý"}</li>
                <li>• {en ? "Jewelry and photography are major expenses" : "Trang sức và chụp ảnh là chi phí lớn"}</li>
                <li>• {en ? "Consider family contributions" : "Cân nhắc đóng góp từ gia đình"}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import type { ExpenseEntry } from "@/types/wedding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

interface BudgetTrackerProps {
  expenses: ExpenseEntry[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  lang: string;
}

export function BudgetTracker({ expenses, onEdit, onDelete, lang }: BudgetTrackerProps) {
  const en = lang === "en";

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, { vi: string; en: string }> = {
      venue: { vi: "Địa điểm", en: "Venue" },
      catering: { vi: "Ẩm thực", en: "Catering" },
      attire: { vi: "Trang phục", en: "Attire" },
      decorations: { vi: "Trang trí", en: "Decorations" },
      photography: { vi: "Chụp ảnh", en: "Photography" },
      music: { vi: "Âm nhạc", en: "Music" },
      transportation: { vi: "Vận chuyển", en: "Transportation" },
      gifts: { vi: "Quà tặng", en: "Gifts" },
      other: { vi: "Khác", en: "Other" },
    };
    const cat = categories[category as keyof typeof categories];
    return cat ? cat[lang as "vi" | "en"] : category;
  };

  if (expenses.length === 0) {
    return (
      <Card className="border-[var(--theme-border)]">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">
            {en ? "No expenses yet. Add your first expense!" : "Chưa có chi tiêu nào. Thêm chi tiêu đầu tiên của bạn!"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">
        {en ? "💸 Expenses" : "💸 Chi Tiêu"}
      </h2>
      {expenses.map((expense) => (
        <Card key={expense.id} className="border-[var(--theme-border)]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{expense.description}</h3>
                  {expense.paid ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {expense.paid ? (en ? "Paid" : "Đã trả") : (en ? "Pending" : "Chờ trả")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{getCategoryLabel(expense.category)}</span>
                  {expense.date && <span>• {expense.date}</span>}
                </div>
                {expense.vendorName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {expense.vendorName}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-lg font-bold text-[var(--theme-primary)]">
                  {expense.amount.toLocaleString()}₫
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(expense.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(expense.id)}
                    className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

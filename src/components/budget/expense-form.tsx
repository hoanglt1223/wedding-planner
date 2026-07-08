import { useState } from "react";
import type { ExpenseEntry } from "@/types/wedding";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";

interface ExpenseFormProps {
  expense?: ExpenseEntry;
  onSave: (expense: ExpenseEntry) => void;
  onSaveNew: (expense: Omit<ExpenseEntry, "id">) => void;
  onCancel: () => void;
  lang: string;
}

export function ExpenseForm({ expense, onSave, onSaveNew, onCancel, lang }: ExpenseFormProps) {
  const en = lang === "en";
  const [formData, setFormData] = useState({
    description: expense?.description || "",
    category: expense?.category || "other",
    amount: expense?.amount || 0,
    paid: expense?.paid || false,
    date: expense?.date || "",
    vendorName: expense?.vendorName || "",
  });

  const categories = [
    { value: "venue", labelVi: "Địa điểm", labelEn: "Venue" },
    { value: "catering", labelVi: "Ẩm thực", labelEn: "Catering" },
    { value: "attire", labelVi: "Trang phục", labelEn: "Attire" },
    { value: "decorations", labelVi: "Trang trí", labelEn: "Decorations" },
    { value: "photography", labelVi: "Chụp ảnh", labelEn: "Photography" },
    { value: "music", labelVi: "Âm nhạc", labelEn: "Music" },
    { value: "transportation", labelVi: "Vận chuyển", labelEn: "Transportation" },
    { value: "gifts", labelVi: "Quà tặng", labelEn: "Gifts" },
    { value: "other", labelVi: "Khác", labelEn: "Other" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim() || formData.amount <= 0) return;

    const expenseData: Omit<ExpenseEntry, "id"> = {
      description: formData.description.trim(),
      category: formData.category,
      amount: formData.amount,
      paid: formData.paid,
      date: formData.date,
      vendorName: formData.vendorName.trim() || undefined,
    };

    if (expense) {
      onSave({ ...expenseData, id: expense.id });
    } else {
      onSaveNew(expenseData);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => !open && onCancel()}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>
            {expense
              ? (en ? "Edit Expense" : "Chỉnh Sửa Chi Tiêu")
              : (en ? "Add Expense" : "Thêm Chi Tiêu")
            }
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">
              {en ? "Description" : "Mô Tả"}
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={en ? "e.g., Venue deposit" : "vd: Tiền cọc địa điểm"}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                {en ? "Category" : "Danh Mục"}
              </Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {en ? cat.labelEn : cat.labelVi}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {en ? "Amount (₫)" : "Số Tiền (₫)"}
              </Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="1000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">
                {en ? "Date" : "Ngày"}
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorName">
                {en ? "Vendor (Optional)" : "Nhà Cung Cấp (Tùy Chọn)"}
              </Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder={en ? "Vendor name" : "Tên nhà cung cấp"}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="paid"
              checked={formData.paid}
              onChange={(e) => setFormData({ ...formData, paid: e.target.checked })}
            />
            <Label htmlFor="paid" className="cursor-pointer">
              {en ? "Paid" : "Đã trả"}
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              {en ? "Cancel" : "Hủy"}
            </Button>
            <Button
              type="submit"
              className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]"
              disabled={!formData.description.trim() || formData.amount <= 0 || !formData.date}
            >
              {en ? "Save" : "Lưu"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

import { useState } from "react";
import { GIFT_CATEGORIES, RECIPIENT_TYPES, GIFT_SUGGESTIONS } from "@/data/guest-gift-data";
import type { GuestGift, GuestGiftCategory } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuestGiftFormProps {
  initial: GuestGift | null;
  lang?: string;
  onSave: (data: Omit<GuestGift, "id" | "distributedQuantity" | "status" | "createdAt">) => void;
  onClose: () => void;
}

export function GuestGiftForm({ initial, lang = "vi", onSave, onClose }: GuestGiftFormProps) {
  const en = lang === "en";
  const editing = initial !== null;

  const [giftName, setGiftName] = useState(initial?.giftName || "");
  const [category, setCategory] = useState<string>(initial?.category || "other");
  const [description, setDescription] = useState(initial?.description || "");
  const [costPerUnit, setCostPerUnit] = useState(initial?.costPerUnit || 0);
  const [totalQuantity, setTotalQuantity] = useState(initial?.totalQuantity || 1);
  const [recipientType, setRecipientType] = useState<"all" | "family" | "vip" | "regular">(initial?.recipientType || "all");
  const assignedGuestIds = initial?.assignedGuestIds || [];
  const [notes, setNotes] = useState(initial?.notes || "");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSelectSuggestion = (suggestionId: string) => {
    const suggestion = GIFT_SUGGESTIONS.find((s) => s.id === suggestionId);
    if (suggestion) {
      setGiftName(en ? suggestion.nameEn : suggestion.nameVi);
      setCategory(suggestion.category);
      setDescription(en ? suggestion.descriptionEn : suggestion.descriptionVi);
      setCostPerUnit(suggestion.defaultCost);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftName.trim()) return;

    onSave({
      giftName: giftName.trim(),
      category: category as GuestGiftCategory,
      description: description.trim(),
      costPerUnit,
      totalQuantity,
      recipientType: recipientType as any,
      assignedGuestIds: assignedGuestIds || [],
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-md rounded-xl shadow-lg max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--theme-surface)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--theme-border)" }}>
          <h3 className="font-semibold text-lg">
            {editing ? (en ? "Edit Guest Gift" : "Sửa Quà Tặng") : (en ? "Add Guest Gift" : "Thêm Quà Tặng")}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Suggestions button */}
          {!editing && (
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {en ? "💡 Choose from suggestions" : "💡 Chọn từ gợi ý"}
              </Button>

              {showSuggestions && (
                <div className="space-y-1 max-h-40 overflow-y-auto p-2 rounded-lg border">
                  {GIFT_SUGGESTIONS.map((s) => {
                    const cat = GIFT_CATEGORIES[s.category];
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleSelectSuggestion(s.id)}
                        className="w-full text-left p-2 rounded hover:bg-muted transition-colors text-sm"
                      >
                        <span>{cat.icon}</span> {en ? s.nameEn : s.nameVi} —{" "}
                        <span className="text-muted-foreground">{en ? s.descriptionEn : s.descriptionVi}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Gift name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {en ? "Gift Name *" : "Tên Quà Tặng *"}
            </label>
            <Input
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              placeholder={en ? "e.g., Tea set, Cookie box" : "vd: Bộ trà, Hộp bánh"}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">{en ? "Category" : "Danh mục"}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              {Object.entries(GIFT_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>
                  {cat.icon} {en ? cat.labelEn : cat.labelVi}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">{en ? "Description" : "Mô tả"}</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={en ? "Brief description..." : "Mô tả ngắn gọn..."}
            />
          </div>

          {/* Cost and Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">{en ? "Cost per Unit (₫)" : "Giá Một Vị (₫)"}</label>
              <Input
                type="number"
                value={costPerUnit || ""}
                onChange={(e) => setCostPerUnit(Number(e.target.value))}
                min={0}
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{en ? "Total Quantity" : "Số Lượng"}</label>
              <Input
                type="number"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Math.max(1, Number(e.target.value)))}
                min={1}
                required
              />
            </div>
          </div>

          {/* Recipient Type */}
          <div>
            <label className="block text-sm font-medium mb-1">{en ? "Recipient Type" : "Loại Người Nhận"}</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value as "all" | "family" | "vip" | "regular")}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              {Object.entries(RECIPIENT_TYPES).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.icon} {en ? type.labelEn : type.labelVi}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">{en ? "Notes" : "Ghi chú"}</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "Additional notes..." : "Ghi chú thêm..."}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {editing ? (en ? "Update" : "Cập nhật") : (en ? "Add Gift" : "Thêm Quà")}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              {en ? "Cancel" : "Hủy"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

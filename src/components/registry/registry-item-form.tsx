import { useState } from "react";
import type { RegistryItem, RegistryCategory } from "@/types/wedding";
import { t } from "@/lib/i18n";

type FormDraft = Omit<RegistryItem, "id" | "createdAt">;

const CATEGORIES: RegistryCategory[] = ["home", "kitchen", "bedroom", "experience", "travel", "electronics", "other"];
const PRIORIES: RegistryItem["priority"][] = ["must-have", "nice-to-have", "optional"];

const CAT_LABELS: Record<RegistryCategory, { vi: string; en: string }> = {
  home: { vi: "🏠 Gia dụng", en: "🏠 Home" },
  kitchen: { vi: "🍳 Nhà bếp", en: "🍳 Kitchen" },
  bedroom: { vi: "🛏️ Phòng ngủ", en: "🛏️ Bedroom" },
  experience: { vi: "✨ Trải nghiệm", en: "✨ Experience" },
  travel: { vi: "✈️ Du lịch", en: "✈️ Travel" },
  electronics: { vi: "📱 Điện tử", en: "📱 Electronics" },
  other: { vi: "📦 Khác", en: "📦 Other" },
};

const PRIORITY_LABELS: Record<RegistryItem["priority"], { vi: string; en: string }> = {
  "must-have": { vi: "Cần thiết", en: "Must have" },
  "nice-to-have": { vi: "Nên có", en: "Nice to have" },
  optional: { vi: "Tùy chọn", en: "Optional" },
};

interface RegistryItemFormProps {
  initial: RegistryItem | null; // null = add new
  lang: string;
  onSave: (data: FormDraft) => void;
  onClose: () => void;
}

export function RegistryItemForm({ initial, lang, onSave, onClose }: RegistryItemFormProps) {
  const en = lang === "en";

  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [category, setCategory] = useState<RegistryCategory>(initial?.category ?? "home");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [priority, setPriority] = useState<RegistryItem["priority"]>(initial?.priority ?? "nice-to-have");
  const [fulfilled, setFulfilled] = useState(initial?.fulfilled ?? false);
  const [fulfilledBy, setFulfilledBy] = useState(initial?.fulfilledBy ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      category,
      price: parseInt(price.replace(/\D/g, "")) || 0,
      link: link.trim(),
      priority,
      fulfilled,
      fulfilledBy: fulfilledBy.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-[var(--theme-surface)] rounded-xl shadow-xl border border-[var(--theme-border)] w-full max-w-md mx-3 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <h3 className="text-base font-semibold" style={{ color: "var(--theme-primary)" }}>
            {initial ? (en ? "Edit Item" : "Sửa mục") : (en ? "Add Item" : "Thêm mục")}
          </h3>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {en ? "Item name" : "Tên mục"} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={en ? "e.g. Rice cooker" : "VD: Nồi cơm điện"}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {en ? "Description" : "Mô tả"}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={en ? "Brand, model, color preference..." : "Hãng, mẫu, màu sắc ưu tiên..."}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background resize-none"
            />
          </div>

          {/* Category + Priority row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {en ? "Category" : "Danh mục"}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RegistryCategory)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CAT_LABELS[c][lang as "vi" | "en"] || c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                {en ? "Priority" : "Mức ưu tiên"}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RegistryItem["priority"])}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              >
                {PRIORIES.map((p) => (
                  <option key={p} value={p}>{PRIORITY_LABELS[p][lang as "vi" | "en"] || p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {en ? "Price (VND)" : "Giá (VND)"}
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={en ? "0 = flexible price" : "0 = giá linh hoạt"}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Link */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {en ? "Product link" : "Link sản phẩm"}
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://..."
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Fulfilled section */}
          <div className="border-t pt-3 space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={fulfilled}
                onChange={(e) => setFulfilled(e.target.checked)}
                className="rounded"
              />
              {en ? "Already received" : "Đã nhận được"}
            </label>
            {fulfilled && (
              <input
                type="text"
                value={fulfilledBy}
                onChange={(e) => setFulfilledBy(e.target.value)}
                placeholder={en ? "Who gave this?" : "Ai tặng?"}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
              />
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              {en ? "Notes" : "Ghi chú"}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "Additional notes..." : "Ghi chú thêm..."}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
            >
              {t("Hủy", lang)}
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm bg-[var(--theme-primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {initial ? (en ? "Update" : "Cập nhật") : (en ? "Add" : "Thêm")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

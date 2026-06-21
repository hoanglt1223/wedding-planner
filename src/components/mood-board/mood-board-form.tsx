import { useState } from "react";
import { t } from "@/lib/i18n";
import type { MoodBoardItem, MoodBoardCategory } from "@/types/wedding";

const CATEGORY_OPTIONS: { value: MoodBoardCategory; labelVi: string; labelEn: string }[] = [
  { value: "decor", labelVi: "Trang trí", labelEn: "Decor" },
  { value: "flowers", labelVi: "Hoa", labelEn: "Flowers" },
  { value: "attire", labelVi: "Trang phục", labelEn: "Attire" },
  { value: "cake", labelVi: "Bánh", labelEn: "Cake" },
  { value: "food", labelVi: "Ẩm thực", labelEn: "Food" },
  { value: "venue", labelVi: "Địa điểm", labelEn: "Venue" },
  { value: "photography", labelVi: "Nhiếp ảnh", labelEn: "Photography" },
  { value: "other", labelVi: "Khác", labelEn: "Other" },
];

type FormData = Omit<MoodBoardItem, "id" | "createdAt">;

interface MoodBoardFormProps {
  lang?: string;
  editing: MoodBoardItem | null;
  onSave: (data: FormData) => void;
  onClose: () => void;
}

export function MoodBoardForm({ lang = "vi", editing, onSave, onClose }: MoodBoardFormProps) {
  const en = lang === "en";
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl ?? "");
  const [title, setTitle] = useState(editing?.title ?? "");
  const [category, setCategory] = useState<MoodBoardCategory>(editing?.category ?? "other");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [tagsInput, setTagsInput] = useState(editing?.tags.join(", ") ?? "");
  const [isFavorite, setIsFavorite] = useState(editing?.isFavorite ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    onSave({
      imageUrl: imageUrl.trim(),
      title: title.trim(),
      category,
      notes: notes.trim(),
      tags,
      isFavorite,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[var(--theme-surface)] rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">
              {editing
                ? en ? "Edit Inspiration" : "Chỉnh sửa cảm hứng"
                : en ? "Add Inspiration" : "Thêm cảm hứng"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-[var(--theme-surface-muted)] flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {en ? "Image URL" : "Link hình ảnh"}
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
            />
            {imageUrl && (
              <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {en ? "Title" : "Tiêu đề"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={en ? "e.g., Centerpiece idea" : "VD: ý tưởng trang trí bàn"}
              className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {en ? "Category" : "Danh mục"}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MoodBoardCategory)}
              className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {en ? opt.labelEn : opt.labelVi}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {en ? "Notes" : "Ghi chú"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "What do you like about this?" : "Bạn thích điều gì ở ý tưởng này?"}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)] resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium block mb-1">
              {en ? "Tags (comma separated)" : "Thẻ (phân tách bằng dấu phẩy)"}
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder={en ? "e.g., rustic, outdoor, pink" : "VD: rustic, ngoài trời, hồng"}
              className="w-full px-3 py-2 border border-[var(--theme-border)] rounded-lg text-sm bg-[var(--theme-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary)]"
            />
          </div>

          {/* Favorite */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--theme-border)]"
            />
            <span className="text-sm">{en ? "Mark as favorite" : "Đánh dấu yêu thích"}</span>
          </label>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[var(--theme-border)] rounded-lg text-sm hover:bg-[var(--theme-surface-muted)] transition-colors"
            >
              {t("Hủy", lang)}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[var(--theme-primary)] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
            >
              {editing ? t("Cập nhật", lang) : t("Thêm", lang)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

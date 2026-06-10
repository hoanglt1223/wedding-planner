import { useState } from "react";
import type { SpeechEntry, SpeechCategory } from "@/types/wedding";

type EntryDraft = Omit<SpeechEntry, "id">;

interface SpeechEntryFormProps {
  initial: SpeechEntry | null; // null = add new
  lang: string;
  onSave: (data: EntryDraft) => void;
  onClose: () => void;
}

const CATEGORIES: { key: SpeechCategory; vi: string; en: string; icon: string }[] = [
  { key: "vow", vi: "Lời thề", en: "Vow", icon: "💍" },
  { key: "toast", vi: "Nâng ly", en: "Toast", icon: "🥂" },
  { key: "reading", vi: "Đọc", en: "Reading", icon: "📖" },
  { key: "prayer", vi: "Cầu nguyện", en: "Prayer", icon: "🙏" },
  { key: "other", vi: "Khác", en: "Other", icon: "📝" },
];

export function SpeechEntryForm({ initial, lang, onSave, onClose }: SpeechEntryFormProps) {
  const en = lang === "en";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<SpeechCategory>(initial?.category ?? "vow");
  const [speaker, setSpeaker] = useState(initial?.speaker ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category,
      speaker: speaker.trim(),
      notes: notes.trim(),
      isFavorite: initial?.isFavorite ?? false,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-background w-full max-w-md rounded-t-xl sm:rounded-xl p-4 space-y-3 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">
            {initial ? (en ? "Edit Speech" : "Sửa bài phát biểu") : (en ? "Add Speech" : "Thêm bài phát biểu")}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Title" : "Tiêu đề"} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={en ? "e.g. Groom's Vow" : "VD: Lời thề chú rể"}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Category" : "Loại"}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCategory(c.key)}
                  className={`py-1.5 text-xs rounded border transition-colors ${
                    category === c.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                      : "bg-background border-muted-foreground/20"
                  }`}
                >
                  {c.icon} {en ? c.en : c.vi}
                </button>
              ))}
            </div>
          </div>

          {/* Speaker */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Speaker (optional)" : "Người đọc (tùy chọn)"}
            </label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder={en ? "e.g. Groom, Bride, Best Man..." : "VD: Chú rể, Cô dâu, Phù rể..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Content" : "Nội dung"} *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={en ? "Write your speech or vow here..." : "Viết lời thề hoặc bài phát biểu tại đây..."}
              rows={8}
              className="w-full border rounded px-3 py-2 text-sm bg-background resize-y min-h-[120px]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Notes (optional)" : "Ghi chú (tùy chọn)"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "e.g. Practice 3 times before the ceremony" : "VD: Tập đọc 3 lần trước buổi lễ"}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {initial ? (en ? "Save Changes" : "Lưu thay đổi") : (en ? "Add Speech" : "Thêm bài phát biểu")}
          </button>
        </form>
      </div>
    </div>
  );
}

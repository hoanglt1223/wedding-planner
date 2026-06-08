import { useState } from "react";
import type { SongItem, SongSection, SongPriority } from "@/types/wedding";

type EntryDraft = Omit<SongItem, "id">;

interface SongEntryFormProps {
  initial: SongItem | null; // null = add new
  lang: string;
  onSave: (data: EntryDraft) => void;
  onClose: () => void;
}

const SECTIONS: { key: SongSection; vi: string; en: string; icon: string }[] = [
  { key: "ceremony", vi: "Lễ cưới", en: "Ceremony", icon: "💒" },
  { key: "cocktail", vi: "Cocktail", en: "Cocktail", icon: "🥂" },
  { key: "reception", vi: "Tiệc", en: "Reception", icon: "🍽️" },
  { key: "first-dance", vi: "Nhảy đầu", en: "First Dance", icon: "💃" },
  { key: "party", vi: "Vui chơi", en: "Party", icon: "🎉" },
  { key: "other", vi: "Khác", en: "Other", icon: "🎶" },
];

const PRIORITIES: { key: SongPriority; vi: string; en: string }[] = [
  { key: "must-play", vi: "🟢 Phải phát", en: "🟢 Must play" },
  { key: "nice-to-have", vi: "🟡 Nên phát", en: "🟡 Nice to have" },
  { key: "do-not-play", vi: "🔴 Không phát", en: "🔴 Do not play" },
];

export function SongEntryForm({ initial, lang, onSave, onClose }: SongEntryFormProps) {
  const en = lang === "en";

  const [title, setTitle] = useState(initial?.title ?? "");
  const [artist, setArtist] = useState(initial?.artist ?? "");
  const [section, setSection] = useState<SongSection>(initial?.section ?? "reception");
  const [priority, setPriority] = useState<SongPriority>(initial?.priority ?? "nice-to-have");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [requestedBy, setRequestedBy] = useState(initial?.requestedBy ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      artist: artist.trim(),
      section,
      priority,
      notes: notes.trim(),
      requestedBy: requestedBy.trim(),
      confirmed: initial?.confirmed ?? false,
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
            {initial ? (en ? "Edit Song" : "Sửa bài hát") : (en ? "Add Song" : "Thêm bài hát")}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Song title" : "Tên bài hát"} *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={en ? "Enter song name..." : "Nhập tên bài hát..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              required
            />
          </div>

          {/* Artist */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Artist" : "Ca sĩ / Nhóm nhạc"}
            </label>
            <input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder={en ? "Enter artist name..." : "Nhập tên ca sĩ..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Section */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Wedding section" : "Phần cưới"}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSection(s.key)}
                  className={`py-1.5 text-xs rounded border transition-colors ${
                    section === s.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                      : "bg-background border-muted-foreground/20"
                  }`}
                >
                  {s.icon} {en ? s.en : s.vi}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Priority" : "Mức độ ưu tiên"}
            </label>
            <div className="flex gap-1.5">
              {PRIORITIES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                    priority === p.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                      : "bg-background border-muted-foreground/20"
                  }`}
                >
                  {en ? p.en : p.vi}
                </button>
              ))}
            </div>
          </div>

          {/* Requested by */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Requested by (optional)" : "Đề xuất bởi (tùy chọn)"}
            </label>
            <input
              type="text"
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              placeholder={en ? "e.g. Bride, Groom, DJ..." : "VD: Cô dâu, Chú rể, MC..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
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
              placeholder={en ? "e.g. Play after cake cutting..." : "VD: Phát sau khi cắt bánh..."}
              rows={2}
              className="w-full border rounded px-3 py-2 text-sm bg-background resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {initial ? (en ? "Save Changes" : "Lưu thay đổi") : (en ? "Add Song" : "Thêm bài hát")}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import type { GuestBookEntry, GuestBookMood, Guest } from "@/types/wedding";

type EntryDraft = Omit<GuestBookEntry, "id" | "createdAt">;

interface GuestBookEntryFormProps {
  initial: GuestBookEntry | null; // null = add new
  guests: Guest[];
  lang: string;
  onSave: (data: EntryDraft) => void;
  onClose: () => void;
}

const MOODS: { key: GuestBookMood; icon: string; vi: string; en: string }[] = [
  { key: "love", icon: "❤️", vi: "Yêu thương", en: "Love" },
  { key: "joy", icon: "🎉", vi: "Vui vẻ", en: "Joy" },
  { key: "wisdom", icon: "💎", vi: "Khôn ngoan", en: "Wisdom" },
  { key: "funny", icon: "😄", vi: "Hài hước", en: "Funny" },
  { key: "other", icon: "✨", vi: "Khác", en: "Other" },
];

export function GuestBookEntryForm({ initial, guests, lang, onSave, onClose }: GuestBookEntryFormProps) {
  const en = lang === "en";

  const [guestName, setGuestName] = useState(initial?.guestName ?? "");
  const [message, setMessage] = useState(initial?.message ?? "");
  const [mood, setMood] = useState<GuestBookMood>(initial?.mood ?? "love");
  const [guestId, setGuestId] = useState<number | undefined>(initial?.guestId);
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  function handleSelectGuest(guest: Guest) {
    setGuestName(guest.name);
    setGuestId(guest.id);
    setShowGuestPicker(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !message.trim()) return;

    onSave({
      guestName: guestName.trim(),
      message: message.trim(),
      mood,
      guestId,
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
            {initial ? (en ? "Edit Message" : "Sửa lời chúc") : (en ? "Write a Message" : "Viết lời chúc")}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Guest name */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Your name" : "Tên của bạn"} *
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={en ? "Enter your name..." : "Nhập tên..."}
                className="flex-1 border rounded px-3 py-2 text-sm bg-background"
                required
              />
              {guests.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowGuestPicker(!showGuestPicker)}
                  className="px-2.5 py-2 border rounded text-sm bg-muted hover:bg-muted/80"
                  title={en ? "Pick from guest list" : "Chọn từ danh sách khách"}
                >
                  👥
                </button>
              )}
            </div>
            {showGuestPicker && guests.length > 0 && (
              <div className="mt-1 max-h-32 overflow-y-auto border rounded bg-background">
                {guests.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleSelectGuest(g)}
                    className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {g.name} {g.tableGroup && <span className="text-muted-foreground">({g.tableGroup})</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Your message" : "Lời chúc của bạn"} *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={en ? "Write your wishes for the couple..." : "Viết lời chúc cho đôi uyên ương..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background min-h-[100px] resize-y"
              required
            />
          </div>

          {/* Mood selector */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Mood" : "Cảm xúc"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMood(m.key)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    mood === m.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                      : "bg-background border-muted-foreground/20"
                  }`}
                >
                  {m.icon} {en ? m.en : m.vi}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {initial ? (en ? "Save Changes" : "Lưu thay đổi") : (en ? "Send Wishes" : "Gửi lời chúc")}
          </button>
        </form>
      </div>
    </div>
  );
}

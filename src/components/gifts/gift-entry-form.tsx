import { useState } from "react";
import type { GiftEntry, Guest } from "@/types/wedding";

type EntryDraft = Omit<GiftEntry, "id">;

interface GiftEntryFormProps {
  initial: GiftEntry | null; // null = add new
  guests: Guest[];
  lang: string;
  onSave: (data: EntryDraft) => void;
  onClose: () => void;
}

export function GiftEntryForm({ initial, guests, lang, onSave, onClose }: GiftEntryFormProps) {
  const en = lang === "en";

  const [type, setType] = useState<"cash" | "gift">(initial?.type ?? "cash");
  const [guestName, setGuestName] = useState(initial?.guestName ?? "");
  const [amount, setAmount] = useState(initial?.amount?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [side, setSide] = useState<string>(initial?.side ?? "other");
  const [guestId, setGuestId] = useState<number | undefined>(initial?.guestId);
  const [tableGroup, setTableGroup] = useState(initial?.tableGroup ?? "");
  const [showGuestPicker, setShowGuestPicker] = useState(false);

  function handleSelectGuest(guest: Guest) {
    setGuestName(guest.name);
    setGuestId(guest.id);
    setSide(guest.side || "other");
    setTableGroup(guest.tableGroup || "");
    setShowGuestPicker(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;

    onSave({
      guestName: guestName.trim(),
      type,
      amount: type === "cash" ? (parseFloat(amount) || 0) : undefined,
      description: type === "gift" ? description.trim() : undefined,
      side: side as "groom" | "bride" | "other",
      guestId,
      tableGroup: tableGroup || undefined,
      thankYouSent: initial?.thankYouSent ?? false,
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
            {initial ? (en ? "Edit Gift" : "Sửa phong bì") : (en ? "Add Gift" : "Thêm phong bì")}
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(["cash", "gift"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                  type === t
                    ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                    : "bg-background border-muted-foreground/20"
                }`}
              >
                {t === "cash" ? "💰 " + (en ? "Cash" : "Tiền mặt") : "🎁 " + (en ? "Gift" : "Quà tặng")}
              </button>
            ))}
          </div>

          {/* Guest name */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Guest name" : "Tên khách"} *
            </label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder={en ? "Enter name..." : "Nhập tên..."}
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

          {/* Cash amount */}
          {type === "cash" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {en ? "Amount (VND)" : "Số tiền (VNĐ)"} *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full border rounded px-3 py-2 text-sm bg-background"
                required
              />
            </div>
          )}

          {/* Gift description */}
          {type === "gift" && (
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                {en ? "Gift description" : "Mô tả quà"}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={en ? "e.g. Flower vase, photo frame..." : "VD: Lọ hoa, khung ảnh..."}
                className="w-full border rounded px-3 py-2 text-sm bg-background"
              />
            </div>
          )}

          {/* Side */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Side" : "Bên"}
            </label>
            <div className="flex gap-2">
              {[
                { key: "groom", vi: "Nhà trai", en: "Groom", icon: "🤵" },
                { key: "bride", vi: "Nhà gái", en: "Bride", icon: "👰" },
                { key: "other", vi: "Khác", en: "Other", icon: "👥" },
              ].map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSide(s.key)}
                  className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                    side === s.key
                      ? "bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] border-[var(--theme-primary)]"
                      : "bg-background border-muted-foreground/20"
                  }`}
                >
                  {s.icon} {en ? s.en : s.vi}
                </button>
              ))}
            </div>
          </div>

          {/* Table group (optional) */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {en ? "Table group (optional)" : "Bàn (tùy chọn)"}
            </label>
            <input
              type="text"
              value={tableGroup}
              onChange={(e) => setTableGroup(e.target.value)}
              placeholder={en ? "e.g. Table 1, VIP..." : "VD: Bàn 1, VIP..."}
              className="w-full border rounded px-3 py-2 text-sm bg-background"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[var(--theme-primary)] text-[var(--theme-primary-foreground)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
          >
            {initial ? (en ? "Save Changes" : "Lưu thay đổi") : (en ? "Add Gift" : "Thêm phong bì")}
          </button>
        </form>
      </div>
    </div>
  );
}

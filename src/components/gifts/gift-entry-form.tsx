import { useState } from "react";
import { t } from "@/lib/i18n";
import type { GiftEntry, Guest } from "@/types/wedding";

interface Props {
  initial?: GiftEntry | null;
  guests: Guest[];
  lang: string;
  onSave: (data: Omit<GiftEntry, "id">) => void;
  onClose: () => void;
}

const SIDES = ["groom", "bride", "other"] as const;

function sideLabel(side: string, lang: string) {
  if (lang === "en") return side === "groom" ? "Groom" : side === "bride" ? "Bride" : "Other";
  return side === "groom" ? "Nhà trai" : side === "bride" ? "Nhà gái" : t("Khác", lang);
}

function fromInitial(initial?: GiftEntry | null): Omit<GiftEntry, "id"> {
  if (initial) return { ...initial };
  return { guestName: "", type: "cash", amount: undefined, description: "", side: "groom", tableGroup: "", thankYouSent: false };
}

export function GiftEntryForm({ initial, guests, lang, onSave, onClose }: Props) {
  // Key the component on initial.id so React remounts for add vs edit
  const [form, setForm] = useState<Omit<GiftEntry, "id">>(() => fromInitial(initial));
  const [nameQuery, setNameQuery] = useState(initial?.guestName ?? "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const suggestions = nameQuery.length > 0
    ? guests.filter((g) => g.name.toLowerCase().includes(nameQuery.toLowerCase())).slice(0, 6)
    : [];

  function pickGuest(g: Guest) {
    setForm((f) => ({ ...f, guestName: g.name, guestId: g.id, side: g.side === "trai" ? "groom" : g.side === "gái" ? "bride" : f.side, tableGroup: g.tableGroup || f.tableGroup }));
    setNameQuery(g.name);
    setShowSuggestions(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = nameQuery.trim();
    if (!name) { setError(lang === "en" ? "Guest name required" : "Cần nhập tên khách"); return; }
    if (form.type === "cash" && (!form.amount || form.amount <= 0)) {
      setError(lang === "en" ? "Amount required for cash" : "Cần nhập số tiền"); return;
    }
    onSave({ ...form, guestName: name });
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-xl shadow-xl w-full max-w-md p-5">
        <h3 className="font-semibold mb-4">
          {initial ? (lang === "en" ? "Edit Entry" : "Sửa phong bì") : (lang === "en" ? "Add Entry" : "Thêm phong bì")}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Guest name with autocomplete */}
          <div className="relative">
            <label className="text-xs text-muted-foreground block mb-1">{lang === "en" ? "Guest Name *" : "Tên khách *"}</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm bg-background"
              value={nameQuery}
              onChange={(e) => { setNameQuery(e.target.value); setShowSuggestions(true); setForm((f) => ({ ...f, guestName: e.target.value, guestId: undefined })); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder={lang === "en" ? "Guest name" : "Họ tên khách"}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 bg-background border rounded shadow-lg mt-0.5 max-h-40 overflow-y-auto">
                {suggestions.map((g) => (
                  <div key={g.id} className="px-3 py-1.5 text-sm hover:bg-muted cursor-pointer" onMouseDown={() => pickGuest(g)}>
                    {g.name} <span className="text-xs text-muted-foreground">· {g.tableGroup}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Type radio */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{lang === "en" ? "Type" : "Loại"}</label>
            <div className="flex gap-3">
              {(["cash", "gift"] as const).map((tp) => (
                <label key={tp} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="radio" checked={form.type === tp} onChange={() => setForm((f) => ({ ...f, type: tp }))} />
                  {tp === "cash" ? t("Tiền mặt", lang) : t("Quà tặng", lang)}
                </label>
              ))}
            </div>
          </div>

          {/* Amount */}
          {form.type === "cash" && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("Số tiền", lang)} (VND) *</label>
              <input type="number" min={0} className="w-full border rounded px-3 py-2 text-sm bg-background"
                value={form.amount ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value ? Number(e.target.value) : undefined }))} />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{lang === "en" ? "Description" : "Mô tả"}</label>
            <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          {/* Side + Table */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("Bên", lang)}</label>
              <select className="w-full border rounded px-2 py-2 text-sm bg-background" value={form.side}
                onChange={(e) => setForm((f) => ({ ...f, side: e.target.value as GiftEntry["side"] }))}>
                {SIDES.map((s) => <option key={s} value={s}>{sideLabel(s, lang)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{lang === "en" ? "Table / Group" : "Bàn / Nhóm"}</label>
              <input className="w-full border rounded px-3 py-2 text-sm bg-background" value={form.tableGroup ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, tableGroup: e.target.value }))} />
            </div>
          </div>

          {/* Thank-you */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.thankYouSent}
              onChange={(e) => setForm((f) => ({ ...f, thankYouSent: e.target.checked }))} />
            {t("Đã cảm ơn", lang)}
          </label>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm border rounded hover:bg-muted">{t("Hủy", lang)}</button>
            <button type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:opacity-90">{t("Lưu", lang)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

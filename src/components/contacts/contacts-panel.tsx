import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeddingContact, ContactCategory } from "@/types/wedding";
import { t } from "@/lib/i18n";

const CATEGORIES: { id: ContactCategory; icon: string; vi: string; en: string }[] = [
  { id: "venue", icon: "🏛️", vi: "Địa điểm", en: "Venue" },
  { id: "vendor", icon: "🏪", vi: "Nhà cung cấp", en: "Vendors" },
  { id: "wedding-party", icon: "👫", vi: "Phù dâu/phù rể", en: "Wedding Party" },
  { id: "family", icon: "👨‍👩‍👧‍👦", vi: "Gia đình", en: "Family" },
  { id: "other", icon: "📌", vi: "Khác", en: "Other" },
];

function getCategoryConfig(id: ContactCategory) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[4];
}

interface ContactsPanelProps {
  contacts: WeddingContact[];
  onAdd: (contact: Omit<WeddingContact, "id">) => void;
  onUpdate: (id: number, updates: Partial<WeddingContact>) => void;
  onRemove: (id: number) => void;
  lang?: string;
}

export function ContactsPanel({ contacts, onAdd, onUpdate, onRemove, lang = "vi" }: ContactsPanelProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCat, setFilterCat] = useState<ContactCategory | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState<ContactCategory>("vendor");
  const [note, setNote] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCategory, setEditCategory] = useState<ContactCategory>("vendor");
  const [editNote, setEditNote] = useState("");

  function resetAddForm() {
    setName(""); setRole(""); setPhone(""); setCategory("vendor"); setNote("");
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      category,
      note: note.trim(),
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function startEdit(c: WeddingContact) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditRole(c.role);
    setEditPhone(c.phone);
    setEditCategory(c.category);
    setEditNote(c.note);
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim()) return;
    onUpdate(id, {
      name: editName.trim(),
      role: editRole.trim(),
      phone: editPhone.trim(),
      category: editCategory,
      note: editNote.trim(),
    });
    setEditingId(null);
  }

  // Filtered contacts
  const filtered = contacts.filter((c) => {
    if (filterCat && c.category !== filterCat) return false;
    return true;
  });

  // Group by category for display
  const usedCategories = [...new Set(contacts.map((c) => c.category))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("📞 Danh Bạ Ngày Cưới", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? `${contacts.length} contacts` : `${contacts.length} liên hệ`}
          </p>
        </div>
        <Button size="sm" className="h-8 px-3" onClick={() => { setShowAddForm(!showAddForm); resetAddForm(); }}>
          + {t("Thêm liên hệ", lang)}
        </Button>
      </div>

      {/* Category filter */}
      {contacts.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterCat(null)}
            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
              filterCat === null
                ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
            }`}
          >
            {t("Tất cả", lang)}
          </button>
          {CATEGORIES.filter((c) => usedCategories.includes(c.id) || filterCat === c.id).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(filterCat === cat.id ? null : cat.id)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                filterCat === cat.id
                  ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                  : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
              }`}
            >
              {cat.icon} {en ? cat.en : cat.vi}
            </button>
          ))}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-[2] h-8 text-sm"
              placeholder={t("Họ tên", lang) + " *"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Vai trò", lang)}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("SĐT", lang)}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="tel"
            />
            <select
              className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              value={category}
              onChange={(e) => setCategory(e.target.value as ContactCategory)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {en ? c.en : c.vi}</option>
              ))}
            </select>
          </div>
          <Input
            className="h-8 text-sm"
            placeholder={t("Ghi chú", lang)}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
              {t("Hủy", lang)}
            </button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>{t("Thêm liên hệ", lang)}</Button>
          </div>
        </div>
      )}

      {/* Contact list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((c) => {
            const isEditing = editingId === c.id;
            const catCfg = getCategoryConfig(c.category);

            if (isEditing) {
              return (
                <div key={c.id} className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-[2] h-8 text-sm"
                      placeholder={t("Họ tên", lang)}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("Vai trò", lang)}
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={t("SĐT", lang)}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      type="tel"
                      inputMode="tel"
                    />
                    <select
                      className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as ContactCategory)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {en ? cat.en : cat.vi}</option>
                      ))}
                    </select>
                  </div>
                  <Input
                    className="h-8 text-sm"
                    placeholder={t("Ghi chú", lang)}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
                      {t("Hủy", lang)}
                    </button>
                    <Button size="sm" className="h-8 px-3" onClick={() => handleSaveEdit(c.id)}>{t("Lưu", lang)}</Button>
                  </div>
                </div>
              );
            }

            return (
              <div key={c.id} className="flex items-start gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Header row: category badge + name */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 shrink-0">
                      {catCfg.icon} {en ? catCfg.en : catCfg.vi}
                    </span>
                    <span className="font-semibold text-sm truncate">{c.name}</span>
                    {c.role && (
                      <span className="text-xs text-muted-foreground truncate">— {c.role}</span>
                    )}
                  </div>

                  {/* Phone with call link */}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 active:text-blue-900"
                    >
                      <span>📞</span>
                      <span className="underline underline-offset-2">{c.phone}</span>
                    </a>
                  )}

                  {/* Note */}
                  {c.note && <div className="text-xs text-gray-400 italic">{c.note}</div>}
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => startEdit(c)} className="text-xs text-muted-foreground hover:text-foreground p-1" title={t("Sửa", lang)}>✏️</button>
                  <button onClick={() => onRemove(c.id)} className="text-xs text-red-400 hover:text-red-600 p-1" title="✕">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">📞</span>
          </div>
          <h3 className="text-base font-semibold mb-1">
            {contacts.length === 0 ? t("Thêm liên hệ đầu tiên", lang) : t("Không tìm thấy liên hệ", lang)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {contacts.length === 0
              ? (en ? "Save important contacts for quick access on your wedding day" : "Lưu liên hệ quan trọng để truy cập nhanh trong ngày cưới")
              : (en ? "Try changing your filter" : "Thử thay đổi bộ lọc")}
          </p>
        </div>
      )}
    </div>
  );
}

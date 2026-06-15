import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { WeddingPartyMember, PartyRole } from "@/types/wedding";
import { t } from "@/lib/i18n";

const ROLES: { id: PartyRole; icon: string; vi: string; en: string }[] = [
  { id: "maid-of-honor", icon: "👑", vi: "Phù dâu chính", en: "Maid of Honor" },
  { id: "bridesmaid", icon: "💐", vi: "Phù dâu", en: "Bridesmaid" },
  { id: "best-man", icon: "🤵", vi: "Phù rể chính", en: "Best Man" },
  { id: "groomsman", icon: "🎩", vi: "Phù rể", en: "Groomsman" },
  { id: "flower-girl", icon: "🌸", vi: "Bé gái rải hoa", en: "Flower Girl" },
  { id: "ring-bearer", icon: "💍", vi: "Bé trai cầm nhẫn", en: "Ring Bearer" },
  { id: "mother-of-bride", icon: "👩", vi: "Mẹ cô dâu", en: "Mother of Bride" },
  { id: "mother-of-groom", icon: "👩", vi: "Mẹ chú rể", en: "Mother of Groom" },
  { id: "father-of-bride", icon: "👨", vi: "Bố cô dâu", en: "Father of Bride" },
  { id: "father-of-groom", icon: "👨", vi: "Bố chú rể", en: "Father of Groom" },
  { id: "officiant", icon: "📿", vi: "Người chủ trì", en: "Officiant" },
  { id: "mc", icon: "🎤", vi: "MC", en: "MC" },
  { id: "other", icon: "👤", vi: "Khác", en: "Other" },
];

function getRoleConfig(id: PartyRole) {
  return ROLES.find((r) => r.id === id) ?? ROLES[ROLES.length - 1];
}

interface WeddingPartyPanelProps {
  members: WeddingPartyMember[];
  onAdd: (member: Omit<WeddingPartyMember, "id">) => void;
  onUpdate: (id: number, updates: Partial<WeddingPartyMember>) => void;
  onRemove: (id: number) => void;
  lang?: string;
}

export function WeddingPartyPanel({ members, onAdd, onUpdate, onRemove, lang = "vi" }: WeddingPartyPanelProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterRole, setFilterRole] = useState<PartyRole | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Add form state
  const [name, setName] = useState("");
  const [role, setRole] = useState<PartyRole>("bridesmaid");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [outfit, setOutfit] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [notes, setNotes] = useState("");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<PartyRole>("bridesmaid");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editOutfit, setEditOutfit] = useState("");
  const [editMeasurements, setEditMeasurements] = useState("");
  const [editResponsibilities, setEditResponsibilities] = useState("");
  const [editNotes, setEditNotes] = useState("");

  function resetAddForm() {
    setName(""); setRole("bridesmaid"); setPhone(""); setEmail("");
    setOutfit(""); setMeasurements(""); setResponsibilities(""); setNotes("");
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      role,
      phone: phone.trim(),
      email: email.trim(),
      outfitDetails: outfit.trim(),
      measurements: measurements.trim(),
      responsibilities: responsibilities.trim(),
      notes: notes.trim(),
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function startEdit(m: WeddingPartyMember) {
    setEditingId(m.id);
    setEditName(m.name);
    setEditRole(m.role);
    setEditPhone(m.phone);
    setEditEmail(m.email);
    setEditOutfit(m.outfitDetails);
    setEditMeasurements(m.measurements);
    setEditResponsibilities(m.responsibilities);
    setEditNotes(m.notes);
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim()) return;
    onUpdate(id, {
      name: editName.trim(),
      role: editRole,
      phone: editPhone.trim(),
      email: editEmail.trim(),
      outfitDetails: editOutfit.trim(),
      measurements: editMeasurements.trim(),
      responsibilities: editResponsibilities.trim(),
      notes: editNotes.trim(),
    });
    setEditingId(null);
  }

  const filtered = filterRole
    ? members.filter((m) => m.role === filterRole)
    : members;

  const usedRoles = [...new Set(members.map((m) => m.role))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("💐 Đội Ngũ Cưới", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? `${members.length} members` : `${members.length} thành viên`}
          </p>
        </div>
        <Button size="sm" className="h-8 px-3" onClick={() => { setShowAddForm(!showAddForm); resetAddForm(); }}>
          + {t("Thêm thành viên", lang)}
        </Button>
      </div>

      {/* Role filter */}
      {members.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilterRole(null)}
            className={`text-xs px-2 py-1 rounded-full border transition-colors ${
              filterRole === null
                ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
            }`}
          >
            {t("Tất cả", lang)}
          </button>
          {ROLES.filter((r) => usedRoles.includes(r.id) || filterRole === r.id).map((r) => (
            <button
              key={r.id}
              onClick={() => setFilterRole(filterRole === r.id ? null : r.id)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                filterRole === r.id
                  ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                  : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
              }`}
            >
              {r.icon} {en ? r.en : r.vi}
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
            <select
              className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              value={role}
              onChange={(e) => setRole(e.target.value as PartyRole)}
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id}>{r.icon} {en ? r.en : r.vi}</option>
              ))}
            </select>
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
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={en ? "Email" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={en ? "Outfit details" : "Trang phục"}
              value={outfit}
              onChange={(e) => setOutfit(e.target.value)}
            />
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={en ? "Measurements" : "Số đo"}
              value={measurements}
              onChange={(e) => setMeasurements(e.target.value)}
            />
          </div>
          <Input
            className="h-8 text-sm"
            placeholder={en ? "Responsibilities" : "Nhiệm vụ"}
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
          <Input
            className="h-8 text-sm"
            placeholder={t("Ghi chú", lang)}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
              {t("Hủy", lang)}
            </button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>{t("Thêm", lang)}</Button>
          </div>
        </div>
      )}

      {/* Member list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((m) => {
            const isEditing = editingId === m.id;
            const isExpanded = expandedId === m.id;
            const roleCfg = getRoleConfig(m.role);

            if (isEditing) {
              return (
                <div key={m.id} className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2">
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-[2] h-8 text-sm"
                      placeholder={t("Họ tên", lang)}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <select
                      className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as PartyRole)}
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.id}>{r.icon} {en ? r.en : r.vi}</option>
                      ))}
                    </select>
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
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder="Email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      type="email"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={en ? "Outfit details" : "Trang phục"}
                      value={editOutfit}
                      onChange={(e) => setEditOutfit(e.target.value)}
                    />
                    <Input
                      className="flex-1 h-8 text-sm"
                      placeholder={en ? "Measurements" : "Số đo"}
                      value={editMeasurements}
                      onChange={(e) => setEditMeasurements(e.target.value)}
                    />
                  </div>
                  <Input
                    className="h-8 text-sm"
                    placeholder={en ? "Responsibilities" : "Nhiệm vụ"}
                    value={editResponsibilities}
                    onChange={(e) => setEditResponsibilities(e.target.value)}
                  />
                  <Input
                    className="h-8 text-sm"
                    placeholder={t("Ghi chú", lang)}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
                      {t("Hủy", lang)}
                    </button>
                    <Button size="sm" className="h-8 px-3" onClick={() => handleSaveEdit(m.id)}>{t("Lưu", lang)}</Button>
                  </div>
                </div>
              );
            }

            return (
              <div key={m.id} className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0 space-y-1">
                    {/* Header row: role badge + name */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 shrink-0">
                        {roleCfg.icon} {en ? roleCfg.en : roleCfg.vi}
                      </span>
                      <span className="font-semibold text-sm truncate">{m.name}</span>
                    </div>

                    {/* Contact info */}
                    <div className="flex gap-3 flex-wrap">
                      {m.phone && (
                        <a
                          href={`tel:${m.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          📞 <span className="underline underline-offset-2">{m.phone}</span>
                        </a>
                      )}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                        >
                          ✉️ <span className="underline underline-offset-2">{m.email}</span>
                        </a>
                      )}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground border-t pt-2">
                        {m.outfitDetails && (
                          <p>👔 <span className="font-medium">{en ? "Outfit:" : "Trang phục:"}</span> {m.outfitDetails}</p>
                        )}
                        {m.measurements && (
                          <p>📏 <span className="font-medium">{en ? "Measurements:" : "Số đo:"}</span> {m.measurements}</p>
                        )}
                        {m.responsibilities && (
                          <p>📋 <span className="font-medium">{en ? "Duties:" : "Nhiệm vụ:"}</span> {m.responsibilities}</p>
                        )}
                        {m.notes && (
                          <p className="italic">💬 {m.notes}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : m.id)}
                      className="text-xs text-muted-foreground hover:text-foreground p-1"
                      title={isExpanded ? (en ? "Collapse" : "Thu gọn") : (en ? "Expand" : "Xem thêm")}
                    >
                      {isExpanded ? "▲" : "▼"}
                    </button>
                    <button onClick={() => startEdit(m)} className="text-xs text-muted-foreground hover:text-foreground p-1" title={t("Sửa", lang)}>✏️</button>
                    <button onClick={() => onRemove(m.id)} className="text-xs text-red-400 hover:text-red-600 p-1" title="✕">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">💐</span>
          </div>
          <h3 className="text-base font-semibold mb-1">
            {members.length === 0 ? t("Thêm thành viên đầu tiên", lang) : t("Không tìm thấy", lang)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {members.length === 0
              ? (en ? "Add your bridesmaids, groomsmen, and other wedding party members" : "Thêm phù dâu, phù rể và các thành viên khác trong đội ngũ cưới")
              : (en ? "Try changing your filter" : "Thử thay đổi bộ lọc")}
          </p>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Vendor, VendorStatus, VendorPayment, VendorQuote } from "@/types/wedding";
import { t } from "@/lib/i18n";
import { VendorPaymentTracker } from "./vendor-payment-tracker";
import { VendorQuoteComparison } from "./vendor-quote-comparison";
import { VendorContractChecklist } from "./vendor-contract-checklist";

const CATEGORIES = [
  "🏛️ Nhà hàng", "📸 Ảnh/Video", "🌸 Trang trí",
  "💄 Makeup", "🎵 MC/Nhạc", "🚗 Xe",
  "💐 Hoa", "👗 Trang phục", "📦 Khác",
];

const STATUS_LIST: VendorStatus[] = ["new", "contacted", "quoted", "booked", "confirmed", "paid"];

const STATUS_CONFIG: Record<VendorStatus, { labelVi: string; labelEn: string; color: string; bg: string }> = {
  new: { labelVi: "Mới", labelEn: "New", color: "#6b7280", bg: "#f3f4f6" },
  contacted: { labelVi: "Đã liên hệ", labelEn: "Contacted", color: "#2563eb", bg: "#dbeafe" },
  quoted: { labelVi: "Báo giá", labelEn: "Quoted", color: "#7c3aed", bg: "#ede9fe" },
  booked: { labelVi: "Đã đặt", labelEn: "Booked", color: "#d97706", bg: "#fef3c7" },
  confirmed: { labelVi: "Xác nhận", labelEn: "Confirmed", color: "#059669", bg: "#d1fae5" },
  paid: { labelVi: "Đã trả", labelEn: "Paid", color: "#16a34a", bg: "#dcfce7" },
};

function formatVnd(n: number): string {
  if (n === 0) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function parseVnd(s: string): number {
  return parseInt(s.replace(/\D/g, ""), 10) || 0;
}

interface VendorPanelProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, "id">) => void;
  onRemoveVendor: (id: number) => void;
  onUpdateVendor?: (id: number, updates: Partial<Vendor>) => void;
  payments?: VendorPayment[];
  onAddPayment?: (payment: Omit<VendorPayment, "id">) => void;
  onRemovePayment?: (id: number) => void;
  onAddQuote?: (vendorId: number, quote: Omit<VendorQuote, "id" | "vendorId" | "createdAt">) => void;
  onRemoveQuote?: (vendorId: number, quoteId: number) => void;
  contractChecklist?: Record<string, boolean>;
  onToggleContractItem?: (itemId: string) => void;
  onClearContractChecklist?: () => void;
  lang?: string;
}

export function VendorPanel({ vendors, onAddVendor, onRemoveVendor, onUpdateVendor, payments = [], onAddPayment, onRemovePayment, onAddQuote, onRemoveQuote, contractChecklist = {}, onToggleContractItem, onClearContractChecklist, lang = "vi" }: VendorPanelProps) {
  const en = lang === "en";
  const [view, setView] = useState<"vendors" | "payments" | "compare" | "contract">("vendors");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCat, setFilterCat] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<VendorStatus | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Add form state
  const [cat, setCat] = useState(CATEGORIES[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState("");
  const [note, setNote] = useState("");
  const [budget, setBudget] = useState("");
  const [deposit, setDeposit] = useState("");

  // Edit form state
  const [editCat, setEditCat] = useState("");
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddr, setEditAddr] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editDeposit, setEditDeposit] = useState("");
  const [editStatus, setEditStatus] = useState<VendorStatus>("new");

  function resetAddForm() {
    setCat(CATEGORIES[0]); setName(""); setPhone(""); setAddr(""); setNote(""); setBudget(""); setDeposit("");
  }

  function handleAdd() {
    if (!name.trim()) return;
    onAddVendor({
      category: cat,
      name: name.trim(),
      phone: phone.trim(),
      address: addr.trim(),
      note: note.trim(),
      status: "new",
      budget: parseVnd(budget),
      deposit: parseVnd(deposit),
      quotes: [],
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function startEdit(v: Vendor) {
    setEditingId(v.id);
    setEditCat(v.category);
    setEditName(v.name);
    setEditPhone(v.phone);
    setEditAddr(v.address);
    setEditNote(v.note);
    setEditBudget(v.budget ? String(v.budget) : "");
    setEditDeposit(v.deposit ? String(v.deposit) : "");
    setEditStatus(v.status);
  }

  function handleSaveEdit(id: number) {
    if (!editName.trim() || !onUpdateVendor) return;
    onUpdateVendor(id, {
      category: editCat,
      name: editName.trim(),
      phone: editPhone.trim(),
      address: editAddr.trim(),
      note: editNote.trim(),
      status: editStatus,
      budget: parseVnd(editBudget),
      deposit: parseVnd(editDeposit),
    });
    setEditingId(null);
  }

  function handleStatusChange(id: number, status: VendorStatus) {
    onUpdateVendor?.(id, { status });
  }

  // Filtered vendors
  const filtered = vendors.filter((v) => {
    if (filterCat && v.category !== filterCat) return false;
    if (filterStatus && v.status !== filterStatus) return false;
    return true;
  });

  // Summary stats
  const totalBudget = vendors.reduce((s, v) => s + (v.budget || 0), 0);
  const totalDeposit = vendors.reduce((s, v) => s + (v.deposit || 0), 0);
  const totalRemaining = totalBudget - totalDeposit;

  // Used categories (for filter chips)
  const usedCategories = [...new Set(vendors.map((v) => v.category))];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("🗺️ Danh Sách Vendor", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? `${vendors.length} vendors` : `${vendors.length} nhà cung cấp`}
          </p>
        </div>
        {view === "vendors" && (
          <Button size="sm" className="h-8 px-3" onClick={() => { setShowAddForm(!showAddForm); resetAddForm(); }}>
            + {t("Thêm nhà cung cấp", lang)}
          </Button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 border-b">
        <button
          onClick={() => setView("vendors")}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === "vendors"
              ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          🗺️ {en ? "Vendors" : "Vendor"}
        </button>
        <button
          onClick={() => setView("payments")}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === "payments"
              ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          💳 {en ? "Payments" : "Thanh Toán"}
          {payments.length > 0 && (
            <span className="ml-1 text-[10px] bg-gray-200 rounded-full px-1.5">{payments.length}</span>
          )}
        </button>
        <button
          onClick={() => setView("compare")}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === "compare"
              ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📊 {en ? "Compare" : "So Sánh"}
        </button>
        <button
          onClick={() => setView("contract")}
          className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === "contract"
              ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          📋 {en ? "Contract Checklist" : "Checklist Hợp Đồng"}
        </button>
      </div>

      {/* Payment tracker view */}
      {view === "payments" && onAddPayment && onRemovePayment && (
        <VendorPaymentTracker
          vendors={vendors}
          payments={payments}
          onAddPayment={onAddPayment}
          onRemovePayment={onRemovePayment}
          lang={lang}
        />
      )}

      {/* Quote comparison view */}
      {view === "compare" && onAddQuote && onRemoveQuote && (
        <VendorQuoteComparison
          vendors={vendors}
          onAddQuote={onAddQuote}
          onRemoveQuote={onRemoveQuote}
          lang={lang}
        />
      )}

      {/* Contract checklist view */}
      {view === "contract" && onToggleContractItem && onClearContractChecklist && (
        <VendorContractChecklist
          checkedItems={contractChecklist}
          onToggle={onToggleContractItem}
          onClear={onClearContractChecklist}
          lang={lang}
        />
      )}

      {/* Vendor list view */}
      {view === "vendors" && (
      <>
      {/* Summary cards */}
      {vendors.length > 0 && totalBudget > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>{formatVnd(totalBudget)}</p>
            <p className="text-xs text-muted-foreground">{t("Ngân sách", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-amber-600">{formatVnd(totalDeposit)}</p>
            <p className="text-xs text-muted-foreground">{t("Đã đặt cọc", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-rose-600">{formatVnd(totalRemaining)}</p>
            <p className="text-xs text-muted-foreground">{t("Còn lại", lang)}</p>
          </div>
        </div>
      )}

      {/* Filter chips */}
      {vendors.length > 0 && (
        <div className="space-y-1.5">
          {/* Category filter */}
          {usedCategories.length > 1 && (
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
              {usedCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterCat(filterCat === c ? null : c)}
                  className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                    filterCat === c
                      ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                      : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* Status filter */}
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => setFilterStatus(null)}
              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                filterStatus === null
                  ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                  : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
              }`}
            >
              {t("Tất cả", lang)}
            </button>
            {STATUS_LIST.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = filterStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilterStatus(active ? null : s)}
                  className="text-xs px-2 py-1 rounded-full border transition-colors"
                  style={{
                    backgroundColor: active ? cfg.color : cfg.bg,
                    color: active ? "#fff" : cfg.color,
                    borderColor: active ? cfg.color : "transparent",
                  }}
                >
                  {en ? cfg.labelEn : cfg.labelVi}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <select className="w-full h-8 text-sm border border-gray-300 rounded px-2 bg-background" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input className="flex-[2] h-8 text-sm" placeholder={t("Tên vendor", lang) + " *"} value={name} onChange={(e) => setName(e.target.value)} />
            <Input className="flex-1 h-8 text-sm" placeholder={t("SĐT", lang)} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Input className="h-8 text-sm" placeholder={t("Địa chỉ", lang)} value={addr} onChange={(e) => setAddr(e.target.value)} />
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input className="flex-1 h-8 text-sm" placeholder={t("Giá thỏa thuận", lang)} type="text" inputMode="numeric" value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} />
            <Input className="flex-1 h-8 text-sm" placeholder={t("Tiền đặt cọc", lang)} type="text" inputMode="numeric" value={deposit} onChange={(e) => setDeposit(e.target.value.replace(/\D/g, ""))} />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input className="flex-1 h-8 text-sm" placeholder={lang === "en" ? "Notes (price, package...)" : "Ghi chú (giá, gói...)"} value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">{t("Hủy", lang)}</button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>{t("Thêm nhà cung cấp", lang)}</Button>
          </div>
        </div>
      )}

      {/* Vendor list */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((v) => {
            const isEditing = editingId === v.id;
            const statusCfg = STATUS_CONFIG[v.status || "new"];

            if (isEditing) {
              return (
                <div key={v.id} className="rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-2">
                  <select className="w-full h-8 text-sm border border-gray-300 rounded px-2 bg-background" value={editCat} onChange={(e) => setEditCat(e.target.value)}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input className="flex-[2] h-8 text-sm" placeholder={t("Tên vendor", lang)} value={editName} onChange={(e) => setEditName(e.target.value)} />
                    <Input className="flex-1 h-8 text-sm" placeholder={t("SĐT", lang)} value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
                  </div>
                  <Input className="h-8 text-sm" placeholder={t("Địa chỉ", lang)} value={editAddr} onChange={(e) => setEditAddr(e.target.value)} />
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    <Input className="flex-1 h-8 text-sm" placeholder={t("Giá thỏa thuận", lang)} type="text" inputMode="numeric" value={editBudget} onChange={(e) => setEditBudget(e.target.value.replace(/\D/g, ""))} />
                    <Input className="flex-1 h-8 text-sm" placeholder={t("Tiền đặt cọc", lang)} type="text" inputMode="numeric" value={editDeposit} onChange={(e) => setEditDeposit(e.target.value.replace(/\D/g, ""))} />
                  </div>
                  <select
                    className="w-full h-8 text-sm border border-gray-300 rounded px-2 bg-background"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as VendorStatus)}
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>{en ? STATUS_CONFIG[s].labelEn : STATUS_CONFIG[s].labelVi}</option>
                    ))}
                  </select>
                  <Input className="h-8 text-sm" placeholder={t("Ghi chú", lang)} value={editNote} onChange={(e) => setEditNote(e.target.value)} />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">{t("Hủy", lang)}</button>
                    <Button size="sm" className="h-8 px-3" onClick={() => handleSaveEdit(v.id)}>{t("Lưu", lang)}</Button>
                  </div>
                </div>
              );
            }

            return (
              <div key={v.id} className="flex items-start gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3">
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Header row: category badge + name + status */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 shrink-0">{v.category}</span>
                    <span className="font-semibold text-sm truncate">{v.name}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full shrink-0 ml-auto"
                      style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
                    >
                      {en ? statusCfg.labelEn : statusCfg.labelVi}
                    </span>
                  </div>

                  {/* Contact info */}
                  {v.phone && <div className="text-xs text-gray-500">📞 {v.phone}</div>}
                  {v.address && <div className="text-xs text-gray-500">📍 {v.address}</div>}
                  {v.note && <div className="text-xs text-gray-400 italic">{v.note}</div>}

                  {/* Budget info */}
                  {(v.budget > 0 || v.deposit > 0) && (
                    <div className="flex gap-3 text-xs pt-0.5">
                      {v.budget > 0 && <span className="text-muted-foreground">💰 {formatVnd(v.budget)}</span>}
                      {v.deposit > 0 && <span className="text-amber-600">🔒 {formatVnd(v.deposit)}</span>}
                      {v.budget > 0 && v.deposit > 0 && v.deposit < v.budget && (
                        <span className="text-rose-500">📋 {formatVnd(v.budget - v.deposit)}</span>
                      )}
                    </div>
                  )}

                  {/* Status quick-switch */}
                  <div className="flex gap-1 pt-1 flex-wrap">
                    {STATUS_LIST.map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      const active = (v.status || "new") === s;
                      return (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(v.id, s)}
                          className="text-[10px] px-1.5 py-0.5 rounded border transition-colors"
                          style={{
                            backgroundColor: active ? cfg.color : "transparent",
                            color: active ? "#fff" : cfg.color,
                            borderColor: active ? cfg.color : "#e5e7eb",
                          }}
                        >
                          {en ? cfg.labelEn : cfg.labelVi}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => startEdit(v)} className="text-xs text-muted-foreground hover:text-foreground p-1" title={t("Sửa", lang)}>✏️</button>
                  <button onClick={() => onRemoveVendor(v.id)} className="text-xs text-red-400 hover:text-red-600 p-1" title="✕">✕</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">🗺️</span>
          </div>
          <h3 className="text-base font-semibold mb-1">
            {vendors.length === 0 ? t("Thêm vendor đầu tiên", lang) : t("Không tìm thấy vendor", lang)}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {vendors.length === 0
              ? (en ? "Save vendor info to compare and contact" : "Lưu thông tin nhà cung cấp để so sánh và liên hệ")
              : (en ? "Try changing your filter" : "Thử thay đổi bộ lọc")}
          </p>
        </div>
      )}
      </>
      )}
    </div>
  );
}

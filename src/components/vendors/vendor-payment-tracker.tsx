import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Vendor, VendorPayment, VendorPaymentMethod } from "@/types/wedding";
import { t } from "@/lib/i18n";

const METHODS: { key: VendorPaymentMethod; vi: string; en: string }[] = [
  { key: "cash", vi: "Tiền mặt", en: "Cash" },
  { key: "bank_transfer", vi: "Chuyển khoản", en: "Bank Transfer" },
  { key: "card", vi: "Thẻ", en: "Card" },
  { key: "other", vi: "Khác", en: "Other" },
];

function formatVnd(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

function parseVnd(s: string): number {
  return parseInt(s.replace(/\D/g, ""), 10) || 0;
}

interface VendorPaymentTrackerProps {
  vendors: Vendor[];
  payments: VendorPayment[];
  onAddPayment: (payment: Omit<VendorPayment, "id">) => void;
  onRemovePayment: (id: number) => void;
  lang?: string;
}

export function VendorPaymentTracker({
  vendors,
  payments,
  onAddPayment,
  onRemovePayment,
  lang = "vi",
}: VendorPaymentTrackerProps) {
  const en = lang === "en";
  const [showForm, setShowForm] = useState(false);
  const [vendorId, setVendorId] = useState<number>(vendors[0]?.id ?? 0);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState<VendorPaymentMethod>("bank_transfer");
  const [note, setNote] = useState("");

  function resetForm() {
    setVendorId(vendors[0]?.id ?? 0);
    setAmount("");
    setDate(new Date().toISOString().slice(0, 10));
    setMethod("bank_transfer");
    setNote("");
  }

  function handleAdd() {
    if (!vendorId || !amount) return;
    onAddPayment({
      vendorId,
      amount: parseVnd(amount),
      date,
      dueDate: date, // Default due date to payment date
      method,
      note: note.trim(),
      paid: false,
    });
    resetForm();
    setShowForm(false);
  }

  // Compute per-vendor totals
  const vendorSummaries = vendors.map((v) => {
    const vPayments = payments.filter((p) => p.vendorId === v.id);
    const totalPaid = vPayments.reduce((s, p) => s + p.amount, 0);
    const remaining = Math.max(0, (v.budget || 0) - totalPaid);
    const pct = v.budget > 0 ? Math.min(100, Math.round((totalPaid / v.budget) * 100)) : 0;
    return { vendor: v, payments: vPayments, totalPaid, remaining, pct };
  }).filter((s) => s.payments.length > 0 || s.vendor.budget > 0);

  const globalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const globalBudget = vendors.reduce((s, v) => s + (v.budget || 0), 0);
  const globalRemaining = Math.max(0, globalBudget - globalPaid);

  // Sort payments by date desc
  const sortedPayments = [...payments].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-base">{t("💳 Thanh Toán Vendor", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? `${payments.length} payments recorded` : `${payments.length} thanh toán đã ghi`}
          </p>
        </div>
        {vendors.length > 0 && (
          <Button
            size="sm"
            className="h-8 px-3"
            onClick={() => { setShowForm(!showForm); resetForm(); }}
          >
            + {t("Ghi thanh toán", lang)}
          </Button>
        )}
      </div>

      {/* Global summary */}
      {payments.length > 0 && globalBudget > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold" style={{ color: "var(--theme-primary)" }}>{formatVnd(globalPaid)}</p>
            <p className="text-xs text-muted-foreground">{t("Đã trả", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-rose-600">{formatVnd(globalRemaining)}</p>
            <p className="text-xs text-muted-foreground">{t("Còn lại", lang)}</p>
          </div>
          <div className="rounded-lg bg-[var(--theme-surface-muted)] p-2">
            <p className="text-sm font-bold text-muted-foreground">{formatVnd(globalBudget)}</p>
            <p className="text-xs text-muted-foreground">{t("Tổng ngân sách", lang)}</p>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)] p-3 space-y-2">
          <select
            className="w-full h-8 text-sm border border-gray-300 rounded px-2 bg-background"
            value={vendorId}
            onChange={(e) => setVendorId(Number(e.target.value))}
          >
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>{v.category} — {v.name}</option>
            ))}
          </select>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Số tiền", lang) + " *"}
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            />
            <Input
              className="flex-1 h-8 text-sm"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5">
            <select
              className="flex-1 h-8 text-sm border border-gray-300 rounded px-2 bg-background"
              value={method}
              onChange={(e) => setMethod(e.target.value as VendorPaymentMethod)}
            >
              {METHODS.map((m) => (
                <option key={m.key} value={m.key}>{en ? m.en : m.vi}</option>
              ))}
            </select>
            <Input
              className="flex-1 h-8 text-sm"
              placeholder={t("Ghi chú", lang)}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="text-xs px-3 py-1.5 text-muted-foreground hover:text-foreground">
              {t("Hủy", lang)}
            </button>
            <Button size="sm" className="h-8 px-3" onClick={handleAdd}>{t("Ghi thanh toán", lang)}</Button>
          </div>
        </div>
      )}

      {/* Per-vendor breakdown */}
      {vendorSummaries.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">{t("Theo nhà cung cấp", lang)}</h3>
          {vendorSummaries.map(({ vendor, totalPaid, remaining, pct }) => (
            <div key={vendor.id} className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{vendor.category} — {vendor.name}</span>
                <span className="text-xs text-muted-foreground">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: pct >= 100 ? "#16a34a" : "var(--theme-primary)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatVnd(totalPaid)} {t("đã trả", lang)}</span>
                {vendor.budget > 0 && <span>{formatVnd(remaining)} {t("còn lại", lang)}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment history */}
      {sortedPayments.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t("Lịch sử thanh toán", lang)}</h3>
          {sortedPayments.map((p) => {
            const vendor = vendors.find((v) => v.id === p.vendorId);
            const mCfg = METHODS.find((m) => m.key === p.method);
            return (
              <div key={p.id} className="flex items-center gap-2 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-surface)] p-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{formatVnd(p.amount)}</span>
                    {vendor && (
                      <span className="text-xs text-muted-foreground truncate">— {vendor.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{p.date}</span>
                    {mCfg && <span>· {en ? mCfg.en : mCfg.vi}</span>}
                    {p.note && <span className="italic">· {p.note}</span>}
                  </div>
                </div>
                <button
                  onClick={() => onRemovePayment(p.id)}
                  className="text-xs text-red-400 hover:text-red-600 p-1 shrink-0"
                  title="✕"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {payments.length === 0 && vendors.length === 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-base font-semibold mb-1">{t("Thêm vendor trước", lang)}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {en ? "Add vendors first, then track payments here" : "Thêm vendor trước, sau đó ghi thanh toán tại đây"}
          </p>
        </div>
      )}

      {payments.length === 0 && vendors.length > 0 && (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-3">
            <span className="text-3xl">💳</span>
          </div>
          <h3 className="text-base font-semibold mb-1">{t("Ghi thanh toán đầu tiên", lang)}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {en ? "Track deposits and payments for each vendor" : "Theo dõi tiền cọc và thanh toán cho từng vendor"}
          </p>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { t } from "@/lib/i18n";
import { getExpenseCategories } from "@/data/resolve-data";
import type { ExpenseEntry } from "@/types/wedding";

interface ExpenseFormProps {
  lang: string;
  editing?: ExpenseEntry | null;
  onSubmit: (entry: Omit<ExpenseEntry, "id">) => void;
  onUpdate?: (id: number, updates: Partial<ExpenseEntry>) => void;
  onCancel: () => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm({ lang, editing, onSubmit, onUpdate, onCancel }: ExpenseFormProps) {
  const categories = getExpenseCategories(lang);
  const [category, setCategory] = useState(editing?.category || categories[0]?.key || "other");
  const [description, setDescription] = useState(editing?.description || "");
  const [amount, setAmount] = useState(editing?.amount?.toString() || "");
  const [vendorName, setVendorName] = useState(editing?.vendorName || "");
  const [date, setDate] = useState(editing?.date || today());
  const [paid, setPaid] = useState(editing?.paid ?? false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/\D/g, "")) || 0;
    if (numAmount <= 0 || !description.trim()) return;

    const entry = {
      category,
      description: description.trim(),
      amount: numAmount,
      vendorName: vendorName.trim() || undefined,
      date,
      paid,
    };

    if (editing && onUpdate) {
      onUpdate(editing.id, entry);
    } else {
      onSubmit(entry);
    }
    onCancel();
  }

  const inputCls = "w-full border border-gray-300 rounded px-2 py-1.5 text-sm";

  return (
    <form onSubmit={handleSubmit} className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-semibold">
        {editing ? t("Sửa chi phí", lang) : t("Thêm chi phí", lang)}
      </h3>

      <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
        {categories.map((c) => (
          <option key={c.key} value={c.key}>{c.icon} {c.label}</option>
        ))}
      </select>

      <input
        className={inputCls}
        placeholder={t("Mô tả", lang) + " *"}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <input
        className={inputCls}
        placeholder={t("Số tiền (VND)", lang) + " *"}
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
        required
      />

      <input
        className={inputCls}
        placeholder={t("Nhà cung cấp", lang)}
        value={vendorName}
        onChange={(e) => setVendorName(e.target.value)}
      />

      <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} className="rounded" />
        {t("Đã thanh toán", lang)}
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-[var(--theme-primary)] text-white rounded py-1.5 text-sm font-medium hover:opacity-90"
        >
          {editing ? t("Cập nhật", lang) : t("Thêm", lang)}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border rounded py-1.5 text-sm hover:bg-muted"
        >
          {t("Hủy", lang)}
        </button>
      </div>
    </form>
  );
}

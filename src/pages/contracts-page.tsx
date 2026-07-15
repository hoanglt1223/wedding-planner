import { useState } from "react";
import { t } from "@/lib/i18n";
import type { WeddingContract, ContractStatus } from "@/types/contracts";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { ContractSummaryBar } from "@/components/contracts/contract-summary-bar";
import { ContractList } from "@/components/contracts/contract-list";
import { ContractForm } from "@/components/contracts/contract-form";

type FilterStatus = "all" | ContractStatus;

export function ContractsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [editing, setEditing] = useState<WeddingContract | null | undefined>(undefined);
  const lang = state.lang;

  const contracts = state.contracts ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(contract: WeddingContract) {
    setEditing(contract);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<WeddingContract, "id" | "createdAt" | "updatedAt">) {
    if (editing && editing.id > 0) {
      store.updateContract(editing.id, data);
    } else {
      store.addContract(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this contract?" : "Xóa hợp đồng này?")) {
      store.removeContract(id);
    }
  }

  // Status filter options
  const statusOptions: Array<{ value: FilterStatus; labelVi: string; labelEn: string }> = [
    { value: "all", labelVi: "Tất cả", labelEn: "All" },
    { value: "draft", labelVi: "Nháp", labelEn: "Draft" },
    { value: "sent", labelVi: "Đã gửi", labelEn: "Sent" },
    { value: "negotiating", labelVi: "Đang thương lượng", labelEn: "Negotiating" },
    { value: "signed", labelVi: "Đã ký", labelEn: "Signed" },
    { value: "completed", labelVi: "Hoàn thành", labelEn: "Completed" },
    { value: "cancelled", labelVi: "Đã hủy", labelEn: "Cancelled" },
  ];

  // If editing or adding, show form
  if (editing !== undefined) {
    return (
      <div className="p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-base">
              {editing ? t("Cập nhật hợp đồng", lang) : t("Thêm hợp đồng mới", lang)}
            </h2>
            <p className="text-xs text-muted-foreground">
              {t("Quản lý thông tin hợp đồng", lang)}
            </p>
          </div>
        </div>
        <ContractForm
          contract={editing}
          onSave={handleSave}
          onCancel={handleClose}
          lang={lang}
        />
      </div>
    );
  }

  // Main contracts list view
  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">📄 {t("Hợp Đồng", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {t("Quản lý hợp đồng và thanh toán", lang)}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          + {t("Thêm", lang)}
        </button>
      </div>

      {/* Summary */}
      <ContractSummaryBar contracts={contracts} lang={lang} />

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="border rounded px-3 py-1.5 text-sm bg-background"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {lang === "vi" ? opt.labelVi : opt.labelEn}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm hợp đồng...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* Contract List */}
      <ContractList
        contracts={contracts}
        search={search}
        filterStatus={filterStatus}
        lang={lang}
        onEdit={handleEdit}
        onToggleFavorite={() => {}}
        onDelete={handleDelete}
      />
    </div>
  );
}

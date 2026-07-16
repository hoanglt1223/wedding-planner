import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Vendor, VendorStatus } from "@/types/wedding";
import { t } from "@/lib/i18n";

const STATUS_LABELS: Record<VendorStatus, { vi: string; en: string }> = {
  new: { vi: "Mới", en: "New" },
  contacted: { vi: "Đã liên hệ", en: "Contacted" },
  quoted: { vi: "Báo giá", en: "Quoted" },
  booked: { vi: "Đã đặt", en: "Booked" },
  confirmed: { vi: "Xác nhận", en: "Confirmed" },
  paid: { vi: "Đã trả", en: "Paid" },
};

function formatVnd(n: number): string {
  if (n === 0) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

// Prevent Excel formula injection
function sanitizeCellValue(value: string): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (/^[=+\-@]/.test(trimmed)) {
    return "'" + trimmed;
  }
  return trimmed;
}

interface VendorExportActionsProps {
  vendors: Vendor[];
  filteredVendors?: Vendor[];
  lang?: string;
}

export function VendorExportActions({ vendors, filteredVendors, lang = "vi" }: VendorExportActionsProps) {
  const [exporting, setExporting] = useState(false);
  const en = lang === "en";

  function generateCSV(vendorList: Vendor[]): string {
    const headers = en
      ? ["Category", "Name", "Phone", "Address", "Status", "Budget (VND)", "Deposit (VND)", "Notes"]
      : ["Danh mục", "Tên", "SĐT", "Địa chỉ", "Trạng thái", "Ngân sách (VND)", "Đặt cọc (VND)", "Ghi chú"];

    const rows = vendorList.map(v => {
      const statusLabel = STATUS_LABELS[v.status || "new"];
      return [
        sanitizeCellValue(v.category),
        sanitizeCellValue(v.name),
        sanitizeCellValue(v.phone),
        sanitizeCellValue(v.address),
        sanitizeCellValue(en ? statusLabel.en : statusLabel.vi),
        String(v.budget || 0),
        String(v.deposit || 0),
        sanitizeCellValue(v.note),
      ];
    });

    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
  }

  function downloadCSV(csv: string, filename: string) {
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async function handleExport(useFiltered: boolean = false) {
    setExporting(true);
    try {
      const listToExport = useFiltered && filteredVendors ? filteredVendors : vendors;
      if (listToExport.length === 0) return;

      const csv = generateCSV(listToExport);
      const date = new Date().toISOString().split("T")[0];
      const filename = `wedding-vendors-${date}.csv`;
      downloadCSV(csv, filename);
    } finally {
      setExporting(false);
    }
  }

  const hasFiltered = filteredVendors && filteredVendors.length !== vendors.length;
  const filteredCount = filteredVendors?.length || 0;

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 px-3"
        onClick={() => handleExport(false)}
        disabled={exporting || vendors.length === 0}
      >
        {exporting ? "⏳" : "📥"} {t("Xuất tất cả", lang)}
      </Button>
      {hasFiltered && filteredCount > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3"
          onClick={() => handleExport(true)}
          disabled={exporting}
        >
          {exporting ? "⏳" : "📥"} {t(`Xuất ${filteredCount}`, lang)}
        </Button>
      )}
    </div>
  );
}

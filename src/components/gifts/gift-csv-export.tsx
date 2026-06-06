import { t } from "@/lib/i18n";
import type { GiftEntry } from "@/types/wedding";

interface GiftCsvExportProps {
  gifts: GiftEntry[];
  lang: string;
}

export function GiftCsvExport({ gifts, lang }: GiftCsvExportProps) {
  function handleExport() {
    if (gifts.length === 0) return;
    const en = lang === "en";

    const header = en
      ? "Guest Name,Type,Amount (VND),Description,Side,Thanked"
      : "Tên khách,Loại,Số tiền (VNĐ),Mô tả,Bên,Đã cảm ơn";

    const rows = gifts.map((g) => {
      const sideLabel =
        g.side === "groom" ? (en ? "Groom" : "Nhà trai") :
        g.side === "bride" ? (en ? "Bride" : "Nhà gái") : (en ? "Other" : "Khác");
      const typeLabel = g.type === "cash" ? (en ? "Cash" : "Tiền mặt") : (en ? "Gift" : "Quà tặng");
      const thanked = g.thankYouSent ? (en ? "Yes" : "Có") : (en ? "No" : "Không");
      return `"${g.guestName}",${typeLabel},${g.amount ?? 0},"${g.description ?? ""}",${sideLabel},${thanked}`;
    });

    const csv = [header, ...rows].join("\n");
    const BOM = "﻿"; // UTF-8 BOM for Excel
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-gifts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={gifts.length === 0}
      className="text-xs px-2.5 py-1.5 border rounded hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      title={t("Xuất CSV phong bì", lang)}
    >
      📥 CSV
    </button>
  );
}

import { t } from "@/lib/i18n";
import type { GiftEntry } from "@/types/wedding";

interface Props {
  gifts: GiftEntry[];
  lang: string;
}

const INJECTION_CHARS = /^[=+\-@]/;

function sanitizeCell(value: string): string {
  if (INJECTION_CHARS.test(value)) return `'${value}`;
  return value;
}

function escapeCell(value: string): string {
  const safe = sanitizeCell(value);
  if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

function sideLabel(side: string, lang: string) {
  if (lang === "en") return side === "groom" ? "Groom" : side === "bride" ? "Bride" : "Other";
  return side === "groom" ? "Nhà trai" : side === "bride" ? "Nhà gái" : "Khác";
}

export function GiftCsvExport({ gifts, lang }: Props) {
  function handleExport() {
    const BOM = "\uFEFF";
    const headers = lang === "en"
      ? ["Guest Name", "Type", "Amount", "Description", "Side", "Table", "Thank You Sent"]
      : ["Tên khách", "Loại", "Số tiền", "Mô tả", "Bên", "Bàn/Nhóm", "Đã cảm ơn"];

    const rows = gifts.map((g) => [
      escapeCell(g.guestName),
      escapeCell(g.type === "cash" ? t("Tiền mặt", lang) : t("Quà tặng", lang)),
      g.amount != null ? String(g.amount) : "",
      escapeCell(g.description ?? ""),
      escapeCell(sideLabel(g.side, lang)),
      escapeCell(g.tableGroup ?? ""),
      g.thankYouSent ? (lang === "en" ? "Yes" : "Có") : (lang === "en" ? "No" : "Chưa"),
    ]);

    const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `phong-bi-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={gifts.length === 0}
      className="text-xs px-3 py-1.5 border rounded hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      ⬇️ {t("Xuất CSV phong bì", lang)}
    </button>
  );
}

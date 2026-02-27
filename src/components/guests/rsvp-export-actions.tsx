import { useState } from "react";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import type { RsvpInvitation } from "@/lib/rsvp-api";

interface RsvpExportActionsProps {
  invitations: RsvpInvitation[];
  lang: string;
}

export function RsvpExportActions({ invitations, lang }: RsvpExportActionsProps) {
  const [copied, setCopied] = useState(false);

  if (invitations.length === 0) return null;

  const handleCopyAll = async () => {
    const lines = invitations.map(
      (inv) => `${inv.guestName}: ${window.location.origin}/#/rsvp/${inv.token}`,
    );
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const handleExportCsv = () => {
    const BOM = "\uFEFF";
    const header = lang === "en"
      ? "Name,Status,Plus Ones,Dietary,Message,Link"
      : "Họ tên,Trạng thái,Đi cùng,Ăn uống,Lời nhắn,Link";
    const safe = (s: string) => s.replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""');
    const rows = invitations.map((inv) => [
      `"${safe(inv.guestName)}"`,
      inv.status,
      inv.plusOnes,
      `"${safe(inv.dietary || "")}"`,
      `"${safe(inv.message || "")}"`,
      `${window.location.origin}/#/rsvp/${inv.token}`,
    ].join(","));
    const csv = BOM + header + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp_responses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-1 flex-wrap">
      <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={handleCopyAll}>
        {copied ? `✓ ${t("Đã sao chép!", lang)}` : `📋 ${t("Sao chép tất cả", lang)}`}
      </Button>
      <Button size="sm" variant="secondary" className="h-7 text-xs" onClick={handleExportCsv}>
        📤 {t("Xuất CSV", lang)}
      </Button>
    </div>
  );
}

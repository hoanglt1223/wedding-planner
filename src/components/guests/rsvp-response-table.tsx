import { useState } from "react";
import { t } from "@/lib/i18n";
import type { RsvpInvitation } from "@/lib/rsvp-api";
import { RsvpQrModal } from "./rsvp-qr-modal";

interface RsvpResponseTableProps {
  invitations: RsvpInvitation[];
  lang: string;
}

const STATUS_ORDER: Record<string, number> = { pending: 0, accepted: 1, declined: 2 };

export function RsvpResponseTable({ invitations, lang }: RsvpResponseTableProps) {
  const [qrGuest, setQrGuest] = useState<{ name: string; token: string } | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const sorted = [...invitations].sort(
    (a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9),
  );

  const handleCopy = async (token: string) => {
    const url = `${window.location.origin}/rsvp/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1500);
    } catch { /* ignore */ }
  };

  const statusBadge = (status: string) => {
    if (status === "accepted") return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-700">{t("Đã nhận", lang)}</span>;
    if (status === "declined") return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-600">{t("Từ chối tham dự", lang)}</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500">{t("Chờ phản hồi", lang)}</span>;
  };

  if (invitations.length === 0) return null;

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-2 py-1.5 font-semibold">{lang === "en" ? "Guest" : "Khách"}</th>
              <th className="text-left px-2 py-1.5 font-semibold">{lang === "en" ? "Status" : "TT"}</th>
              <th className="text-center px-2 py-1.5 font-semibold">+</th>
              <th className="text-left px-2 py-1.5 font-semibold hidden sm:table-cell">{lang === "en" ? "Dietary" : "Ăn uống"}</th>
              <th className="text-left px-2 py-1.5 font-semibold hidden sm:table-cell">{t("Lời nhắn", lang)}</th>
              <th className="text-center px-2 py-1.5 font-semibold">{lang === "en" ? "Actions" : ""}</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inv) => (
              <tr key={inv.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1.5 font-medium max-w-[120px] truncate">{inv.guestName}</td>
                <td className="px-2 py-1.5">{statusBadge(inv.status)}</td>
                <td className="px-2 py-1.5 text-center">{inv.status === "accepted" && inv.plusOnes > 0 ? `+${inv.plusOnes}` : ""}</td>
                <td className="px-2 py-1.5 text-gray-500 max-w-[100px] truncate hidden sm:table-cell">{inv.dietary || ""}</td>
                <td className="px-2 py-1.5 text-gray-500 max-w-[120px] truncate hidden sm:table-cell">{inv.message || ""}</td>
                <td className="px-2 py-1.5 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <button
                      type="button"
                      onClick={() => handleCopy(inv.token)}
                      className="text-gray-400 hover:text-blue-600"
                      title={t("Sao chép link", lang)}
                    >
                      {copiedToken === inv.token ? "✓" : "📋"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQrGuest({ name: inv.guestName, token: inv.token })}
                      className="text-gray-400 hover:text-blue-600"
                      title={t("Mã QR", lang)}
                    >
                      📱
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {qrGuest && (
        <RsvpQrModal
          guestName={qrGuest.name}
          token={qrGuest.token}
          open={true}
          onClose={() => setQrGuest(null)}
          lang={lang}
        />
      )}
    </>
  );
}

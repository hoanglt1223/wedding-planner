import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { t } from "@/lib/i18n";

interface RsvpQrModalProps {
  guestName: string;
  token: string;
  open: boolean;
  onClose: () => void;
  lang?: string;
}

export function RsvpQrModal({ guestName, token, open, onClose, lang = "vi" }: RsvpQrModalProps) {
  const [qrUrl, setQrUrl] = useState("");
  const rsvpLink = `${window.location.origin}/#/rsvp/${token}`;

  useEffect(() => {
    if (open && token) {
      QRCode.toDataURL(rsvpLink, { width: 256, margin: 2 }).then(setQrUrl).catch(() => {});
    }
  }, [open, token, rsvpLink]);

  if (!open) return null;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(rsvpLink); } catch { /* fallback not needed */ }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 max-w-xs w-full mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t("Mã QR", lang)} — {guestName}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        {qrUrl && <img src={qrUrl} alt="QR Code" className="w-full rounded-lg" />}
        <p className="text-xs text-gray-500 break-all">{rsvpLink}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2 text-xs font-semibold bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          📋 {t("Sao chép link", lang)}
        </button>
      </div>
    </div>
  );
}

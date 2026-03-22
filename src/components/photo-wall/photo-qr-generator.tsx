import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { t } from "@/lib/i18n";

interface Props {
  token: string;
  lang?: string;
}

export function PhotoQrGenerator({ token, lang = "vi" }: Props) {
  const [qrUrl, setQrUrl] = useState("");
  const uploadLink = `${window.location.origin}/photos/${token}`;

  useEffect(() => {
    if (token) {
      QRCode.toDataURL(uploadLink, { width: 256, margin: 2 }).then(setQrUrl).catch(() => {});
    }
  }, [token, uploadLink]);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(uploadLink); } catch { /* no-op */ }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "photo-wall-qr.png";
    a.click();
  };

  if (!token) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">{t("Tạo QR code ảnh", lang)}</h3>
      {qrUrl && (
        <img src={qrUrl} alt="QR Upload" className="w-40 h-40 rounded-lg border border-gray-100" />
      )}
      <p className="text-xs text-gray-500 break-all">{uploadLink}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-1.5 text-xs font-medium bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          📋 Sao chép link
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 py-1.5 text-xs font-medium bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          ⬇️ Tải QR
        </button>
      </div>
    </div>
  );
}

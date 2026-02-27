import { useState } from "react";
import { t } from "@/lib/i18n";
import { createPhotoToken } from "@/lib/photo-api";
import type { PhotoWallSettings } from "@/types/wedding";
import { PhotoQrGenerator } from "./photo-qr-generator";

interface Props {
  userId: string;
  settings: PhotoWallSettings;
  onUpdateSettings: (s: Partial<PhotoWallSettings>) => void;
  lang?: string;
  uploadToken?: string;
  onTokenCreated?: (token: string) => void;
}

export function PhotoUploadLink({ userId, settings, onUpdateSettings, lang = "vi", uploadToken, onTokenCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showQr, setShowQr] = useState(false);

  const handleToggleEnable = async () => {
    const next = !settings.enabled;
    onUpdateSettings({ enabled: next });
    if (next && !uploadToken) {
      setLoading(true);
      setError("");
      try {
        const token = await createPhotoToken(userId);
        onTokenCreated?.(token);
      } catch {
        setError("Không thể tạo link. Thử lại sau.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const token = await createPhotoToken(userId);
      onTokenCreated?.(token);
    } catch {
      setError("Không thể tạo link.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!uploadToken) return;
    const link = `${window.location.origin}/#/photos/${uploadToken}`;
    try { await navigator.clipboard.writeText(link); } catch { /* no-op */ }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{t("Tường ảnh cưới", lang)}</span>
        <button
          type="button"
          onClick={handleToggleEnable}
          disabled={loading}
          className={`relative w-11 h-6 rounded-full transition-colors ${settings.enabled ? "bg-gray-800" : "bg-gray-200"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${settings.enabled ? "left-5.5" : "left-0.5"}`} />
        </button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {settings.enabled && uploadToken && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button type="button" onClick={handleCopy} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
              📋 Sao chép link
            </button>
            <button type="button" onClick={() => setShowQr((v) => !v)} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">
              📱 {t("Tạo QR code ảnh", lang)}
            </button>
            <button type="button" onClick={handleRegenerate} disabled={loading} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40">
              🔄 Mới
            </button>
          </div>
          {showQr && <PhotoQrGenerator token={uploadToken} lang={lang} />}
        </div>
      )}
    </div>
  );
}

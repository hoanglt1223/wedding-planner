import { useCallback, useEffect, useState } from "react";
import { t } from "@/lib/i18n";
import { fetchPhotos, moderatePhoto } from "@/lib/photo-api";
import type { PhotoMeta } from "@/lib/photo-api";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import { PhotoMasonryGrid } from "./photo-masonry-grid";
import { PhotoUploadLink } from "./photo-upload-link";

interface Props {
  userId: string;
  state: WeddingState;
  store: WeddingStore;
}

export function PhotoGalleryDashboard({ userId, state, store }: Props) {
  const [photos, setPhotos] = useState<PhotoMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadToken, setUploadToken] = useState<string>("");
  const [showModerate, setShowModerate] = useState(false);
  const lang = state.lang;
  const settings = state.photoWallSettings ?? { enabled: false, maxPhotos: 100, autoApprove: true };

  const refreshPhotos = useCallback(() => {
    if (!userId) return;
    fetchPhotos(userId)
      .then(({ photos: p }) => { setPhotos(p); setLoading(false); })
      .catch(() => { setError("Không tải được ảnh."); setLoading(false); });
  }, [userId]);

  useEffect(() => { refreshPhotos(); }, [refreshPhotos]);

  const handleModerate = async (id: string, approved: boolean) => {
    try {
      await moderatePhoto(userId, id, approved);
      setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, approved } : p));
    } catch { /* no-op */ }
  };

  const approvedCount = photos.filter((p) => p.approved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-800">{t("📸 Ảnh Cưới", lang)}</h2>
          <p className="text-xs text-gray-400">{approvedCount} {t("ảnh", lang)} • {photos.length} tổng</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowModerate((v) => !v)}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {showModerate ? t("Ẩn ảnh", lang) : t("Duyệt ảnh", lang)}
          </button>
          <button
            type="button"
            onClick={refreshPhotos}
            className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            ↺
          </button>
        </div>
      </div>

      <PhotoUploadLink
        userId={userId}
        settings={settings}
        onUpdateSettings={(s) => store.setPhotoWallSettings(s)}
        lang={lang}
        uploadToken={uploadToken}
        onTokenCreated={setUploadToken}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading ? (
        <div className="text-center py-8 text-gray-400 text-sm">{t("Đang tải ảnh...", lang)}</div>
      ) : (
        <PhotoMasonryGrid
          photos={photos}
          showModerate={showModerate}
          onModerate={handleModerate}
        />
      )}
    </div>
  );
}

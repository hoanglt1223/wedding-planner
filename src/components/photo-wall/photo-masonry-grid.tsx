import { useState } from "react";
import type { PhotoMeta } from "@/lib/photo-api";
import { PhotoCard } from "./photo-card";

interface Props {
  photos: PhotoMeta[];
  showModerate?: boolean;
  onModerate?: (id: string, approved: boolean) => void;
}

export function PhotoMasonryGrid({ photos, showModerate, onModerate }: Props) {
  const [expanded, setExpanded] = useState<PhotoMeta | null>(null);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-2">📷</div>
        <p className="text-sm">Chưa có ảnh nào</p>
      </div>
    );
  }

  return (
    <>
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gridAutoRows: "10px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{ gridRowEnd: `span 20` }}
            className="overflow-hidden"
          >
            <PhotoCard
              photo={photo}
              showModerate={showModerate}
              onModerate={onModerate}
              onClick={setExpanded}
            />
          </div>
        ))}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpanded(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={expanded.blobUrl}
              alt={expanded.uploaderName ?? "Ảnh cưới"}
              className="w-full rounded-xl object-contain max-h-[80vh]"
            />
            {expanded.uploaderName && (
              <p className="text-center text-white text-sm mt-2">{expanded.uploaderName}</p>
            )}
            <button
              type="button"
              onClick={() => setExpanded(null)}
              className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

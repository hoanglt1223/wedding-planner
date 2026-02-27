import type { PhotoMeta } from "@/lib/photo-api";

interface Props {
  photo: PhotoMeta;
  showModerate?: boolean;
  onModerate?: (id: string, approved: boolean) => void;
  onClick?: (photo: PhotoMeta) => void;
}

export function PhotoCard({ photo, showModerate, onModerate, onClick }: Props) {
  const date = new Date(photo.createdAt).toLocaleDateString("vi-VN");

  return (
    <div
      className={`relative group overflow-hidden rounded-xl cursor-pointer ${!photo.approved ? "opacity-50" : ""}`}
      onClick={() => onClick?.(photo)}
    >
      <img
        src={photo.blobUrl}
        alt={photo.uploaderName ?? "Ảnh cưới"}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
          {photo.uploaderName && (
            <p className="text-xs font-semibold truncate">{photo.uploaderName}</p>
          )}
          <p className="text-[10px] opacity-75">{date}</p>
        </div>
        {showModerate && onModerate && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onModerate(photo.id, !photo.approved); }}
            className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-gray-800 hover:bg-white transition-colors font-medium"
          >
            {photo.approved ? "Ẩn" : "Hiện"}
          </button>
        )}
      </div>
      {!photo.approved && (
        <div className="absolute top-2 left-2 text-[10px] bg-gray-800/70 text-white px-2 py-0.5 rounded-full">
          Đã ẩn
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PhotoItem } from "@/types/wedding";

const TAGS = [
  "👗 Váy cưới",
  "🤵 Vest",
  "💐 Hoa",
  "🌸 Trang trí",
  "📸 Pre-wedding",
  "💍 Nhẫn",
  "🎂 Bánh",
  "📦 Khác",
];

interface PhotoBoardProps {
  photos: PhotoItem[];
  onAddPhoto: (photo: Omit<PhotoItem, "id">) => void;
  onRemovePhoto: (id: number) => void;
}

export function PhotoBoard({ photos, onAddPhoto, onRemovePhoto }: PhotoBoardProps) {
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState(TAGS[0]);
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAdd = () => {
    if (!url.trim()) return;
    onAddPhoto({ url: url.trim(), tag, note: note.trim() });
    setUrl("");
    setNote("");
  };

  const filtered = filter === "all" ? photos : photos.filter((p) => p.tag === filter);
  const allTags = ["all", ...TAGS];

  return (
    <div className="rounded-xl bg-white/5 p-4 shadow">
      <h2 className="mb-2 text-base font-bold">📸 Mood Board &amp; Ảnh Cưới</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Lưu ảnh yêu thích: váy, vest, hoa, trang trí... để so sánh và chọn lựa
      </p>

      {/* Add form */}
      <div className="space-y-1.5 rounded-lg bg-gray-50 p-3 mb-3">
        <Input
          className="h-8 text-sm"
          placeholder="Dán link ảnh (URL)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex gap-1">
          <select
            className="flex-1 h-8 text-sm border border-gray-300 rounded px-2"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Input
            className="flex-1 h-8 text-sm"
            placeholder="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button size="sm" className="h-8 px-3" onClick={handleAdd}>
            +
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      {photos.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2 py-0.5 rounded text-[0.7rem] font-medium transition-colors ${
                filter === t
                  ? "bg-red-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "all" ? "Tất cả" : t}
            </button>
          ))}
        </div>
      )}

      {/* Photo grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group relative rounded-lg overflow-hidden border border-gray-200 bg-white"
            >
              <img
                src={p.url}
                alt={p.note || p.tag}
                className="w-full h-32 object-cover"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%239ca3af' font-size='12'%3E%E2%9D%8C%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="p-1.5">
                <span className="text-[0.6rem] bg-gray-100 rounded px-1 py-0.5">{p.tag}</span>
                {p.note && (
                  <div className="text-[0.65rem] text-gray-500 mt-0.5 truncate">{p.note}</div>
                )}
              </div>
              <button
                onClick={() => onRemovePhoto(p.id)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-400 py-4">
          {photos.length === 0
            ? "Chưa có ảnh. Thêm ảnh bằng URL ở trên."
            : "Không có ảnh trong mục này."}
        </div>
      )}
    </div>
  );
}

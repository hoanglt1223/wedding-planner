import { useRef, useState } from "react";
import { put } from "@vercel/blob/client";
import { t } from "@/lib/i18n";
import { resizeImage, isImageTypeAllowed } from "@/lib/image-resize";
import { getUploadUrl, confirmUpload } from "@/lib/photo-api";

interface Props {
  token: string;
  lang: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

export function PhotoUploadForm({ token, lang, onSuccess, onError }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onError("");
    if (!isImageTypeAllowed(f)) {
      onError("Chỉ hỗ trợ ảnh JPEG, PNG, WebP.");
      return;
    }
    if (f.size > MAX_BYTES) {
      onError(`Ảnh phải nhỏ hơn ${MAX_MB}MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);
    try {
      const resized = await resizeImage(file);
      setProgress(25);

      const { clientToken, pathname } = await getUploadUrl(token, file.name);
      setProgress(35);

      const blob = await put(pathname, resized, {
        access: "public",
        token: clientToken,
        onUploadProgress: ({ percentage }) => {
          setProgress(35 + Math.round(percentage * 0.55));
        },
      });
      setProgress(92);

      await confirmUpload(token, blob.url, name);
      setProgress(100);
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="space-y-2">
            <div className="text-3xl">🖼️</div>
            <p className="text-sm text-gray-500">{t("Chọn ảnh", lang)}</p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP — tối đa {MAX_MB}MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileChange} />
      </div>

      <input
        type="text"
        placeholder={t("Tên của bạn", lang) + " (tuỳ chọn)"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />

      {uploading && (
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-gray-800 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      <button
        type="button"
        disabled={!file || uploading}
        onClick={handleUpload}
        className="w-full py-2.5 text-sm font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? t("Đang tải ảnh...", lang) : t("Tải ảnh lên", lang)}
      </button>
    </div>
  );
}

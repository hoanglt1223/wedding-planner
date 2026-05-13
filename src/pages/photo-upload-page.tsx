import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { t } from "@/lib/i18n";
import { PhotoUploadForm } from "@/components/photo-wall/photo-upload-form";

export default function PhotoUploadPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const lang = "vi";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Link không hợp lệ.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3 px-6">
          <div className="text-5xl">🎉</div>
          <h2 className="text-lg font-semibold text-gray-800">Tải ảnh thành công!</h2>
          <p className="text-sm text-gray-500">Cảm ơn bạn đã chia sẻ khoảnh khắc đẹp.</p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-2 px-4 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700"
          >
            {t("Tải ảnh lên", lang)} thêm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-10 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <div className="text-center space-y-1">
          <div className="text-3xl">📸</div>
          <h1 className="text-lg font-bold text-gray-800">{t("Tường ảnh cưới", lang)}</h1>
          <p className="text-xs text-gray-500">Chia sẻ ảnh kỷ niệm của bạn</p>
        </div>
        {error && (
          <div className="text-xs text-red-500 bg-red-50 rounded-lg p-3">{error}</div>
        )}
        <PhotoUploadForm
          token={token}
          lang={lang}
          onSuccess={() => setDone(true)}
          onError={setError}
        />
      </div>
    </div>
  );
}

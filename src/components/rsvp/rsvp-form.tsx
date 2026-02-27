import { useState } from "react";
import { t } from "@/lib/i18n";

interface RsvpFormProps {
  guestName: string;
  onSubmit: (data: { status: "accepted" | "declined"; plusOnes: number; dietary: string; message: string }) => Promise<void>;
  lang: string;
}

export function RsvpForm({ guestName, onSubmit, lang }: RsvpFormProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | null>(null);
  const [plusOnes, setPlusOnes] = useState(0);
  const [dietary, setDietary] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!status || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ status, plusOnes: status === "accepted" ? plusOnes : 0, dietary, message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-[#2c1810]">
        {t("Lời mời dành cho", lang)}
      </h2>
      <div className="text-base font-bold text-[#2c1810] bg-[#f5f0eb] rounded-lg px-3 py-2">
        {guestName}
      </div>

      {/* Attendance */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setStatus("accepted")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
            status === "accepted"
              ? "border-green-500 bg-green-50 text-green-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          ✓ {t("Tham dự", lang)}
        </button>
        <button
          type="button"
          onClick={() => setStatus("declined")}
          className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-colors ${
            status === "declined"
              ? "border-red-400 bg-red-50 text-red-600"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          ✗ {t("Từ chối", lang)}
        </button>
      </div>

      {/* Plus-ones (only when accepted) */}
      {status === "accepted" && (
        <div>
          <label className="block text-xs text-[#8a7060] mb-1">{t("Số khách đi cùng", lang)}</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPlusOnes(Math.max(0, plusOnes - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold"
              disabled={plusOnes === 0}
            >−</button>
            <span className="text-lg font-bold w-8 text-center">{plusOnes}</span>
            <button
              type="button"
              onClick={() => setPlusOnes(Math.min(20, plusOnes + 1))}
              className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold"
              disabled={plusOnes >= 20}
            >+</button>
          </div>
        </div>
      )}

      {/* Dietary (only when accepted) */}
      {status === "accepted" && (
        <div>
          <label className="block text-xs text-[#8a7060] mb-1">{t("Chế độ ăn đặc biệt", lang)}</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-2 text-sm resize-none"
            rows={2}
            maxLength={500}
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder={lang === "en" ? "Allergies, vegetarian, etc." : "Dị ứng, ăn chay, v.v."}
          />
        </div>
      )}

      {/* Message */}
      {status && (
        <div>
          <label className="block text-xs text-[#8a7060] mb-1">{t("Lời nhắn", lang)}</label>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-2 text-sm resize-none"
            rows={3}
            maxLength={500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={lang === "en" ? "Congratulations to the couple!" : "Lời chúc tới cô dâu chú rể!"}
          />
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!status || submitting}
        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50"
        style={{ backgroundColor: status === "accepted" ? "#15803d" : status === "declined" ? "#dc2626" : "#9ca3af" }}
      >
        {submitting ? t("Đang gửi...", lang) : t("Gửi RSVP", lang)}
      </button>
    </div>
  );
}

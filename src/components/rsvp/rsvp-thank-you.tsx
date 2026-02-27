import { t } from "@/lib/i18n";

interface RsvpThankYouProps {
  guestName: string;
  status: string;
  plusOnes: number;
  dietary: string | null;
  message: string | null;
  lang: string;
}

export function RsvpThankYou({ guestName, status, plusOnes, dietary, message, lang }: RsvpThankYouProps) {
  const isAccepted = status === "accepted";

  return (
    <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-6 text-center space-y-4">
      <div className="text-5xl">{isAccepted ? "🎉" : "💌"}</div>
      <h2 className="text-xl font-bold text-[#2c1810]">{t("Cảm ơn bạn!", lang)}</h2>
      <p className="text-sm text-[#8a7060]">{t("Chúng tôi đã nhận phản hồi của bạn", lang)}</p>

      <div className="text-left space-y-2 bg-[#f5f0eb] rounded-lg p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-[#8a7060]">{lang === "en" ? "Guest" : "Khách"}</span>
          <span className="font-medium">{guestName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#8a7060]">{lang === "en" ? "Status" : "Trạng thái"}</span>
          <span className={`font-medium ${isAccepted ? "text-green-600" : "text-red-500"}`}>
            {isAccepted ? t("Tham dự", lang) : t("Từ chối", lang)}
          </span>
        </div>
        {isAccepted && plusOnes > 0 && (
          <div className="flex justify-between">
            <span className="text-[#8a7060]">{t("Số khách đi cùng", lang)}</span>
            <span className="font-medium">+{plusOnes}</span>
          </div>
        )}
        {isAccepted && dietary && (
          <div className="flex justify-between">
            <span className="text-[#8a7060]">{t("Chế độ ăn đặc biệt", lang)}</span>
            <span className="font-medium">{dietary}</span>
          </div>
        )}
        {message && (
          <div className="pt-2 border-t border-[#e8ddd0]">
            <span className="text-[#8a7060] text-xs">{t("Lời nhắn", lang)}</span>
            <p className="text-sm mt-1 italic">"{message}"</p>
          </div>
        )}
      </div>

      <div className="pt-4">
        <a
          href="/"
          className="text-xs text-[#8a7060] hover:underline"
        >
          {lang === "en" ? "Create your own wedding plan" : "Tạo kế hoạch đám cưới của bạn"}
        </a>
      </div>
    </div>
  );
}

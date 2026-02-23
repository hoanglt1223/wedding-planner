import { useEffect, useState } from "react";
import { fetchSharedData, type SharedData } from "@/lib/share";
import { SharedProgress } from "@/components/shared/shared-progress";
import { getLocale } from "@/lib/format";
import { t } from "@/lib/i18n";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

interface Props {
  shareId: string;
  lang?: string;
}

export function SharedPreviewPage({ shareId, lang = "vi" }: Props) {
  const [data, setData] = useState<SharedData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "expired">("loading");

  useEffect(() => {
    fetchSharedData(shareId).then((d) => {
      if (d) { setData(d); setStatus("ok"); }
      else setStatus("expired");
    });
  }, [shareId]);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)` }}
      >
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💍</div>
          <p className="text-sm text-[#8a7060]">{t("Đang tải...", lang)}</p>
        </div>
      </div>
    );
  }

  if (status === "expired" || !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)` }}
      >
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">⏰</div>
          <h2 className="text-lg font-bold text-[#2c1810] mb-2">{t("Link Đã Hết Hạn", lang)}</h2>
          <p className="text-sm text-[#8a7060] mb-4">
            {lang === "en"
              ? "Share links are valid for 10 minutes. Please ask the sender to create a new link."
              : "Link chia sẻ chỉ có hiệu lực trong 10 phút. Hãy yêu cầu người gửi tạo link mới."}
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white rounded-full transition-colors"
            style={{ backgroundColor: BRAND.accent }}
          >
            {t("Tạo Kế Hoạch Của Bạn", lang)}
          </a>
        </div>
      </div>
    );
  }

  const locale = getLocale(lang);
  const weddingDate = data.info.date
    ? new Date(data.info.date + "T00:00:00").toLocaleDateString(locale, {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)` }}
    >
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-2">💒</div>
          <h1 className="text-xl font-bold text-[#2c1810]">
            {data.info.bride || (lang === "en" ? "Bride" : "Cô dâu")} & {data.info.groom || (lang === "en" ? "Groom" : "Chú rể")}
          </h1>
          {weddingDate && <p className="text-sm text-[#8a7060] mt-1">{weddingDate}</p>}
        </div>

        {/* Progress */}
        <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4">
          <SharedProgress data={data} />
        </div>

        {/* Guest count */}
        {data.guests.length > 0 && (
          <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 text-center">
            <p className="text-2xl font-bold" style={{ color: BRAND.accent }}>{data.guests.length}</p>
            <p className="text-xs text-[#8a7060]">{t("khách", lang)}</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white rounded-full transition-colors"
            style={{ backgroundColor: BRAND.accent }}
          >
            {t("💍 Tạo Kế Hoạch Đám Cưới", lang)}
          </a>
          <p className="text-xs text-[#8a7060] mt-2">
            {lang === "en" ? "100% Free · No sign-up needed" : "Miễn phí 100% · Không cần đăng ký"}
          </p>
        </div>
      </div>
    </div>
  );
}

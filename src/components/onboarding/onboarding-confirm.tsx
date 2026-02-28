import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/format";
import type { Region } from "@/types/wedding";

const REGION_LABELS: Record<Region, { vi: string; en: string }> = {
  north: { vi: "Miền Bắc", en: "Northern" },
  central: { vi: "Miền Trung", en: "Central" },
  south: { vi: "Miền Nam", en: "Southern" },
};

interface OnboardingConfirmProps {
  lang: string;
  bride: string;
  groom: string;
  date: string;
  region: Region;
  onComplete: () => void;
  onBack: () => void;
}

export function OnboardingConfirm(p: OnboardingConfirmProps) {
  const { lang } = p;
  const en = lang === "en";
  const regionLabel = REGION_LABELS[p.region]?.[en ? "en" : "vi"] ?? p.region;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--brand-border)] bg-white/80 p-5 text-center">
        <div className="text-3xl mb-2">💒</div>
        <p className="text-lg font-semibold text-[#2c1810] mb-1">
          {p.bride} & {p.groom}
        </p>
        {p.date && (
          <p className="text-sm text-[#8a7060]">
            {new Date(p.date + "T00:00:00").toLocaleDateString(getLocale(lang), {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <p className="text-xs text-[#8a7060] mt-1">{regionLabel}</p>
        <p className="text-xs text-[#8a7060] mt-3">
          {en ? "Ready to plan for the big day!" : "Sẵn sàng lên kế hoạch cho ngày trọng đại!"}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={p.onBack}
          className="h-11 px-5 text-sm font-medium text-[#5a3e2e] border border-[var(--brand-border)] rounded-full hover:bg-[var(--brand)]/10 transition-colors"
        >
          {t("← Quay Lại", lang)}
        </button>
        <button
          onClick={p.onComplete}
          className="flex-1 h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors animate-pulse"
        >
          {t("Bắt Đầu Lên Kế Hoạch! 🎉", lang)}
        </button>
      </div>
    </div>
  );
}

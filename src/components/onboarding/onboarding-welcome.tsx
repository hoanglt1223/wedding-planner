import { t } from "@/lib/i18n";

interface OnboardingWelcomeProps {
  lang: string;
  onSetLang: (lang: string) => void;
  onNext: () => void;
}

export function OnboardingWelcome({ lang, onSetLang, onNext }: OnboardingWelcomeProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="text-6xl mb-2">💍</div>
      <div>
        <h1 className="text-2xl font-bold text-[#2c1810]">
          {t("Kế Hoạch Đám Cưới", lang)}
        </h1>
        <p className="text-sm text-[#8a7060] mt-2">
          {lang === "en"
            ? "Plan your perfect Vietnamese wedding"
            : "Lên kế hoạch đám cưới hoàn hảo"}
        </p>
      </div>

      {/* Language selector */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onSetLang("vi")}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            lang === "vi"
              ? "bg-[var(--brand)] text-white border-[var(--brand)]"
              : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
          }`}
        >
          🇻🇳 Tiếng Việt
        </button>
        <button
          onClick={() => onSetLang("en")}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            lang === "en"
              ? "bg-[var(--brand)] text-white border-[var(--brand)]"
              : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
          }`}
        >
          🌍 English
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors"
      >
        {lang === "en" ? "Get Started →" : "Bắt Đầu →"}
      </button>
    </div>
  );
}

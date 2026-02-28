import { useState, useCallback } from "react";
import { OnboardingWelcome } from "./onboarding-welcome";
import { OnboardingNames } from "./onboarding-names";
import { OnboardingDateRegion } from "./onboarding-date-region";
import { OnboardingPreview } from "./onboarding-preview";
import { OnboardingConfirm } from "./onboarding-confirm";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import type { Region } from "@/types/wedding";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";
import { getWeddingSteps } from "@/data/resolve-data";
import { t } from "@/lib/i18n";

const BRAND = THEMES.find((th) => th.id === DEFAULT_THEME_ID) || THEMES[0];
const TOTAL_STEPS = 5;

const SAMPLE_DATA_VI = {
  bride: "Nguyễn Thị Thu Thảo", groom: "Nguyễn Thanh Hoàng",
  brideFamilyName: "Họ Nguyễn", groomFamilyName: "Họ Nhà Trai",
  date: "2026-03-14", engagementDate: "2026-09-15", betrothalDate: "2026-11-15",
};
const SAMPLE_DATA_EN = {
  bride: "Emily Nguyen", groom: "David Tran",
  brideFamilyName: "Nguyen Family", groomFamilyName: "Tran Family",
  date: "2026-03-14", engagementDate: "2026-09-15", betrothalDate: "2026-11-15",
};

interface Props {
  store: WeddingStore;
  track: (type: string, data?: unknown) => void;
}

const INPUT_CLS = "w-full h-10 px-3 text-sm border border-[var(--brand-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30";

export function OnboardingWizard({ store, track }: Props) {
  const lang = store.state.lang;
  const [step, setStep] = useState(0);
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [brideBirthDate, setBrideBirthDate] = useState("");
  const [groomBirthDate, setGroomBirthDate] = useState("");
  const [date, setDate] = useState("");
  const [engagementDate, setEngagementDate] = useState("");
  const [region, setRegion] = useState<Region>(store.state.region);
  const [partyTime, setPartyTime] = useState<"noon" | "afternoon">("noon");
  const [enabledSteps, setEnabledSteps] = useState<Record<string, boolean>>({});

  const handleToggleStep = useCallback((stepId: string) => {
    setEnabledSteps((prev) => {
      const allSteps = getWeddingSteps(lang);
      if (Object.keys(prev).length === 0) {
        const init: Record<string, boolean> = {};
        for (const s of allSteps) init[s.id] = true;
        init[stepId] = false;
        return init;
      }
      return { ...prev, [stepId]: prev[stepId] === false ? true : false };
    });
  }, [lang]);

  const goStep = (s: number) => {
    track(`onboarding_step_${s}`, { from: step });
    setStep(s);
  };

  const handleComplete = () => {
    store.updateInfo("bride", bride.trim());
    store.updateInfo("groom", groom.trim());
    if (brideBirthDate) store.updateInfo("brideBirthDate", brideBirthDate);
    if (groomBirthDate) store.updateInfo("groomBirthDate", groomBirthDate);
    if (date) store.updateInfo("date", date);
    if (engagementDate) store.updateInfo("engagementDate", engagementDate);
    store.setRegion(region);
    store.setPartyTime(partyTime);
    store.setEnabledSteps(enabledSteps);
    track("onboarding_complete", { hasDate: !!date, region, partyTime, lang });
    store.completeOnboarding();
  };

  const handleSkip = () => {
    const sample = lang === "en" ? SAMPLE_DATA_EN : SAMPLE_DATA_VI;
    for (const [k, v] of Object.entries(sample)) store.updateInfo(k, v);
    track("onboarding_skipped", { lang });
    store.completeOnboarding();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)`,
        "--brand": BRAND.accent, "--brand-dark": BRAND.primaryDark, "--brand-border": BRAND.themeBorder,
      } as React.CSSProperties}
    >
      <div className="w-full max-w-md">
        {/* Step dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${
              i === step ? "w-8 bg-[var(--brand)]" : i < step ? "w-8 bg-[var(--brand)]/40" : "w-4 bg-gray-200"
            }`} />
          ))}
        </div>

        {step === 0 && <OnboardingWelcome lang={lang} onSetLang={store.setLang} onNext={() => goStep(1)} />}
        {step === 1 && <OnboardingNames lang={lang} bride={bride} groom={groom}
          brideBirthDate={brideBirthDate} groomBirthDate={groomBirthDate} inputCls={INPUT_CLS}
          onBride={setBride} onGroom={setGroom}
          onBrideBirthDate={setBrideBirthDate} onGroomBirthDate={setGroomBirthDate}
          onNext={() => goStep(2)} onBack={() => goStep(0)} />}
        {step === 2 && <OnboardingDateRegion lang={lang} date={date} engagementDate={engagementDate}
          region={region} partyTime={partyTime} inputCls={INPUT_CLS}
          onDate={setDate} onEngagementDate={setEngagementDate}
          onRegion={setRegion} onPartyTime={setPartyTime}
          onNext={() => goStep(3)} onBack={() => goStep(1)} />}
        {step === 3 && (
          <div className="space-y-4">
            <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-[var(--brand-border)] bg-white/80 p-3">
              <OnboardingPreview lang={lang} enabledSteps={enabledSteps} onToggleStep={handleToggleStep} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => goStep(2)}
                className="h-11 px-5 text-sm font-medium text-[#5a3e2e] border border-[var(--brand-border)] rounded-full hover:bg-[var(--brand)]/10 transition-colors">
                {t("← Quay Lại", lang)}
              </button>
              <button onClick={() => goStep(4)}
                className="flex-1 h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors">
                {t("Tiếp Tục →", lang)}
              </button>
            </div>
          </div>
        )}
        {step === 4 && <OnboardingConfirm lang={lang} bride={bride} groom={groom}
          date={date} region={region} onComplete={handleComplete} onBack={() => goStep(3)} />}

        <button onClick={handleSkip} className="w-full mt-4 text-xs text-[#8a7060] hover:text-[#5a3e2e] transition-colors">
          {t("Xem thử với dữ liệu mẫu →", lang)}
        </button>
      </div>
    </div>
  );
}

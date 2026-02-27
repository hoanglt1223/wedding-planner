import { useState, useCallback } from "react";
import { OnboardingPreview } from "./onboarding-preview";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import type { Region } from "@/types/wedding";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";
import { getWeddingSteps } from "@/data/resolve-data";
import { getLocale } from "@/lib/format";
import { t } from "@/lib/i18n";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

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

const BUDGET_PRESETS = [
  { label: "50M", value: 50_000_000 },
  { label: "100M", value: 100_000_000 },
  { label: "200M", value: 200_000_000 },
  { label: "500M", value: 500_000_000 },
];

const REGIONS: { id: Region; vi: string; en: string }[] = [
  { id: "north", vi: "Miền Bắc", en: "Northern" },
  { id: "central", vi: "Miền Trung", en: "Central" },
  { id: "south", vi: "Miền Nam", en: "Southern" },
];

interface Props {
  store: WeddingStore;
  track: (type: string, data?: unknown) => void;
}

export function OnboardingWizard({ store, track }: Props) {
  const lang = store.state.lang;
  const [step, setStep] = useState(0);
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");
  const [engagementDate, setEngagementDate] = useState("");
  const [budget, setBudget] = useState(200_000_000);
  const [region, setRegion] = useState<Region>(store.state.region);
  const [partyTime, setPartyTime] = useState<"noon" | "afternoon">("noon");
  const [enabledSteps, setEnabledSteps] = useState<Record<string, boolean>>({});

  const canContinue = !!(bride.trim() && groom.trim());

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

  const handleComplete = () => {
    store.updateInfo("bride", bride.trim());
    store.updateInfo("groom", groom.trim());
    if (date) store.updateInfo("date", date);
    if (engagementDate) store.updateInfo("engagementDate", engagementDate);
    store.setBudget(budget);
    store.setRegion(region);
    store.setPartyTime(partyTime);
    store.setEnabledSteps(enabledSteps);
    track("onboarding_info", {
      hasDate: !!date, hasEngagementDate: !!engagementDate,
      budget, region, partyTime, lang,
      enabledStepCount: Object.values(enabledSteps).filter(Boolean).length,
    });
    store.completeOnboarding();
  };

  const handleSkip = () => {
    const sample = lang === "en" ? SAMPLE_DATA_EN : SAMPLE_DATA_VI;
    for (const [k, v] of Object.entries(sample)) store.updateInfo(k, v);
    track("onboarding_skipped", { lang });
    store.completeOnboarding();
  };

  const handleStep0Continue = () => {
    track("onboarding_step_info", {
      brideName: bride.trim(), groomName: groom.trim(),
      weddingDate: date || null, engagementDate: engagementDate || null,
      budget, region, partyTime,
    });
    setStep(1);
  };

  const fmtBudget = (v: number) =>
    v >= 1_000_000_000
      ? `${(v / 1_000_000_000).toFixed(v % 1_000_000_000 === 0 ? 0 : 1)}${lang === "en" ? "B" : " tỷ"}`
      : `${(v / 1_000_000).toFixed(0)}${lang === "en" ? "M" : " triệu"}`;

  const inputCls = "w-full h-10 px-3 text-sm border border-[var(--brand-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)`,
        "--brand": BRAND.accent, "--brand-dark": BRAND.primaryDark, "--brand-border": BRAND.themeBorder,
      } as React.CSSProperties}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💍</div>
          <h1 className="text-2xl font-bold text-[#2c1810]">{t("Kế Hoạch Đám Cưới", lang)}</h1>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((s) => (
            <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? "w-8 bg-[var(--brand)]" : s < step ? "w-8 bg-[var(--brand)]/40" : "w-4 bg-gray-200"}`} />
          ))}
        </div>

        {step === 0 && <Step0
          lang={lang} bride={bride} groom={groom} date={date} engagementDate={engagementDate}
          budget={budget} region={region} partyTime={partyTime} canContinue={canContinue}
          inputCls={inputCls} fmtBudget={fmtBudget}
          onBride={setBride} onGroom={setGroom} onDate={setDate} onEngagementDate={setEngagementDate}
          onBudget={setBudget} onRegion={setRegion} onPartyTime={setPartyTime}
          onContinue={handleStep0Continue}
        />}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-[#5a3e2e] text-center">
              {lang === "en" ? "Traditional Vietnamese wedding process" : "Quy trình cưới truyền thống Việt Nam"}
            </p>
            <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-[var(--brand-border)] bg-white/80 p-3">
              <OnboardingPreview lang={lang} enabledSteps={enabledSteps} onToggleStep={handleToggleStep} />
            </div>
            <button onClick={() => { track("onboarding_step_ceremonies", { enabledSteps }); setStep(2); }}
              className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors">
              {t("Tiếp Tục →", lang)}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--brand-border)] bg-white/80 p-5 text-center">
              <div className="text-3xl mb-2">💒</div>
              <p className="text-lg font-semibold text-[#2c1810] mb-1">{bride} & {groom}</p>
              {date && <p className="text-sm text-[#8a7060]">{new Date(date + "T00:00:00").toLocaleDateString(getLocale(lang), { day: "numeric", month: "long", year: "numeric" })}</p>}
              <p className="text-xs text-[#8a7060] mt-1">
                {REGIONS.find((r) => r.id === region)?.[lang === "en" ? "en" : "vi"]} · {fmtBudget(budget)} VNĐ
              </p>
              <p className="text-xs text-[#8a7060] mt-3">
                {lang === "en" ? "Ready to plan for the big day!" : "Sẵn sàng lên kế hoạch cho ngày trọng đại!"}
              </p>
            </div>
            <button onClick={handleComplete}
              className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors animate-pulse">
              {t("Bắt Đầu Lên Kế Hoạch! 🎉", lang)}
            </button>
          </div>
        )}

        <button onClick={handleSkip} className="w-full mt-4 text-xs text-[#8a7060] hover:text-[#5a3e2e] transition-colors">
          {t("Xem thử với dữ liệu mẫu →", lang)}
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 0 sub-component (keeps main component small) ---------- */

interface Step0Props {
  lang: string; bride: string; groom: string; date: string; engagementDate: string;
  budget: number; region: Region; partyTime: "noon" | "afternoon"; canContinue: boolean;
  inputCls: string; fmtBudget: (v: number) => string;
  onBride: (v: string) => void; onGroom: (v: string) => void;
  onDate: (v: string) => void; onEngagementDate: (v: string) => void;
  onBudget: (v: number) => void; onRegion: (v: Region) => void;
  onPartyTime: (v: "noon" | "afternoon") => void; onContinue: () => void;
}

function Step0(p: Step0Props) {
  const { lang, inputCls } = p;
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#5a3e2e] text-center">
        {lang === "en" ? "Enter basic info to get started" : "Nhập thông tin cơ bản để bắt đầu"}
      </p>

      {/* Names */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">{t("Tên cô dâu", lang)}</label>
          <input type="text" value={p.bride} onChange={(e) => p.onBride(e.target.value)}
            placeholder={lang === "en" ? "Emily..." : "Nguyễn Thị..."} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">{t("Tên chú rể", lang)}</label>
          <input type="text" value={p.groom} onChange={(e) => p.onGroom(e.target.value)}
            placeholder={lang === "en" ? "David..." : "Trần Văn..."} className={inputCls} />
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {lang === "en" ? "Wedding date" : "Ngày cưới"} <span className="text-[#8a7060] font-normal">({lang === "en" ? "opt." : "tùy chọn"})</span>
          </label>
          <input type="date" value={p.date} onChange={(e) => p.onDate(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {lang === "en" ? "Party date" : "Ngày tiệc"} <span className="text-[#8a7060] font-normal">({lang === "en" ? "opt." : "tùy chọn"})</span>
          </label>
          <input type="date" value={p.engagementDate} onChange={(e) => p.onEngagementDate(e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Region + Party time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {lang === "en" ? "Region" : "Miền"}
          </label>
          <div className="flex gap-1">
            {REGIONS.map((r) => (
              <button key={r.id} type="button" onClick={() => p.onRegion(r.id)}
                className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-colors ${
                  p.region === r.id
                    ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                    : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
                }`}>
                {lang === "en" ? r.en.charAt(0) : r.vi.slice(5)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {lang === "en" ? "Party time" : "Giờ tiệc"}
          </label>
          <div className="flex gap-1">
            {(["noon", "afternoon"] as const).map((pt) => (
              <button key={pt} type="button" onClick={() => p.onPartyTime(pt)}
                className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-colors ${
                  p.partyTime === pt
                    ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                    : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
                }`}>
                {pt === "noon" ? (lang === "en" ? "Noon" : "Trưa") : (lang === "en" ? "Evening" : "Chiều")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
          {lang === "en" ? "Estimated budget" : "Ngân sách dự kiến"}
        </label>
        <div className="flex gap-2 mb-2">
          {BUDGET_PRESETS.map((bp) => (
            <button key={bp.value} type="button" onClick={() => p.onBudget(bp.value)}
              className={`flex-1 h-9 text-xs font-medium rounded-lg border transition-colors ${
                p.budget === bp.value
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
              }`}>
              {bp.label}
            </button>
          ))}
        </div>
        <input type="range" min={10_000_000} max={2_000_000_000} step={10_000_000}
          value={p.budget} onChange={(e) => p.onBudget(Number(e.target.value))}
          className="w-full accent-[var(--brand)]" />
        <p className="text-center text-sm font-semibold text-[#2c1810] mt-1">{p.fmtBudget(p.budget)} VNĐ</p>
      </div>

      <button onClick={p.onContinue} disabled={!p.canContinue}
        className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        {t("Tiếp Tục →", lang)}
      </button>
    </div>
  );
}

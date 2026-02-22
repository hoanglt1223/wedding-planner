import { useState } from "react";
import { OnboardingPreview } from "./onboarding-preview";
import type { WeddingStore } from "@/hooks/use-wedding-store";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

const SAMPLE_DATA = {
  bride: "Nguyễn Thị A",
  groom: "Trần Văn B",
  brideFamilyName: "Họ Nguyễn",
  groomFamilyName: "Họ Trần",
  date: "2026-12-20",
  engagementDate: "2026-10-15",
  betrothalDate: "2026-11-15",
};

interface Props {
  store: WeddingStore;
}

export function OnboardingWizard({ store }: Props) {
  const [step, setStep] = useState(0);
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [date, setDate] = useState("");

  const canContinue = bride.trim() && groom.trim();

  const handleComplete = () => {
    store.updateInfo("bride", bride.trim());
    store.updateInfo("groom", groom.trim());
    if (date) store.updateInfo("date", date);
    store.completeOnboarding();
  };

  const handleSkip = () => {
    for (const [k, v] of Object.entries(SAMPLE_DATA)) {
      store.updateInfo(k, v);
    }
    store.completeOnboarding();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(to bottom, ${BRAND.primaryLight}, white, #fffbeb)`,
        "--brand": BRAND.accent,
        "--brand-dark": BRAND.primaryDark,
        "--brand-border": BRAND.themeBorder,
      } as React.CSSProperties}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💍</div>
          <h1 className="text-2xl font-bold text-[#2c1810]">
            Kế Hoạch Đám Cưới
          </h1>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? "w-8 bg-[var(--brand)]" : s < step ? "w-8 bg-[var(--brand)]/40" : "w-4 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-[#5a3e2e] text-center">
              Nhập thông tin cơ bản để bắt đầu
            </p>
            <div>
              <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
                Tên cô dâu
              </label>
              <input
                type="text"
                value={bride}
                onChange={(e) => setBride(e.target.value)}
                placeholder="Nguyễn Thị..."
                className="w-full h-10 px-3 text-sm border border-[var(--brand-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
                Tên chú rể
              </label>
              <input
                type="text"
                value={groom}
                onChange={(e) => setGroom(e.target.value)}
                placeholder="Trần Văn..."
                className="w-full h-10 px-3 text-sm border border-[var(--brand-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
                Ngày cưới (tùy chọn)
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-10 px-3 text-sm border border-[var(--brand-border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30"
              />
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!canContinue}
              className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Tiếp Tục →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-[#5a3e2e] text-center">
              Quy trình cưới truyền thống Việt Nam
            </p>
            <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-[var(--brand-border)] bg-white/80 p-3">
              <OnboardingPreview />
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors"
            >
              Tiếp Tục →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--brand-border)] bg-white/80 p-5 text-center">
              <div className="text-3xl mb-2">💒</div>
              <p className="text-lg font-semibold text-[#2c1810] mb-1">
                {bride} & {groom}
              </p>
              {date && (
                <p className="text-sm text-[#8a7060]">
                  {new Date(date + "T00:00:00").toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <p className="text-xs text-[#8a7060] mt-3">
                Sẵn sàng lên kế hoạch cho ngày trọng đại!
              </p>
            </div>
            <button
              onClick={handleComplete}
              className="w-full h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors animate-pulse"
            >
              Bắt Đầu Lên Kế Hoạch! 🎉
            </button>
          </div>
        )}

        <button
          onClick={handleSkip}
          className="w-full mt-4 text-xs text-[#8a7060] hover:text-[#5a3e2e] transition-colors"
        >
          Xem thử với dữ liệu mẫu →
        </button>
      </div>
    </div>
  );
}

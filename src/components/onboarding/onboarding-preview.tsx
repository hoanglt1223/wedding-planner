import { getWeddingSteps } from "@/data/resolve-data";
import { t } from "@/lib/i18n";

interface OnboardingPreviewProps {
  lang?: string;
  enabledSteps: Record<string, boolean>;
  onToggleStep: (stepId: string) => void;
}

export function OnboardingPreview({ lang = "vi", enabledSteps, onToggleStep }: OnboardingPreviewProps) {
  const steps = getWeddingSteps(lang);
  const hasSelection = Object.keys(enabledSteps).length > 0;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[#2c1810] mb-1">
        {t("Nghi Lễ Cưới 8 Bước", lang)}
      </h3>
      <p className="text-2xs text-[#8a7060] mb-2">
        {lang === "en"
          ? "Uncheck ceremonies you don't need"
          : "Bỏ chọn các nghi lễ không cần thiết"}
      </p>
      <div className="space-y-1.5">
        {steps.map((step, i) => {
          const checked = !hasSelection || enabledSteps[step.id] !== false;
          return (
            <label
              key={step.id}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 transition-all ${
                checked
                  ? "border-[#e8ddd0] bg-white/60"
                  : "border-gray-200 bg-gray-50/60 opacity-50"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggleStep(step.id)}
                className="size-4 rounded border-[#d4b896] text-[var(--brand)] accent-[var(--brand)] shrink-0"
              />
              <span className="text-lg">{step.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${checked ? "text-[#2c1810]" : "text-gray-400 line-through"}`}>
                  {i + 1}. {step.title}
                </p>
                <p className="text-2xs text-[#8a7060]">{step.timeline}</p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

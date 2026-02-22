import { WEDDING_STEPS } from "@/data/wedding-steps";

export function OnboardingPreview() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[#2c1810] mb-3">
        Nghi Lễ Cưới 8 Bước
      </h3>
      <div className="space-y-1.5">
        {WEDDING_STEPS.map((step, i) => (
          <div
            key={step.id}
            className="flex items-center gap-3 rounded-lg border border-[#e8ddd0] bg-white/60 px-3 py-2"
          >
            <span className="text-lg">{step.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2c1810] truncate">
                {i + 1}. {step.title}
              </p>
              <p className="text-2xs text-[#8a7060]">{step.timeline}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

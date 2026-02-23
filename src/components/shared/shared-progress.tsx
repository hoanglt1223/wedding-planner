import { getWeddingSteps } from "@/data/resolve-data";
import type { SharedData } from "@/lib/share";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

const BRAND = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];

interface Props {
  data: SharedData;
  lang?: string;
}

export function SharedProgress({ data, lang = "vi" }: Props) {
  const weddingSteps = getWeddingSteps(lang);
  let total = 0, done = 0;
  const steps = weddingSteps.map((step) => {
    let stepTotal = 0, stepDone = 0;
    step.ceremonies.forEach((c, ci) => {
      let idx = 0;
      c.steps.forEach((s) => {
        if (s.checkable) {
          stepTotal++;
          total++;
          if (data.checkedItems[`${step.id}_${ci}_${idx}`]) { stepDone++; done++; }
          idx++;
        }
      });
    });
    return { id: step.id, icon: step.icon, title: step.title, stepTotal, stepDone };
  });

  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#8a7060]">{lang === "en" ? "Preparation progress" : "Tiến độ chuẩn bị"}</span>
          <span className="font-bold" style={{ color: BRAND.accent }}>{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: BRAND.accent }} />
        </div>
      </div>
      <div className="space-y-1.5">
        {steps.map((s) => (
          <div key={s.id} className="flex items-center gap-2 text-sm">
            <span>{s.icon}</span>
            <span className="flex-1 truncate text-[#2c1810]">{s.title}</span>
            <span className="text-xs text-[#8a7060]">
              {s.stepDone}/{s.stepTotal}
            </span>
            {s.stepTotal > 0 && s.stepDone === s.stepTotal && <span className="text-green-600">✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

import type { WeddingStep } from "@/types/wedding";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollableTabBar } from "@/components/layout/scrollable-tab-bar";
import { CeremonySection } from "./ceremony-section";

interface StepPanelProps {
  step: WeddingStep;
  activeSubTab: number;
  checkedKeys: Record<string, boolean>;
  onSubTabChange: (stepId: string, index: number) => void;
  onToggleCheck: (key: string) => void;
  onGoAI: (hint: string) => void;
}

function getStepProgress(
  step: WeddingStep,
  checkedKeys: Record<string, boolean>,
): { done: number; total: number; pct: number } {
  let total = 0;
  let done = 0;
  step.cers.forEach((c, ci) =>
    c.cl.forEach((_item, i) => {
      total++;
      if (checkedKeys[`${step.id}_${ci}_${i}`]) done++;
    }),
  );
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function StepPanel({
  step,
  activeSubTab,
  checkedKeys,
  onSubTabChange,
  onToggleCheck,
  onGoAI,
}: StepPanelProps) {
  const { done, total, pct } = getStepProgress(step, checkedKeys);

  const ceremonyTabs = step.cers.map((cer) => ({
    label: cer.nm,
    suffix: !cer.req ? "(tùy chọn)" : undefined,
  }));

  return (
    <div className="space-y-2">
      {/* Overview card */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1">
          {step.icon} {step.title}
        </h2>
        <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[0.68rem] font-semibold bg-amber-100 text-amber-800 rounded px-2 py-0.5">
            ⏰ {step.tm}
          </span>
          {step.aiHint && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[0.68rem] px-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => onGoAI(step.aiHint)}
            >
              🤖 Hỏi AI
            </Button>
          )}
        </div>
        <Progress value={pct} className="h-2 mb-1" />
        <div className="text-[0.68rem] text-gray-400 text-right">
          {done}/{total} ({pct}%)
        </div>
      </div>

      {/* Sub-ceremony tab bar with scroll arrows */}
      <ScrollableTabBar
        tabs={ceremonyTabs}
        activeIndex={activeSubTab}
        onTabChange={(i) => onSubTabChange(step.id, i)}
        variant="pill"
      />

      {/* Active ceremony section */}
      {step.cers[activeSubTab] && (
        <CeremonySection
          ceremony={step.cers[activeSubTab]}
          stepId={step.id}
          ceremonyIndex={activeSubTab}
          checkedKeys={checkedKeys}
          onToggleCheck={onToggleCheck}
        />
      )}
    </div>
  );
}

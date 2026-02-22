import { useMemo } from "react";
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
  stepStartTime?: string;
  onSetStepStartTime: (stepId: string, time: string) => void;
}

function getStepProgress(
  step: WeddingStep,
  checkedKeys: Record<string, boolean>,
): { done: number; total: number; pct: number } {
  let total = 0;
  let done = 0;
  step.ceremonies.forEach((c, ci) => {
    let checkIdx = 0;
    c.steps.forEach((s) => {
      if (s.checkable) {
        total++;
        if (checkedKeys[`${step.id}_${ci}_${checkIdx}`]) done++;
        checkIdx++;
      }
    });
  });
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** Find the earliest time across all ceremonies in a step */
function getBaseTime(step: WeddingStep): string | null {
  let earliest: string | null = null;
  for (const cer of step.ceremonies) {
    for (const s of cer.steps) {
      if (s.time && (!earliest || s.time < earliest)) {
        earliest = s.time;
      }
    }
  }
  return earliest;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function StepPanel({
  step,
  activeSubTab,
  checkedKeys,
  onSubTabChange,
  onToggleCheck,
  onGoAI,
  stepStartTime,
  onSetStepStartTime,
}: StepPanelProps) {
  const { done, total, pct } = getStepProgress(step, checkedKeys);

  const baseTime = useMemo(() => getBaseTime(step), [step]);
  const hasTimes = baseTime !== null;
  const currentStart = stepStartTime || baseTime || "08:00";
  const timeOffset = hasTimes ? timeToMinutes(currentStart) - timeToMinutes(baseTime!) : 0;

  const ceremonyTabs = step.ceremonies.map((cer) => ({
    label: cer.name,
    suffix: !cer.required ? "(tùy chọn)" : undefined,
  }));

  return (
    <div className="space-y-2">
      {/* Overview card */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-0.5">
          {step.icon} {step.title}
        </h2>
        {step.formalName && (
          <div className="text-xs text-gray-400 italic mb-1.5">
            Tên chính thức: {step.formalName}
          </div>
        )}
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{step.description}</p>

        {/* Meaning section */}
        {step.meaning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-2">
            <div className="text-xs font-semibold text-amber-800 mb-1">📖 Ý nghĩa</div>
            <p className="text-xs text-amber-700 leading-relaxed">{step.meaning}</p>
          </div>
        )}

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[0.68rem] font-semibold bg-amber-100 text-amber-800 rounded px-2 py-0.5">
            ⏰ {step.timeline}
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
          {hasTimes && (
            <label className="inline-flex items-center gap-1 text-[0.68rem] font-medium text-gray-600">
              🕐 Giờ bắt đầu
              <input
                type="time"
                value={currentStart}
                onChange={(e) => onSetStepStartTime(step.id, e.target.value)}
                className="border border-gray-300 rounded px-1.5 py-0.5 text-[0.68rem] font-mono w-[5.5rem]"
              />
            </label>
          )}
        </div>
        {pct > 0 && (
          <>
            <Progress value={pct} className="h-2 mb-1" />
            <div className="text-[0.68rem] text-gray-400 text-right">
              {done}/{total} ({pct}%)
            </div>
          </>
        )}
      </div>

      {/* Sub-ceremony tab bar with scroll arrows */}
      <ScrollableTabBar
        tabs={ceremonyTabs}
        activeIndex={activeSubTab}
        onTabChange={(i) => onSubTabChange(step.id, i)}
        variant="pill"
      />

      {/* Active ceremony section */}
      {step.ceremonies[activeSubTab] && (
        <CeremonySection
          ceremony={step.ceremonies[activeSubTab]}
          stepId={step.id}
          ceremonyIndex={activeSubTab}
          checkedKeys={checkedKeys}
          onToggleCheck={onToggleCheck}
          timeOffset={timeOffset}
        />
      )}

      {/* Step-level notes */}
      {step.notes && step.notes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm">
          <div className="text-xs font-semibold text-blue-800 mb-1">📝 Lưu ý quan trọng</div>
          <div className="space-y-0.5">
            {step.notes.map((note, i) => (
              <div key={i} className="text-xs text-blue-700 leading-relaxed">• {note}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

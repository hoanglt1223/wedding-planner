import type { WeddingStep } from "@/types/wedding";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollableTabBar } from "@/components/layout/scrollable-tab-bar";
import { CeremonySection } from "./ceremony-section";
import { PartyTimeToggle } from "./party-time-toggle";

interface StepPanelProps {
  step: WeddingStep;
  activeSubTab: number;
  checkedKeys: Record<string, boolean>;
  onSubTabChange: (stepId: string, index: number) => void;
  onToggleCheck: (key: string) => void;
  onGoAI: (hint: string) => void;
  partyTime: "noon" | "afternoon";
  onSetPartyTime: (v: "noon" | "afternoon") => void;
}

function getStepProgress(
  step: WeddingStep,
  checkedKeys: Record<string, boolean>,
): { done: number; total: number; pct: number } {
  let total = 0;
  let done = 0;
  step.ceremonies.forEach((c, ci) =>
    c.checklist.forEach((_item, i) => {
      total++;
      if (checkedKeys[`${step.id}_${ci}_${i}`]) done++;
    }),
  );
  return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
}

// Steps that have time-critical schedules (betrothal, bride-ceremony, procession, groom-ceremony)
const TIMELINE_STEP_IDS = new Set(["betrothal", "bride-ceremony", "procession", "groom-ceremony"]);

export function StepPanel({
  step,
  activeSubTab,
  checkedKeys,
  onSubTabChange,
  onToggleCheck,
  onGoAI,
  partyTime,
  onSetPartyTime,
}: StepPanelProps) {
  const { done, total, pct } = getStepProgress(step, checkedKeys);
  const showPartyTimeToggle = TIMELINE_STEP_IDS.has(step.id);

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

        {/* Step-level notes */}
        {step.notes && step.notes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 mb-2">
            <div className="text-xs font-semibold text-blue-800 mb-1">📝 Lưu ý quan trọng</div>
            <div className="space-y-0.5">
              {step.notes.map((note, i) => (
                <div key={i} className="text-xs text-blue-700 leading-relaxed">• {note}</div>
              ))}
            </div>
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
          {showPartyTimeToggle && (
            <PartyTimeToggle value={partyTime} onChange={onSetPartyTime} />
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
      {step.ceremonies[activeSubTab] && (
        <CeremonySection
          ceremony={step.ceremonies[activeSubTab]}
          stepId={step.id}
          ceremonyIndex={activeSubTab}
          checkedKeys={checkedKeys}
          onToggleCheck={onToggleCheck}
          partyTime={partyTime}
        />
      )}
    </div>
  );
}

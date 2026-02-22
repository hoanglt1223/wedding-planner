import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { CeremonyStep } from "@/types/wedding";
import { formatShort } from "@/lib/format";

interface CeremonyStepsProps {
  steps: CeremonyStep[];
  stepId: string;
  ceremonyIndex: number;
  checkedKeys: Record<string, boolean>;
  onToggle: (key: string) => void;
  timeOffset: number;
}

function offsetTime(time: string, offsetMin: number): string {
  if (offsetMin === 0) return time;
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + offsetMin;
  const newH = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const newM = ((total % 60) + 60) % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

function CheckableRow({
  step,
  checkKey,
  checked,
  onToggle,
}: {
  step: CeremonyStep;
  checkKey: string;
  checked: boolean;
  onToggle: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasDetail = !!step.detail;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <li className={`rounded-lg px-2 py-1.5 text-sm transition-colors ${
        checked ? "bg-[var(--theme-surface-muted)] text-primary line-through opacity-70" : "hover:bg-[var(--theme-surface-muted)] text-gray-700"
      }`}>
        <div className="flex items-center gap-2">
          <span
            onClick={(e) => { e.stopPropagation(); onToggle(checkKey); }}
            className={`inline-flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 cursor-pointer transition-colors ${
              checked ? "bg-primary border-primary text-primary-foreground" : "border-[var(--theme-border)]"
            }`}
          >
            {checked && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span
            className="flex-1 cursor-pointer"
            onClick={() => hasDetail ? setOpen(!open) : onToggle(checkKey)}
          >
            {step.text}
          </span>
          {step.cost != null && step.cost > 0 && (
            <span className="text-2xs font-semibold bg-amber-100 text-amber-700 rounded px-1.5 py-0.5 ml-1">
              {formatShort(step.cost)}
            </span>
          )}
          {hasDetail && (
            <CollapsibleTrigger asChild>
              <button className="p-0.5 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
          )}
        </div>
        {hasDetail && (
          <CollapsibleContent>
            <div className="mt-1.5 ml-6 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-2 border border-gray-100">
              {step.detail}
            </div>
          </CollapsibleContent>
        )}
      </li>
    </Collapsible>
  );
}

export function CeremonySteps({
  steps,
  stepId,
  ceremonyIndex,
  checkedKeys,
  onToggle,
  timeOffset,
}: CeremonyStepsProps) {
  const checkable = steps.filter((s) => s.checkable);
  const sequence = steps.filter((s) => !s.checkable);
  const hasTimed = sequence.some((s) => s.time);
  const hasBoth = checkable.length > 0 && sequence.length > 0;

  if (steps.length === 0) return null;

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">
      {/* Section 1: Checkable items */}
      {checkable.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-primary mb-2">Checklist</h2>
          <ul className="space-y-1">
            {checkable.map((s, i) => {
              const key = `${stepId}_${ceremonyIndex}_${i}`;
              return (
                <CheckableRow
                  key={key}
                  step={s}
                  checkKey={key}
                  checked={!!checkedKeys[key]}
                  onToggle={onToggle}
                />
              );
            })}
          </ul>
        </>
      )}

      {/* Divider */}
      {hasBoth && <div className="border-t border-dashed border-gray-200 my-3" />}

      {/* Section 2: Ceremony sequence */}
      {sequence.length > 0 && (
        hasTimed ? (
          /* Timed table */
          <>
            <h2 className="text-sm font-bold text-primary mb-2">
              Lịch Trình Chi Tiết
              {timeOffset !== 0 && (
                <span className="ml-1.5 text-2xs font-normal text-gray-400">
                  ({timeOffset > 0 ? "+" : ""}{timeOffset} phút)
                </span>
              )}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-14">Giờ</th>
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold">Hoạt động</th>
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-20">Phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {sequence.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 pr-2 font-mono font-semibold text-primary align-top whitespace-nowrap">
                        {s.time ? offsetTime(s.time, timeOffset) : ""}
                      </td>
                      <td className="py-1.5 pr-2 text-gray-700 align-top">
                        {s.text}
                        {s.note && (
                          <span className="block text-2xs text-gray-400 mt-0.5">{s.note}</span>
                        )}
                      </td>
                      <td className="py-1.5 text-gray-500 align-top whitespace-nowrap">
                        {s.responsible || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Numbered table */
          <>
            <h2 className="text-sm font-bold text-primary mb-2">Lịch Trình Chi Tiết</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-14">Bước</th>
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold">Hoạt động</th>
                    <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-20">Phụ trách</th>
                  </tr>
                </thead>
                <tbody>
                  {sequence.map((s, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 pr-2 font-mono font-semibold text-primary align-top whitespace-nowrap">
                        {i + 1}
                      </td>
                      <td className="py-1.5 pr-2 text-gray-700 align-top">
                        {s.text}
                        {s.note && (
                          <span className="block text-2xs text-gray-400 mt-0.5">{s.note}</span>
                        )}
                      </td>
                      <td className="py-1.5 text-gray-500 align-top whitespace-nowrap">
                        {s.responsible || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
}

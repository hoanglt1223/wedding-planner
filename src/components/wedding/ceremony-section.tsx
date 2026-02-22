import type { Ceremony } from "@/types/wedding";
import { Badge } from "@/components/ui/badge";
import { CeremonySteps } from "./ceremony-steps";
import { PeopleGrid } from "./people-grid";
import { GiftsTable } from "./gifts-table";

interface CeremonySectionProps {
  ceremony: Ceremony;
  stepId: string;
  ceremonyIndex: number;
  checkedKeys: Record<string, boolean>;
  onToggleCheck: (key: string) => void;
  partyTime: "noon" | "afternoon";
}

export function CeremonySection({
  ceremony,
  stepId,
  ceremonyIndex,
  checkedKeys,
  onToggleCheck,
  partyTime,
}: CeremonySectionProps) {
  return (
    <div className="space-y-2">
      {/* Header card */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900 flex-1">{ceremony.name}</h2>
          {ceremony.required ? (
            <Badge className="bg-red-600 text-white text-[0.6rem] px-1.5 py-0.5 h-auto">
              BẮT BUỘC
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-400 text-[0.6rem] px-1.5 py-0.5 h-auto">
              TÙY CHỌN
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{ceremony.description}</p>
      </div>

      {/* People grid */}
      {ceremony.people.length > 0 && <PeopleGrid people={ceremony.people} />}

      {/* Unified steps */}
      {ceremony.steps.length > 0 && (
        <CeremonySteps
          steps={ceremony.steps}
          stepId={stepId}
          ceremonyIndex={ceremonyIndex}
          checkedKeys={checkedKeys}
          onToggle={onToggleCheck}
          partyTime={partyTime}
        />
      )}

      {/* Gifts table */}
      {ceremony.gifts && ceremony.gifts.length > 0 && <GiftsTable gifts={ceremony.gifts} />}

      {/* Tips */}
      {ceremony.tips.length > 0 && (
        <div className="bg-white rounded-xl p-3 shadow-sm">
          <h2 className="text-sm font-bold text-red-800 mb-2">Lưu Ý</h2>
          <div className="space-y-1.5">
            {ceremony.tips.map((tip, i) => (
              <div
                key={i}
                className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800"
              >
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

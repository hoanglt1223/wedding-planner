import type { Ceremony } from "@/types/wedding";
import type { Region } from "@/data/regions";
import { Badge } from "@/components/ui/badge";
import { CeremonySteps } from "./ceremony-steps";
import { PeopleGrid } from "./people-grid";
import { GiftsTable } from "./gifts-table";
import { DiscussionsList } from "./discussions-list";
import { t } from "@/lib/i18n";

interface CeremonySectionProps {
  ceremony: Ceremony;
  stepId: string;
  ceremonyIndex: number;
  checkedKeys: Record<string, boolean>;
  onToggleCheck: (key: string) => void;
  timeOffset: number;
  lang?: string;
  region?: Region;
}

export function CeremonySection({
  ceremony,
  stepId,
  ceremonyIndex,
  checkedKeys,
  onToggleCheck,
  timeOffset,
  lang = "vi",
  region: _region = "south",
}: CeremonySectionProps) {
  return (
    <div className="space-y-2">
      {/* Header card */}
      <div className="bg-[var(--theme-surface)] rounded-xl p-3 shadow-sm border border-[var(--theme-border)]">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-base font-bold text-gray-900 flex-1">{ceremony.name}</h2>
          {ceremony.required ? (
            <Badge className="bg-primary text-primary-foreground text-2xs px-1.5 py-0.5 h-auto">
              {t("BẮT BUỘC", lang)}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-400 text-2xs px-1.5 py-0.5 h-auto">
              {t("TÙY CHỌN", lang)}
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
          timeOffset={timeOffset}
        />
      )}

      {/* Family discussion topics */}
      {ceremony.discussions && ceremony.discussions.length > 0 && (
        <DiscussionsList discussions={ceremony.discussions} lang={lang} />
      )}

      {/* Gifts table */}
      {ceremony.gifts && ceremony.gifts.length > 0 && <GiftsTable gifts={ceremony.gifts} lang={lang} />}
    </div>
  );
}

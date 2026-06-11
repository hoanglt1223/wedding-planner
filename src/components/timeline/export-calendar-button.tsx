import { Calendar } from "lucide-react";
import { t } from "@/lib/i18n";
import { exportWeddingCalendar } from "@/lib/ics-export";
import type { CoupleInfo, TimelineEntry } from "@/types/wedding";

interface ExportCalendarButtonProps {
  info: CoupleInfo;
  timelineEntries: TimelineEntry[];
  lang: string;
}

export function ExportCalendarButton({
  info,
  timelineEntries,
  lang,
}: ExportCalendarButtonProps) {
  const handleExport = () => {
    exportWeddingCalendar(info, timelineEntries, lang);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md
        bg-[var(--theme-primary)] text-white hover:opacity-90 transition-opacity"
    >
      <Calendar className="w-3.5 h-3.5" />
      {t("Xuất lịch (.ics)", lang)}
    </button>
  );
}

/**
 * Calendar Export Page Wrapper
 * Main page for calendar export functionality
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { CalendarExportPanel } from "@/components/calendar-export/calendar-export-panel";

export function CalendarExportPage() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang === "en" ? "en" : "vi";

  return (
    <div className="space-y-4 py-2">
      <CalendarExportPanel
        weddingDate={state.info.date || ""}
        timeline={state.timelineEntries || []}
        payments={state.vendorPayments || []}
        lang={lang}
      />
    </div>
  );
}

/**
 * Wedding Schedule Share Page
 * Main page for managing schedule sharing settings
 */

import { ScheduleSharePanel } from "@/components/schedule-share/schedule-share-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function ScheduleSharePage() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang === "en" ? "en" : "vi";

  return (
    <div className="space-y-4 py-2">
      <ScheduleSharePanel lang={lang} />
    </div>
  );
}
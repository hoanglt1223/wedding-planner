/**
 * Anniversary Page Wrapper
 * Connects the Anniversary Tracker with wedding store context
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { AnniversaryTracker } from "@/components/anniversary/anniversary-tracker";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

export function AnniversaryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];

  return (
    <AnniversaryTracker
      dates={state.anniversaryDates || []}
      weddingDate={state.info.date || ""}
      lang={(state.lang as "vi" | "en")}
      theme={theme}
      onAddDate={(date) => store.addAnniversaryDate(date)}
      onUpdateDate={(id, date) => store.updateAnniversaryDate(id, date)}
      onRemoveDate={(id) => store.removeAnniversaryDate(id)}
    />
  );
}
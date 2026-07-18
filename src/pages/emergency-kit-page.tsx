/**
 * Emergency Kit Page
 * Wedding Day Emergency Kit Checklist page
 */

import { EmergencyKitPanel } from "@/components/emergency-kit/emergency-kit-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function EmergencyKitPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <EmergencyKitPanel
        checkedItems={state.emergencyKitChecked || {}}
        onToggleItem={(itemId) => store.toggleEmergencyKitItem(itemId)}
        onClearChecklist={() => store.clearEmergencyKitChecklist()}
        lang={lang}
      />
    </div>
  );
}

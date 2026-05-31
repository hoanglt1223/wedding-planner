import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { PlanningChecklist } from "@/components/planning-checklist/planning-checklist";

export function ChecklistPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <PlanningChecklist
      weddingDate={state.info.date}
      checkedItems={state.checkedChecklistItems ?? {}}
      onToggle={store.toggleChecklistItem}
      lang={state.lang}
    />
  );
}

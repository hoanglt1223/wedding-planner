import { WEDDING_STEPS } from "@/data/wedding-steps";
import { StepPanel } from "@/components/wedding/step-panel";
import { BudgetPanel } from "@/components/budget/budget-panel";
import { GuestPanel } from "@/components/guests/guest-panel";
import { NotesPanel } from "@/components/notes/notes-panel";
import { VendorPanel } from "@/components/vendors/vendor-panel";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface PanelRouterProps {
  state: WeddingState;
  store: WeddingStore;
  onGoAI: (hint: string) => void;
}

const STEP_COUNT = WEDDING_STEPS.length; // 7

export function PanelRouter({ state, store, onGoAI }: PanelRouterProps) {
  const tab = state.tab;

  // Step panels (tabs 0-6)
  if (tab < STEP_COUNT) {
    const step = WEDDING_STEPS[tab];
    return (
      <StepPanel
        key={step.id}
        step={step}
        activeSubTab={state.subTabs[step.id] ?? 0}
        checkedKeys={state.checkedItems}
        onSubTabChange={store.setSubTab}
        onToggleCheck={store.toggleCheck}
        onGoAI={onGoAI}
        stepStartTime={(state.stepStartTimes || {})[step.id]}
        onSetStepStartTime={store.setStepStartTime}
      />
    );
  }

  if (tab === STEP_COUNT) {
    // tab 7 — Budget
    return (
      <BudgetPanel
        budget={state.budget}
        categoryOverrides={state.budgetOverrides}
        expenses={state.expenses || {}}
        onSetBudget={store.setBudget}
        onSetCategoryPercent={store.setCategoryPercent}
        onSetExpense={store.setExpense}
      />
    );
  }

  if (tab === STEP_COUNT + 1) {
    // tab 8 — Guests
    return (
      <GuestPanel
        guests={state.guests}
        onAddGuest={store.addGuest}
        onRemoveGuest={store.removeGuest}
        onClearGuests={store.clearGuests}
        onImportGuests={store.importGuests}
      />
    );
  }

  if (tab === STEP_COUNT + 2) {
    // tab 9 — Notes
    return (
      <NotesPanel
        notes={state.notes || ""}
        onSetNotes={store.setNotes}
      />
    );
  }

  if (tab === STEP_COUNT + 3) {
    // tab 10 — Vendors
    return (
      <VendorPanel
        vendors={state.vendors || []}
        onAddVendor={store.addVendor}
        onRemoveVendor={store.removeVendor}
      />
    );
  }

  return null;
}

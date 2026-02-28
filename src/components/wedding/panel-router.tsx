import { lazy, Suspense } from "react";
import { getWeddingSteps } from "@/data/resolve-data";

const TimelinePage = lazy(() => import("@/pages/timeline-page"));
const GiftPage = lazy(() => import("@/pages/gift-page"));
import { StepPanel } from "@/components/wedding/step-panel";
import { ExpenseTracker } from "@/components/budget/expense-tracker";
import { GuestPanel } from "@/components/guests/guest-panel";
import { NotesPanel } from "@/components/notes/notes-panel";
import { VendorPanel } from "@/components/vendors/vendor-panel";
import { AuspiciousCalendar } from "@/components/calendar/auspicious-calendar";
import { isStepEnabled } from "@/hooks/use-wedding-store";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface PanelRouterProps {
  state: WeddingState;
  store: WeddingStore;
  onGoAI: (hint: string) => void;
  userId?: string;
}

export function PanelRouter({ state, store, onGoAI, userId }: PanelRouterProps) {
  const tab = state.tab;
  const lang = state.lang;
  const steps = getWeddingSteps(lang).filter((s) => isStepEnabled(state.enabledSteps || {}, s.id));
  const stepCount = steps.length;

  // Step panels (tabs 0-6)
  if (tab < stepCount) {
    const step = steps[tab];
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
        lang={lang}
        region={state.region}
      />
    );
  }

  if (tab === stepCount) {
    return <ExpenseTracker state={state} store={store} />;
  }

  if (tab === stepCount + 1) {
    return (
      <GuestPanel
        guests={state.guests}
        onAddGuest={store.addGuest}
        onRemoveGuest={store.removeGuest}
        onClearGuests={store.clearGuests}
        onImportGuests={store.importGuests}
        lang={lang}
        userId={userId}
        rsvpSettings={state.rsvpSettings}
        onSetRsvpSettings={store.setRsvpSettings}
        onUpdateGuestRsvpToken={store.updateGuestRsvpToken}
        themeId={state.themeId}
      />
    );
  }

  if (tab === stepCount + 2) {
    return (
      <NotesPanel
        notes={state.notes || ""}
        onSetNotes={store.setNotes}
        lang={lang}
      />
    );
  }

  if (tab === stepCount + 3) {
    return (
      <VendorPanel
        vendors={state.vendors || []}
        onAddVendor={store.addVendor}
        onRemoveVendor={store.removeVendor}
        lang={lang}
      />
    );
  }

  if (tab === stepCount + 4) {
    return (
      <AuspiciousCalendar
        lang={lang}
        brideBirthDate={state.info.brideBirthDate}
        groomBirthDate={state.info.groomBirthDate}
        weddingDate={state.info.date}
        betrothalDate={state.info.betrothalDate}
        engagementDate={state.info.engagementDate}
      />
    );
  }

  if (tab === stepCount + 5) {
    return (
      <Suspense fallback={null}>
        <TimelinePage state={state} store={store} />
      </Suspense>
    );
  }

  if (tab === stepCount + 6) {
    return (
      <Suspense fallback={null}>
        <GiftPage state={state} store={store} />
      </Suspense>
    );
  }

  return null;
}

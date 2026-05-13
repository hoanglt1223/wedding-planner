import { getWeddingSteps } from "@/data/resolve-data";
import { CountdownWidget } from "@/components/countdown/countdown-widget";
import { StatsGrid } from "@/components/wedding/stats-grid";
import { TabNavigation } from "@/components/wedding/tab-navigation";
import { PanelRouter } from "@/components/wedding/panel-router";
import { isStepEnabled } from "@/hooks/use-wedding-store";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function PlanningPage() {
  const store = useWeddingStoreContext();
  const { state, userId } = store;
  const progress = store.getProgress();
  const lang = state.lang;
  const enabled = state.enabledSteps || {};
  const filteredCount = getWeddingSteps(lang).filter((s) => isStepEnabled(enabled, s.id)).length;

  return (
    <>
      <CountdownWidget
        weddingDate={state.info.date}
        progress={progress}
        dismissedReminders={state.dismissedReminders || []}
        onDismiss={store.dismissReminder}
        lang={lang}
      />
      <StatsGrid
        totalSteps={filteredCount}
        done={progress.done}
        total={progress.total}
        budget={state.budget}
        progressPct={progress.pct}
        lang={lang}
      />
      <TabNavigation activeTab={state.tab} onTabChange={store.setTab} lang={lang} enabledSteps={enabled} />
      <PanelRouter state={state} store={store} userId={userId} />
    </>
  );
}

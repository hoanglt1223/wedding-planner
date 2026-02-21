import { WEDDING_STEPS } from "@/data/wedding-steps";
import { StatsGrid } from "@/components/wedding/stats-grid";
import { TabNavigation } from "@/components/wedding/tab-navigation";
import { PanelRouter } from "@/components/wedding/panel-router";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface KeHoachPageProps {
  state: WeddingState;
  store: WeddingStore;
  progress: { done: number; total: number; pct: number };
  onGoAI: (hint: string) => void;
}

export function KeHoachPage({ state, store, progress, onGoAI }: KeHoachPageProps) {
  return (
    <>
      <StatsGrid
        totalSteps={WEDDING_STEPS.length}
        done={progress.done}
        total={progress.total}
        budget={state.bud}
        progressPct={progress.pct}
      />
      <TabNavigation activeTab={state.tab} onTabChange={store.setTab} />
      <PanelRouter state={state} store={store} onGoAI={onGoAI} />
    </>
  );
}

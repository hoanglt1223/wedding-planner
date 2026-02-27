import { getWeddingSteps } from "@/data/resolve-data";
import { StatsGrid } from "@/components/wedding/stats-grid";
import { TabNavigation } from "@/components/wedding/tab-navigation";
import { PanelRouter } from "@/components/wedding/panel-router";
import { isStepEnabled } from "@/hooks/use-wedding-store";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface PlanningPageProps {
  state: WeddingState;
  store: WeddingStore;
  progress: { done: number; total: number; pct: number };
  onGoAI: (hint: string) => void;
  userId?: string;
}

export function PlanningPage({ state, store, progress, onGoAI, userId }: PlanningPageProps) {
  const lang = state.lang;
  const enabled = state.enabledSteps || {};
  const filteredCount = getWeddingSteps(lang).filter((s) => isStepEnabled(enabled, s.id)).length;

  return (
    <>
      <StatsGrid
        totalSteps={filteredCount}
        done={progress.done}
        total={progress.total}
        budget={state.budget}
        progressPct={progress.pct}
        lang={lang}
      />
      <TabNavigation activeTab={state.tab} onTabChange={store.setTab} lang={lang} enabledSteps={enabled} />
      <PanelRouter state={state} store={store} onGoAI={onGoAI} userId={userId} />
    </>
  );
}

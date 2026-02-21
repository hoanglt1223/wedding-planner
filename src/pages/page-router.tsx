import { PlanningPage } from "./planning-page";
import { AstrologyPage } from "./astrology-page";
import { CardsPanel } from "@/components/cards/cards-panel";
import { AiPanel } from "@/components/ai/ai-panel";
import { PrintPanel } from "@/components/print/print-panel";
import { IdeasPanel } from "@/components/ideas/ideas-panel";
import { WEDDING_STEPS } from "@/data/wedding-steps";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

interface PageRouterProps {
  state: WeddingState;
  store: WeddingStore;
  progress: { done: number; total: number; pct: number };
  onGoAI: (hint: string) => void;
}

export function PageRouter({ state, store, progress, onGoAI }: PageRouterProps) {
  switch (state.page) {
    case "planning":
      return (
        <PlanningPage
          state={state}
          store={store}
          progress={progress}
          onGoAI={onGoAI}
        />
      );

    case "astrology":
      return (
        <AstrologyPage
          info={state.info}
          onUpdateInfo={store.updateInfo}
        />
      );

    case "cards":
      return (
        <CardsPanel
          info={state.info}
          onUpdateInfo={store.updateInfo}
          photos={state.photos || []}
          onAddPhoto={store.addPhoto}
          onRemovePhoto={store.removePhoto}
        />
      );

    case "ai":
      return (
        <AiPanel
          aiResponse={state.aiResponse}
          budget={state.budget}
          onSetAiResponse={store.setAiResponse}
        />
      );

    case "handbook":
      return (
        <PrintPanel
          info={state.info}
          steps={WEDDING_STEPS}
        />
      );

    case "ideas":
      return (
        <IdeasPanel
          state={state}
          onSetState={store.setState}
          onNavigate={(page, tab) => {
            store.setPage(page);
            if (tab !== undefined) store.setTab(tab);
          }}
        />
      );

    default:
      return null;
  }
}

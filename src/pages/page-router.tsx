import { KeHoachPage } from "./ke-hoach-page";
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
    case "kehoach":
      return (
        <KeHoachPage
          state={state}
          store={store}
          progress={progress}
          onGoAI={onGoAI}
        />
      );

    case "thiep":
      return (
        <CardsPanel
          info={state.info}
          onUpdateInfo={store.updateInfo}
        />
      );

    case "ai":
      return (
        <AiPanel
          aiResponse={state.ar}
          budget={state.bud}
          onSetAiResponse={store.setAiResponse}
        />
      );

    case "sotay":
      return (
        <PrintPanel
          info={state.info}
          steps={WEDDING_STEPS}
        />
      );

    case "ytuong":
      return <IdeasPanel />;

    default:
      return null;
  }
}

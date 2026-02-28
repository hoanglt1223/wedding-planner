import { lazy, Suspense } from "react";
import { PlanningPage } from "./planning-page";
import { HomePage } from "./home-page";
import { GuestsPage } from "./guests-page";
import { AstrologyPage } from "./astrology-page";
import { CardsPanel } from "@/components/cards/cards-panel";
import { AiPanel } from "@/components/ai/ai-panel";
import { PrintPanel } from "@/components/print/print-panel";
import { getWeddingSteps } from "@/data/resolve-data";
import type { WeddingState } from "@/types/wedding";
import type { WeddingStore } from "@/hooks/use-wedding-store";

const TaskBoardDashboard = lazy(() => import("@/components/tasks/task-board-dashboard"));
const WebsiteSettingsPanel = lazy(() => import("@/components/website/website-settings-panel"));

interface PageRouterProps {
  state: WeddingState;
  store: WeddingStore;
  progress: { done: number; total: number; pct: number };
  onGoAI: (hint: string) => void;
  userId?: string;
}

export function PageRouter({ state, store, progress, onGoAI, userId }: PageRouterProps) {
  const lang = state.lang;

  switch (state.page) {
    case "home":
      return <HomePage state={state} store={store} progress={progress} />;

    case "guests":
      return <GuestsPage state={state} store={store} userId={userId} />;

    case "planning":
      return (
        <PlanningPage
          state={state}
          store={store}
          progress={progress}
          onGoAI={onGoAI}
          userId={userId}
        />
      );

    case "astrology":
      return (
        <AstrologyPage
          info={state.info}
          onUpdateInfo={store.updateInfo}
          lang={lang}
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
          lang={lang}
        />
      );

    case "ai":
      return (
        <AiPanel
          aiResponse={state.aiResponse}
          budget={state.budget}
          onSetAiResponse={store.setAiResponse}
          lang={lang}
        />
      );

    case "handbook":
      return (
        <PrintPanel
          info={state.info}
          steps={getWeddingSteps(lang)}
          lang={lang}
        />
      );

    case "tasks":
      return (
        <Suspense fallback={null}>
          <TaskBoardDashboard state={state} store={store} userId={userId} />
        </Suspense>
      );

    case "website":
      return (
        <Suspense fallback={null}>
          <WebsiteSettingsPanel state={state} store={store} />
        </Suspense>
      );

    default:
      return <HomePage state={state} store={store} progress={progress} />;
  }
}

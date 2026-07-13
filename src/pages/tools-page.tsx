import { lazy, Suspense, useState } from "react";
import { AiPanel } from "@/components/ai/ai-panel";
import { AstrologyPage } from "./astrology-page";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { ExportPanel } from "@/components/export/export-panel";
import { HashtagGenerator } from "@/components/hashtags/hashtag-generator";

const TaskBoardDashboard = lazy(() => import("@/components/tasks/task-board-dashboard"));

const TABS = [
  { labelVi: "🤖 AI", labelEn: "🤖 AI" },
  { labelVi: "🔮 Tử Vi", labelEn: "🔮 Fortune" },
  { labelVi: "📋 Công Việc", labelEn: "📋 Tasks" },
  { labelVi: "#️⃣ Hashtag", labelEn: "#️⃣ Hashtag" },
  { labelVi: "📦 Xuất Dữ Liệu", labelEn: "📦 Export" },
];

export function ToolsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [activeTab, setActiveTab] = useState(0);
  const lang = state.lang;
  const en = lang === "en";

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 border-b">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === i
                ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {en ? tab.labelEn : tab.labelVi}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && <AiPanel />}
      {activeTab === 1 && <AstrologyPage />}
      {activeTab === 2 && (
        <Suspense fallback={null}>
          <TaskBoardDashboard />
        </Suspense>
      )}
      {activeTab === 3 && (
        <HashtagGenerator
          brideName={state.info.bride}
          groomName={state.info.groom}
          weddingDate={state.info.date}
          generatedHashtags={state.generatedHashtags || []}
          favoriteHashtags={state.favoriteHashtags || []}
          onGenerateHashtags={store.setGeneratedHashtags}
          onToggleFavorite={store.toggleFavoriteHashtag}
          onClearGenerated={store.clearGeneratedHashtags}
          lang={state.lang === "en" ? "en" : "vi"}
        />
      )}
      {activeTab === 4 && <ExportPanel />}
    </div>
  );
}

import { MoodBoardPanel } from "@/components/mood-board/mood-board-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function MoodBoardPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <MoodBoardPanel
        items={state.moodBoardItems || []}
        colorPalettes={state.colorPalettes || []}
        onAddItem={store.addMoodBoardItem}
        onUpdateItem={store.updateMoodBoardItem}
        onRemoveItem={store.removeMoodBoardItem}
        onToggleFavorite={store.toggleMoodBoardFavorite}
        onAddPalette={store.addColorPalette}
        onUpdatePalette={store.updateColorPalette}
        onRemovePalette={store.removeColorPalette}
        lang={lang}
      />
    </div>
  );
}

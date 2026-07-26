/**
 * Honeymoon Page
 * Connects the Honeymoon Planner with the wedding store
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { DEFAULT_HONEYMOON } from "@/data/backgrounds";
import { HoneymoonPlanner } from "@/components/honeymoon/honeymoon-planner";

export function HoneymoonPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const honeymoon = state.honeymoon ?? DEFAULT_HONEYMOON;
  const lang = (state.lang as "vi" | "en");

  return (
    <HoneymoonPlanner
      honeymoon={honeymoon}
      lang={lang}
      onUpdate={(patch) => store.updateHoneymoon(patch)}
      onTogglePacking={(itemId) => store.toggleHoneymoonPacking(itemId)}
      onClearPacking={() => store.clearHoneymoonPacking()}
      onAddTask={(task) => store.addHoneymoonTask(task)}
      onUpdateTask={(id, updates) => store.updateHoneymoonTask(id, updates)}
      onRemoveTask={(id) => store.removeHoneymoonTask(id)}
    />
  );
}

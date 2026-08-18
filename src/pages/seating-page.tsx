import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { SeatingMealPlanner } from "@/components/seating/seating-meal-planner";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

export default function SeatingPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];

  return (
    <SeatingMealPlanner
      tables={state.seatingTables ?? []}
      guests={state.guests ?? []}
      onAddTable={store.addSeatingTable}
      onUpdateTable={store.updateSeatingTable}
      onRemoveTable={store.removeSeatingTable}
      onAssignGuest={store.assignGuestToTable}
      onUnassignGuest={store.unassignGuest}
      lang={state.lang}
      theme={theme}
    />
  );
}

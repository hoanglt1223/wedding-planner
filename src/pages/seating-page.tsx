import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { SeatingChartPanel } from "@/components/seating/seating-chart-panel";

export default function SeatingPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <SeatingChartPanel
      tables={state.seatingTables ?? []}
      guests={state.guests ?? []}
      onAddTable={store.addSeatingTable}
      onUpdateTable={store.updateSeatingTable}
      onRemoveTable={store.removeSeatingTable}
      onAssignGuest={store.assignGuestToTable}
      onUnassignGuest={store.unassignGuest}
      lang={state.lang}
    />
  );
}

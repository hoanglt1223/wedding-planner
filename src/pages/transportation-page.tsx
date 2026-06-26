import { TransportationPanel } from "@/components/transportation/transportation-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function TransportationPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <div className="space-y-4 py-2">
      <TransportationPanel
        groups={state.transportationGroups ?? []}
        guests={state.guests ?? []}
        onAddGroup={store.addTransportationGroup}
        onUpdateGroup={store.updateTransportationGroup}
        onRemoveGroup={store.removeTransportationGroup}
        onAssignGuest={store.assignGuestToTransport}
        onUnassignGuest={store.unassignGuestFromTransport}
        lang={state.lang}
      />
    </div>
  );
}

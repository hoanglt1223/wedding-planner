import { WeddingPartyPanel } from "@/components/wedding-party/wedding-party-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function WeddingPartyPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <WeddingPartyPanel
        members={state.weddingParty || []}
        onAdd={store.addPartyMember}
        onUpdate={store.updatePartyMember}
        onRemove={store.removePartyMember}
        lang={lang}
      />
    </div>
  );
}

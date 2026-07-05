import { WelcomeBagPanel } from "@/components/welcome-bags/welcome-bag-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function WelcomeBagPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <WelcomeBagPanel
        items={state.welcomeBagItems ?? []}
        distributions={state.welcomeBagDistributions ?? []}
        guests={state.guests ?? []}
        onAddItem={store.addWelcomeBagItem}
        onRemoveItem={store.removeWelcomeBagItem}
        onUpdateItem={store.updateWelcomeBagItem}
        onToggleItemChecked={store.toggleWelcomeBagItemChecked}
        onAddDistribution={store.addWelcomeBagDistribution}
        onRemoveDistribution={store.removeWelcomeBagDistribution}
        onUpdateDistribution={store.updateWelcomeBagDistribution}
        lang={lang}
      />
    </div>
  );
}

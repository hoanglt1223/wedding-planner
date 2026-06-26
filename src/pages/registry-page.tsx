import { RegistryPanel } from "@/components/registry/registry-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function RegistryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <RegistryPanel
        items={state.registryItems || []}
        lang={lang}
        onAdd={store.addRegistryItem}
        onUpdate={store.updateRegistryItem}
        onRemove={store.removeRegistryItem}
        onToggleFulfilled={store.toggleRegistryFulfilled}
      />
    </div>
  );
}

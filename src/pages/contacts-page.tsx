import { ContactsPanel } from "@/components/contacts/contacts-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function ContactsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <ContactsPanel
        contacts={state.contacts || []}
        onAdd={store.addContact}
        onUpdate={store.updateContact}
        onRemove={store.removeContact}
        lang={lang}
      />
    </div>
  );
}

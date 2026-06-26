import { VendorPanel } from "@/components/vendors/vendor-panel";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function VendorPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <VendorPanel
        vendors={state.vendors || []}
        onAddVendor={store.addVendor}
        onRemoveVendor={store.removeVendor}
        onUpdateVendor={store.updateVendor}
        payments={state.vendorPayments || []}
        onAddPayment={store.addVendorPayment}
        onRemovePayment={store.removeVendorPayment}
        onAddQuote={store.addVendorQuote}
        onRemoveQuote={store.removeVendorQuote}
        lang={lang}
      />
    </div>
  );
}

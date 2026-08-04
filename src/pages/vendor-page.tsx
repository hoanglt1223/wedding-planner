import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { VendorPanel } from "@/components/vendors/vendor-panel";
import { VendorGratitudeTracker } from "@/components/vendors/vendor-gratitude-tracker";
import { VendorGratitudeGuide } from "@/components/vendors/vendor-gratitude-guide";
import { VendorDiscovery } from "@/components/vendors/vendor-discovery";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

type VendorTab = "discover" | "vendors" | "gratitude" | "guide" | "compare";

export function VendorPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<VendorTab>("vendors");

  const tabs: Array<{ id: VendorTab; labelVi: string; labelEn: string }> = [
    { id: "discover", labelVi: "Khám Phá", labelEn: "Discover" },
    { id: "vendors", labelVi: "Nhà Cung Cấp", labelEn: "Vendors" },
    { id: "gratitude", labelVi: "Theo Dõi Tip", labelEn: "Tip Tracker" },
    { id: "guide", labelVi: "Hướng Dẫn", labelEn: "Guide" },
    { id: "compare", labelVi: "So Sánh", labelEn: "Compare" },
  ];

  // Handle tab change
  function handleTabChange(tabId: VendorTab) {
    if (tabId === "compare") {
      navigate({ to: "/app/vendor-comparison" });
    } else {
      setActiveTab(tabId);
    }
  }

  return (
    <div className="space-y-4 py-2">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id || (tab.id === "compare" && window.location.hash.includes("vendor-comparison"))
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang === "vi" ? tab.labelVi : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "discover" && (
        <VendorDiscovery
          onAddVendor={store.addVendor}
          lang={lang === "en" ? "en" : "vi"}
        />
      )}

      {activeTab === "vendors" && (
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
          contractChecklist={state.contractChecklist || {}}
          onToggleContractItem={store.toggleContractCheckItem}
          onClearContractChecklist={store.clearContractChecklist}
          communications={state.vendorCommunications || []}
          onAddCommunication={store.addVendorCommunication}
          onUpdateCommunication={store.updateVendorCommunication}
          onRemoveCommunication={store.removeVendorCommunication}
          lang={lang}
        />
      )}

      {activeTab === "gratitude" && (
        <VendorGratitudeTracker
          vendors={state.vendors || []}
          gratitudeList={state.vendorGratitude || []}
          onAdd={store.addVendorGratitude}
          onUpdate={store.updateVendorGratitude}
          onRemove={store.removeVendorGratitude}
          lang={lang === "en" ? "en" : "vi"}
        />
      )}

      {activeTab === "guide" && (
        <VendorGratitudeGuide
          vendors={state.vendors || []}
          lang={lang === "en" ? "en" : "vi"}
        />
      )}
    </div>
  );
}

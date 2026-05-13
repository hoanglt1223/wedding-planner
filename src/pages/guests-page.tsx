import { lazy, Suspense, useState } from "react";
import { GuestPanel } from "@/components/guests/guest-panel";
import { PhotoGalleryDashboard } from "@/components/photo-wall/photo-gallery-dashboard";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

const GiftPage = lazy(() => import("./gift-page"));

const TABS = [
  { labelVi: "👥 Khách mời", labelEn: "👥 Guests" },
  { labelVi: "📸 Ảnh cưới", labelEn: "📸 Photos" },
  { labelVi: "🎁 Quà tặng", labelEn: "🎁 Gifts" },
];

export function GuestsPage() {
  const store = useWeddingStoreContext();
  const { state, userId } = store;
  const [activeTab, setActiveTab] = useState(0);
  const lang = state.lang;
  const en = lang === "en";

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 border-b">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === i
                ? "border-[var(--theme-primary)] text-[var(--theme-primary)]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {en ? tab.labelEn : tab.labelVi}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && (
        <GuestPanel
          guests={state.guests}
          onAddGuest={store.addGuest}
          onRemoveGuest={store.removeGuest}
          onClearGuests={store.clearGuests}
          onImportGuests={store.importGuests}
          lang={lang}
          userId={userId}
          rsvpSettings={state.rsvpSettings}
          onSetRsvpSettings={store.setRsvpSettings}
          onUpdateGuestRsvpToken={store.updateGuestRsvpToken}
          themeId={state.themeId}
        />
      )}
      {activeTab === 1 && userId && (
        <PhotoGalleryDashboard userId={userId} state={state} store={store} />
      )}
      {activeTab === 2 && (
        <Suspense fallback={null}>
          <GiftPage state={state} store={store} />
        </Suspense>
      )}
    </div>
  );
}

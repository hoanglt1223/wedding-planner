import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { ItineraryPage as ItineraryPageComponent } from "@/components/itinerary/itinerary-page";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

export default function ItineraryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];

  return (
    <ItineraryPageComponent
      items={state.itineraryItems ?? []}
      lang={state.lang}
      brideName={state.info.bride || ""}
      groomName={state.info.groom || ""}
      weddingDate={state.info.date || ""}
      theme={theme}
      onUpdateItems={(items) => store.setItineraryItems(items)}
    />
  );
}

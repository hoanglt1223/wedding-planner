import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { ItineraryPage as ItineraryPageComponent } from "@/components/itinerary/itinerary-page";

export default function ItineraryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <ItineraryPageComponent
      items={state.itineraryItems ?? []}
      lang={state.lang}
      onUpdateItems={(items) => store.setItineraryItems(items)}
    />
  );
}

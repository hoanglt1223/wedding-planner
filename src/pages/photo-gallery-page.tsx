import { PhotoGalleryDashboard } from "@/components/photo-wall/photo-gallery-dashboard";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function PhotoGalleryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <div className="space-y-4 py-2">
      <PhotoGalleryDashboard
        userId={store.userId ?? ""}
        state={state}
        store={store}
      />
    </div>
  );
}

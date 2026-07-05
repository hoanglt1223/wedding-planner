import { PhotoShotList } from "@/components/photo-shots/photo-shot-list";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function PhotoShotsPage() {
  const store = useWeddingStoreContext();
  const { state, addPhotoShot, removePhotoShot, updatePhotoShot } = store;
  const lang = state.lang;

  function handleGenerateTemplate() {
    const { getTemplatePhotoShots } = require("@/data/photo-shots");
    const template = getTemplatePhotoShots(lang);
    template.forEach((shot: any) => addPhotoShot(shot));
  }

  return (
    <div className="space-y-4 py-2">
      <PhotoShotList
        shots={state.photoShots || []}
        onAdd={addPhotoShot}
        onRemove={removePhotoShot}
        onUpdate={updatePhotoShot}
        onGenerateTemplate={handleGenerateTemplate}
        lang={lang}
      />
    </div>
  );
}

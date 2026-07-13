import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { HashtagGenerator } from "@/components/hashtags/hashtag-generator";

export default function HashtagGeneratorPage() {
  const { state, setGeneratedHashtags, toggleFavoriteHashtag, clearGeneratedHashtags } = useWeddingStoreContext();

  return (
    <div className="space-y-4 py-2">
      <HashtagGenerator
        brideName={state.info.bride}
        groomName={state.info.groom}
        weddingDate={state.info.date}
        generatedHashtags={state.generatedHashtags || []}
        favoriteHashtags={state.favoriteHashtags || []}
        onGenerateHashtags={setGeneratedHashtags}
        onToggleFavorite={toggleFavoriteHashtag}
        onClearGenerated={clearGeneratedHashtags}
        lang={state.lang === "en" ? "en" : "vi"}
      />
    </div>
  );
}

import { useState } from "react";
import { SongListPage } from "@/components/songs/song-list-page";
import { MusicDiscovery } from "@/components/songs/music-discovery";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import type { SongItem } from "@/types/wedding";

type SongsTab = "playlist" | "discover";

export function SongsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [activeTab, setActiveTab] = useState<SongsTab>("playlist");
  const lang = state.lang === "en" ? "en" : "vi";

  function handleAddSong(song: Omit<SongItem, "id">) {
    store.addSong(song);
  }

  return (
    <div className="space-y-4 py-2">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("playlist")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "playlist"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          📋 {lang === "en" ? "Playlist" : "Danh sách"}
        </button>
        <button
          onClick={() => setActiveTab("discover")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "discover"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🎵 {lang === "en" ? "Discover" : "Khám phá"}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "playlist" && <SongListPage />}
      {activeTab === "discover" && (
        <MusicDiscovery onAddSong={handleAddSong} lang={lang} />
      )}
    </div>
  );
}
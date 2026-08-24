import { useState } from "react";
import {
  MUSIC_CATEGORIES,
  getSongsByCategory,
  getPopularSongs,
  DJ_BAND_TIPS,
  REGIONAL_MUSIC_NOTES,
  type MusicCategory,
  type SongRecommendation,
} from "@/data/wedding-music";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import type { SongItem } from "@/types/wedding";

type MusicDiscoveryTab = "categories" | "popular" | "tips";

export function MusicDiscovery({
  onAddSong,
  lang,
}: {
  onAddSong: (song: Omit<SongItem, "id">) => void;
  lang: "vi" | "en";
}) {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [selectedCategory, setSelectedCategory] = useState<MusicCategory | null>(
    MUSIC_CATEGORIES.length > 0 ? MUSIC_CATEGORIES[0]! : null
  );
  const [activeTab, setActiveTab] = useState<MusicDiscoveryTab>("categories");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongRecommendation | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("");

  const region = state.region || "north";

  function handleQuickAdd(song: SongRecommendation) {
    setSelectedSong(song);
    setShowAddModal(true);
  }

  function handleAddFromDiscovery() {
    if (!selectedSong) return;
    const newSong: Omit<SongItem, "id"> = {
      title: selectedSong.title,
      artist: selectedSong.artist,
      section: "party",
      priority: "nice-to-have",
      notes: (lang === "vi" ? selectedSong.notesVi : selectedSong.notesEn) || "",
      requestedBy: "",
      confirmed: false,
    };
    onAddSong(newSong);
    setShowAddModal(false);
    setSelectedSong(null);
  }

  const moodOptions: Array<{ value: string; labelVi: string; labelEn: string }> = [
    { value: "romantic", labelVi: "Lãng mạn", labelEn: "Romantic" },
    { value: "upbeat", labelVi: "Vui tươi", labelEn: "Upbeat" },
    { value: "traditional", labelVi: "Truyền thống", labelEn: "Traditional" },
    { value: "emotional", labelVi: "Cảm động", labelEn: "Emotional" },
    { value: "celebratory", labelVi: "Phấn khởi", labelEn: "Celebratory" },
  ];

  const languageOptions: Array<{ value: string; labelVi: string; labelEn: string }> = [
    { value: "vi", labelVi: "Tiếng Việt", labelEn: "Vietnamese" },
    { value: "en", labelVi: "Tiếng Anh", labelEn: "English" },
    { value: "instrumental", labelVi: "Không lời", labelEn: "Instrumental" },
  ];

  return (
    <div className="space-y-4 py-2">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "categories"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Danh mục" : "Categories"}
        </button>
        <button
          onClick={() => setActiveTab("popular")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "popular"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Phổ biến" : "Popular"}
        </button>
        <button
          onClick={() => setActiveTab("tips")}
          className={`px-3 py-2 text-sm font-medium transition-colors relative ${
            activeTab === "tips"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === "vi" ? "Mẹo" : "Tips"}
        </button>
      </div>

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Category Selector */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              {lang === "vi" ? "Chọn danh mục nhạc" : "Select music category"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {MUSIC_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3 border rounded-lg text-center transition-colors ${
                    selectedCategory?.id === cat.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-xs font-medium">
                    {lang === "vi" ? cat.nameVi : cat.nameEn}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Category Details */}
          {selectedCategory && (
            <div className="border rounded-lg p-4 space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{selectedCategory.icon}</span>
                  <h3 className="text-lg font-semibold">
                    {lang === "vi" ? selectedCategory.nameVi : selectedCategory.nameEn}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lang === "vi"
                    ? selectedCategory.descriptionVi
                    : selectedCategory.descriptionEn}
                </p>
                <div className="text-xs text-muted-foreground mt-1">
                  {lang === "vi" ? "Thời lượng:" : "Duration:"}{" "}
                  {selectedCategory.typicalDuration}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">
                  {lang === "vi" ? "💡 Mẹo chọn nhạc" : "💡 Music Selection Tips"}
                </h4>
                <ul className="space-y-1">
                  {(lang === "vi"
                    ? selectedCategory.tipsVi
                    : selectedCategory.tipsEn
                  ).map((tip, idx) => (
                    <li key={idx} className="text-xs flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Song Recommendations */}
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {lang === "vi" ? "🎵 Bài hát đề xuất" : "🎵 Recommended Songs"}
                </h4>
                <div className="space-y-2">
                  {getSongsByCategory(selectedCategory.id).slice(0, 5).map((song) => (
                    <div
                      key={song.id}
                      className="p-2 border rounded flex items-start justify-between gap-2"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium">{song.title}</div>
                        <div className="text-xs text-muted-foreground">{song.artist}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 bg-muted rounded">
                            {song.duration}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-muted rounded">
                            {song.language === "vi"
                              ? "Việt"
                              : song.language === "en"
                              ? "Anh"
                              : "Không lời"}
                          </span>
                          {song.popular && (
                            <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                              {lang === "vi" ? "Phổ biến" : "Popular"}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleQuickAdd(song)}
                        className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                      >
                        {lang === "vi" ? "Thêm" : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Tab */}
      {activeTab === "popular" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <div>
              <label className="text-xs text-muted-foreground">
                {lang === "vi" ? "Ngôn ngữ:" : "Language:"}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                }}
                className="border rounded px-3 py-1.5 text-sm bg-background ml-2"
              >
                <option value="">{lang === "vi" ? "Tất cả" : "All"}</option>
                {languageOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {lang === "vi" ? opt.labelVi : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                {lang === "vi" ? "Tâm trạng:" : "Mood:"}
              </label>
              <select
                value={selectedMood}
                onChange={(e) => {
                  setSelectedMood(e.target.value);
                }}
                className="border rounded px-3 py-1.5 text-sm bg-background ml-2"
              >
                <option value="">{lang === "vi" ? "Tất cả" : "All"}</option>
                {moodOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {lang === "vi" ? opt.labelVi : opt.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtered Songs List */}
          <div className="space-y-2">
            {(() => {
              let songs = getPopularSongs(50);
              if (selectedLanguage) {
                songs = songs.filter((s) => s.language === selectedLanguage);
              }
              if (selectedMood) {
                songs = songs.filter((s) => s.mood === selectedMood);
              }
              return songs.slice(0, 20).map((song) => (
                <div
                  key={song.id}
                  className="p-3 border rounded flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{song.title}</div>
                      {song.popular && (
                        <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                          {lang === "vi" ? "Phổ biến" : "Popular"}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{song.artist}</div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">
                        {song.duration}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded">
                        {song.language === "vi"
                          ? "Việt"
                          : song.language === "en"
                          ? "Anh"
                          : "Không lời"}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-muted rounded capitalize">
                        {song.mood}
                      </span>
                    </div>
                    {(lang === "vi" ? song.notesVi : song.notesEn) && (
                      <div className="text-xs text-muted-foreground mt-1 italic">
                        {lang === "vi" ? song.notesVi : song.notesEn}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleQuickAdd(song)}
                    className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
                  >
                    {lang === "vi" ? "Thêm" : "Add"}
                  </button>
                </div>
              ));
            })()}
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === "tips" && (
        <div className="space-y-4">
          {/* DJ/Band Tips */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">
              {lang === "vi" ? "🎤 Mẹo chọn DJ/Band" : "🎤 DJ/Band Selection Tips"}
            </h3>
            <ul className="space-y-2">
              {(lang === "vi" ? DJ_BAND_TIPS.vi : DJ_BAND_TIPS.en).map((tip, idx) => (
                <li key={idx} className="text-xs flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Regional Notes */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">
              {lang === "vi" ? "🌏 Lưu ý khu vực" : "🌏 Regional Notes"}
            </h3>
            <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
              <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">
                {region === "north"
                  ? lang === "vi"
                    ? "Miền Bắc"
                    : "Northern"
                  : region === "central"
                  ? lang === "vi"
                    ? "Miền Trung"
                    : "Central"
                  : lang === "vi"
                  ? "Miền Nam"
                  : "Southern"}
              </div>
              <div className="text-xs text-muted-foreground">
                {lang === "vi"
                  ? REGIONAL_MUSIC_NOTES[region as keyof typeof REGIONAL_MUSIC_NOTES].vi
                  : REGIONAL_MUSIC_NOTES[region as keyof typeof REGIONAL_MUSIC_NOTES].en}
              </div>
            </div>
          </div>

          {/* General Tips */}
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">
              {lang === "vi" ? "📋 Checklist nhạc đám cưới" : "📋 Wedding Music Checklist"}
            </h3>
            <ul className="space-y-2">
              {[
                lang === "vi" ? "Đã chọn nhạc nhập đường" : "Selected processional music",
                lang === "vi" ? "Đã chọn nhạc ra về" : "Selected recessional music",
                lang === "vi" ? "Đã chọn bài hát đầu tiên" : "Selected first dance song",
                lang === "vi" ? "Đã chuẩn bị danh sách nhạc tiệc" : "Prepared party music list",
                lang === "vi" ? "Đã thông báo DJ/band về yêu cầu" : "Informed DJ/band of requirements",
                lang === "vi" ? "Đã kiểm tra âm thanh trước tiệc" : "Checked sound system before reception",
                lang === "vi" ? "Đã chuẩn bị nhạc dự phòng" : "Prepared backup music",
              ].map((item, idx) => (
                <li key={idx} className="text-xs flex items-start gap-2">
                  <input type="checkbox" className="mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Add Song Modal */}
      {showAddModal && selectedSong && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-4 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">
              {lang === "vi" ? "Thêm bài hát" : "Add Song"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {lang === "vi"
                ? `Đang thêm: ${selectedSong.title} - ${selectedSong.artist}`
                : `Adding: ${selectedSong.title} - ${selectedSong.artist}`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedSong(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-muted transition-colors"
              >
                {lang === "vi" ? "Hủy" : "Cancel"}
              </button>
              <button
                onClick={handleAddFromDiscovery}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                {lang === "vi" ? "Thêm" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

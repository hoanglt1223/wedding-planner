import { useState, useRef } from "react";
import { t } from "@/lib/i18n";
import type { SongItem, SongSection, SongPriority } from "@/types/wedding";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { SongSummaryBar } from "./song-summary-bar";
import { SongEntryList } from "./song-entry-list";
import { SongEntryForm } from "./song-entry-form";

type FilterSection = "all" | SongSection;
type FilterPriority = "all" | SongPriority;

export function SongListPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [search, setSearch] = useState("");
  const [filterSection, setFilterSection] = useState<FilterSection>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [editing, setEditing] = useState<SongItem | null | undefined>(undefined);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = state.lang;

  const songs = state.songs ?? [];

  function handleAdd() {
    setEditing(null);
  }

  function handleEdit(song: SongItem) {
    setEditing(song);
  }

  function handleClose() {
    setEditing(undefined);
  }

  function handleSave(data: Omit<SongItem, "id">) {
    if (editing) {
      store.updateSong(editing.id, data);
    } else {
      store.addSong(data);
    }
    setEditing(undefined);
  }

  function handleDelete(id: number) {
    if (window.confirm(lang === "en" ? "Delete this song?" : "Xóa bài hát này?")) {
      store.removeSong(id);
    }
  }

  function handleToggleConfirmed(id: number) {
    const song = songs.find((s) => s.id === id);
    if (song) store.updateSong(id, { confirmed: !song.confirmed });
  }

  function handleExportCSV() {
    const headers = ["Title", "Artist", "Section", "Priority", "Requested By", "Notes", "Confirmed"];
    const rows = songs.map(song => [
      song.title,
      song.artist,
      song.section,
      song.priority,
      song.requestedBy || "",
      song.notes || "",
      song.confirmed ? "Yes" : "No"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-playlist-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }

  function handleExportTXT() {
    const content = songs.map((song, idx) => {
      const confirmed = song.confirmed ? " ✓" : "";
      const priority = song.priority === "must-play" ? " [MUST]" : song.priority === "do-not-play" ? " [NO]" : "";
      return `${idx + 1}. ${song.title}${confirmed}${priority}
   Artist: ${song.artist || "Unknown"}
   Section: ${song.section}
   ${song.requestedBy ? `   Requested by: ${song.requestedBy}\n` : ""}${song.notes ? `   Notes: ${song.notes}\n` : ""}`;
    }).join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wedding-playlist-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }

  function handleExportDJ() {
    // DJ-friendly format with only must-play and nice-to-have, sorted by section
    const djSongs = songs
      .filter(s => s.priority !== "do-not-play")
      .sort((a, b) => a.section.localeCompare(b.section));

    const bySection: Record<SongSection, SongItem[]> = {
      ceremony: [],
      cocktail: [],
      reception: [],
      "first-dance": [],
      party: [],
      other: []
    };

    djSongs.forEach(song => {
      bySection[song.section].push(song);
    });

    let content = `WEDDING DJ PLAYLIST\n`;
    content += `Generated: ${new Date().toLocaleDateString()}\n`;
    content += `Total Songs: ${djSongs.length}\n\n`;

    Object.entries(bySection).forEach(([section, sectionSongs]) => {
      if (sectionSongs.length > 0) {
        content += `${section.toUpperCase()}\n${"=".repeat(section.length)}\n`;
        sectionSongs.forEach((song, idx) => {
          const mustPlay = song.priority === "must-play" ? " ★ MUST PLAY" : "";
          content += `${idx + 1}. ${song.title} - ${song.artist || "Unknown"}${mustPlay}\n`;
          if (song.notes) content += `   Note: ${song.notes}\n`;
        });
        content += "\n";
      }
    });

    // Do not play section
    const doNotPlay = songs.filter(s => s.priority === "do-not-play");
    if (doNotPlay.length > 0) {
      content += `DO NOT PLAY\n${"=".repeat(12)}\n`;
      doNotPlay.forEach((song, idx) => {
        content += `${idx + 1}. ${song.title} - ${song.artist || "Unknown"}\n`;
      });
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dj-playlist-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  }

  function handleImportCSV(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");

      // Skip header row
      const dataLines = lines.slice(1);

      let imported = 0;
      dataLines.forEach(line => {
        if (!line.trim()) return;

        // Parse CSV line (handle quoted strings)
        const regex = /("([^"]|"")*"|[^,]*)/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(line)) !== null) {
          if (match[1]) {
            matches.push(match[1].replace(/""/g, '"').replace(/^"|"$/g, ''));
          }
        }

        if (matches.length >= 2) {
          const title = matches[0]?.trim();
          const artist = matches[1]?.trim();

          if (title) {
            store.addSong({
              title,
              artist: artist || "",
              section: (matches[2] as SongSection) || "reception",
              priority: (matches[3] as SongPriority) || "nice-to-have",
              requestedBy: matches[4] || "",
              notes: matches[5] || "",
              confirmed: matches[6] === "Yes"
            });
            imported++;
          }
        }
      });

      alert(`Imported ${imported} songs successfully!`);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="font-semibold text-base">{t("🎵 Danh Sách Nhạc", lang)}</h2>
          <p className="text-xs text-muted-foreground">{t("Quản lý nhạc đám cưới", lang)}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export/Import menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="text-xs px-3 py-1.5 border border-primary text-primary rounded hover:bg-primary/5 transition-colors"
            >
              📤 {lang === "en" ? "Export" : "Xuất"}
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 bg-background border rounded-lg shadow-lg z-10 min-w-[150px]">
                <div className="py-1">
                  <button
                    onClick={handleExportCSV}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    📄 {lang === "en" ? "Export CSV" : "Xuất CSV"}
                  </button>
                  <button
                    onClick={handleExportTXT}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    📝 {lang === "en" ? "Export TXT" : "Xuất TXT"}
                  </button>
                  <button
                    onClick={handleExportDJ}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors"
                  >
                    🎧 {lang === "en" ? "DJ Format" : "Định dạng DJ"}
                  </button>
                  <div className="border-t my-1" />
                  <label className="block w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors cursor-pointer">
                    📥 {lang === "en" ? "Import CSV" : "Nhập CSV"}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleImportCSV}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            + {t("Thêm", lang)}
          </button>
        </div>
      </div>

      {/* Summary */}
      <SongSummaryBar songs={songs} lang={lang} />

      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("🔍 Tìm kiếm bài hát...", lang)}
        className="w-full border rounded px-3 py-2 text-sm bg-background"
      />

      {/* List */}
      <SongEntryList
        songs={songs}
        search={search}
        filterSection={filterSection}
        filterPriority={filterPriority}
        onFilterSectionChange={setFilterSection}
        onFilterPriorityChange={setFilterPriority}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleConfirmed={handleToggleConfirmed}
        lang={lang}
      />

      {/* Add/Edit modal */}
      {editing !== undefined && (
        <SongEntryForm
          initial={editing}
          lang={lang}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}

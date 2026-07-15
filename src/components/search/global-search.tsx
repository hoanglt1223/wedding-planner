import { useState, useMemo, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, X, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { WeddingState } from "@/types/wedding";

interface SearchResult {
  id: string;
  type: "guest" | "vendor" | "task" | "song" | "speech" | "contact" | "contract";
  title: string;
  subtitle?: string;
  category?: string;
  route: string;
  data?: unknown;
}

interface GlobalSearchProps {
  state: WeddingState;
  lang?: string;
}

export function GlobalSearch({ state, lang = "vi" }: GlobalSearchProps) {
  const en = lang === "en";
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search across all data
  const searchResults = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search guests
    if (!selectedType || selectedType === "guest") {
      (state.guests || []).forEach((guest) => {
        const match =
          guest.name.toLowerCase().includes(q) ||
          guest.phone.includes(q) ||
          guest.side?.toLowerCase().includes(q) ||
          guest.tableGroup?.toLowerCase().includes(q) ||
          guest.guestNotes?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `guest-${guest.id}`,
            type: "guest",
            title: guest.name,
            subtitle: guest.phone,
            category: guest.side,
            route: "/guests",
            data: guest,
          });
        }
      });
    }

    // Search vendors
    if (!selectedType || selectedType === "vendor") {
      (state.vendors || []).forEach((vendor) => {
        const match =
          vendor.name.toLowerCase().includes(q) ||
          vendor.category?.toLowerCase().includes(q) ||
          vendor.phone?.includes(q) ||
          vendor.address?.toLowerCase().includes(q) ||
          vendor.note?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `vendor-${vendor.id}`,
            type: "vendor",
            title: vendor.name,
            subtitle: vendor.phone || vendor.address,
            category: vendor.category,
            route: "/vendors",
            data: vendor,
          });
        }
      });
    }

    // Search tasks (from wedding tasks)
    if (!selectedType || selectedType === "task") {
      // Search in wedding tasks from database would be handled differently
      // For now, we'll search timeline entries as tasks
      (state.timelineEntries || []).forEach((entry) => {
        const match =
          entry.title.toLowerCase().includes(q) ||
          entry.location?.toLowerCase().includes(q) ||
          entry.notes?.toLowerCase().includes(q) ||
          entry.responsible?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `timeline-${entry.id}`,
            type: "task",
            title: entry.title,
            subtitle: entry.time,
            category: entry.category,
            route: "/tasks",
            data: entry,
          });
        }
      });
    }

    // Search songs
    if (!selectedType || selectedType === "song") {
      (state.songs || []).forEach((song) => {
        const match =
          song.title?.toLowerCase().includes(q) ||
          song.artist?.toLowerCase().includes(q) ||
          song.notes?.toLowerCase().includes(q) ||
          song.requestedBy?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `song-${song.id}`,
            type: "song",
            title: song.title || "Untitled",
            subtitle: song.artist,
            category: song.section,
            route: "/songs",
            data: song,
          });
        }
      });
    }

    // Search speeches
    if (!selectedType || selectedType === "speech") {
      (state.speeches || []).forEach((speech) => {
        const match =
          speech.title?.toLowerCase().includes(q) ||
          speech.content?.toLowerCase().includes(q) ||
          speech.speaker?.toLowerCase().includes(q) ||
          speech.notes?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `speech-${speech.id}`,
            type: "speech",
            title: speech.title || "Untitled",
            subtitle: speech.speaker,
            category: speech.category,
            route: "/speeches",
            data: speech,
          });
        }
      });
    }

    // Search contacts
    if (!selectedType || selectedType === "contact") {
      (state.contacts || []).forEach((contact) => {
        const match =
          contact.name?.toLowerCase().includes(q) ||
          contact.role?.toLowerCase().includes(q) ||
          contact.phone?.includes(q) ||
          contact.note?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `contact-${contact.id}`,
            type: "contact",
            title: contact.name,
            subtitle: contact.phone || contact.role,
            category: contact.category,
            route: "/guests", // Contacts shown in guests section
            data: contact,
          });
        }
      });
    }

    // Search contracts
    if (!selectedType || selectedType === "contract") {
      (state.contracts || []).forEach((contract) => {
        const match =
          contract.vendorName?.toLowerCase().includes(q) ||
          contract.contractType?.toLowerCase().includes(q) ||
          contract.vendorCategory?.toLowerCase().includes(q) ||
          contract.notes?.toLowerCase().includes(q);

        if (match) {
          results.push({
            id: `contract-${contract.id}`,
            type: "contract",
            title: contract.vendorName || "Unknown Vendor",
            subtitle: contract.contractType,
            category: contract.vendorCategory,
            route: "/contracts",
            data: contract,
          });
        }
      });
    }

    // Sort by relevance (title match first, then subtitle)
    return results.sort((a, b) => {
      const aTitleExact = a.title.toLowerCase() === q;
      const bTitleExact = b.title.toLowerCase() === q;
      if (aTitleExact && !bTitleExact) return -1;
      if (!aTitleExact && bTitleExact) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [query, selectedType, state]);

  // Count results by type
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    searchResults.forEach((result) => {
      counts[result.type] = (counts[result.type] || 0) + 1;
    });
    return counts;
  }, [searchResults]);

  const typeLabels: Record<string, { vi: string; en: string; icon: string }> = {
    guest: { vi: "Khách", en: "Guests", icon: "👥" },
    vendor: { vi: "Nhà cung cấp", en: "Vendors", icon: "🏪" },
    task: { vi: "Công việc", en: "Tasks", icon: "📋" },
    song: { vi: "Nhạc", en: "Songs", icon: "🎵" },
    speech: { vi: "Lời nói", en: "Speeches", icon: "🎤" },
    contact: { vi: "Danh bạ", en: "Contacts", icon: "📇" },
    contract: { vi: "Hợp đồng", en: "Contracts", icon: "📄" },
  };

  const handleResultClick = (result: SearchResult) => {
    navigate({ to: result.route });
    setShowResults(false);
    setQuery("");
  };

  const handleClear = () => {
    setQuery("");
    setSelectedType(null);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={en ? "Search guests, vendors, tasks..." : "Tìm khách, nhà cung cấp, công việc..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-10 h-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {showResults && query.trim() && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-[80vh] overflow-auto z-50 shadow-lg">
          {/* Type filters */}
          {Object.keys(typeCounts).length > 1 && (
            <div className="flex gap-1 p-2 border-b overflow-x-auto">
              <button
                onClick={() => setSelectedType(null)}
                className={`text-xs px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                  selectedType === null
                    ? "bg-[var(--theme-primary)] text-white"
                    : "bg-muted hover:bg-muted-foreground/10"
                }`}
              >
                {en ? "All" : "Tất cả"} ({searchResults.length})
              </button>
              {Object.entries(typeCounts).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? null : type)}
                  className={`text-xs px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedType === type
                      ? "bg-[var(--theme-primary)] text-white"
                      : "bg-muted hover:bg-muted-foreground/10"
                  }`}
                >
                  {typeLabels[type]?.icon || "📄"} {en ? typeLabels[type]?.en : typeLabels[type]?.vi} ({count})
                </button>
              ))}
            </div>
          )}

          {/* Results list */}
          {searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.slice(0, 20).map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted-foreground/5 transition-colors text-left"
                >
                  <span className="text-xl shrink-0">
                    {typeLabels[result.type]?.icon || "📄"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{result.title}</div>
                    {result.subtitle && (
                      <div className="text-xs text-muted-foreground truncate">{result.subtitle}</div>
                    )}
                    {result.category && (
                      <div className="text-xs text-muted-foreground/70">
                        {en ? typeLabels[result.type]?.en : typeLabels[result.type]?.vi}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </button>
              ))}
              {searchResults.length > 20 && (
                <div className="px-4 py-2 text-xs text-center text-muted-foreground">
                  {en ? "First 20 results shown" : "Hiển thị 20 kết quả đầu tiên"}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-sm">
                {en ? "No results found" : "Không tìm thấy kết quả"}
              </p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

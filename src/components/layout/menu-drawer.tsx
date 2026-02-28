import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MENU_ITEMS } from "@/data/nav-sections";
import { THEMES } from "@/data/themes";
import type { Region } from "@/types/wedding";

interface MenuDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang?: string;
  onPageChange: (page: string) => void;
  region?: Region;
  onSetRegion?: (region: Region) => void;
  onSetLang?: (lang: string) => void;
  activeTheme?: string;
  onSelectTheme?: (themeId: string) => void;
}

const REGIONS: { id: Region; vi: string; en: string }[] = [
  { id: "north", vi: "Bắc", en: "North" },
  { id: "central", vi: "Trung", en: "Central" },
  { id: "south", vi: "Nam", en: "South" },
];

export function MenuDrawer({
  open, onOpenChange, lang = "vi", onPageChange,
  region = "south", onSetRegion, onSetLang,
  activeTheme, onSelectTheme,
}: MenuDrawerProps) {
  const en = lang === "en";

  const navigate = (pageId: string) => {
    onPageChange(pageId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[80vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>{en ? "Menu" : "Menu"}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-3 overflow-y-auto">
          {/* Navigation items */}
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.pageId}
                onClick={() => navigate(item.pageId)}
                className="w-full flex items-center gap-3 min-h-[44px] px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">
                  {en ? item.labelEn : item.labelVi}
                </span>
              </button>
            ))}
          </div>

          <hr className="border-muted" />

          {/* Language */}
          {onSetLang && (
            <div className="px-3">
              <p className="text-xs text-muted-foreground mb-2">{en ? "Language" : "Ngôn ngữ"}</p>
              <div className="flex gap-2">
                {(["vi", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => onSetLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      lang === l
                        ? "bg-[var(--theme-primary)] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l === "vi" ? "🇻🇳 Tiếng Việt" : "🌍 English"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Region */}
          {onSetRegion && (
            <div className="px-3">
              <p className="text-xs text-muted-foreground mb-2">{en ? "Region" : "Vùng miền"}</p>
              <div className="flex gap-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onSetRegion(r.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      region === r.id
                        ? "bg-[var(--theme-primary)] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {en ? r.en : r.vi}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Theme */}
          {onSelectTheme && (
            <div className="px-3">
              <p className="text-xs text-muted-foreground mb-2">{en ? "Theme" : "Giao diện"}</p>
              <div className="flex flex-wrap gap-2">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => onSelectTheme(theme.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      activeTheme === theme.id
                        ? "bg-[var(--theme-primary)] text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

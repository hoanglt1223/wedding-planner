import { useState } from "react";
import { Settings, X } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RegionSelector } from "./region-selector";
import { RemindersBell } from "./reminders";
import { getCountdown } from "@/lib/countdown";
import { getLangLabel, t } from "@/lib/i18n";
import { THEMES } from "@/data/themes";
import { createShareLink } from "@/lib/share";
import type { CoupleInfo, WeddingState, Region } from "@/types/wedding";

interface RightSidebarProps {
  lang?: string;
  onSetLang?: (lang: string) => void;
  region?: Region;
  onSetRegion?: (region: Region) => void;
  weddingDate: string;
  info: CoupleInfo;
  state: WeddingState;
  activeTheme: string;
  onSelectTheme: (id: string) => void;
  isOnline?: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function ShareButton({ state }: { state: WeddingState }) {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      const url = await createShareLink(state);
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* share requires server */
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
    >
      <span className="text-base leading-none">
        {copied ? "✓" : sharing ? "…" : "↗"}
      </span>
      <span>{copied ? t("Đã sao chép!", state.lang) : t("Chia sẻ", state.lang)}</span>
    </button>
  );
}

function SidebarContent({
  lang = "vi",
  onSetLang,
  region = "south",
  onSetRegion,
  weddingDate,
  info,
  state,
  activeTheme,
  onSelectTheme,
  isOnline,
}: Omit<RightSidebarProps, "mobileOpen" | "onMobileOpenChange">) {
  const en = lang === "en";
  const countdown = getCountdown(weddingDate);

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--theme-border)] shrink-0">
        <span className="text-sm font-semibold text-muted-foreground">
          {en ? "Settings" : "Cài đặt"}
        </span>
        {isOnline === false && (
          <span className="offline-badge text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
            Offline
          </span>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Countdown */}
          {countdown && (
            <div className="rounded-lg bg-[var(--theme-primary-light)]/50 p-3 text-center">
              <p className="text-2xs text-muted-foreground mb-1">
                {en ? "Wedding Day" : "Ngày cưới"}
              </p>
              <p
                className="text-lg font-bold"
                style={{ color: "var(--theme-primary)" }}
              >
                {countdown.passed
                  ? en ? "Congratulations!" : "Chúc mừng!"
                  : countdown.days > 0
                  ? `${countdown.days} ${en ? "days" : "ngày"}`
                  : `${countdown.hours}h ${countdown.minutes}m`}
              </p>
            </div>
          )}

          {/* Reminders */}
          <div>
            <p className="text-2xs text-muted-foreground font-medium mb-2 px-1">
              {en ? "Reminders" : "Nhắc nhở"}
            </p>
            <RemindersBell info={info} />
          </div>

          {/* Share */}
          <div>
            <p className="text-2xs text-muted-foreground font-medium mb-2 px-1">
              {en ? "Share" : "Chia sẻ"}
            </p>
            <ShareButton state={state} />
          </div>

          {/* Region */}
          {onSetRegion && (
            <div>
              <p className="text-2xs text-muted-foreground font-medium mb-2 px-1">
                {en ? "Region" : "Vùng miền"}
              </p>
              <RegionSelector
                region={region}
                onRegionChange={onSetRegion}
                lang={lang}
              />
            </div>
          )}

          {/* Language */}
          {onSetLang && (
            <div>
              <p className="text-2xs text-muted-foreground font-medium mb-2 px-1">
                {en ? "Language" : "Ngôn ngữ"}
              </p>
              <button
                onClick={() => onSetLang(lang === "vi" ? "en" : "vi")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="text-base leading-none">
                  {lang === "vi" ? "🇻🇳" : "🌍"}
                </span>
                <span>{getLangLabel(lang)}</span>
              </button>
            </div>
          )}

          {/* Theme */}
          <div>
            <p className="text-2xs text-muted-foreground font-medium mb-2 px-1">
              {en ? "Theme" : "Giao diện"}
            </p>
            <div className="space-y-0.5">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    theme.id === activeTheme
                      ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)] font-semibold"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 border border-border"
                    style={{ background: theme.primary }}
                  />
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export function RightSidebar(props: RightSidebarProps) {
  const { mobileOpen, onMobileOpenChange, ...contentProps } = props;

  return (
    <>
      {/* Desktop: flying sidebar (fixed to right edge) */}
      <DesktopFlyingSidebar {...contentProps} />

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="right" className="w-72 p-0">
          <SidebarContent {...contentProps} />
        </SheetContent>
      </Sheet>
    </>
  );
}

function DesktopFlyingSidebar(
  props: Omit<RightSidebarProps, "mobileOpen" | "onMobileOpenChange">
) {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:block fixed top-12 right-0 z-30 h-[calc(100vh-3rem)]">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-3 -left-9 z-10 h-8 w-8 flex items-center justify-center rounded-l-lg border border-r-0 border-[var(--theme-border)] bg-[var(--theme-surface)] text-muted-foreground hover:text-foreground transition-colors shadow-sm"
        title={open ? "Close" : "Settings"}
      >
        {open ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
      </button>

      {/* Panel */}
      <div
        className={`h-full w-56 border-l border-[var(--theme-border)] bg-[var(--theme-surface)]/95 backdrop-blur-sm shadow-lg transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <SidebarContent {...props} />
      </div>
    </div>
  );
}

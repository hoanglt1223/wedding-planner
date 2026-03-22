import { useNavigate } from "@tanstack/react-router";
import { PAGES } from "@/data/page-definitions";
import { t } from "@/lib/i18n";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LeftSidebarProps {
  activePage: string;
  lang?: string;
  progressPct: number;
  done: number;
  total: number;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function SidebarContent({
  activePage,
  lang = "vi",
  progressPct,
  done,
  total,
  onNavigate,
}: Omit<LeftSidebarProps, "mobileOpen" | "onMobileOpenChange"> & {
  onNavigate?: () => void;
}) {
  const navigate = useNavigate();

  const handleClick = (pageId: string) => {
    void navigate({ to: `/app/${pageId}` as never });
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Progress */}
      <div className="px-4 py-3 border-b border-[var(--theme-border)]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-2xs text-muted-foreground font-medium">
            {t("Tiến độ", lang)}
          </span>
          <span className="text-2xs text-muted-foreground font-medium">
            {done}/{total}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPct}%`,
              backgroundColor: "var(--theme-primary)",
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-0.5">
          {PAGES.map((page) => {
            const active = page.id === activePage;
            return (
              <button
                key={page.id}
                onClick={() => handleClick(page.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                  active
                    ? "bg-[var(--theme-primary-light)] text-[var(--theme-primary)] font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span className="text-base leading-none shrink-0">
                  {page.icon}
                </span>
                <span className="truncate">
                  {t(page.shortLabel || page.label.replace(/^.+?\s/, ""), lang)}
                </span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}

export function LeftSidebar(props: LeftSidebarProps) {
  const { mobileOpen, onMobileOpenChange, ...contentProps } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-[var(--theme-border)] bg-[var(--theme-surface)]/60 h-full">
        <SidebarContent {...contentProps} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent
            {...contentProps}
            onNavigate={() => onMobileOpenChange(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}

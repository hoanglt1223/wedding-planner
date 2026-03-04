import { useState, useCallback, useEffect, useRef } from "react";
import type { CoupleInfo, WeddingStep } from "@/types/wedding";
import { getLocale } from "@/lib/format";
import { t } from "@/lib/i18n";
import { EventTimeline } from "./event-timeline";
import { HandbookPage } from "./handbook-page";
import { exportHandbookPDF } from "./pdf-export";

interface PrintPanelProps {
  info: CoupleInfo;
  steps: WeddingStep[];
  lang?: string;
}

export function PrintPanel({ info, steps, lang = "vi" }: PrintPanelProps) {
  const locale = getLocale(lang);
  const [currentPage, setCurrentPage] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const bookRef = useRef<HTMLDivElement>(null);

  // Pages: cover(0), toc(1), timeline(2), steps(3..N+2), notes(N+3)
  const totalPages = 3 + steps.length + 1;

  const goTo = useCallback(
    (p: number) => {
      setCurrentPage(Math.max(0, Math.min(p, totalPages - 1)));
      setShowToc(false);
    },
    [totalPages],
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrentPage((p) => Math.max(p - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [totalPages]);

  // TOC entries
  const tocEntries = [
    { label: t("Lịch Trình Sự Kiện", lang), page: 2, icon: "🎬" },
    ...steps.map((s, i) => ({
      label: s.title,
      page: 3 + i,
      icon: s.icon,
    })),
    { label: t("Ghi Chú", lang), page: totalPages - 1, icon: "📝" },
  ];

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    if (!bookRef.current || exporting) return;
    setExporting(true);
    setExportProgress(lang === "en" ? "Preparing..." : "Đang chuẩn bị...");

    // Temporarily show all pages for capture
    const container = bookRef.current;
    container.setAttribute("data-export-all", "true");

    // Small delay for DOM to update
    await new Promise((r) => setTimeout(r, 100));

    try {
      const groom = info.groom || "groom";
      const bride = info.bride || "bride";
      const filename = `so-tay-dam-cuoi-${groom}-${bride}.pdf`
        .toLowerCase()
        .replace(/\s+/g, "-");

      await exportHandbookPDF(container, filename, (cur, total) => {
        setExportProgress(
          lang === "en"
            ? `Rendering page ${cur}/${total}...`
            : `Đang xuất trang ${cur}/${total}...`,
        );
      });
    } finally {
      container.removeAttribute("data-export-all");
      setExporting(false);
      setExportProgress("");
    }
  };

  const fmDate = (d: string) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString(locale) : "";

  return (
    <div className="p-3 sm:p-4 max-w-2xl mx-auto">
      {/* Toolbar — hidden when printing */}
      <div className="no-print mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={handlePrint}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors"
        >
          🖨️ {t("In Sổ Tay", lang)}
        </button>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-500 disabled:opacity-50 transition-colors"
        >
          📄 {lang === "en" ? "Export PDF" : "Xuất PDF"}
        </button>
        <button
          onClick={() => setShowToc((v) => !v)}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200 transition-colors sm:hidden"
        >
          📖 {lang === "en" ? "TOC" : "Mục lục"}
        </button>
        {exportProgress && (
          <span className="text-xs text-purple-600 animate-pulse">{exportProgress}</span>
        )}
      </div>

      <div className="flex gap-4">
        {/* TOC sidebar — desktop */}
        <div className="no-print hidden sm:block w-44 shrink-0">
          <div className="sticky top-4 rounded-lg bg-white shadow p-3 space-y-0.5">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2">
              {lang === "en" ? "Contents" : "Mục lục"}
            </div>
            <button
              onClick={() => goTo(0)}
              className={`block w-full text-left text-xs px-2 py-1 rounded transition-colors ${currentPage === 0 ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100"}`}
            >
              📕 {lang === "en" ? "Cover" : "Bìa"}
            </button>
            <button
              onClick={() => goTo(1)}
              className={`block w-full text-left text-xs px-2 py-1 rounded transition-colors ${currentPage === 1 ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100"}`}
            >
              📋 {lang === "en" ? "Table of Contents" : "Mục lục"}
            </button>
            {tocEntries.map((entry) => (
              <button
                key={entry.page}
                onClick={() => goTo(entry.page)}
                className={`block w-full text-left text-xs px-2 py-1 rounded truncate transition-colors ${currentPage === entry.page ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100"}`}
              >
                {entry.icon} {entry.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile TOC dropdown */}
        {showToc && (
          <div className="no-print fixed inset-0 z-50 bg-black/30 sm:hidden" onClick={() => setShowToc(false)}>
            <div
              className="absolute top-16 left-3 right-3 bg-white rounded-xl shadow-xl p-4 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-bold mb-3">{lang === "en" ? "Table of Contents" : "Mục lục"}</div>
              <button onClick={() => goTo(0)} className="block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-100">
                📕 {lang === "en" ? "Cover" : "Bìa"}
              </button>
              {tocEntries.map((entry) => (
                <button
                  key={entry.page}
                  onClick={() => goTo(entry.page)}
                  className="block w-full text-left text-sm px-2 py-1.5 rounded hover:bg-gray-100"
                >
                  {entry.icon} {entry.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book container */}
        <div ref={bookRef} className="flex-1 min-w-0">
          {/* === COVER PAGE === */}
          <div
            data-book-page
            className={`book-page bg-white rounded-xl shadow-md overflow-hidden ${currentPage !== 0 ? "book-page-hidden" : ""}`}
            style={{ minHeight: "min(85vh, 1000px)" }}
          >
            <div className="absolute inset-4 border-2 border-gray-200 rounded-lg pointer-events-none" />
            <div className="relative flex flex-col items-center justify-center h-full px-8 py-16 text-center" style={{ minHeight: "min(85vh, 1000px)" }}>
              <div className="text-5xl mb-4">💒</div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-wide mb-2">
                {t("SỔ TAY ĐÁM CƯỚI", lang)}
              </h1>
              <div className="w-16 h-0.5 bg-gray-300 my-4" />
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">
                {info.groom || "?"} & {info.bride || "?"}
              </div>
              <div className="text-sm text-gray-500">
                {info.groomFamilyName} ♥ {info.brideFamilyName}
              </div>
              {info.date && (
                <div className="mt-4 text-sm text-gray-400">
                  {t("Ngày cưới:", lang)} {fmDate(info.date)}
                </div>
              )}
              <div className="mt-8 text-xs text-gray-300">
                Vietnamese Wedding Planner
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-300">1</div>
          </div>

          {/* === TOC PAGE === */}
          <div
            data-book-page
            className={`book-page bg-white rounded-xl shadow-md overflow-hidden mt-4 ${currentPage !== 1 ? "book-page-hidden" : ""}`}
            style={{ minHeight: "min(85vh, 1000px)" }}
          >
            <div className="absolute inset-3 border border-gray-200 rounded pointer-events-none" />
            <div className="px-8 py-10 sm:px-12">
              <h2 className="text-xl font-bold font-serif text-center mb-8">
                {lang === "en" ? "Table of Contents" : "Mục Lục"}
              </h2>
              <div className="space-y-3">
                {tocEntries.map((entry, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(entry.page)}
                    className="no-print flex items-center w-full group text-left"
                  >
                    <span className="text-base mr-2">{entry.icon}</span>
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">
                      {entry.label}
                    </span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mt-1" />
                    <span className="text-sm text-gray-400 font-mono">{entry.page + 1}</span>
                  </button>
                ))}
                {/* Print-only static TOC */}
                {tocEntries.map((entry, i) => (
                  <div
                    key={`p-${i}`}
                    className="hidden print:flex items-center w-full"
                  >
                    <span className="text-base mr-2">{entry.icon}</span>
                    <span className="text-sm font-medium">{entry.label}</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-2 mt-1" />
                    <span className="text-sm text-gray-400 font-mono">{entry.page + 1}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-300">2</div>
          </div>

          {/* === EVENT TIMELINE PAGE === */}
          <div
            data-book-page
            className={`book-page bg-white rounded-xl shadow-md overflow-hidden mt-4 ${currentPage !== 2 ? "book-page-hidden" : ""}`}
            style={{ minHeight: "min(85vh, 1000px)" }}
          >
            <div className="absolute inset-3 border border-gray-200 rounded pointer-events-none" />
            <div className="px-6 py-8">
              <EventTimeline info={info} lang={lang} />
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-300">3</div>
          </div>

          {/* === CHAPTER PAGES (one per step) === */}
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`mt-4 ${currentPage !== 3 + i ? "book-page-hidden" : ""}`}
            >
              <HandbookPage
                step={step}
                chapterNum={i + 1}
                pageNum={4 + i}
                lang={lang}
              />
            </div>
          ))}

          {/* === NOTES PAGE === */}
          <div
            data-book-page
            className={`book-page bg-white rounded-xl shadow-md overflow-hidden mt-4 ${currentPage !== totalPages - 1 ? "book-page-hidden" : ""}`}
            style={{ minHeight: "min(85vh, 1000px)" }}
          >
            <div className="absolute inset-3 border border-gray-200 rounded pointer-events-none" />
            <div className="px-8 py-10 sm:px-12">
              <h2 className="text-xl font-bold font-serif text-center mb-6">
                📝 {t("Ghi Chú", lang)}
              </h2>
              <div className="space-y-4">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-200 pb-4" />
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-300">{totalPages}</div>
          </div>

          {/* Footer / page indicator */}
          <div className="text-center text-xs text-gray-400 pt-3 pb-1 print:hidden">
            Vietnamese Wedding Planner —{" "}
            {lang === "en" ? "Printed" : "In ngày"}{" "}
            {new Date().toLocaleDateString(locale)}
          </div>
        </div>
      </div>

      {/* Navigation — hidden when printing */}
      <div className="no-print mt-4 flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 0}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200 disabled:opacity-30 transition-colors"
        >
          ← {lang === "en" ? "Prev" : "Trước"}
        </button>
        <span className="text-sm text-gray-500 tabular-nums">
          {lang === "en" ? "Page" : "Trang"} {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200 disabled:opacity-30 transition-colors"
        >
          {lang === "en" ? "Next" : "Sau"} →
        </button>
      </div>
    </div>
  );
}

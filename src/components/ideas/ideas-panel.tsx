import { useRef } from "react";
import { getIdeas } from "@/data/resolve-data";
import type { IdeaItemExt } from "@/data/ideas";
import { exportToJson, readJsonFile } from "@/lib/export";
import type { WeddingState } from "@/types/wedding";
import { t } from "@/lib/i18n";

interface IdeasPanelProps {
  state: WeddingState;
  onSetState: (fn: (prev: WeddingState) => WeddingState) => void;
  onNavigate?: (page: string, tab?: number) => void;
}

function getStatusBadge(lang: string): Record<IdeaItemExt["status"], { label: string; cls: string }> {
  return {
    done: { label: lang === "en" ? "Done" : "Đã xong", cls: "bg-green-100 text-green-700 border-green-200" },
    planned: { label: t("Sắp tới", lang), cls: "bg-amber-100 text-amber-700 border-amber-200" },
    future: { label: t("Tương lai", lang), cls: "bg-gray-100 text-gray-600 border-gray-200" },
  };
}

export function IdeasPanel({ state, onSetState, onNavigate }: IdeasPanelProps) {
  const lang = state.lang;
  const ideas = getIdeas(lang);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportToJson(state);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      onSetState(() => data);
    } catch {
      alert(lang === "en" ? "Invalid file!" : "File không hợp lệ!");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const grouped = {
    done: ideas.filter((i) => i.status === "done"),
    planned: ideas.filter((i) => i.status === "planned"),
    future: ideas.filter((i) => i.status === "future"),
  };

  return (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Export/Import Section */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h2 className="mb-3 text-base font-bold text-foreground">{t("📜 Lưu Trữ Dữ Liệu", lang)}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 transition-colors"
            >
              📥 Export JSON
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              📤 Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>

        {/* Ideas List */}
        <h2 className="text-xl font-bold text-foreground">
          {t("💡 Tính Năng & Ý Tưởng", lang)}
        </h2>

        {/* Done section */}
        {grouped.done.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-green-600">✅ {t("Đã hoàn thành", lang)}</h3>
            {grouped.done.map((idea, i) => (
              <IdeaCard key={i} idea={idea} onNavigate={onNavigate} lang={lang} />
            ))}
          </div>
        )}

        {/* Planned section */}
        {grouped.planned.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-600">🔜 {t("Sắp tới", lang)}</h3>
            {grouped.planned.map((idea, i) => (
              <IdeaCard key={i} idea={idea} lang={lang} />
            ))}
          </div>
        )}

        {/* Future section */}
        {grouped.future.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">🔮 {t("Tương lai", lang)}</h3>
            {grouped.future.map((idea, i) => (
              <IdeaCard key={i} idea={idea} lang={lang} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 rounded-xl bg-muted/50 p-4">
          <h2 className="mb-1 text-base font-bold text-foreground">{lang === "en" ? "🚀 Want a feature?" : "🚀 Muốn tính năng nào?"}</h2>
          <p className="text-sm text-muted-foreground">
            {lang === "en"
              ? <>Use the <b className="text-foreground">🤖 AI</b> tab to ask about any idea above!</>
              : <>Hãy dùng tab <b className="text-foreground">🤖 AI</b> để hỏi chi tiết về bất kỳ ý tưởng nào ở trên!</>}
          </p>
        </div>
      </div>
    </div>
  );
}

interface IdeaCardProps {
  idea: IdeaItemExt;
  onNavigate?: (page: string, tab?: number) => void;
  lang?: string;
}

function IdeaCard({ idea, onNavigate, lang = "vi" }: IdeaCardProps) {
  const badge = getStatusBadge(lang)[idea.status];
  const hasLink = idea.status === "done" && idea.link && onNavigate;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <span className="text-lg">{idea.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-foreground">{idea.title}</span>
          <span className={`rounded-full border px-2 py-0.5 text-2xs font-medium ${badge.cls}`}>
            {badge.label}
          </span>
          {hasLink && (
            <button
              onClick={() => onNavigate(idea.link!.page, idea.link!.tab)}
              className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-2xs font-medium text-blue-600 hover:bg-muted/80 hover:text-blue-500 transition-colors"
            >
              {idea.link!.hint} →
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{idea.description}</p>
      </div>
    </div>
  );
}

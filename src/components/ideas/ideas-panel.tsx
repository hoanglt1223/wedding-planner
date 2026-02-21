import { useRef } from "react";
import { IDEAS } from "@/data/ideas";
import type { IdeaItemExt } from "@/data/ideas";
import { exportToJson, readJsonFile } from "@/lib/export";
import type { WeddingState } from "@/types/wedding";

interface IdeasPanelProps {
  state: WeddingState;
  onSetState: (fn: (prev: WeddingState) => WeddingState) => void;
  onNavigate?: (page: string, tab?: number) => void;
}

const STATUS_BADGE: Record<IdeaItemExt["status"], { label: string; cls: string }> = {
  done: { label: "Đã xong", cls: "bg-green-500/20 text-green-300 border-green-500/30" },
  planned: { label: "Sắp tới", cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  future: { label: "Tương lai", cls: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export function IdeasPanel({ state, onSetState, onNavigate }: IdeasPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportToJson(state);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      onSetState(() => data);
    } catch {
      alert("File không hợp lệ!");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const grouped = {
    done: IDEAS.filter((i) => i.status === "done"),
    planned: IDEAS.filter((i) => i.status === "planned"),
    future: IDEAS.filter((i) => i.status === "future"),
  };

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-purple-950 to-slate-900 p-3 sm:p-4 rounded-xl">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Export/Import Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-base font-bold text-white">📜 Lưu Trữ Dữ Liệu</h2>
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
        <h2 className="text-xl font-bold text-white">
          💡 Tính Năng & Ý Tưởng
        </h2>

        {/* Done section */}
        {grouped.done.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-green-400">✅ Đã hoàn thành</h3>
            {grouped.done.map((idea, i) => (
              <IdeaCard key={i} idea={idea} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {/* Planned section */}
        {grouped.planned.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-400">🔜 Sắp tới</h3>
            {grouped.planned.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </div>
        )}

        {/* Future section */}
        {grouped.future.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400">🔮 Tương lai</h3>
            {grouped.future.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <h2 className="mb-1 text-base font-bold text-white">🚀 Muốn tính năng nào?</h2>
          <p className="text-sm text-white/65">
            Hãy dùng tab <b className="text-white/85">🤖 AI</b> để hỏi chi tiết về bất kỳ ý tưởng nào ở trên!
          </p>
        </div>
      </div>
    </div>
  );
}

interface IdeaCardProps {
  idea: IdeaItemExt;
  onNavigate?: (page: string, tab?: number) => void;
}

function IdeaCard({ idea, onNavigate }: IdeaCardProps) {
  const badge = STATUS_BADGE[idea.status];
  const hasLink = idea.status === "done" && idea.link && onNavigate;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-lg">{idea.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white">{idea.title}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${badge.cls}`}>
            {badge.label}
          </span>
          {hasLink && (
            <button
              onClick={() => onNavigate(idea.link!.page, idea.link!.tab)}
              className="ml-auto rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-blue-300 hover:bg-white/20 hover:text-blue-200 transition-colors"
            >
              {idea.link!.hint} →
            </button>
          )}
        </div>
        <p className="mt-0.5 text-sm text-white/60">{idea.description}</p>
      </div>
    </div>
  );
}

import { useRef } from "react";
import { IDEAS } from "@/data/ideas";
import type { IdeaItemExt } from "@/data/ideas";
import { exportToJson, readJsonFile } from "@/lib/export";
import type { WeddingState } from "@/types/wedding";

interface IdeasPanelProps {
  state: WeddingState;
  onSetState: (fn: (prev: WeddingState) => WeddingState) => void;
}

const STATUS_BADGE: Record<IdeaItemExt["status"], { label: string; cls: string }> = {
  done: { label: "Da xong", cls: "bg-green-500/20 text-green-300 border-green-500/30" },
  planned: { label: "Sap toi", cls: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
  future: { label: "Tuong lai", cls: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

export function IdeasPanel({ state, onSetState }: IdeasPanelProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => exportToJson(state);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJsonFile(file);
      onSetState(() => data);
    } catch {
      alert("File khong hop le!");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const grouped = {
    done: IDEAS.filter((i) => i.status === "done"),
    planned: IDEAS.filter((i) => i.status === "planned"),
    future: IDEAS.filter((i) => i.status === "future"),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Export/Import Section */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 text-base font-bold text-white">📜 Luu Tru Du Lieu</h2>
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
          <p className="mt-2 text-xs text-white/50">
            Export toan bo du lieu cuoi de backup, hoac import lai tu file JSON.
          </p>
        </div>

        {/* Ideas List */}
        <h2 className="text-xl font-bold text-white">
          💡 Tinh Nang & Y Tuong
        </h2>

        {/* Done section */}
        {grouped.done.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-green-400">✅ Da hoan thanh</h3>
            {grouped.done.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </div>
        )}

        {/* Planned section */}
        {grouped.planned.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-amber-400">🔜 Sap toi</h3>
            {grouped.planned.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </div>
        )}

        {/* Future section */}
        {grouped.future.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-400">🔮 Tuong lai</h3>
            {grouped.future.map((idea, i) => (
              <IdeaCard key={i} idea={idea} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <h2 className="mb-1 text-base font-bold text-white">🚀 Muon tinh nang nao?</h2>
          <p className="text-sm text-white/65">
            Hay dung tab <b className="text-white/85">🤖 AI</b> de hoi chi tiet ve bat ky y tuong nao o tren!
          </p>
        </div>
      </div>
    </div>
  );
}

function IdeaCard({ idea }: { idea: IdeaItemExt }) {
  const badge = STATUS_BADGE[idea.status];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-lg">{idea.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{idea.title}</span>
          <span className={`rounded-full border px-2 py-0.5 text-[0.65rem] font-medium ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-white/60">{idea.desc}</p>
      </div>
    </div>
  );
}

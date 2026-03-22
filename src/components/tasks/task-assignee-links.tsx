import { useState, useEffect } from "react";
import QRCode from "qrcode";
import type { TaskData } from "@/lib/task-api";
import { t } from "@/lib/i18n";

interface TaskAssigneeLinksProps {
  tasks: TaskData[];
  lang?: string;
}

interface AssigneeEntry {
  name: string;
  token: string | null;
  count: number;
}

function getAssignees(tasks: TaskData[]): AssigneeEntry[] {
  const map = new Map<string, AssigneeEntry>();
  for (const task of tasks) {
    if (!task.assigneeName) continue;
    const key = task.assigneeName;
    if (!map.has(key)) map.set(key, { name: key, token: task.assigneeToken, count: 0 });
    map.get(key)!.count++;
    if (task.assigneeToken && !map.get(key)!.token) map.get(key)!.token = task.assigneeToken;
  }
  return [...map.values()];
}

function QrModal({ name, link, onClose }: { name: string; link: string; onClose: () => void }) {
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL(link, { width: 240, margin: 2 }).then(setQrUrl).catch(() => {});
  }, [link]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 max-w-xs w-full mx-4 space-y-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{t("Mã QR", "vi")} — {name}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        {qrUrl && <img src={qrUrl} alt="QR" className="w-full rounded-lg" />}
        <p className="text-xs text-gray-400 break-all">{link}</p>
      </div>
    </div>
  );
}

export function TaskAssigneeLinks({ tasks, lang = "vi" }: TaskAssigneeLinksProps) {
  const assignees = getAssignees(tasks);
  const [copied, setCopied] = useState<string | null>(null);
  const [qrTarget, setQrTarget] = useState<AssigneeEntry | null>(null);

  async function handleCopy(token: string) {
    const link = `${window.location.origin}/tasks/${token}`;
    try { await navigator.clipboard.writeText(link); } catch { /* ignore */ }
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  if (assignees.length === 0) {
    return <p className="text-xs text-gray-400 text-center py-4">{t("Chưa có công việc", lang)}</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 uppercase">{t("Tạo link cho thành viên", lang)}</p>
      {assignees.map((a) => {
        const link = a.token ? `${window.location.origin}/tasks/${a.token}` : null;
        return (
          <div key={a.name} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800">{a.name}</p>
              <p className="text-xs text-gray-500">{a.count} công việc</p>
              {link && <p className="text-xs text-blue-500 truncate">{link}</p>}
            </div>
            {a.token && (
              <>
                <button type="button" onClick={() => handleCopy(a.token!)}
                  className="text-xs px-2 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 shrink-0">
                  {copied === a.token ? "✓" : t("Sao chép", lang)}
                </button>
                <button type="button" onClick={() => setQrTarget(a)}
                  className="text-xs px-2 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 shrink-0">
                  {t("Mã QR", lang)}
                </button>
              </>
            )}
            {!a.token && (
              <span className="text-xs text-gray-400 italic">Chưa có token</span>
            )}
          </div>
        );
      })}
      {qrTarget?.token && (
        <QrModal
          name={qrTarget.name}
          link={`${window.location.origin}/tasks/${qrTarget.token}`}
          onClose={() => setQrTarget(null)}
        />
      )}
    </div>
  );
}

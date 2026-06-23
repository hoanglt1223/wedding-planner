import { useState } from "react";
import type { QuickNote, QuickNoteColor } from "@/types/wedding";

const NOTE_COLORS: { key: QuickNoteColor; bg: string; border: string; dot: string }[] = [
  { key: "yellow", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400" },
  { key: "blue", bg: "bg-blue-50", border: "border-blue-200", dot: "bg-blue-400" },
  { key: "green", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-400" },
  { key: "pink", bg: "bg-pink-50", border: "border-pink-200", dot: "bg-pink-400" },
  { key: "purple", bg: "bg-purple-50", border: "border-purple-200", dot: "bg-purple-400" },
];

function getColorConfig(color: QuickNoteColor) {
  return NOTE_COLORS.find((c) => c.key === color) || NOTE_COLORS[0];
}

interface QuickNotesWidgetProps {
  notes: QuickNote[];
  onAdd: (text: string, color: QuickNoteColor) => void;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  lang?: string;
}

export function QuickNotesWidget({ notes, onAdd, onToggle, onRemove, lang = "vi" }: QuickNotesWidgetProps) {
  const en = lang === "en";
  const [expanded, setExpanded] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState<QuickNoteColor>("yellow");

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  const activeCount = notes.filter((n) => !n.done).length;

  function handleAdd() {
    const text = newText.trim();
    if (!text) return;
    onAdd(text, newColor);
    setNewText("");
    setShowAdd(false);
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-4 text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <div>
            <h3 className="text-sm font-semibold">
              {en ? "Quick Notes" : "Ghi Chú Nhanh"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {notes.length > 0
                ? en
                  ? `${activeCount} active`
                  : `${activeCount} đang ghi`
                : en
                  ? "No notes yet"
                  : "Chưa có ghi chú"}
            </p>
          </div>
        </div>
        <span className="text-muted-foreground text-sm">{expanded ? "▲" : "▼"}</span>
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Add button */}
          {!showAdd && (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full text-xs text-[var(--theme-primary)] hover:underline py-1"
            >
              + {en ? "Add note" : "Thêm ghi chú"}
            </button>
          )}

          {/* Add form */}
          {showAdd && (
            <div className="space-y-2 p-2 rounded-lg bg-[var(--theme-surface-muted)] border border-[var(--theme-border)]">
              <textarea
                className="w-full text-sm p-2 rounded border border-[var(--theme-border)] bg-background resize-none"
                rows={2}
                placeholder={en ? "Write a note..." : "Viết ghi chú..."}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setNewColor(c.key)}
                      className={`w-5 h-5 rounded-full ${c.dot} transition-transform ${
                        newColor === c.key ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""
                      }`}
                      title={c.key}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAdd(false); setNewText(""); }}
                    className="text-xs px-2 py-1 text-muted-foreground hover:text-foreground"
                  >
                    {en ? "Cancel" : "Hủy"}
                  </button>
                  <button
                    onClick={handleAdd}
                    className="text-xs px-3 py-1 bg-[var(--theme-primary)] text-white rounded hover:opacity-90"
                  >
                    {en ? "Add" : "Thêm"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes list */}
          {sortedNotes.length > 0 ? (
            <div className="space-y-1.5">
              {sortedNotes.map((note) => {
                const colors = getColorConfig(note.color);
                return (
                  <div
                    key={note.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border ${colors.bg} ${colors.border} transition-opacity ${
                      note.done ? "opacity-50" : ""
                    }`}
                  >
                    <button
                      onClick={() => onToggle(note.id)}
                      className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                        note.done
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {note.done && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <p className={`flex-1 text-sm leading-snug ${note.done ? "line-through text-muted-foreground" : ""}`}>
                      {note.text}
                    </p>
                    <button
                      onClick={() => onRemove(note.id)}
                      className="text-xs text-red-400 hover:text-red-600 shrink-0 px-1"
                      title={en ? "Delete" : "Xóa"}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                {en ? "Tap + to add a quick note" : "Nhấn + để thêm ghi chú nhanh"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

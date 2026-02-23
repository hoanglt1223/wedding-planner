import { t } from "@/lib/i18n";

interface NotesPanelProps {
  notes: string;
  onSetNotes: (notes: string) => void;
  lang?: string;
}

export function NotesPanel({ notes, onSetNotes, lang = "vi" }: NotesPanelProps) {
  const placeholder = lang === "en"
    ? "Write notes here...\n\nExample:\n- Call restaurant ABC for pricing\n- Dress fitting next Saturday\n- Confirm MC before Nov 15"
    : "Viết ghi chú ở đây...\n\nVí dụ:\n- Gọi nhà hàng ABC hỏi giá\n- Thử váy thứ 7 tuần sau\n- Xác nhận MC trước 15/11";

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4">
      <div className="pb-2">
        <h2 className="text-base font-semibold">{t("📝 Ghi Chú Chung", lang)}</h2>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          {lang === "en" ? "Notes, ideas, to-dos for both of you. Auto-saved." : "Ghi chú, ý tưởng, việc cần làm cho cả hai. Tự động lưu."}
        </p>
        {!notes && (
          <div className="flex items-center gap-3 py-4 px-3 rounded-lg bg-muted/50 mb-2">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-sm font-medium">{t("Ghi chú cho ngày cưới...", lang)}</p>
              <p className="text-xs text-muted-foreground">{lang === "en" ? "To-dos, ideas, contacts..." : "Việc cần làm, ý tưởng, liên hệ..."}</p>
            </div>
          </div>
        )}
        <textarea
          className="w-full min-h-[300px] border border-gray-300 rounded-lg p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder={placeholder}
          value={notes}
          onChange={(e) => onSetNotes(e.target.value)}
        />
        <div className="text-right text-2xs text-gray-400">
          {notes.length} {t("ký tự", lang)}
        </div>
      </div>
    </div>
  );
}

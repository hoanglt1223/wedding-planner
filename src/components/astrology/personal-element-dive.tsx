import type { ElementProfile } from "@/data/astrology-element-profiles";

// Reuse color dot map (duplicated to keep file independent)
const COLOR_DOT: Record<string, string> = {
  "Đỏ": "bg-red-500", "Hồng": "bg-pink-400", "Cam": "bg-orange-500",
  "Vàng": "bg-yellow-400", "Vàng nhạt": "bg-yellow-200",
  "Xanh lá": "bg-green-500", "Xanh lục": "bg-emerald-500",
  "Xanh lam": "bg-blue-500", "Xanh dương": "bg-blue-600",
  "Xanh đậm": "bg-blue-900", "Tím": "bg-purple-500",
  "Trắng": "bg-gray-100 border border-gray-300", "Bạc": "bg-gray-300",
  "Đen": "bg-gray-900", "Nâu": "bg-amber-800", "Xám": "bg-gray-400",
};

interface SoundElementInfo {
  name: string;
  element: string;
  emoji: string;
  label: string;
}

interface Props {
  soundElement: SoundElementInfo;
  elementProfile: ElementProfile | undefined;
}

export function ElementDiveSection({ soundElement, elementProfile }: Props) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">🔮 Nạp Âm — {soundElement.name}</h3>

      {/* Nạp Âm summary */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-2xl">{soundElement.emoji}</span>
        <div>
          <div className="font-semibold">{soundElement.name}</div>
          <div className="text-xs text-muted-foreground">Hành {soundElement.label}</div>
        </div>
      </div>

      {!elementProfile ? (
        <p className="text-xs text-muted-foreground">Không có dữ liệu hành {soundElement.label}.</p>
      ) : (
        <>
          {/* Core traits */}
          <div>
            <div className="text-xs font-medium mb-1.5">✨ Tính cách theo hành</div>
            <div className="flex flex-wrap gap-1.5">
              {elementProfile.coreTraits.map((t) => (
                <span key={t} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Marriage traits */}
          <div className="text-xs bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)] rounded-lg p-3">
            <div className="font-medium text-[var(--theme-note-text)] mb-1">💑 Tình cảm &amp; hôn nhân</div>
            <div className="text-muted-foreground">{elementProfile.marriageTraits}</div>
          </div>

          {/* Health tendencies */}
          <div className="text-xs bg-[var(--theme-note-bg)] border border-[var(--theme-note-border)] rounded-lg p-3">
            <div className="font-medium text-[var(--theme-note-text)] mb-1">🏥 Sức khỏe cần chú ý</div>
            <div className="text-muted-foreground">{elementProfile.healthTendencies}</div>
          </div>

          {/* Lucky vs unlucky colors */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-medium text-green-600 mb-1.5">✅ Màu hợp hành</div>
              <div className="flex flex-wrap gap-1">
                {elementProfile.luckyColors.map((c) => (
                  <span key={c} className="flex items-center gap-1 bg-[var(--theme-surface-muted)] px-1.5 py-0.5 rounded-full text-xs">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[c] ?? "bg-gray-300"}`} />
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-medium text-red-500 mb-1.5">⚠️ Màu kị hành</div>
              <div className="flex flex-wrap gap-1">
                {elementProfile.unluckyColors.map((c) => (
                  <span key={c} className="flex items-center gap-1 bg-[var(--theme-surface-muted)] px-1.5 py-0.5 rounded-full text-xs opacity-60">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${COLOR_DOT[c] ?? "bg-gray-300"}`} />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

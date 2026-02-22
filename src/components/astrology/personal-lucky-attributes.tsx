import type { ZodiacProfile } from "@/data/astrology-zodiac-profiles";
import type { ElementProfile } from "@/data/astrology-element-profiles";

// Map color names to approximate Tailwind bg classes for dots
const COLOR_DOT: Record<string, string> = {
  "Đỏ": "bg-red-500", "Hồng": "bg-pink-400", "Cam": "bg-orange-500",
  "Vàng": "bg-yellow-400", "Vàng kim": "bg-yellow-500", "Vàng nhạt": "bg-yellow-200",
  "Xanh lá": "bg-green-500", "Xanh lục": "bg-emerald-500", "Xanh lam": "bg-blue-500",
  "Xanh dương": "bg-blue-600", "Xanh đậm": "bg-blue-900", "Tím": "bg-purple-500",
  "Trắng": "bg-gray-100 border border-gray-300", "Bạc": "bg-gray-300",
  "Đen": "bg-gray-900", "Nâu": "bg-amber-800", "Be": "bg-amber-100",
  "Xám": "bg-gray-400",
};

interface Props {
  profile: ZodiacProfile;
  elementProfile: ElementProfile | undefined;
}

export function LuckyAttributesSection({ profile, elementProfile }: Props) {
  // Merge lucky colors from zodiac + element, deduplicate
  const allColors = [...new Set([...profile.luckyColors, ...(elementProfile?.luckyColors ?? [])])];
  const allNumbers = [...new Set([...profile.luckyNumbers, ...(elementProfile?.luckyNumbers ?? [])])].sort((a, b) => a - b);
  const allDirections = [...new Set([...profile.luckyDirections, ...(elementProfile?.luckyDirections ?? [])])];

  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">🍀 Thuộc Tính May Mắn</h3>

      {/* Lucky numbers */}
      <div>
        <div className="text-xs font-medium mb-1.5">🔢 Số may mắn</div>
        <div className="flex flex-wrap gap-1.5">
          {allNumbers.map((n) => (
            <span key={n} className="bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full text-xs">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Lucky colors */}
      <div>
        <div className="text-xs font-medium mb-1.5">🎨 Màu sắc may mắn</div>
        <div className="flex flex-wrap gap-1.5">
          {allColors.map((c) => (
            <span key={c} className="flex items-center gap-1 bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${COLOR_DOT[c] ?? "bg-gray-300"}`} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Lucky directions */}
      <div>
        <div className="text-xs font-medium mb-1.5">🧭 Hướng may mắn</div>
        <div className="flex flex-wrap gap-1.5">
          {allDirections.map((d) => (
            <span key={d} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Compatible signs */}
      <div>
        <div className="text-xs font-medium mb-1.5">💞 Tuổi hợp</div>
        <div className="flex flex-wrap gap-1.5">
          {profile.compatibleSigns.map((s) => (
            <span key={s} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Careers */}
      <div>
        <div className="text-xs font-medium mb-1.5">💼 Nghề nghiệp phù hợp</div>
        <div className="flex flex-wrap gap-1.5">
          {profile.careers.map((c) => (
            <span key={c} className="bg-[var(--theme-surface-muted)] px-2 py-0.5 rounded-full text-xs">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

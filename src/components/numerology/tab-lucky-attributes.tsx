import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcFullProfile } from "@/lib/numerology";
import { getNumerologyProfile } from "@/data/numerology-profiles";
import { ToggleBtn } from "./toggle-btn";

interface TabLuckyAttributesProps {
  info: CoupleInfo;
  fullNames: { bride: string; groom: string };
}

const COLOR_SWATCHES: Record<string, string> = {
  "Đỏ": "bg-red-500", "Vàng": "bg-yellow-400", "Cam": "bg-orange-500",
  "Trắng": "bg-white border border-gray-300", "Xanh dương": "bg-blue-500", "Bạc": "bg-gray-300",
  "Tím": "bg-purple-500", "Hồng": "bg-pink-400", "Xanh lá": "bg-green-500",
  "Nâu": "bg-amber-800", "Xanh navy": "bg-blue-900", "Xanh ngọc": "bg-teal-500",
  "Đỏ đậm": "bg-red-800", "Đen": "bg-gray-900", "Vàng gold": "bg-yellow-600",
  "Xanh biển đậm": "bg-blue-800", "Trắng kem": "bg-amber-50 border border-amber-200",
  "Tím lavender": "bg-purple-300", "Xanh pastel": "bg-blue-200",
  "Vàng đồng": "bg-amber-500", "Xanh ngọc lục": "bg-emerald-500",
};

export function TabLuckyAttributes({ info, fullNames }: TabLuckyAttributesProps) {
  const [active, setActive] = useState<"bride" | "groom">("bride");

  const birthDate = active === "bride" ? info.brideBirthDate : info.groomBirthDate;
  const fullName = active === "bride" ? (fullNames.bride || info.bride || "") : (fullNames.groom || info.groom || "");

  const profile = useMemo(() => calcFullProfile(birthDate, fullName), [birthDate, fullName]);
  const numProfile = useMemo(() => getNumerologyProfile(profile.lifePath), [profile.lifePath]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <ToggleBtn active={active === "bride"} onClick={() => setActive("bride")}
          label={fullNames.bride || info.bride || "Cô dâu"} />
        <ToggleBtn active={active === "groom"} onClick={() => setActive("groom")}
          label={fullNames.groom || info.groom || "Chú rể"} />
      </div>

      {/* Lucky Numbers */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">🔢 Con số may mắn</h4>
        <div className="flex gap-2 flex-wrap">
          {numProfile.luckyNumbers.map((n) => (
            <span key={n} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-sm">
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* Lucky Colors */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">🎨 Màu sắc may mắn</h4>
        <div className="flex gap-3 flex-wrap">
          {numProfile.luckyColors.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full shadow-sm ${COLOR_SWATCHES[color] ?? "bg-gray-400"}`} />
              <span className="text-sm">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Career directions */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">💼 Hướng nghề nghiệp</h4>
        <div className="flex flex-wrap gap-1.5">
          {numProfile.careers.map((c) => (
            <span key={c} className="px-2 py-0.5 rounded-full bg-muted text-xs">{c}</span>
          ))}
        </div>
      </div>

      {/* Wedding advice */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-2">
        <h4 className="text-sm font-bold">💍 Lời khuyên đám cưới</h4>
        <p className="text-sm text-muted-foreground">{numProfile.weddingAdvice}</p>
      </div>
    </div>
  );
}

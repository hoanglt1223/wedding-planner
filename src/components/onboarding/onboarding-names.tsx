import { t } from "@/lib/i18n";

interface OnboardingNamesProps {
  lang: string;
  bride: string;
  groom: string;
  brideBirthDate: string;
  groomBirthDate: string;
  inputCls: string;
  onBride: (v: string) => void;
  onGroom: (v: string) => void;
  onBrideBirthDate: (v: string) => void;
  onGroomBirthDate: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingNames(p: OnboardingNamesProps) {
  const { lang, inputCls } = p;
  const en = lang === "en";
  const canContinue = !!(p.bride.trim() && p.groom.trim());
  const opt = <span className="text-[#8a7060] font-normal">({en ? "opt." : "tùy chọn"})</span>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#5a3e2e] text-center">
        {en ? "Who's getting married?" : "Ai là người kết hôn?"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">{t("Tên cô dâu", lang)}</label>
          <input type="text" value={p.bride} onChange={(e) => p.onBride(e.target.value)}
            placeholder={en ? "Emily..." : "Nguyễn Thị..."} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">{t("Tên chú rể", lang)}</label>
          <input type="text" value={p.groom} onChange={(e) => p.onGroom(e.target.value)}
            placeholder={en ? "David..." : "Trần Văn..."} className={inputCls} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
              {en ? "Bride birthday" : "Sinh nhật cô dâu"} {opt}
            </label>
            <input type="date" value={p.brideBirthDate} onChange={(e) => p.onBrideBirthDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
              {en ? "Groom birthday" : "Sinh nhật chú rể"} {opt}
            </label>
            <input type="date" value={p.groomBirthDate} onChange={(e) => p.onGroomBirthDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <p className="text-[11px] text-[#8a7060] text-center leading-tight">
          {en
            ? "🔮 Unlocks Astrology (Five Elements, Tam Tai) & Numerology (Life Path, compatibility, lucky wedding dates)"
            : "🔮 Mở khóa Tử Vi (Ngũ Hành, Tam Tai, Kim Lâu) & Thần Số Học (Số Chủ Đạo, tương hợp, ngày cưới may mắn)"}
        </p>
      </div>

      <div className="flex gap-2">
        <button onClick={p.onBack}
          className="h-11 px-5 text-sm font-medium text-[#5a3e2e] border border-[var(--brand-border)] rounded-full hover:bg-[var(--brand)]/10 transition-colors">
          {t("← Quay Lại", lang)}
        </button>
        <button onClick={p.onNext} disabled={!canContinue}
          className="flex-1 h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          {t("Tiếp Tục →", lang)}
        </button>
      </div>
    </div>
  );
}

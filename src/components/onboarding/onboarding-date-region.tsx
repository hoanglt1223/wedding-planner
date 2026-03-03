import { t } from "@/lib/i18n";
import { DateInput } from "@/components/ui/date-input";
import type { Region } from "@/types/wedding";

const REGIONS: { id: Region; vi: string; en: string }[] = [
  { id: "north", vi: "Miền Bắc", en: "Northern" },
  { id: "central", vi: "Miền Trung", en: "Central" },
  { id: "south", vi: "Miền Nam", en: "Southern" },
];

interface OnboardingDateRegionProps {
  lang: string;
  date: string;
  engagementDate: string;
  region: Region;
  partyTime: "noon" | "afternoon";
  inputCls: string;
  onDate: (v: string) => void;
  onEngagementDate: (v: string) => void;
  onRegion: (v: Region) => void;
  onPartyTime: (v: "noon" | "afternoon") => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingDateRegion(p: OnboardingDateRegionProps) {
  const { lang, inputCls } = p;
  const en = lang === "en";
  const opt = <span className="text-[#8a7060] font-normal">({en ? "opt." : "tùy chọn"})</span>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#5a3e2e] text-center">
        {en ? "When and where?" : "Khi nào và ở đâu?"}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {en ? "Wedding date" : "Ngày cưới"} {opt}
          </label>
          <DateInput value={p.date} onChange={p.onDate} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
            {en ? "Engagement date" : "Ngày đám hỏi"} {opt}
          </label>
          <DateInput value={p.engagementDate} onChange={p.onEngagementDate} className={inputCls} />
        </div>
      </div>

      {/* Region */}
      <div>
        <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
          {en ? "Region" : "Miền"}
        </label>
        <div className="flex gap-2">
          {REGIONS.map((r) => (
            <button key={r.id} type="button" onClick={() => p.onRegion(r.id)}
              className={`flex-1 h-9 text-sm font-medium rounded-lg border transition-colors ${
                p.region === r.id
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
              }`}>
              {en ? r.en : r.vi}
            </button>
          ))}
        </div>
      </div>

      {/* Party time */}
      <div>
        <label className="block text-xs font-medium text-[#5a3e2e] mb-1">
          {en ? "Party time" : "Giờ tiệc"}
        </label>
        <div className="flex gap-2">
          {(["noon", "afternoon"] as const).map((pt) => (
            <button key={pt} type="button" onClick={() => p.onPartyTime(pt)}
              className={`flex-1 h-9 text-sm font-medium rounded-lg border transition-colors ${
                p.partyTime === pt
                  ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                  : "bg-white text-[#5a3e2e] border-[var(--brand-border)] hover:bg-[var(--brand)]/10"
              }`}>
              {pt === "noon" ? (en ? "Noon" : "Buổi trưa") : (en ? "Evening" : "Buổi chiều")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={p.onBack}
          className="h-11 px-5 text-sm font-medium text-[#5a3e2e] border border-[var(--brand-border)] rounded-full hover:bg-[var(--brand)]/10 transition-colors">
          {t("← Quay Lại", lang)}
        </button>
        <button onClick={p.onNext}
          className="flex-1 h-11 text-sm font-semibold text-white bg-[var(--brand)] rounded-full hover:bg-[var(--brand-dark)] transition-colors">
          {t("Tiếp Tục →", lang)}
        </button>
      </div>
    </div>
  );
}

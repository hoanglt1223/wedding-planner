import { useState } from "react";
import { t } from "@/lib/i18n";
import { DateInput } from "@/components/ui/date-input";
import type { CoupleInfo } from "@/types/wedding";

const BIRTH_HOURS_VI = [
  { value: 0, label: "Giờ Tý (23h-1h)" },
  { value: 2, label: "Giờ Sửu (1h-3h)" },
  { value: 4, label: "Giờ Dần (3h-5h)" },
  { value: 6, label: "Giờ Mão (5h-7h)" },
  { value: 8, label: "Giờ Thìn (7h-9h)" },
  { value: 10, label: "Giờ Tỵ (9h-11h)" },
  { value: 12, label: "Giờ Ngọ (11h-13h)" },
  { value: 14, label: "Giờ Mùi (13h-15h)" },
  { value: 16, label: "Giờ Thân (15h-17h)" },
  { value: 18, label: "Giờ Dậu (17h-19h)" },
  { value: 20, label: "Giờ Tuất (19h-21h)" },
  { value: 22, label: "Giờ Hợi (21h-23h)" },
];

const BIRTH_HOURS_EN = [
  { value: 0, label: "Tý - Rat (23h-1h)" },
  { value: 2, label: "Sửu - Ox (1h-3h)" },
  { value: 4, label: "Dần - Tiger (3h-5h)" },
  { value: 6, label: "Mão - Cat (5h-7h)" },
  { value: 8, label: "Thìn - Dragon (7h-9h)" },
  { value: 10, label: "Tỵ - Snake (9h-11h)" },
  { value: 12, label: "Ngọ - Horse (11h-13h)" },
  { value: 14, label: "Mùi - Goat (13h-15h)" },
  { value: 16, label: "Thân - Monkey (15h-17h)" },
  { value: 18, label: "Dậu - Rooster (17h-19h)" },
  { value: 20, label: "Tuất - Dog (19h-21h)" },
  { value: 22, label: "Hợi - Pig (21h-23h)" },
];

interface BirthInputFormProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string | number | null) => void;
  lang?: string;
}

export function BirthInputForm({ info, onUpdateInfo, lang = "vi" }: BirthInputFormProps) {
  const [showGender, setShowGender] = useState(false);
  const hours = lang === "en" ? BIRTH_HOURS_EN : BIRTH_HOURS_VI;

  return (
    <div className="space-y-2">
      {/* Bride column */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground block">
          {t("Ngày sinh Cô dâu", lang)}
          {info.bride && <span className="font-normal ml-1">({info.bride})</span>}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <DateInput
            value={info.brideBirthDate || ""}
            onChange={(v) => onUpdateInfo("brideBirthDate", v)}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={info.brideBirthHour ?? ""}
            onChange={(e) =>
              onUpdateInfo("brideBirthHour", e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{t("Không biết", lang)}</option>
            {hours.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Groom column */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground block">
          {t("Ngày sinh Chú rể", lang)}
          {info.groom && <span className="font-normal ml-1">({info.groom})</span>}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <DateInput
            value={info.groomBirthDate || ""}
            onChange={(v) => onUpdateInfo("groomBirthDate", v)}
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select
            value={info.groomBirthHour ?? ""}
            onChange={(e) =>
              onUpdateInfo("groomBirthHour", e.target.value === "" ? null : Number(e.target.value))
            }
            className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">{t("Không biết", lang)}</option>
            {hours.map((h) => (
              <option key={h.value} value={h.value}>
                {h.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gender toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowGender((v) => !v)}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {showGender ? t("Ẩn giới tính", lang) : t("Đổi giới tính (nếu cần)", lang)}
        </button>
        {showGender && (
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-0.5">
                {t("Giới tính Cô dâu", lang)}
              </label>
              <select
                value={info.brideGender || "female"}
                onChange={(e) => onUpdateInfo("brideGender", e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="female">{t("Nữ", lang)}</option>
                <option value="male">{t("Nam", lang)}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-0.5">
                {t("Giới tính Chú rể", lang)}
              </label>
              <select
                value={info.groomGender || "male"}
                onChange={(e) => onUpdateInfo("groomGender", e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="male">{t("Nam", lang)}</option>
                <option value="female">{t("Nữ", lang)}</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

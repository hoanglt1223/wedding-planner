import { useState } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { getZodiac, getSoundElement, getStemBranch } from "@/lib/astrology";
import { getZodiacProfiles, getElementProfiles, getYearlyForecasts } from "@/data/resolve-data";
import { PersonalitySection } from "./personal-personality";
import { YearlyForecastSection } from "./personal-yearly-forecast";
import { LuckyAttributesSection } from "./personal-lucky-attributes";
import { ElementDiveSection } from "./personal-element-dive";
import { AiReadingCard } from "./ai-reading-card";

interface TabPersonalProps {
  info: CoupleInfo;
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
  brideGender?: string;
  groomGender?: string;
  lang?: string;
}

export function TabPersonal({ info, brideYear, groomYear, brideName, groomName, lang = "vi" }: TabPersonalProps) {
  const [activeProfile, setActiveProfile] = useState<"bride" | "groom">("bride");

  const year = activeProfile === "bride" ? brideYear : groomYear;
  const name = activeProfile === "bride" ? (brideName || (lang === "en" ? "Bride" : "Cô dâu")) : (groomName || (lang === "en" ? "Groom" : "Chú rể"));
  const birthHour = activeProfile === "bride" ? info.brideBirthHour : info.groomBirthHour;

  const zodiac = getZodiac(year);
  const soundElement = getSoundElement(year);
  const stemBranch = getStemBranch(year);
  const zodiacProfiles = getZodiacProfiles(lang);
  const elementProfiles = getElementProfiles(lang);
  const yearlyForecasts = getYearlyForecasts(lang);
  const profile = zodiacProfiles[zodiac.chiIndex];
  const elementProfile = elementProfiles.find((e) => e.key === soundElement.element) || elementProfiles[0];
  const forecast = yearlyForecasts[zodiac.chiIndex];

  return (
    <div className="space-y-3">
      {/* Profile toggle */}
      <div className="flex gap-2">
        <ToggleButton
          active={activeProfile === "bride"}
          onClick={() => setActiveProfile("bride")}
          label={brideName || (lang === "en" ? "Bride" : "Cô dâu")}
        />
        <ToggleButton
          active={activeProfile === "groom"}
          onClick={() => setActiveProfile("groom")}
          label={groomName || (lang === "en" ? "Groom" : "Chú rể")}
        />
      </div>

      {/* Header card */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 text-center">
        <div className="text-4xl mb-1">{zodiac.emoji}</div>
        <div className="text-lg font-bold">{name}</div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {stemBranch} · {zodiac.name} ({zodiac.chi})
        </div>
        <div className="text-sm mt-0.5">
          {soundElement.emoji} {soundElement.name} ({soundElement.label})
        </div>
      </div>

      <PersonalitySection profile={profile} zodiac={zodiac} />
      <YearlyForecastSection forecast={forecast} />
      <LuckyAttributesSection profile={profile} elementProfile={elementProfile} />
      <ElementDiveSection soundElement={soundElement} elementProfile={elementProfile} />

      <AiReadingCard
        birthDate={activeProfile === "bride" ? info.brideBirthDate : info.groomBirthDate}
        birthHour={birthHour}
        gender={activeProfile === "bride" ? info.brideGender : info.groomGender}
        currentYear={new Date().getFullYear()}
        lang={lang}
      />
    </div>
  );
}

function ToggleButton({
  active, onClick, label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

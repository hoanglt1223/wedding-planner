import { Card, CardContent } from "@/components/ui/card";
import {
  getStemBranch, getZodiac, getSoundElement, getElementRelation,
  isSixHarmony, isSixConflict, isSixHarm, isThreeHarmony, getThreeHarmonyGroup,
  ELEMENT_LABEL,
  type CompatType,
} from "@/lib/astrology";
import { ZodiacShareButton } from "./zodiac-share-card";

interface TabCompatibilityProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

const COMPAT_STYLE: Record<CompatType, { bg: string; border: string; text: string; icon: string }> = {
  "generating": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "💚" },
  "neutral": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "💙" },
  "overcoming": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: "💔" },
};

export function TabCompatibility({ brideYear, groomYear, brideName, groomName }: TabCompatibilityProps) {
  const brideSoundElement = getSoundElement(brideYear);
  const groomSoundElement = getSoundElement(groomYear);
  const brideZ = getZodiac(brideYear);
  const groomZ = getZodiac(groomYear);
  const rel = getElementRelation(brideSoundElement.element, groomSoundElement.element);
  const style = COMPAT_STYLE[rel.type];

  const sixHarmony = isSixHarmony(brideYear, groomYear);
  const sixConflict = isSixConflict(brideYear, groomYear);
  const sixHarm = isSixHarm(brideYear, groomYear);
  const threeHarmony = isThreeHarmony(brideYear, groomYear);

  // Score calculation (0-100)
  let score = 50;
  if (rel.type === "generating") score += 25;
  if (rel.type === "neutral") score += 15;
  if (rel.type === "overcoming") score -= 20;
  if (threeHarmony) score += 15;
  if (sixHarmony) score += 20;
  if (sixConflict) score -= 25;
  if (sixHarm) score -= 15;
  score = Math.max(0, Math.min(100, score));

  return (
    <div className="space-y-3">
      {/* Person Cards */}
      <div className="grid grid-cols-2 gap-3">
        <PersonMini label="Cô dâu" name={brideName} year={brideYear} />
        <PersonMini label="Chú rể" name={groomName} year={groomYear} />
      </div>

      {/* Main compatibility result */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className={`rounded-lg p-4 ${style.bg} ${style.border} border text-center space-y-2`}>
            <div className="text-3xl">{style.icon}</div>
            <div className={`text-xl font-bold ${style.text}`}>{rel.label}</div>
            <div className="text-sm text-gray-600">{rel.desc}</div>
            <div className="flex justify-center gap-4 text-sm">
              <span>{brideSoundElement.emoji} {ELEMENT_LABEL[brideSoundElement.element]}</span>
              <span className="text-gray-400">×</span>
              <span>{groomSoundElement.emoji} {ELEMENT_LABEL[groomSoundElement.element]}</span>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Điểm hợp tuổi tổng hợp</span>
              <span className={`font-bold ${score >= 60 ? "text-green-600" : score >= 40 ? "text-amber-600" : "text-red-600"}`}>
                {score}/100
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${score >= 60 ? "bg-green-500" : score >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share button */}
      <ZodiacShareButton
        brideYear={brideYear} groomYear={groomYear}
        brideName={brideName} groomName={groomName}
        score={score} relationType={rel.type}
      />

      {/* Chi relationships */}
      <Card>
        <CardContent className="pt-4 pb-3 space-y-2">
          <h3 className="text-sm font-bold">Quan hệ địa chi ({brideZ.chi} — {groomZ.chi})</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <ChiTag label="Tam Hợp" active={threeHarmony} good desc="Bộ ba tương hợp" />
            <ChiTag label="Lục Hợp" active={sixHarmony} good desc="Cặp tương hợp hoàn hảo" />
            <ChiTag label="Lục Xung" active={sixConflict} good={false} desc="Đối xung, bất hòa" />
            <ChiTag label="Lục Hại" active={sixHarm} good={false} desc="Tương hại, gây bất lợi" />
          </div>
        </CardContent>
      </Card>

      {/* Tam Hợp group */}
      <Card>
        <CardContent className="pt-4 pb-3 space-y-2">
          <h3 className="text-sm font-bold">Nhóm Tam Hợp</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-pink-50 rounded-lg p-2">
              <div className="text-gray-500 mb-1">{brideName || "Cô dâu"} ({brideZ.chi})</div>
              {getThreeHarmonyGroup(brideYear).map((s) => <div key={s}>{s}</div>)}
            </div>
            <div className="bg-sky-50 rounded-lg p-2">
              <div className="text-gray-500 mb-1">{groomName || "Chú rể"} ({groomZ.chi})</div>
              {getThreeHarmonyGroup(groomYear).map((s) => <div key={s}>{s}</div>)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PersonMini({ label, name, year }: { label: string; name: string; year: number }) {
  const stemBranch = getStemBranch(year);
  const z = getZodiac(year);
  const soundElement = getSoundElement(year);
  return (
    <Card>
      <CardContent className="pt-3 pb-2 px-3 text-center space-y-1">
        <div className="text-xs text-gray-500 font-semibold">{label}</div>
        <div className="text-sm font-bold">{name || "—"}</div>
        <div className="text-3xl">{z.emoji}</div>
        <div className="text-xs">{stemBranch}</div>
        <div className="text-xs text-gray-500">{z.name} ({z.chi})</div>
        <div className="text-xs">{soundElement.name}</div>
        <div className={`text-sm font-bold ${soundElement.color}`}>{soundElement.emoji} {ELEMENT_LABEL[soundElement.element]}</div>
      </CardContent>
    </Card>
  );
}

function ChiTag({ label, active, good, desc }: { label: string; active: boolean; good: boolean; desc: string }) {
  if (!active) return (
    <div className="rounded-lg bg-gray-50 p-2 opacity-50">
      <div className="font-medium text-gray-400">{label}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
  return (
    <div className={`rounded-lg p-2 border ${good ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
      <div className={`font-medium ${good ? "text-green-700" : "text-red-700"}`}>
        {good ? "✅" : "⚠️"} {label}
      </div>
      <div className="text-xs text-gray-600">{desc}</div>
    </div>
  );
}

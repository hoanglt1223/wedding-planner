import { Card, CardContent } from "@/components/ui/card";
import {
  getSoundElement, getElementRelation, getGeneratingElement,
  ELEMENT_EMOJI, ELEMENT_TEXT_CLASS, ELEMENT_BG_CLASS, ELEMENT_LABEL, OVERCOMING_CYCLE,
} from "@/lib/astrology";
import { ELEMENT_COLORS, ELEMENT_NUMBERS, ELEMENT_SEASONS, ELEMENT_GENERATING_ME } from "@/lib/astrology-feng-shui";

interface TabFiveElementsProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

const ELEMENT_LIST = ["metal", "wood", "water", "fire", "earth"];

export function TabFiveElements({ brideYear, groomYear, brideName, groomName }: TabFiveElementsProps) {
  const brideSoundElement = getSoundElement(brideYear);
  const groomSoundElement = getSoundElement(groomYear);

  return (
    <div className="space-y-3">
      {/* Ngũ Hành cycle diagram */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-3 text-center">Vòng Tương Sinh — Tương Khắc</h3>
          <div className="grid grid-cols-5 gap-1 text-center text-xs mb-3">
            {ELEMENT_LIST.map((el) => (
              <div key={el} className={`rounded-lg p-2 ${ELEMENT_BG_CLASS[el]} ${brideSoundElement.element === el || groomSoundElement.element === el ? "ring-2 ring-red-400" : ""}`}>
                <div className="text-2xl">{ELEMENT_EMOJI[el]}</div>
                <div className={`font-bold ${ELEMENT_TEXT_CLASS[el]}`}>{ELEMENT_LABEL[el]}</div>
              </div>
            ))}
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-600 font-bold">→ Tương Sinh:</span>
              <span>Kim → Thủy → Mộc → Hỏa → Thổ → Kim</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold">⊗ Tương Khắc:</span>
              <span>Kim ⊗ Mộc ⊗ Thổ ⊗ Thủy ⊗ Hỏa ⊗ Kim</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed element info for both */}
      <div className="grid grid-cols-1 gap-3">
        <ElementDetail label={brideName || "Cô dâu"} year={brideYear} />
        <ElementDetail label={groomName || "Chú rể"} year={groomYear} />
      </div>

      {/* Full Ngũ Hành table */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">Bảng tương quan Ngũ Hành</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-1">Hành</th>
                  <th className="text-left py-1">Sinh</th>
                  <th className="text-left py-1">Khắc</th>
                  <th className="text-left py-1">Bị sinh bởi</th>
                  <th className="text-center py-1">Với cô dâu</th>
                  <th className="text-center py-1">Với chú rể</th>
                </tr>
              </thead>
              <tbody>
                {ELEMENT_LIST.map((el) => {
                  const brideRel = getElementRelation(brideSoundElement.element, el);
                  const groomRel = getElementRelation(groomSoundElement.element, el);
                  return (
                    <tr key={el} className="border-b border-gray-100">
                      <td className={`py-1.5 font-bold ${ELEMENT_TEXT_CLASS[el]}`}>{ELEMENT_EMOJI[el]} {ELEMENT_LABEL[el]}</td>
                      <td className="py-1.5">{ELEMENT_EMOJI[getGeneratingElement(el)!]} {ELEMENT_LABEL[getGeneratingElement(el)!]}</td>
                      <td className="py-1.5">{ELEMENT_EMOJI[OVERCOMING_CYCLE[el]]} {ELEMENT_LABEL[OVERCOMING_CYCLE[el]]}</td>
                      <td className="py-1.5">{ELEMENT_EMOJI[ELEMENT_GENERATING_ME[el]]} {ELEMENT_LABEL[ELEMENT_GENERATING_ME[el]]}</td>
                      <td className="py-1.5 text-center">
                        <RelBadge type={brideRel.type} />
                      </td>
                      <td className="py-1.5 text-center">
                        <RelBadge type={groomRel.type} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ElementDetail({ label, year }: { label: string; year: number }) {
  const na = getSoundElement(year);
  const el = na.element;
  const colors = ELEMENT_COLORS[el];
  const nums = ELEMENT_NUMBERS[el];
  const season = ELEMENT_SEASONS[el];
  const generatingElement = ELEMENT_GENERATING_ME[el]; // element that generates this destiny

  return (
    <Card>
      <CardContent className={`pt-3 pb-2 ${ELEMENT_BG_CLASS[el]}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{na.emoji}</span>
          <div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`font-bold ${na.color}`}>{ELEMENT_LABEL[el]} — {na.name}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoRow label="Hành sinh" value={`${ELEMENT_EMOJI[getGeneratingElement(el)!]} ${ELEMENT_LABEL[getGeneratingElement(el)!]} (tốt cho ${label})`} />
          <InfoRow label="Hành hỗ trợ" value={`${ELEMENT_EMOJI[generatingElement!]} ${ELEMENT_LABEL[generatingElement!]} (sinh ra ${ELEMENT_LABEL[el]})`} />
          <InfoRow label="Hành khắc" value={`${ELEMENT_EMOJI[OVERCOMING_CYCLE[el]]} ${ELEMENT_LABEL[OVERCOMING_CYCLE[el]]} (cần tránh)`} />
          <InfoRow label="Mùa vượng" value={season} />
          <InfoRow label="Số may mắn" value={nums.join(", ")} />
          <div className="col-span-2">
            <span className="text-gray-500">Màu may mắn: </span>
            <span className="inline-flex gap-1 ml-1">
              {colors.hex.map((hex, i) => (
                <span key={hex} className="inline-flex items-center gap-0.5">
                  <span className="w-3 h-3 rounded-full border border-gray-200 inline-block" style={{ background: hex }} />
                  <span>{colors.colors[i]}</span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-500">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function RelBadge({ type }: { type: string }) {
  if (type === "generating") return <span className="text-green-600">✅</span>;
  if (type === "neutral") return <span className="text-blue-600">💙</span>;
  return <span className="text-red-500">⊗</span>;
}

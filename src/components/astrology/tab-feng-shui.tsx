import { Card, CardContent } from "@/components/ui/card";
import { getSoundElement, ELEMENT_EMOJI, ELEMENT_BG_CLASS, ELEMENT_LABEL } from "@/lib/astrology";
import {
  getCungMenh, getLuckyDirections, getUnluckyDirections, isPalaceCompatible,
  ELEMENT_COLORS, ELEMENT_GENERATING_ME, GROUP_LABEL,
} from "@/lib/astrology-feng-shui";

interface TabFengShuiProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

const DIR_EMOJI: Record<string, string> = {
  "Bắc": "⬆️", "Nam": "⬇️", "Đông": "➡️", "Tây": "⬅️",
  "Đông Bắc": "↗️", "Đông Nam": "↘️", "Tây Bắc": "↖️", "Tây Nam": "↙️",
};

export function TabFengShui({ brideYear, groomYear, brideName, groomName }: TabFengShuiProps) {
  const bridePalace = getCungMenh(brideYear, "female");
  const groomPalace = getCungMenh(groomYear, "male");
  const palaceCompatible = isPalaceCompatible(bridePalace, groomPalace);
  const brideLucky = getLuckyDirections(bridePalace);
  const groomLucky = getLuckyDirections(groomPalace);
  const brideSoundElement = getSoundElement(brideYear);
  const groomSoundElement = getSoundElement(groomYear);

  // Find shared lucky directions
  const sharedLucky = brideLucky.filter((d) => groomLucky.includes(d));

  return (
    <div className="space-y-3">
      {/* Cung Mệnh cards */}
      <div className="grid grid-cols-2 gap-3">
        <PalaceCard label={brideName || "Cô dâu"} year={brideYear} gender="female" />
        <PalaceCard label={groomName || "Chú rể"} year={groomYear} gender="male" />
      </div>

      {/* Cung compatibility */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">🏠 Tương hợp Cung Mệnh (Bát Trạch)</h3>
          <div className={`rounded-lg p-3 border text-center ${palaceCompatible ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <div className="text-lg font-bold mb-1">
              {GROUP_LABEL[bridePalace.group]} × {GROUP_LABEL[groomPalace.group]}
            </div>
            <div className={`text-sm ${palaceCompatible ? "text-green-700" : "text-amber-700"}`}>
              {palaceCompatible
                ? "✅ Cùng nhóm trạch — Rất hợp! Dễ chọn hướng nhà chung."
                : "⚠️ Khác nhóm trạch — Cần cân nhắc khi chọn hướng nhà. Ưu tiên hướng của gia chủ (chồng)."}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lucky directions */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">🧭 Hướng tốt — Hướng xấu</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <DirectionList label={brideName || "Cô dâu"} lucky={brideLucky} unlucky={getUnluckyDirections(bridePalace)} />
            <DirectionList label={groomName || "Chú rể"} lucky={groomLucky} unlucky={getUnluckyDirections(groomPalace)} />
          </div>
          {sharedLucky.length > 0 && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
              <div className="font-medium text-green-700 mb-1">Hướng tốt chung cho cả hai:</div>
              <div className="flex gap-2 flex-wrap">
                {sharedLucky.map((d) => (
                  <span key={d} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium">
                    {DIR_EMOJI[d]} {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lucky colors for wedding */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">🎨 Màu sắc phong thủy cho đám cưới</h3>
          <div className="space-y-3">
            <ColorSection label={brideName || "Cô dâu"} element={brideSoundElement.element} />
            <ColorSection label={groomName || "Chú rể"} element={groomSoundElement.element} />
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Nên chọn màu sắc trang trí, thiệp cưới, trang phục phù hợp với mệnh của cả hai.
            Ưu tiên màu của hành sinh ra mệnh ({ELEMENT_EMOJI[ELEMENT_GENERATING_ME[brideSoundElement.element]]} {ELEMENT_LABEL[ELEMENT_GENERATING_ME[brideSoundElement.element]]} cho cô dâu,
            {" "}{ELEMENT_EMOJI[ELEMENT_GENERATING_ME[groomSoundElement.element]]} {ELEMENT_LABEL[ELEMENT_GENERATING_ME[groomSoundElement.element]]} cho chú rể).
          </div>
        </CardContent>
      </Card>

      {/* Feng shui tips */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">💡 Lưu ý phong thủy đám cưới</h3>
          <div className="space-y-2 text-xs text-gray-600">
            <Tip text="Hướng rước dâu nên theo hướng tốt của chú rể (gia chủ)." />
            <Tip text="Bàn thờ gia tiên nên đặt theo hướng tốt nhất của gia chủ." />
            <Tip text="Phòng tân hôn nên ở vị trí hướng tốt, tránh hướng Ngũ Quỷ, Tuyệt Mệnh." />
            <Tip text="Nên chọn giờ Hoàng Đạo để xuất hành rước dâu." />
            <Tip text="Trang trí tiệc cưới nên dùng màu sắc phù hợp với Ngũ Hành của cả hai." />
            <Tip text="Nên tránh các vật trang trí có hình con vật xung với tuổi cô dâu chú rể." />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PalaceCard({ label, year, gender }: { label: string; year: number; gender: "male" | "female" }) {
  const cung = getCungMenh(year, gender);
  return (
    <Card>
      <CardContent className={`pt-3 pb-2 px-3 text-center ${ELEMENT_BG_CLASS[cung.element]}`}>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-lg font-bold mt-1">Cung {cung.name}</div>
        <div className="text-sm text-gray-600">{ELEMENT_EMOJI[cung.element]} {ELEMENT_LABEL[cung.element]} · {cung.direction}</div>
        <div className="text-xs mt-1 text-gray-500">{GROUP_LABEL[cung.group]}</div>
      </CardContent>
    </Card>
  );
}

function DirectionList({ label, lucky, unlucky }: { label: string; lucky: string[]; unlucky: string[] }) {
  return (
    <div className="text-xs space-y-1">
      <div className="font-semibold">{label}</div>
      <div className="space-y-0.5">
        {lucky.map((d) => <div key={d} className="text-green-600">{DIR_EMOJI[d]} {d} ✓</div>)}
        {unlucky.map((d) => <div key={d} className="text-red-400">{DIR_EMOJI[d]} {d} ✗</div>)}
      </div>
    </div>
  );
}

function ColorSection({ label, element }: { label: string; element: string }) {
  const colors = ELEMENT_COLORS[element];
  const generatingElement = ELEMENT_GENERATING_ME[element];
  const sinhColors = ELEMENT_COLORS[generatingElement];
  return (
    <div className="text-xs">
      <span className="font-medium">{label} ({ELEMENT_EMOJI[element]} {ELEMENT_LABEL[element]}): </span>
      <span className="inline-flex gap-1.5 flex-wrap mt-1">
        {colors.hex.map((hex, i) => (
          <span key={hex} className="inline-flex items-center gap-0.5">
            <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: hex }} />
            <span>{colors.colors[i]}</span>
          </span>
        ))}
        {sinhColors.hex.map((hex, i) => (
          <span key={`s-${hex}`} className="inline-flex items-center gap-0.5 opacity-70">
            <span className="w-4 h-4 rounded-full border border-dashed border-gray-300" style={{ background: hex }} />
            <span>{sinhColors.colors[i]}*</span>
          </span>
        ))}
      </span>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return <div className="flex gap-1.5"><span>•</span><span>{text}</span></div>;
}

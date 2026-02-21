import { Card, CardContent } from "@/components/ui/card";
import { getNapAm, getHanhRelation, getSinhHanh, HANH_EMOJI, HANH_COLOR, HANH_BG, KHAC } from "@/lib/tu-vi";
import { HANH_COLORS, HANH_NUMBERS, HANH_SEASONS, HANH_SINH_ME } from "@/lib/tu-vi-phong-thuy";

interface TabNguHanhProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

const HANH_LIST = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"];

export function TabNguHanh({ brideYear, groomYear, brideName, groomName }: TabNguHanhProps) {
  const brideNa = getNapAm(brideYear);
  const groomNa = getNapAm(groomYear);

  return (
    <div className="space-y-3">
      {/* Ngũ Hành cycle diagram */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-3 text-center">Vòng Tương Sinh — Tương Khắc</h3>
          <div className="grid grid-cols-5 gap-1 text-center text-xs mb-3">
            {HANH_LIST.map((h) => (
              <div key={h} className={`rounded-lg p-2 ${HANH_BG[h]} ${brideNa.hanh === h || groomNa.hanh === h ? "ring-2 ring-red-400" : ""}`}>
                <div className="text-2xl">{HANH_EMOJI[h]}</div>
                <div className={`font-bold ${HANH_COLOR[h]}`}>{h}</div>
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
        <HanhDetail label={brideName || "Cô dâu"} year={brideYear} />
        <HanhDetail label={groomName || "Chú rể"} year={groomYear} />
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
                {HANH_LIST.map((h) => {
                  const brideRel = getHanhRelation(brideNa.hanh, h);
                  const groomRel = getHanhRelation(groomNa.hanh, h);
                  return (
                    <tr key={h} className="border-b border-gray-100">
                      <td className={`py-1.5 font-bold ${HANH_COLOR[h]}`}>{HANH_EMOJI[h]} {h}</td>
                      <td className="py-1.5">{HANH_EMOJI[getSinhHanh(h)!]} {getSinhHanh(h)}</td>
                      <td className="py-1.5">{HANH_EMOJI[KHAC[h]]} {KHAC[h]}</td>
                      <td className="py-1.5">{HANH_EMOJI[HANH_SINH_ME[h]]} {HANH_SINH_ME[h]}</td>
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

function HanhDetail({ label, year }: { label: string; year: number }) {
  const na = getNapAm(year);
  const h = na.hanh;
  const colors = HANH_COLORS[h];
  const nums = HANH_NUMBERS[h];
  const season = HANH_SEASONS[h];
  const sinhMe = HANH_SINH_ME[h]; // hành sinh ra mệnh

  return (
    <Card>
      <CardContent className={`pt-3 pb-2 ${HANH_BG[h]}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{na.emoji}</span>
          <div>
            <div className="text-xs text-gray-500">{label}</div>
            <div className={`font-bold ${na.color}`}>{na.hanh} — {na.name}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <InfoRow label="Hành sinh" value={`${HANH_EMOJI[getSinhHanh(h)!]} ${getSinhHanh(h)} (tốt cho ${label})`} />
          <InfoRow label="Hành hỗ trợ" value={`${HANH_EMOJI[sinhMe]} ${sinhMe} (sinh ra ${h})`} />
          <InfoRow label="Hành khắc" value={`${HANH_EMOJI[KHAC[h]]} ${KHAC[h]} (cần tránh)`} />
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
  if (type === "tuong-sinh") return <span className="text-green-600">✅</span>;
  if (type === "binh-hoa") return <span className="text-blue-600">💙</span>;
  return <span className="text-red-500">⊗</span>;
}

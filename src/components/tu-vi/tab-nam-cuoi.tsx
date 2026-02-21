import { Card, CardContent } from "@/components/ui/card";
import {
  getCanChi, getZodiac, getNapAm, isTamTai, isThaiTue, isXungThaiTue,
  getTamTaiYears, getKimLau, HANH_EMOJI,
} from "@/lib/tu-vi";

interface TabNamCuoiProps {
  weddingYear: number;
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

export function TabNamCuoi({ weddingYear, brideYear, groomYear, brideName, groomName }: TabNamCuoiProps) {
  const canChi = getCanChi(weddingYear);
  const zodiac = getZodiac(weddingYear);
  const napAm = getNapAm(weddingYear);

  const brideKL = getKimLau(brideYear, weddingYear);
  const groomKL = getKimLau(groomYear, weddingYear);
  const brideTT = isTamTai(brideYear, weddingYear);
  const groomTT = isTamTai(groomYear, weddingYear);
  const brideTTue = isThaiTue(brideYear, weddingYear);
  const groomTTue = isThaiTue(groomYear, weddingYear);
  const brideXung = isXungThaiTue(brideYear, weddingYear);
  const groomXung = isXungThaiTue(groomYear, weddingYear);

  const warnings: string[] = [];
  if (brideTT) warnings.push(`${brideName || "Cô dâu"} gặp Tam Tai năm ${weddingYear}`);
  if (groomTT) warnings.push(`${groomName || "Chú rể"} gặp Tam Tai năm ${weddingYear}`);
  if (brideTTue) warnings.push(`${brideName || "Cô dâu"} phạm Thái Tuế (trùng tuổi con giáp)`);
  if (groomTTue) warnings.push(`${groomName || "Chú rể"} phạm Thái Tuế (trùng tuổi con giáp)`);
  if (brideXung) warnings.push(`${brideName || "Cô dâu"} xung Thái Tuế (đối xung con giáp)`);
  if (groomXung) warnings.push(`${groomName || "Chú rể"} xung Thái Tuế (đối xung con giáp)`);
  if (brideKL.isKimLau) warnings.push(`${brideName || "Cô dâu"} phạm Kim Lâu: ${brideKL.desc}`);
  if (groomKL.isKimLau) warnings.push(`${groomName || "Chú rể"} phạm Kim Lâu: ${groomKL.desc}`);

  return (
    <div className="space-y-3">
      {/* Wedding year info */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{zodiac.emoji}</span>
            <div>
              <div className="text-lg font-bold">Năm {weddingYear} — {canChi}</div>
              <div className="text-sm text-gray-500">{napAm.name} ({HANH_EMOJI[napAm.hanh]} {napAm.hanh})</div>
              <div className="text-sm text-gray-500">Năm {zodiac.name} ({zodiac.chi})</div>
            </div>
          </div>

          {/* Overall status */}
          {warnings.length === 0 ? (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700">
              ✅ Năm {weddingYear} rất tốt để tổ chức đám cưới! Không có xung khắc lớn.
            </div>
          ) : (
            <div className="space-y-2">
              {warnings.map((w, i) => (
                <div key={i} className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
                  ⚠️ {w}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kim Lâu detail */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">🔒 Kim Lâu (Tuổi cấm cưới)</h3>
          <p className="text-xs text-gray-500 mb-3">
            Dựa trên tuổi mụ (tuổi âm lịch) năm cưới. Vị trí 1, 3, 6, 8 trong chu kỳ 9 năm là Kim Lâu.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <KimLauCard label={brideName || "Cô dâu"} kl={brideKL} />
            <KimLauCard label={groomName || "Chú rể"} kl={groomKL} />
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <div className="font-medium text-gray-600 mb-1">Ý nghĩa các vị trí Kim Lâu:</div>
            <div className="grid grid-cols-2 gap-1">
              <span>• Vị trí 1: Khắc vợ/chồng</span>
              <span>• Vị trí 3: Khắc con cái</span>
              <span>• Vị trí 6: Khắc gia đạo</span>
              <span>• Vị trí 8: Khắc bản thân</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tam Tai timeline */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">🌊 Tam Tai (3 năm hạn)</h3>
          <p className="text-xs text-gray-500 mb-3">
            Mỗi con giáp có 3 năm Tam Tai liên tiếp trong chu kỳ 12 năm. Nên tránh cưới trong năm Tam Tai.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <TamTaiList
              label={brideName || "Cô dâu"}
              birthYear={brideYear}
              weddingYear={weddingYear}
            />
            <TamTaiList
              label={groomName || "Chú rể"}
              birthYear={groomYear}
              weddingYear={weddingYear}
            />
          </div>
        </CardContent>
      </Card>

      {/* Good years suggestion */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <h3 className="text-sm font-bold mb-2">📅 Gợi ý năm cưới tốt</h3>
          <div className="flex flex-wrap gap-2">
            {getGoodYears(brideYear, groomYear, weddingYear).map((y) => (
              <span key={y.year} className={`text-xs px-2 py-1 rounded-full border ${
                y.year === weddingYear ? "bg-red-100 border-red-300 font-bold" : "bg-green-50 border-green-200"
              }`}>
                {y.year} ({getCanChi(y.year)})
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Các năm không có Tam Tai, Thái Tuế, Kim Lâu cho cả hai
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KimLauCard({ label, kl }: { label: string; kl: ReturnType<typeof getKimLau> }) {
  return (
    <div className={`rounded-lg p-3 border text-sm ${kl.isKimLau ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
      <div className="font-medium">{label}</div>
      <div className="text-xs text-gray-500 mt-1">Tuổi mụ: {kl.tuoiMu} (vị trí {kl.pos}/9)</div>
      <div className={`text-xs mt-1 font-medium ${kl.isKimLau ? "text-red-600" : "text-green-600"}`}>
        {kl.isKimLau ? `⚠️ ${kl.desc}` : "✅ Không phạm Kim Lâu"}
      </div>
    </div>
  );
}

function TamTaiList({ label, birthYear, weddingYear }: { label: string; birthYear: number; weddingYear: number }) {
  const years = getTamTaiYears(birthYear, weddingYear - 2, 6);
  return (
    <div className="rounded-lg bg-gray-50 p-2 text-xs">
      <div className="font-semibold text-gray-600 mb-1">{label}</div>
      <div className="space-y-0.5">
        {years.map((y) => (
          <div key={y} className={y === weddingYear ? "text-red-600 font-bold" : "text-gray-500"}>
            {y === weddingYear ? "⚠️" : "•"} {y} ({getCanChi(y)})
          </div>
        ))}
      </div>
    </div>
  );
}

function getGoodYears(brideYear: number, groomYear: number, currentYear: number) {
  const results: { year: number }[] = [];
  for (let y = currentYear - 1; y <= currentYear + 5 && results.length < 8; y++) {
    const bTT = isTamTai(brideYear, y);
    const gTT = isTamTai(groomYear, y);
    const bThaiTue = isThaiTue(brideYear, y) || isXungThaiTue(brideYear, y);
    const gThaiTue = isThaiTue(groomYear, y) || isXungThaiTue(groomYear, y);
    const bKL = getKimLau(brideYear, y).isKimLau;
    const gKL = getKimLau(groomYear, y).isKimLau;
    if (!bTT && !gTT && !bThaiTue && !gThaiTue && !bKL && !gKL) {
      results.push({ year: y });
    }
  }
  return results;
}

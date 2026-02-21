import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCompatibleYears, getCanChi, getNapAm, getZodiac, HANH_COLOR } from "@/lib/tu-vi";

interface TabTuoiHopProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
}

export function TabTuoiHop({ brideYear, groomYear, brideName, groomName }: TabTuoiHopProps) {
  const [activeTab, setActiveTab] = useState<"bride" | "groom">("bride");
  const year = activeTab === "bride" ? brideYear : groomYear;
  const name = activeTab === "bride" ? (brideName || "Cô dâu") : (groomName || "Chú rể");
  const years = getCompatibleYears(year, 15);
  const na = getNapAm(year);
  const z = getZodiac(year);

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("bride")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "bride" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-pink-50"
          }`}
        >
          {brideName || "Cô dâu"} ({brideYear})
        </button>
        <button
          onClick={() => setActiveTab("groom")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "groom" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-blue-50"
          }`}
        >
          {groomName || "Chú rể"} ({groomYear})
        </button>
      </div>

      {/* Person info */}
      <Card>
        <CardContent className="pt-3 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{z.emoji}</span>
            <div>
              <div className="font-bold">{name} — {getCanChi(year)}</div>
              <div className="text-sm text-gray-500">{na.name} ({na.emoji} {na.hanh})</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-3 pb-2">
          <div className="text-xs text-gray-500 mb-2">
            Các năm sinh phù hợp (Tương Sinh hoặc Bình Hòa) trong khoảng ±15 năm
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-gray-500">
                  <th className="text-left py-1.5 font-medium">Năm</th>
                  <th className="text-left py-1.5 font-medium">Can Chi</th>
                  <th className="text-left py-1.5 font-medium">Con giáp</th>
                  <th className="text-left py-1.5 font-medium">Mệnh</th>
                  <th className="text-right py-1.5 font-medium">Quan hệ</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => {
                  const yz = getZodiac(y.year);
                  const isPartner = y.year === (activeTab === "bride" ? groomYear : brideYear);
                  return (
                    <tr
                      key={y.year}
                      className={`border-b border-gray-100 ${isPartner ? "bg-yellow-50 font-bold" : "hover:bg-gray-50"}`}
                    >
                      <td className="py-1.5">
                        {y.year}
                        {isPartner && <span className="ml-1 text-red-500">★</span>}
                      </td>
                      <td className="py-1.5">{y.canChi}</td>
                      <td className="py-1.5">{yz.emoji} {yz.name}</td>
                      <td className={`py-1.5 ${HANH_COLOR[y.hanh]}`}>{y.emoji} {y.hanh}</td>
                      <td className="py-1.5 text-right">
                        <Badge
                          variant={y.relation === "Tương Sinh" ? "default" : "secondary"}
                          className="text-[10px] px-1.5"
                        >
                          {y.relation}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-gray-400 mt-2 text-center">
            {years.length} năm sinh phù hợp · ★ = đối tượng hiện tại
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

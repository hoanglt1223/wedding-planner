import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getCompatibleYears, getStemBranch, getSoundElement, getZodiac, ELEMENT_TEXT_CLASS, ELEMENT_LABEL } from "@/lib/astrology";

interface TabCompatibleAgesProps {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
  brideGender?: string;
  groomGender?: string;
}

export function TabCompatibleAges({ brideYear, groomYear, brideName, groomName, brideGender: _brideGender, groomGender: _groomGender }: TabCompatibleAgesProps) {
  const [activeTab, setActiveTab] = useState<"bride" | "groom">("bride");
  const year = activeTab === "bride" ? brideYear : groomYear;
  const name = activeTab === "bride" ? (brideName || "Cô dâu") : (groomName || "Chú rể");
  const years = getCompatibleYears(year, 15);
  const soundElement = getSoundElement(year);
  const z = getZodiac(year);

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("bride")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "bride" ? "bg-primary text-primary-foreground" : "bg-[var(--theme-surface-muted)] text-muted-foreground hover:bg-[var(--theme-surface-muted)]"
          }`}
        >
          {brideName || "Cô dâu"} ({brideYear})
        </button>
        <button
          onClick={() => setActiveTab("groom")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "groom" ? "bg-primary text-primary-foreground" : "bg-[var(--theme-surface-muted)] text-muted-foreground hover:bg-[var(--theme-surface-muted)]"
          }`}
        >
          {groomName || "Chú rể"} ({groomYear})
        </button>
      </div>

      {/* Person info */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] pt-3 pb-2 px-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{z.emoji}</span>
          <div>
            <div className="font-bold">{name} — {getStemBranch(year)}</div>
            <div className="text-sm text-muted-foreground">{soundElement.name} ({soundElement.emoji} {ELEMENT_LABEL[soundElement.element]})</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] pt-3 pb-2 px-4">
        <div className="text-xs text-muted-foreground mb-2">
          Các năm sinh phù hợp (Tương Sinh hoặc Bình Hòa) trong khoảng ±15 năm
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[var(--theme-surface)]">
              <tr className="border-b text-muted-foreground">
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
                    className={`border-b border-[var(--theme-border)] ${isPartner ? "bg-[var(--theme-primary-light)] font-bold" : "hover:bg-[var(--theme-surface-muted)]"}`}
                  >
                    <td className="py-1.5">
                      {y.year}
                      {isPartner && <span className="ml-1 text-primary">★</span>}
                    </td>
                    <td className="py-1.5">{y.stemBranch}</td>
                    <td className="py-1.5">{yz.emoji} {yz.name}</td>
                    <td className={`py-1.5 ${ELEMENT_TEXT_CLASS[y.element]}`}>{y.emoji} {ELEMENT_LABEL[y.element]}</td>
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
        <div className="text-xs text-muted-foreground mt-2 text-center">
          {years.length} năm sinh phù hợp · ★ = đối tượng hiện tại
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabHopTuoi } from "@/components/tu-vi/tab-hop-tuoi";
import { TabNguHanh } from "@/components/tu-vi/tab-ngu-hanh";
import { TabNamCuoi } from "@/components/tu-vi/tab-nam-cuoi";
import { TabTuoiHop } from "@/components/tu-vi/tab-tuoi-hop";
import { TabPhongThuy } from "@/components/tu-vi/tab-phong-thuy";
import type { CoupleInfo } from "@/types/wedding";

interface TuViPageProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string) => void;
}

const TABS = [
  { id: "hoptuoi", label: "💑 Hợp Tuổi" },
  { id: "nguhanh", label: "🔥 Ngũ Hành" },
  { id: "namcuoi", label: "📅 Năm Cưới" },
  { id: "tuoihop", label: "🔍 Tuổi Hợp" },
  { id: "phongthuy", label: "🧭 Phong Thủy" },
];

export function TuViPage({ info, onUpdateInfo }: TuViPageProps) {
  const [activeTab, setActiveTab] = useState("hoptuoi");
  const brideYear = parseInt(info.bby) || 0;
  const groomYear = parseInt(info.gby) || 0;
  const weddingYear = info.date ? parseInt(info.date.slice(0, 4)) : new Date().getFullYear();
  const hasData = brideYear > 1900 && groomYear > 1900;

  const tabProps = {
    brideYear, groomYear, weddingYear,
    brideName: info.bride, groomName: info.groom,
  };

  return (
    <div className="space-y-3 pb-8">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-xl font-bold text-red-800">🔮 Tử Vi Khoa Học</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Ngũ Hành · Hợp Tuổi · Tam Tai · Thái Tuế · Kim Lâu · Phong Thủy
        </p>
      </div>

      {/* Birth year inputs */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Label className="text-xs font-semibold">Năm sinh Cô dâu</Label>
          <Input
            type="number"
            placeholder="VD: 1998"
            min={1940} max={2010}
            value={info.bby || ""}
            onChange={(e) => onUpdateInfo("bby", e.target.value)}
            className="mt-0.5 text-center font-bold text-lg"
          />
          {info.bride && <div className="text-xs text-gray-400 mt-0.5 text-center">{info.bride}</div>}
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Năm sinh Chú rể</Label>
          <Input
            type="number"
            placeholder="VD: 1996"
            min={1940} max={2010}
            value={info.gby || ""}
            onChange={(e) => onUpdateInfo("gby", e.target.value)}
            className="mt-0.5 text-center font-bold text-lg"
          />
          {info.groom && <div className="text-xs text-gray-400 mt-0.5 text-center">{info.groom}</div>}
        </div>
      </div>

      {!hasData ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          Nhập năm sinh của cô dâu và chú rể để xem phân tích tử vi
        </div>
      ) : (
        <>
          {/* Tab navigation */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  tab.id === activeTab
                    ? "bg-purple-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "hoptuoi" && <TabHopTuoi {...tabProps} />}
          {activeTab === "nguhanh" && <TabNguHanh {...tabProps} />}
          {activeTab === "namcuoi" && <TabNamCuoi {...tabProps} />}
          {activeTab === "tuoihop" && <TabTuoiHop {...tabProps} />}
          {activeTab === "phongthuy" && <TabPhongThuy {...tabProps} />}

          <div className="text-center text-xs text-gray-400 pt-2">
            Dữ liệu tham khảo từ phong tục truyền thống Việt Nam.
            Hạnh phúc đôi lứa phụ thuộc sự thấu hiểu và yêu thương.
          </div>
        </>
      )}
    </div>
  );
}

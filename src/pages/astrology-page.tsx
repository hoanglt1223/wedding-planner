import { useState } from "react";
import { TabCompatibility } from "@/components/astrology/tab-compatibility";
import { TabFiveElements } from "@/components/astrology/tab-five-elements";
import { TabWeddingYear } from "@/components/astrology/tab-wedding-year";
import { TabCompatibleAges } from "@/components/astrology/tab-compatible-ages";
import { TabFengShui } from "@/components/astrology/tab-feng-shui";
import { TabPersonal } from "@/components/astrology/tab-personal";
import { BirthInputForm } from "@/components/astrology/birth-input-form";
import { getBirthYear } from "@/lib/astrology";
import type { CoupleInfo } from "@/types/wedding";

interface AstrologyPageProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string | number | null) => void;
}

const TABS = [
  { id: "compatibility", label: "💑 Hợp Tuổi" },
  { id: "personal", label: "✨ Cá Nhân" },
  { id: "five-elements", label: "🔥 Ngũ Hành" },
  { id: "wedding-year", label: "📅 Năm Cưới" },
  { id: "compatible-ages", label: "🔍 Tuổi Hợp" },
  { id: "feng-shui", label: "🧭 Phong Thủy" },
];

export function AstrologyPage({ info, onUpdateInfo }: AstrologyPageProps) {
  const [activeTab, setActiveTab] = useState("compatibility");
  const brideYear = getBirthYear(info.brideBirthDate);
  const groomYear = getBirthYear(info.groomBirthDate);
  const weddingYear = info.date ? parseInt(info.date.slice(0, 4)) : new Date().getFullYear();
  const hasData = brideYear > 1900 && groomYear > 1900;

  const tabProps = {
    brideYear, groomYear, weddingYear,
    brideName: info.bride, groomName: info.groom,
    brideGender: info.brideGender || "female",
    groomGender: info.groomGender || "male",
  };

  return (
    <div className="space-y-3 pb-8">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-xl font-bold text-primary">🔮 Tử Vi Khoa Học</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ngũ Hành · Hợp Tuổi · Tam Tai · Thái Tuế · Kim Lâu · Phong Thủy
        </p>
      </div>

      {/* Birth input form */}
      <BirthInputForm info={info} onUpdateInfo={onUpdateInfo} />

      {!hasData ? (
        <div className="flex flex-col items-center py-12 text-center">
          <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <span className="text-4xl">🔮</span>
          </div>
          <h3 className="text-base font-semibold mb-1">Khám phá tử vi đôi bạn</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Nhập năm sinh của cô dâu và chú rể để xem phân tích ngũ hành, hợp tuổi, và phong thủy
          </p>
        </div>
      ) : (
        <>
          {/* Decorative divider */}
          <div className="flex items-center gap-2 text-muted-foreground/40">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs">☯</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  tab.id === activeTab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "compatibility" && <TabCompatibility {...tabProps} />}
          {activeTab === "personal" && <TabPersonal info={info} {...tabProps} />}
          {activeTab === "five-elements" && <TabFiveElements {...tabProps} />}
          {activeTab === "wedding-year" && <TabWeddingYear {...tabProps} />}
          {activeTab === "compatible-ages" && <TabCompatibleAges {...tabProps} />}
          {activeTab === "feng-shui" && <TabFengShui {...tabProps} />}

          <div className="text-center text-xs text-muted-foreground pt-2">
            Dữ liệu tham khảo từ phong tục truyền thống Việt Nam.
            Hạnh phúc đôi lứa phụ thuộc sự thấu hiểu và yêu thương.
          </div>
        </>
      )}
    </div>
  );
}

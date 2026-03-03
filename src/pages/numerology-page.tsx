import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcFullProfile } from "@/lib/numerology";
import { TabPersonalProfile } from "@/components/numerology/tab-personal-profile";
import { TabCompatibility } from "@/components/numerology/tab-compatibility";
import { TabWeddingDates } from "@/components/numerology/tab-wedding-dates";
import { TabYearlyForecast } from "@/components/numerology/tab-yearly-forecast";
import { TabLuckyAttributes } from "@/components/numerology/tab-lucky-attributes";

interface NumerologyPageProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string | number | null) => void;
}

const TAB_IDS = [
  { id: "profile", label: "🔢 Hồ Sơ" },
  { id: "compatibility", label: "💑 Tương Hợp" },
  { id: "wedding", label: "📅 Ngày Cưới" },
  { id: "forecast", label: "🔮 Dự Báo" },
  { id: "lucky", label: "🍀 May Mắn" },
];

export function NumerologyPage({ info, onUpdateInfo }: NumerologyPageProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [brideFullName, setBrideFullName] = useState(info.bride || "");
  const [groomFullName, setGroomFullName] = useState(info.groom || "");
  const [showNames, setShowNames] = useState(false);

  const fullNames = { bride: brideFullName, groom: groomFullName };
  const hasData = Boolean(info.brideBirthDate && info.groomBirthDate);

  const brideProfile = useMemo(
    () => calcFullProfile(info.brideBirthDate, brideFullName || info.bride || ""),
    [info.brideBirthDate, brideFullName, info.bride],
  );
  const groomProfile = useMemo(
    () => calcFullProfile(info.groomBirthDate, groomFullName || info.groom || ""),
    [info.groomBirthDate, groomFullName, info.groom],
  );

  return (
    <div className="space-y-3 pb-8">
      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-xl font-bold text-primary">🔢 Thần Số Học</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pythagorean · Số Chủ Đạo · Tương Hợp · Ngày Cưới · Dự Báo
        </p>
      </div>

      {/* Optional full-name input */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
        <button
          onClick={() => setShowNames(!showNames)}
          className="w-full flex items-center justify-between text-sm font-medium"
        >
          <span>✏️ Nhập họ tên đầy đủ (tùy chọn)</span>
          <span className="text-muted-foreground">{showNames ? "▲" : "▼"}</span>
        </button>
        {showNames && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              value={brideFullName}
              onChange={(e) => setBrideFullName(e.target.value)}
              placeholder={info.bride || "Họ tên cô dâu"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
            />
            <input
              value={groomFullName}
              onChange={(e) => setGroomFullName(e.target.value)}
              placeholder={info.groom || "Họ tên chú rể"}
              className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
            />
          </div>
        )}
      </div>

      {!hasData && (
        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
          <div className="text-center">
            <h3 className="text-base font-semibold mb-1">📅 Nhập ngày sinh để bắt đầu</h3>
            <p className="text-xs text-muted-foreground">
              Cần ngày sinh của cả hai để phân tích thần số học
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Cô dâu {info.bride ? `(${info.bride})` : ""}
              </label>
              <input
                type="date"
                value={info.brideBirthDate || ""}
                onChange={(e) => onUpdateInfo("brideBirthDate", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Chú rể {info.groom ? `(${info.groom})` : ""}
              </label>
              <input
                type="date"
                value={info.groomBirthDate || ""}
                onChange={(e) => onUpdateInfo("groomBirthDate", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {hasData && (
        <>
          <div className="flex items-center gap-2 text-muted-foreground/40">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs">🔢</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar scrollbar-hide pb-1">
            {TAB_IDS.map((tab) => (
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
          {activeTab === "profile" && <TabPersonalProfile info={info} fullNames={fullNames} />}
          {activeTab === "compatibility" && (
            <TabCompatibility
              profile1={brideProfile}
              profile2={groomProfile}
              brideName={brideFullName || info.bride}
              groomName={groomFullName || info.groom}
            />
          )}
          {activeTab === "wedding" && (
            <TabWeddingDates lifePath1={brideProfile.lifePath} lifePath2={groomProfile.lifePath} />
          )}
          {activeTab === "forecast" && <TabYearlyForecast info={info} fullNames={fullNames} />}
          {activeTab === "lucky" && <TabLuckyAttributes info={info} fullNames={fullNames} />}

          <div className="text-center text-xs text-muted-foreground pt-2">
            Dữ liệu tham khảo từ Thần Số Học Pythagorean. Hạnh phúc đôi lứa phụ thuộc sự thấu hiểu và yêu thương.
          </div>
        </>
      )}
    </div>
  );
}

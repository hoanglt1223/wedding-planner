import { useState, useMemo } from "react";
import { calcFullProfile } from "@/lib/numerology";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { DateInput } from "@/components/ui/date-input";
import { TabPersonalProfile } from "@/components/numerology/tab-personal-profile";
import { TabCompatibility } from "@/components/numerology/tab-compatibility";
import { TabWeddingDates } from "@/components/numerology/tab-wedding-dates";
import { TabYearlyForecast } from "@/components/numerology/tab-yearly-forecast";
import { TabLuckyAttributes } from "@/components/numerology/tab-lucky-attributes";

const BRIDE_DEFAULT_DOB = "2000-08-09";
const GROOM_DEFAULT_DOB = "1999-07-31";

const TAB_IDS = [
  { id: "profile", label: "🔢 Hồ Sơ" },
  { id: "compatibility", label: "💑 Tương Hợp" },
  { id: "wedding", label: "📅 Ngày Cưới" },
  { id: "forecast", label: "🔮 Dự Báo" },
  { id: "lucky", label: "🍀 May Mắn" },
];

export function NumerologyPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const info = state.info;
  const onUpdateInfo = store.updateInfo;
  const [activeTab, setActiveTab] = useState("profile");
  const [brideFullName, setBrideFullName] = useState(info.bride || "");
  const [groomFullName, setGroomFullName] = useState(info.groom || "");
  const [brideDob, setBrideDob] = useState(info.brideBirthDate || BRIDE_DEFAULT_DOB);
  const [groomDob, setGroomDob] = useState(info.groomBirthDate || GROOM_DEFAULT_DOB);
  const [showInfoForm, setShowInfoForm] = useState(false);

  const fullNames = { bride: brideFullName, groom: groomFullName };
  const hasData = Boolean(info.brideBirthDate && info.groomBirthDate);

  const hasPendingChanges =
    brideDob !== (info.brideBirthDate || "") ||
    groomDob !== (info.groomBirthDate || "") ||
    brideFullName !== (info.bride || "") ||
    groomFullName !== (info.groom || "");

  const handleSubmitInfo = () => {
    if (brideDob && brideDob !== (info.brideBirthDate || "")) onUpdateInfo("brideBirthDate", brideDob);
    if (groomDob && groomDob !== (info.groomBirthDate || "")) onUpdateInfo("groomBirthDate", groomDob);
    if (brideFullName !== (info.bride || "")) onUpdateInfo("bride", brideFullName);
    if (groomFullName !== (info.groom || "")) onUpdateInfo("groom", groomFullName);
  };

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

      {/* Info form — always visible when no data, collapsible when data present */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
        {hasData ? (
          <button
            onClick={() => setShowInfoForm(!showInfoForm)}
            className="w-full flex items-center justify-between text-sm font-medium"
          >
            <span>✏️ Chỉnh sửa thông tin</span>
            <span className="text-muted-foreground">{showInfoForm ? "▲" : "▼"}</span>
          </button>
        ) : (
          <div className="text-center mb-2">
            <h3 className="text-base font-semibold mb-0.5">📅 Nhập thông tin để bắt đầu</h3>
            <p className="text-xs text-muted-foreground">
              Cần ngày sinh của cả hai để phân tích thần số học
            </p>
          </div>
        )}

        {(!hasData || showInfoForm) && (
          <div className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Họ tên cô dâu</label>
                <input
                  value={brideFullName}
                  onChange={(e) => setBrideFullName(e.target.value)}
                  placeholder="Họ tên cô dâu"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Họ tên chú rể</label>
                <input
                  value={groomFullName}
                  onChange={(e) => setGroomFullName(e.target.value)}
                  placeholder="Họ tên chú rể"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ngày sinh cô dâu</label>
                <DateInput
                  value={brideDob}
                  onChange={setBrideDob}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Ngày sinh chú rể</label>
                <DateInput
                  value={groomDob}
                  onChange={setGroomDob}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--theme-border)] bg-background text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSubmitInfo}
              disabled={!hasPendingChanges || !brideDob || !groomDob}
              className="w-full py-2 rounded-lg text-sm font-semibold transition-colors bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {hasData ? "Cập nhật" : "Bắt đầu phân tích"}
            </button>
          </div>
        )}
      </div>

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

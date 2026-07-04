import { useMemo } from "react";

interface OverallHealthScoreProps {
  overallScore: number;
  categoryScores: {
    budget: number;
    guests: number;
    timeline: number;
    vendors: number;
  };
  lang?: string;
}

export function OverallHealthScore({ overallScore, categoryScores, lang = "vi" }: OverallHealthScoreProps) {
  const en = lang === "en";

  const healthStatus = useMemo(() => {
    if (overallScore >= 90) return { label: en ? "Excellent" : "Xuất sắc", color: "#22c55e", bg: "#dcfce7", icon: "🎉" };
    if (overallScore >= 75) return { label: en ? "On Track" : "Đúng tiến độ", color: "#3b82f6", bg: "#dbeafe", icon: "✅" };
    if (overallScore >= 60) return { label: en ? "Good Progress" : "Tiến triển tốt", color: "#f59e0b", bg: "#fef3c7", icon: "📈" };
    return { label: en ? "Needs Attention" : "Cần chú ý", color: "#ef4444", bg: "#fee2e2", icon: "⚠️" };
  }, [overallScore, en]);

  const categoryLabels = {
    budget: { vi: "Ngân sách", en: "Budget", icon: "💰" },
    guests: { vi: "Khách mời", en: "Guests", icon: "👥" },
    timeline: { vi: "Lịch trình", en: "Timeline", icon: "📅" },
    vendors: { vi: "Nhà cung cấp", en: "Vendors", icon: "🤝" },
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "var(--theme-surface)",
        border: "1px solid var(--theme-border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{healthStatus.icon}</span>
          <div>
            <h3 className="font-semibold text-base">{en ? "Wedding Readiness" : "Mức độ sẵn sàng"}</h3>
            <p className="text-xs text-muted-foreground">
              {en ? "Overall planning progress" : "Tổng tiến độ lập kế hoạch"}
            </p>
          </div>
        </div>
        <div
          className="text-right px-4 py-2 rounded-lg"
          style={{ backgroundColor: healthStatus.bg }}
        >
          <p className="text-2xl font-bold" style={{ color: healthStatus.color }}>
            {overallScore}%
          </p>
          <p className="text-xs" style={{ color: healthStatus.color }}>
            {healthStatus.label}
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(categoryScores).map(([key, score]) => {
          const cat = categoryLabels[key as keyof typeof categoryLabels];
          const scoreColor = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

          return (
            <div
              key={key}
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: "var(--theme-surface-muted)" }}
            >
              <p className="text-lg mb-1">{cat.icon}</p>
              <p className="text-xs text-muted-foreground mb-1">{en ? cat.en : cat.vi}</p>
              <p className="text-sm font-bold" style={{ color: scoreColor }}>
                {score}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

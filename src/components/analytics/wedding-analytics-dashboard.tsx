import { useState, useMemo } from "react";
import { t } from "@/lib/i18n";
import { BudgetHealthCard } from "./budget-health-card";
import { GuestHealthCard } from "./guest-health-card";
import { TimelineHealthCard } from "./timeline-health-card";
import { VendorHealthCard } from "./vendor-health-card";
import { OverallHealthScore } from "./overall-health-score";
import type { WeddingState } from "@/types/wedding";

interface WeddingAnalyticsDashboardProps {
  state: WeddingState;
  lang?: string;
}

export function WeddingAnalyticsDashboard({ state, lang = "vi" }: WeddingAnalyticsDashboardProps) {
  const [activeView, setActiveView] = useState<"overview" | "budget" | "guests" | "timeline" | "vendors">("overview");
  const en = lang === "en";

  // Calculate overall health score
  const healthScores = useMemo(() => {
    const scores = {
      budget: calculateBudgetHealth(state),
      guests: calculateGuestHealth(state),
      timeline: calculateTimelineHealth(state),
      vendors: calculateVendorHealth(state),
    };

    const overall = Math.round(
      (scores.budget + scores.guests + scores.timeline + scores.vendors) / 4
    );

    return { ...scores, overall };
  }, [state]);

  return (
    <div className="space-y-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-semibold text-lg">{t("📊 Phân Tích Dữ Liệu", lang)}</h2>
          <p className="text-xs text-muted-foreground">
            {en ? "Track your wedding planning progress with data insights" : "Theo dõi tiến độ lập kế hoạch cưới với số liệu"}
          </p>
        </div>
      </div>

      {/* Overall Health Score */}
      <OverallHealthScore
        overallScore={healthScores.overall}
        categoryScores={healthScores}
        lang={lang}
      />

      {/* View selector tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { key: "overview", label: en ? "Overview" : "Tổng quan", icon: "📊" },
          { key: "budget", label: en ? "Budget" : "Ngân sách", icon: "💰" },
          { key: "guests", label: en ? "Guests" : "Khách mời", icon: "👥" },
          { key: "timeline", label: en ? "Timeline" : "Lịch trình", icon: "📅" },
          { key: "vendors", label: en ? "Vendors" : "Nhà cung cấp", icon: "🤝" },
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => setActiveView(view.key as typeof activeView)}
            className={`text-xs px-3 py-2 rounded-lg border transition-colors whitespace-nowrap ${
              activeView === view.key
                ? "bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]"
                : "border-[var(--theme-border)] text-muted-foreground hover:border-[var(--theme-primary)]"
            }`}
          >
            {view.icon} {view.label}
          </button>
        ))}
      </div>

      {/* Content based on active view */}
      {activeView === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BudgetHealthCard state={state} lang={lang} />
          <GuestHealthCard state={state} lang={lang} />
          <TimelineHealthCard state={state} lang={lang} />
          <VendorHealthCard state={state} lang={lang} />
        </div>
      )}

      {activeView === "budget" && (
        <div className="space-y-3">
          <BudgetHealthCard state={state} lang={lang} detailed />
        </div>
      )}

      {activeView === "guests" && (
        <div className="space-y-3">
          <GuestHealthCard state={state} lang={lang} detailed />
        </div>
      )}

      {activeView === "timeline" && (
        <div className="space-y-3">
          <TimelineHealthCard state={state} lang={lang} detailed />
        </div>
      )}

      {activeView === "vendors" && (
        <div className="space-y-3">
          <VendorHealthCard state={state} lang={lang} detailed />
        </div>
      )}
    </div>
  );
}

// Health calculation helpers
function calculateBudgetHealth(state: WeddingState): number {
  if (state.budget === 0) return 50; // Neutral if no budget set

  const expenseLog = state.expenseLog || [];
  const totalSpent = expenseLog.reduce((sum, e) => sum + e.amount, 0);
  const budgetUtilization = (totalSpent / state.budget) * 100;

  // Score based on being on track (not over budget)
  if (budgetUtilization > 100) return Math.max(0, 100 - (budgetUtilization - 100));
  if (budgetUtilization > 90) return 80;
  if (budgetUtilization > 75) return 90;
  if (budgetUtilization > 50) return 100;
  if (budgetUtilization > 25) return 85;
  return 70; // Just started
}

function calculateGuestHealth(state: WeddingState): number {
  const guests = state.guests || [];
  if (guests.length === 0) return 50;

  const totalGuests = guests.length;
  const withRSVP = guests.filter(g => g.rsvpToken).length;
  const rsvpRate = (withRSVP / totalGuests) * 100;

  // Score based on RSVP completion
  if (rsvpRate >= 90) return 100;
  if (rsvpRate >= 75) return 85;
  if (rsvpRate >= 50) return 70;
  if (rsvpRate >= 25) return 55;
  return 40;
}

function calculateTimelineHealth(state: WeddingState): number {
  const checkedItems = state.checkedItems || {};
  const totalItems = Object.keys(checkedItems).length;
  if (totalItems === 0) return 50;

  const completed = Object.values(checkedItems).filter(Boolean).length;
  const completionRate = (completed / totalItems) * 100;

  // Score based on checklist completion
  if (completionRate >= 90) return 100;
  if (completionRate >= 75) return 90;
  if (completionRate >= 50) return 75;
  if (completionRate >= 25) return 60;
  return 50;
}

function calculateVendorHealth(state: WeddingState): number {
  const vendors = state.vendors || [];
  if (vendors.length === 0) return 50;

  const bookedOrConfirmed = vendors.filter(v =>
    v.status === "booked" || v.status === "confirmed" || v.status === "paid"
  ).length;
  const bookingRate = (bookedOrConfirmed / vendors.length) * 100;

  // Score based on vendor booking completion
  if (bookingRate >= 90) return 100;
  if (bookingRate >= 75) return 90;
  if (bookingRate >= 50) return 75;
  if (bookingRate >= 25) return 60;
  return 50;
}

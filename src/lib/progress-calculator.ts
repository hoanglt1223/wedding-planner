import type { WeddingState } from "@/types/wedding";
import { getWeddingSteps } from "@/data/resolve-data";
import { isStepEnabled } from "@/hooks/use-wedding-store";
import { BADGES } from "@/data/badges";
import { BADGES_EN } from "@/data/badges.en";
import type { BadgeDefinition } from "@/data/badges";

export interface BadgeStatus {
  badge: BadgeDefinition;
  unlocked: boolean;
}

export interface SectionProgress {
  id: string;
  icon: string;
  label: string;
  percentage: number;
  total: number;
  done: number;
}

export function getBadges(lang: string): BadgeDefinition[] {
  return lang === "en" ? BADGES_EN : BADGES;
}

export function computeBadgeStatuses(
  state: WeddingState,
  progressPct: number,
  lang: string,
): BadgeStatus[] {
  const badges = getBadges(lang);
  const hasDate = !!state.info.date;
  const hasGuests10 = state.guests.length >= 10;
  const hasBudget = state.budget > 0;
  const hasGift = (state.gifts?.length ?? 0) > 0;
  const hasWebsite = state.websiteSettings?.enabled === true;
  const daysToWedding = state.info.date
    ? Math.ceil((new Date(state.info.date).getTime() - Date.now()) / 86400000)
    : Infinity;
  const within100 = daysToWedding <= 100 && daysToWedding > 0;
  const allDone = progressPct >= 100;

  const unlockMap: Record<string, boolean> = {
    "date-set": hasDate,
    "guest-list": hasGuests10,
    "budget-set": hasBudget,
    "first-gift": hasGift,
    "website-live": hasWebsite,
    "countdown-100": within100,
    "complete": allDone,
  };

  return badges.map((badge) => ({
    badge,
    unlocked: unlockMap[badge.id] ?? false,
  }));
}

export function computeSectionProgress(
  state: WeddingState,
  lang: string,
): SectionProgress[] {
  const en = lang === "en";
  const guests = state.guests || [];
  const gifts = state.gifts || [];
  const timeline = state.timelineEntries || [];
  const expenses = state.expenseLog || [];

  // Count checkable items from wedding steps
  let checkTotal = 0;
  let checkedCount = 0;
  const enabled = state.enabledSteps || {};
  for (const step of getWeddingSteps(lang).filter((s) => isStepEnabled(enabled, s.id))) {
    for (let ci = 0; ci < step.ceremonies.length; ci++) {
      let checkIdx = 0;
      for (const s of step.ceremonies[ci].steps) {
        if (s.checkable) {
          checkTotal++;
          if (state.checkedItems[`${step.id}_${ci}_${checkIdx}`]) checkedCount++;
          checkIdx++;
        }
      }
    }
  }

  return [
    {
      id: "planning",
      icon: "💒",
      label: en ? "Planning" : "Kế hoạch",
      percentage: checkTotal > 0 ? Math.round((checkedCount / checkTotal) * 100) : 0,
      total: checkTotal,
      done: checkedCount,
    },
    {
      id: "guests",
      icon: "👥",
      label: en ? "Guests" : "Khách mời",
      percentage: Math.min(guests.length * 10, 100),
      total: 10,
      done: Math.min(guests.length, 10),
    },
    {
      id: "budget",
      icon: "💰",
      label: en ? "Budget" : "Ngân sách",
      percentage: expenses.length > 0 ? 100 : state.budget > 0 ? 50 : 0,
      total: 2,
      done: (state.budget > 0 ? 1 : 0) + (expenses.length > 0 ? 1 : 0),
    },
    {
      id: "timeline",
      icon: "⏱️",
      label: en ? "Timeline" : "Lịch trình",
      percentage: timeline.length > 0 ? 100 : 0,
      total: 1,
      done: timeline.length > 0 ? 1 : 0,
    },
    {
      id: "gifts",
      icon: "🎁",
      label: en ? "Gifts" : "Phong bì",
      percentage: gifts.length > 0 ? 100 : 0,
      total: 1,
      done: gifts.length > 0 ? 1 : 0,
    },
  ];
}

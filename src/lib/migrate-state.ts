import { DEFAULT_PAGE } from "@/data/page-definitions";

const V7_KEY = "wp_v7";
const V8_KEY = "wp_v8";
const V9_KEY = "wp_v9";
const V10_KEY = "wp_v10";
const V11_KEY = "wp_v11";

const PAGE_MAP: Record<string, string> = {
  kehoach: "planning",
  tuvi: "astrology",
  thiep: "cards",
  sotay: "handbook",
  ytuong: "ideas",
  ai: "ai",
};

const STEP_MAP: Record<string, string> = {
  gap: "meeting",
  cauhon: "proposal",
  damngo: "engagement",
  damhoi: "betrothal",
  cuoigai: "bride-ceremony",
  ruocdau: "procession",
  cuoitrai: "groom-ceremony",
};

const BUDGET_MAP: Record<string, string> = {
  levat: "ceremonial-gifts",
};

function remapStepKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const parts = key.split("_");
    if (parts.length >= 1 && STEP_MAP[parts[0]]) {
      parts[0] = STEP_MAP[parts[0]];
    }
    result[parts.join("_")] = obj[key];
  }
  return result;
}

function remapBudgetKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    result[BUDGET_MAP[key] ?? key] = obj[key];
  }
  return result;
}

/**
 * Migrate localStorage across versions.
 * v7→v8: Added `page` field, remaps old tab indices.
 * v8→v9: Renamed abbreviated property keys to descriptive English names.
 * v9→v10: Renamed Vietnamese page/step/budget IDs to English.
 * v10→v11: Added `partyTime` field for noon/afternoon toggle.
 * Safe to call multiple times — no-ops if already migrated.
 */
export function migrateState(): void {
  // Already on latest — check for onboardingComplete backfill
  if (localStorage.getItem(V11_KEY)) {
    try {
      const data = JSON.parse(localStorage.getItem(V11_KEY)!);
      if (data.onboardingComplete === undefined) {
        data.onboardingComplete = !!(data.info?.bride);
        localStorage.setItem(V11_KEY, JSON.stringify(data));
      }
    } catch { /* ignore */ }
    return;
  }

  // v10→v11 migration: add partyTime
  const v10Raw = localStorage.getItem(V10_KEY);
  if (v10Raw) {
    try {
      const v10Data = JSON.parse(v10Raw);
      const v11Data = { ...v10Data, partyTime: v10Data.partyTime ?? "noon" };
      localStorage.setItem(V11_KEY, JSON.stringify(v11Data));
    } catch {
      // Corrupt data — ignore
    }
    return;
  }

  // Legacy migrations below (v7→v8→v9→v10→v11)
  // Try v8 first, then v7
  let raw = localStorage.getItem(V8_KEY);
  let needsV7Migration = false;

  if (!raw) {
    raw = localStorage.getItem(V7_KEY);
    needsV7Migration = true;
  }

  // If v9 already exists and v8/v7 don't, load v9 directly for v9→v10
  const v9Raw = localStorage.getItem(V9_KEY);

  if (!raw && !v9Raw) return;

  try {
    let v9Data: Record<string, unknown>;

    if (raw) {
      const old = JSON.parse(raw);

      // v7→v8 migration: add page field
      if (needsV7Migration) {
        const tabToPage: Record<number, string> = {
          9: "thiep",
          10: "ai",
          11: "sotay",
          12: "ytuong",
        };
        const oldTab = old.tab as number;
        const mappedPage = tabToPage[oldTab];
        old.page = mappedPage ?? DEFAULT_PAGE;
        if (mappedPage) old.tab = 0;
        if (!old.exp) old.exp = {};
        if (!old.thm) old.thm = "red";
      }

      // v8→v9 migration: rename abbreviated keys to descriptive English
      v9Data = {
        page: old.page ?? "kehoach",
        tab: old.tab ?? 0,
        subTabs: old.st ?? {},
        checkedItems: old.ck ?? {},
        budget: old.bud ?? 200_000_000,
        budgetOverrides: old.bo ?? {},
        expenses: old.exp ?? {},
        themeId: old.thm ?? "red",
        apiKey: old.zk ?? "",
        aiResponse: old.ar ?? "",
        info: old.info ? {
          bride: old.info.bride ?? "",
          groom: old.info.groom ?? "",
          brideFamilyName: old.info.bf ?? "",
          groomFamilyName: old.info.gf ?? "",
          date: old.info.date ?? "",
          engagementDate: old.info.dDN ?? "",
          betrothalDate: old.info.dDH ?? "",
          brideBirthYear: old.info.bby ?? "",
          groomBirthYear: old.info.gby ?? "",
        } : undefined,
        guests: Array.isArray(old.guests)
          ? old.guests.map((g: Record<string, unknown>) => ({
              name: g.n ?? g.name ?? "",
              phone: g.p ?? g.phone ?? "",
              side: g.s ?? g.side ?? "trai",
              tableGroup: g.g ?? g.tableGroup ?? "",
              id: g.id ?? 0,
            }))
          : [],
        guestIdCounter: old.gid ?? old.guestIdCounter ?? 0,
        notes: old.notes ?? "",
        vendors: Array.isArray(old.vendors)
          ? old.vendors.map((v: Record<string, unknown>) => ({
              id: v.id ?? 0,
              category: v.cat ?? v.category ?? "",
              name: v.n ?? v.name ?? "",
              phone: v.p ?? v.phone ?? "",
              address: v.addr ?? v.address ?? "",
              note: v.note ?? "",
            }))
          : [],
        vendorIdCounter: old.vnid ?? old.vendorIdCounter ?? 0,
        photos: old.photos ?? [],
        photoIdCounter: old.phid ?? old.photoIdCounter ?? 0,
        lang: old.lang ?? "vi",
      };
    } else {
      // v9 already exists — load it directly
      v9Data = JSON.parse(v9Raw!);
    }

    // v9→v10 migration: rename Vietnamese page/step/budget IDs to English
    const rawPage = (v9Data.page as string) ?? "kehoach";
    const v10Data = {
      ...v9Data,
      page: PAGE_MAP[rawPage] ?? rawPage,
      checkedItems: remapStepKeys((v9Data.checkedItems as Record<string, unknown>) ?? {}),
      subTabs: remapStepKeys((v9Data.subTabs as Record<string, unknown>) ?? {}),
      budgetOverrides: remapBudgetKeys((v9Data.budgetOverrides as Record<string, unknown>) ?? {}),
      expenses: remapBudgetKeys((v9Data.expenses as Record<string, unknown>) ?? {}),
    };

    // v10→v11: add partyTime
    const v11Data = { ...v10Data, partyTime: "noon" };
    localStorage.setItem(V11_KEY, JSON.stringify(v11Data));
  } catch {
    // Corrupt data — ignore, fresh state will be used
  }
}

import { DEFAULT_PAGE } from "@/data/page-definitions";

const OLD_KEY = "wp_v7";
const NEW_KEY = "wp_v8";

/**
 * Migrate localStorage from wp_v7 to wp_v8.
 * Adds `page` field, remaps old tab indices 9-12 to page IDs.
 * Safe to call multiple times — no-ops if already migrated.
 */
export function migrateState(): void {
  // Already migrated or fresh install
  if (localStorage.getItem(NEW_KEY)) return;

  const raw = localStorage.getItem(OLD_KEY);
  if (!raw) return;

  try {
    const old = JSON.parse(raw);

    // Map old extra-tab indices to page IDs
    const tabToPage: Record<number, string> = {
      9: "thiep",
      10: "ai",
      11: "sotay",
      12: "ytuong",
    };

    const oldTab = old.tab as number;
    const mappedPage = tabToPage[oldTab];

    old.page = mappedPage ?? DEFAULT_PAGE;
    // If tab was a page-level tab, reset to sub-tab 0
    if (mappedPage) old.tab = 0;

    localStorage.setItem(NEW_KEY, JSON.stringify(old));
  } catch {
    // Corrupt data — ignore, fresh state will be used
  }
}

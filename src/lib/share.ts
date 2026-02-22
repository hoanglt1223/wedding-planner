import type { WeddingState } from "@/types/wedding";

/** Strip sensitive fields before sharing */
function filterState(state: WeddingState) {
  return {
    info: state.info,
    budget: state.budget,
    budgetOverrides: state.budgetOverrides,
    expenses: state.expenses,
    checkedItems: state.checkedItems,
    partyTime: state.partyTime,
    guests: state.guests.map((g) => ({ name: g.name, side: g.side, tableGroup: g.tableGroup, id: g.id })),
    themeId: state.themeId,
    stepStartTimes: state.stepStartTimes,
  };
}

export async function createShareLink(state: WeddingState): Promise<string> {
  const filtered = filterState(state);
  const data = btoa(encodeURIComponent(JSON.stringify(filtered)));
  const res = await fetch("/api/share", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
  });
  if (!res.ok) throw new Error("Failed to create share link");
  const { id } = await res.json() as { id: string };
  return `${window.location.origin}/#/shared/${id}`;
}

export type SharedData = ReturnType<typeof filterState>;

export async function fetchSharedData(id: string): Promise<SharedData | null> {
  const res = await fetch(`/api/share?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const { data } = await res.json() as { data: string };
  try {
    return JSON.parse(decodeURIComponent(atob(data)));
  } catch {
    return null;
  }
}

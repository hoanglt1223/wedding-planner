import type { TimelineEntry, WeddingStep } from "@/types/wedding";

// Default time slots by step id
const STEP_DEFAULTS: Record<string, string> = {
  "proposal": "06:00",
  "meeting": "05:30",
  "engagement": "06:00",
  "betrothal": "06:00",
  "bride-ceremony": "07:00",
  "procession": "09:00",
  "groom-ceremony": "09:30",
  "post-wedding": "11:00",
};

function mapTabToCategory(tab: string): TimelineEntry["category"] {
  const lower = tab.toLowerCase();
  if (lower.includes("tiệc") || lower.includes("reception")) return "reception";
  if (lower.includes("lễ") || lower.includes("ceremony") || lower.includes("cưới")) return "ceremony";
  if (lower.includes("chuẩn bị") || lower.includes("prep")) return "prep";
  return "other";
}

function getReceptionTime(partyTime: "noon" | "afternoon", index: number): string {
  if (partyTime === "noon") {
    const base = 11 * 60 + index * 30;
    const h = Math.floor(base / 60);
    const m = base % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }
  const base = 17 * 60 + index * 30;
  const h = Math.floor(base / 60);
  const m = base % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimelineFromSteps(
  steps: WeddingStep[],
  enabledSteps: Record<string, boolean>,
  stepStartTimes: Record<string, string>,
  partyTime: "noon" | "afternoon",
  lang: string,
): TimelineEntry[] {
  const isEn = lang === "en";
  const entries: TimelineEntry[] = [];
  let idCounter = 1;

  // Prep entry
  entries.push({
    id: idCounter++,
    time: "05:00",
    title: isEn ? "Bride & Groom preparation" : "Chuẩn bị cô dâu & chú rể",
    category: "prep",
    location: isEn ? "Bride / Groom home" : "Nhà cô dâu / chú rể",
    responsible: isEn ? "Family" : "Gia đình",
    notes: isEn ? "Makeup, dressing, final checks" : "Trang điểm, thay đồ, kiểm tra lại mọi thứ",
  });

  let receptionIndex = 0;

  steps.forEach((step) => {
    const isEnabled = !enabledSteps || Object.keys(enabledSteps).length === 0
      ? true
      : enabledSteps[step.id] !== false;

    if (!isEnabled) return;

    const baseTime = stepStartTimes[step.id] ?? STEP_DEFAULTS[step.id] ?? "08:00";
    const isReception = step.tab.toLowerCase().includes("tiệc") ||
      step.id === "bride-ceremony" || step.id === "groom-ceremony";

    step.ceremonies.forEach((ceremony, ci) => {
      const timeOffset = ci * 30;
      let entryTime: string;

      if (isReception && (ceremony.name.toLowerCase().includes("tiệc"))) {
        entryTime = getReceptionTime(partyTime, receptionIndex++);
      } else {
        const [h, m] = baseTime.split(":").map(Number);
        const totalMin = h * 60 + m + timeOffset;
        const eh = Math.floor(totalMin / 60) % 24;
        const em = totalMin % 60;
        entryTime = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
      }

      entries.push({
        id: idCounter++,
        time: entryTime,
        title: ceremony.name,
        category: mapTabToCategory(ceremony.name + step.tab),
        location: "",
        responsible: ceremony.people[0]?.role ?? "",
        notes: ceremony.description.slice(0, 80),
      });
    });
  });

  return entries.sort((a, b) => a.time.localeCompare(b.time));
}

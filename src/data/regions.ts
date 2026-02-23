// Region system for Vietnamese wedding customs (North/Central/South)

export type Region = "north" | "central" | "south";

export interface RegionalContent<T = string> {
  default: T;
  north?: T;
  central?: T;
  south?: T;
}

export function resolveRegional<T>(
  content: RegionalContent<T>,
  region: Region,
): T {
  return content[region] ?? content.default;
}

export interface RegionInfo {
  id: Region;
  label: string;
  labelEn: string;
  emoji: string;
}

export const REGIONS: RegionInfo[] = [
  { id: "north", label: "Miền Bắc", labelEn: "Northern", emoji: "🏔️" },
  { id: "central", label: "Miền Trung", labelEn: "Central", emoji: "🌊" },
  { id: "south", label: "Miền Nam", labelEn: "Southern", emoji: "🌴" },
];

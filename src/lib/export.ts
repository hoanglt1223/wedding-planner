import type { WeddingState } from "@/types/wedding";

export function exportToJson(state: WeddingState): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const anchor = document.createElement("a");
  const url = URL.createObjectURL(blob);
  anchor.href = url;
  anchor.download = `wedding-data-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile(file: File): Promise<WeddingState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (
          typeof data !== "object" || !data ||
          typeof data.budget !== "number" ||
          !Array.isArray(data.guests) ||
          typeof data.info !== "object"
        ) {
          throw new Error("Invalid shape");
        }
        resolve(data as WeddingState);
      } catch {
        reject(new Error("Invalid JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsText(file, "UTF-8");
  });
}

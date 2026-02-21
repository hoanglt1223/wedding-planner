import type { WeddingState } from "@/types/wedding";

export function exportToJson(state: WeddingState): void {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `wedding-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function readJsonFile(file: File): Promise<WeddingState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Read failed"));
    reader.readAsText(file, "UTF-8");
  });
}

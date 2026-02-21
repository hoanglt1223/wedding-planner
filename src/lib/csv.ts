import type { Guest } from "@/types/wedding";

const CSV_HEADER = "Họ tên,SĐT,Bên,Nhóm";
const BOM = "\uFEFF";

/** Download a sample CSV template */
export function downloadSampleCsv(): void {
  const csv = `${CSV_HEADER}\nNguyễn A,0901234567,trai,Bàn 1\nTrần B,0912345678,gai,Họ hàng`;
  downloadBlob(BOM + csv, "khach_moi_mau.csv");
}

/** Export current guest list to CSV */
export function exportGuestsCsv(guests: Guest[]): void {
  let csv = CSV_HEADER + "\n";
  guests.forEach((guest) => {
    csv += `${guest.name},${guest.phone || ""},${guest.side},${guest.tableGroup || ""}\n`;
  });
  downloadBlob(BOM + csv, "khach_moi.csv");
}

/** Parse CSV text into guest array (skip header row) */
export function parseCsvToGuests(text: string): Omit<Guest, "id">[] {
  return text
    .split("\n")
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => {
      const parts = line.split(",").map((s) => s.trim());
      return {
        name: parts[0] || "",
        phone: parts[1] || "",
        side: parts[2] || "trai",
        tableGroup: parts[3] || "",
      };
    })
    .filter((guest) => guest.name);
}

/** Read a File as UTF-8 text */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsText(file, "UTF-8");
  });
}

function downloadBlob(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv" });
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(blob);
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(anchor.href);
}

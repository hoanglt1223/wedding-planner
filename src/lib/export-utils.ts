import type { WeddingState, Vendor, TimelineEntry, GiftEntry, ExpenseEntry } from "@/types/wedding";
import { generateVendorSummaryPdf, generateTimelineSchedulePdf, generateWeddingOverviewPdf } from "./pdf-templates";

export interface ExportOptions {
  format: "json" | "csv" | "pdf";
  lang: string;
}

// Escape CSV field values
function escapeCsvField(value: string | number | boolean | undefined | null): string {
  if (value === undefined || value === null) return "";
  const stringValue = String(value);
  // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// Convert array of objects to CSV
function objectsToCsv<T>(data: T[], headers: string[], getters: ((item: T) => string | number | boolean | undefined | null)[]): string {
  if (data.length === 0) return headers.join(",");

  const headerRow = headers.map(escapeCsvField).join(",");
  const dataRows = data.map(item =>
    getters.map(getter => escapeCsvField(getter(item))).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

// Export complete state as JSON
export function exportStateAsJson(state: WeddingState): string {
  return JSON.stringify(state, null, 2);
}

// Export guests as CSV
export function exportGuestsAsCsv(guests: any[], lang: string): string {
  const labels = {
    name: lang === "en" ? "Name" : "Tên",
    phone: lang === "en" ? "Phone" : "Điện thoại",
    side: lang === "en" ? "Side" : "Bên",
    tableGroup: lang === "en" ? "Table" : "Bàn",
    dietary: lang === "en" ? "Dietary" : "Dinh dưỡng",
    guestNotes: lang === "en" ? "Notes" : "Ghi chú",
    plusOneName: lang === "en" ? "+1 Name" : "Tên người đi cùng"
  };

  return objectsToCsv(
    guests,
    [labels.name, labels.phone, labels.side, labels.tableGroup, labels.dietary, labels.guestNotes, labels.plusOneName],
    [
      (g: any) => g.name,
      (g: any) => g.phone || "",
      (g: any) => g.side || "",
      (g: any) => g.tableGroup || "",
      (g: any) => g.dietary || "",
      (g: any) => g.guestNotes || "",
      (g: any) => g.plusOneName || ""
    ]
  );
}

// Export vendors as CSV
export function exportVendorsAsCsv(vendors: Vendor[], lang: string): string {
  const statusLabels: Record<string, string> = {
    new: lang === "en" ? "New" : "Mới",
    contacted: lang === "en" ? "Contacted" : "Đã liên hệ",
    quoted: lang === "en" ? "Quoted" : "Đã báo giá",
    booked: lang === "en" ? "Booked" : "Đã đặt cọc",
    confirmed: lang === "en" ? "Confirmed" : "Đã chốt",
    paid: lang === "en" ? "Paid" : "Đã thanh toán"
  };

  const labels = {
    category: lang === "en" ? "Category" : "Danh mục",
    name: lang === "en" ? "Name" : "Tên",
    phone: lang === "en" ? "Phone" : "Điện thoại",
    address: lang === "en" ? "Address" : "Địa chỉ",
    status: lang === "en" ? "Status" : "Trạng thái",
    budget: lang === "en" ? "Budget (VND)" : "Ngân sách (VND)",
    deposit: lang === "en" ? "Deposit (VND)" : "Đặt cọc (VND)",
    note: lang === "en" ? "Notes" : "Ghi chú"
  };

  return objectsToCsv(
    vendors,
    Object.values(labels),
    [
      (v: Vendor) => v.category,
      (v: Vendor) => v.name,
      (v: Vendor) => v.phone || "",
      (v: Vendor) => v.address || "",
      (v: Vendor) => statusLabels[v.status] || v.status,
      (v: Vendor) => v.budget || 0,
      (v: Vendor) => v.deposit || 0,
      (v: Vendor) => v.note || ""
    ]
  );
}

// Export timeline as CSV
export function exportTimelineAsCsv(entries: TimelineEntry[], lang: string): string {
  const labels = {
    time: lang === "en" ? "Time" : "Giờ",
    title: lang === "en" ? "Title" : "Tiêu đề",
    location: lang === "en" ? "Location" : "Địa điểm",
    responsible: lang === "en" ? "Responsible" : "Người phụ trách",
    category: lang === "en" ? "Category" : "Danh mục",
    notes: lang === "en" ? "Notes" : "Ghi chú"
  };

  return objectsToCsv(
    entries,
    Object.values(labels),
    [
      (e: TimelineEntry) => e.time,
      (e: TimelineEntry) => e.title,
      (e: TimelineEntry) => e.location || "",
      (e: TimelineEntry) => e.responsible || "",
      (e: TimelineEntry) => e.category,
      (e: TimelineEntry) => e.notes || ""
    ]
  );
}

// Export budget/expense log as CSV
export function exportBudgetAsCsv(expenses: ExpenseEntry[], budget: number, lang: string): string {
  const labels = {
    category: lang === "en" ? "Category" : "Danh mục",
    description: lang === "en" ? "Description" : "Mô tả",
    amount: lang === "en" ? "Amount (VND)" : "Số tiền (VND)",
    vendor: lang === "en" ? "Vendor" : "Nhà cung cấp",
    date: lang === "en" ? "Date" : "Ngày",
    paid: lang === "en" ? "Paid" : "Đã trả",
    totalBudget: lang === "en" ? "Total Budget" : "Tổng ngân sách"
  };

  const rows = expenses.map(e => [
    e.category,
    e.description,
    e.amount,
    e.vendorName || "",
    e.date,
    e.paid ? "✓" : ""
  ]);

  // Add total budget row at the end
  rows.push([
    "",
    labels.totalBudget,
    budget.toString(),
    "",
    "",
    ""
  ]);

  const headerRow = Object.values(labels).join(",");
  const dataRows = rows.map(row =>
    row.map(escapeCsvField).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

// Export gifts/phong bi as CSV
export function exportGiftsAsCsv(gifts: GiftEntry[], lang: string): string {
  const labels = {
    guestName: lang === "en" ? "Guest Name" : "Tên khách",
    type: lang === "en" ? "Type" : "Loại",
    amount: lang === "en" ? "Amount (VND)" : "Số tiền (VND)",
    description: lang === "en" ? "Description" : "Mô tả",
    side: lang === "en" ? "Side" : "Bên",
    tableGroup: lang === "en" ? "Table" : "Bàn",
    thankYouSent: lang === "en" ? "Thank You Sent" : "Đã cảm ơn"
  };

  return objectsToCsv(
    gifts,
    Object.values(labels),
    [
      (g: GiftEntry) => g.guestName,
      (g: GiftEntry) => g.type === "cash" ? (lang === "en" ? "Cash" : "Tiền mặt") : (lang === "en" ? "Gift" : "Quà"),
      (g: GiftEntry) => g.amount || 0,
      (g: GiftEntry) => g.description || "",
      (g: GiftEntry) => g.side,
      (g: GiftEntry) => g.tableGroup || "",
      (g: GiftEntry) => g.thankYouSent ? "✓" : ""
    ]
  );
}

// Download file helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Get timestamp for filename
export function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().split("T")[0].replace(/-/g, "");
}

/**
 * Export vendor summary as PDF
 */
export async function exportVendorsAsPdf(state: WeddingState): Promise<Blob> {
  const theme = extractThemeFromState(state);
  return generateVendorSummaryPdf(state, theme);
}

/**
 * Export timeline schedule as PDF
 */
export async function exportTimelineAsPdf(state: WeddingState): Promise<Blob> {
  const theme = extractThemeFromState(state);
  return generateTimelineSchedulePdf(state, theme);
}

/**
 * Export wedding overview as PDF
 */
export async function exportWeddingOverviewAsPdf(state: WeddingState): Promise<Blob> {
  const theme = extractThemeFromState(state);
  return generateWeddingOverviewPdf(state, theme);
}

/**
 * Download PDF blob
 */
export function downloadPdfBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Extract theme colors from WeddingState for PDF generation
 */
function extractThemeFromState(_state: WeddingState): {
  primary: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
} {
  // In a real implementation, you'd extract these from state.theme or use CSS variables
  // For now, we'll return a default theme that matches the Traditional Red theme
  return {
    primary: "#e11d48",
    surface: "#ffffff",
    surfaceMuted: "#f9fafb",
    border: "#e5e7eb",
    text: "#111827",
    textMuted: "#6b7280"
  };
}

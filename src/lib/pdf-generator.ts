import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export interface PdfTheme {
  primary: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
}

export interface PdfOptions {
  orientation: "portrait" | "landscape";
  format: "a4" | "letter";
  theme: PdfTheme;
  lang: "vi" | "en";
}

const DEFAULT_THEME: PdfTheme = {
  primary: "#e11d48",
  surface: "#ffffff",
  surfaceMuted: "#f9fafb",
  border: "#e5e7eb",
  text: "#111827",
  textMuted: "#6b7280"
};

/**
 * Convert hex color to RGB for jsPDF
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

/**
 * Create a new PDF document with theme support
 */
export function createPdf(options: Partial<PdfOptions> = {}): jsPDF {
  const opts: PdfOptions = {
    orientation: options.orientation || "portrait",
    format: options.format || "a4",
    theme: options.theme || DEFAULT_THEME,
    lang: options.lang || "vi"
  };

  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: "mm",
    format: opts.format
  });

  // Store theme in document for later use
  (pdf as any).theme = opts.theme;
  (pdf as any).lang = opts.lang;

  return pdf;
}

/**
 * Add a header to the PDF page
 */
export function addPdfHeader(pdf: jsPDF, title: string, subtitle?: string): void {
  const theme = (pdf as any).theme as PdfTheme;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const primaryRgb = hexToRgb(theme.primary);

  // Background color bar
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.rect(0, 0, pageWidth, 25, "F");

  // Title text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, 15, 10);

  // Subtitle
  if (subtitle) {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(subtitle, 15, 18);
  }

  // Decorative line
  pdf.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.setLineWidth(0.5);
  pdf.line(15, 22, pageWidth - 15, 22);
}

/**
 * Add a footer to the PDF page with page number
 */
export function addPdfFooter(pdf: jsPDF, pageNumber: number, totalPages: number): void {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const theme = (pdf as any).theme as PdfTheme;

  pdf.setFontSize(8);
  pdf.setTextColor(theme.textMuted);
  pdf.text(
    `${pageNumber} / ${totalPages}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );
}

/**
 * Add a section with styled background
 */
export function addPdfSection(
  pdf: jsPDF,
  title: string,
  y: number,
  contentFn: (pdf: jsPDF, startY: number) => number
): number {
  const theme = (pdf as any).theme as PdfTheme;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const primaryRgb = hexToRgb(theme.primary);
  const mutedRgb = hexToRgb(theme.surfaceMuted);

  // Check if we need a new page
  if (y > pageHeight - 40) {
    pdf.addPage();
    y = 30;
  }

  // Section title background
  pdf.setFillColor(mutedRgb.r, mutedRgb.g, mutedRgb.b);
  pdf.roundedRect(12, y, pageWidth - 24, 8, 1, 1, "F");

  // Section title
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.roundedRect(12, y, 4, 8, [1, 0, 0, 1], "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text(title, 18, y + 5);

  // Content
  const contentY = contentFn(pdf, y + 12);

  return contentY;
}

/**
 * Add a table to the PDF
 */
export function addPdfTable(
  pdf: jsPDF,
  headers: string[],
  rows: string[][],
  y: number,
  columnWidths?: number[]
): number {
  const theme = (pdf as any).theme as PdfTheme;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const primaryRgb = hexToRgb(theme.primary);
  const mutedRgb = hexToRgb(theme.surfaceMuted);
  const borderRgb = hexToRgb(theme.border);

  const tableWidth = pageWidth - 24;
  const colWidth = columnWidths ||
    headers.map(() => tableWidth / headers.length);

  let currentY = y;
  const rowHeight = 7;
  const lineHeight = 5;

  // Check if we need a new page
  if (currentY + (rows.length + 1) * rowHeight > pdf.internal.pageSize.getHeight() - 20) {
    pdf.addPage();
    currentY = 30;
  }

  // Header row
  pdf.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
  pdf.rect(12, currentY, tableWidth, rowHeight, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");

  let xOffset = 12;
  headers.forEach((header, i) => {
    pdf.text(header, xOffset + 2, currentY + lineHeight);
    xOffset += colWidth[i];
  });

  currentY += rowHeight;

  // Data rows
  pdf.setTextColor(theme.text);
  pdf.setFont("helvetica", "normal");

  rows.forEach((row, rowIndex) => {
    const bgColor = rowIndex % 2 === 0 ? theme.surface : theme.surfaceMuted;
    const bgRgb = hexToRgb(bgColor);

    pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
    pdf.rect(12, currentY, tableWidth, rowHeight, "F");

    pdf.setTextColor(theme.text);
    pdf.setFontSize(8);

    let colX = 12;
    row.forEach((cell, i) => {
      // Truncate text if too long
      const maxWidth = colWidth[i] - 4;
      const text = pdf.splitTextToSize(cell, maxWidth)[0] as string;
      pdf.text(text, colX + 2, currentY + lineHeight);
      colX += colWidth[i];
    });

    currentY += rowHeight;
  });

  return currentY + 5;
}

/**
 * Capture HTML element as PDF
 */
export async function htmlToPdf(
  element: HTMLElement,
  filename: string,
  options: {
    scale?: number;
    useCORS?: boolean;
    logging?: boolean;
  } = {}
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: options.scale || 2,
    useCORS: options.useCORS || true,
    logging: options.logging || false,
    backgroundColor: "#ffffff"
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
}

/**
 * Add text with word wrap
 */
export function addWrappedText(
  pdf: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: {
    fontSize?: number;
    fontStyle?: "normal" | "bold";
    color?: string;
  } = {}
): number {
  const theme = (pdf as any).theme as PdfTheme;
  const rgb = hexToRgb(options.color || theme.text);

  pdf.setTextColor(rgb.r, rgb.g, rgb.b);
  pdf.setFontSize(options.fontSize || 10);
  pdf.setFont("helvetica", options.fontStyle || "normal");

  const lines = pdf.splitTextToSize(text, maxWidth);
  const lineHeight = (options.fontSize || 10) * 0.5;

  lines.forEach((line: string, i: number) => {
    pdf.text(line, x, y + (i * lineHeight));
  });

  return y + (lines.length * lineHeight);
}

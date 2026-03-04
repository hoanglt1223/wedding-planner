import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

const A4_W = 210;
const A4_H = 297;

export async function exportHandbookPDF(
  containerRef: HTMLDivElement,
  filename: string,
  onProgress?: (current: number, total: number) => void,
) {
  const pages = containerRef.querySelectorAll<HTMLElement>("[data-book-page]");
  if (pages.length === 0) return;

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    onProgress?.(i + 1, total);
    const page = pages[i];

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const ratio = canvas.width / canvas.height;
    let imgW = A4_W;
    let imgH = A4_W / ratio;
    if (imgH > A4_H) {
      imgH = A4_H;
      imgW = A4_H * ratio;
    }
    const x = (A4_W - imgW) / 2;
    const y = (A4_H - imgH) / 2;

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", x, y, imgW, imgH);
  }

  pdf.save(filename);
}

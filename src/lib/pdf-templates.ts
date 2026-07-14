import type { WeddingState, TimelineEntry } from "@/types/wedding";
import { createPdf, addPdfHeader, addPdfFooter, addPdfSection, addPdfTable, type PdfTheme } from "./pdf-generator";

/**
 * Generate Vendor Summary PDF
 */
export async function generateVendorSummaryPdf(state: WeddingState, theme: PdfTheme): Promise<Blob> {
  const pdf = createPdf({ theme, lang: state.lang as "vi" | "en" });
  const en = state.lang === "en";
  const vendors = state.vendors || [];

  // Page 1: Summary
  addPdfHeader(pdf, en ? "Vendor Summary" : "Tổng Kết Nhà Cung Cấp", en ? "Wedding Planning" : "Lập Hoạch Đám Cưới");

  let y = 35;

  // Summary stats
  const totalBudget = vendors.reduce((sum, v) => sum + (v.budget || 0), 0);
  const totalDeposit = vendors.reduce((sum, v) => sum + (v.deposit || 0), 0);
  const totalRemaining = totalBudget - totalDeposit;

  const formatMoney = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}tr`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
    return String(n);
  };

  y = addPdfSection(pdf, en ? "Overview" : "Tổng quan", y, (pdf, startY) => {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const stats = [
      [en ? "Total Vendors:" : "Tổng số vendor:", String(vendors.length)],
      [en ? "Total Budget:" : "Tổng ngân sách:", `${formatMoney(totalBudget)} VND`],
      [en ? "Total Deposit:" : "Tổng đặt cọc:", `${formatMoney(totalDeposit)} VND`],
      [en ? "Remaining Balance:" : "Còn lại:", `${formatMoney(totalRemaining)} VND`]
    ];

    let currentY = startY;
    stats.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Vendor details
  if (vendors.length > 0) {
    y = addPdfSection(pdf, en ? "Vendor Details" : "Chi Tiết Vendor", y, (pdf, startY) => {
      const statusLabels: Record<string, string> = {
        new: en ? "New" : "Mới",
        contacted: en ? "Contacted" : "Đã liên hệ",
        quoted: en ? "Quoted" : "Đã báo giá",
        booked: en ? "Booked" : "Đã đặt",
        confirmed: en ? "Confirmed" : "Xác nhận",
        paid: en ? "Paid" : "Đã trả"
      };

      const headers = [
        en ? "Category" : "Danh mục",
        en ? "Name" : "Tên",
        en ? "Status" : "Trạng thái",
        en ? "Budget" : "Ngân sách",
        en ? "Phone" : "Điện thoại"
      ];

      const rows = vendors.map(v => [
        v.category,
        v.name,
        statusLabels[v.status] || v.status,
        v.budget ? formatMoney(v.budget) : "-",
        v.phone || "-"
      ]);

      return addPdfTable(pdf, headers, rows, startY, [25, 35, 25, 25, 25]);
    });
  }

  // Footer
  addPdfFooter(pdf, 1, 1);

  return pdf.output("blob") as Blob;
}

/**
 * Generate Timeline Schedule PDF
 */
export async function generateTimelineSchedulePdf(state: WeddingState, theme: PdfTheme): Promise<Blob> {
  const pdf = createPdf({ theme, lang: state.lang as "vi" | "en" });
  const en = state.lang === "en";
  const entries = state.timelineEntries || [];

  // Page 1: Header
  addPdfHeader(pdf, en ? "Wedding Timeline" : "Lịch Trình Đám Cưới", en ? "Schedule & Events" : "Lịch Trình & Sự Kiện");

  let y = 35;

  // Wedding info
  if (state.info.groom && state.info.bride && state.info.date) {
    y = addPdfSection(pdf, en ? "Wedding Information" : "Thông Tin Đám Cưới", y, (pdf, startY) => {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const info = [
        [en ? "Groom:" : "Chú rể:", state.info.groom],
        [en ? "Bride:" : "Cô dâu:", state.info.bride],
        [en ? "Date:" : "Ngày:", state.info.date]
      ];

      let currentY = startY;
      info.forEach(([label, value]) => {
        pdf.text(label, 15, currentY);
        pdf.text(value, 50, currentY);
        currentY += 7;
      });

      return currentY + 5;
    });
  }

  // Timeline entries
  if (entries.length > 0) {
    const groupedByCategory = entries.reduce((acc, entry) => {
      if (!acc[entry.category]) acc[entry.category] = [];
      acc[entry.category].push(entry);
      return acc;
    }, {} as Record<string, TimelineEntry[]>);

    let pageNumber = 1;

    Object.entries(groupedByCategory).forEach(([category, categoryEntries]) => {
      y = addPdfSection(pdf, category, y, (pdf, startY) => {
        const headers = [
          en ? "Time" : "Giờ",
          en ? "Activity" : "Hoạt động",
          en ? "Location" : "Địa điểm",
          en ? "Responsible" : "Người phụ trách"
        ];

        const rows = (categoryEntries as TimelineEntry[]).map(e => [
          e.time,
          e.title,
          e.location || "-",
          e.responsible || "-"
        ]);

        return addPdfTable(pdf, headers, rows, startY, [25, 50, 40, 40]);
      });

      // Add footer and new page if needed
      if (y > pdf.internal.pageSize.getHeight() - 30) {
        addPdfFooter(pdf, pageNumber, Math.ceil(Object.keys(groupedByCategory).length / 3));
        pdf.addPage();
        y = 30;
        pageNumber++;
      }
    });

    addPdfFooter(pdf, pageNumber, pageNumber);
  }

  return pdf.output("blob") as Blob;
}

/**
 * Generate Wedding Overview PDF
 */
export async function generateWeddingOverviewPdf(state: WeddingState, theme: PdfTheme): Promise<Blob> {
  const pdf = createPdf({ theme, lang: state.lang as "vi" | "en" });
  const en = state.lang === "en";

  // Page 1: Cover
  addPdfHeader(pdf, en ? "Wedding Overview" : "Tổng Quan Đám Cưới", en ? "Planning Summary" : "Tóm Tắt Lập Hoạch");

  let y = 40;

  // Couple information
  if (state.info.groom && state.info.bride) {
    y = addPdfSection(pdf, en ? "Couple Information" : "Thông Tin Cặp Đôi", y, (pdf, startY) => {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const info = [
        [en ? "Groom:" : "Chú rể:", state.info.groom],
        [en ? "Bride:" : "Cô dâu:", state.info.bride],
        state.info.date ? [en ? "Wedding Date:" : "Ngày cưới:", state.info.date] : null,
        state.venue ? [en ? "Venue:" : "Địa điểm:", state.venue] : null
      ].filter(Boolean) as [string, string][];

      let currentY = startY;
      info.forEach(([label, value]) => {
        pdf.text(label, 15, currentY);
        pdf.text(value, 55, currentY);
        currentY += 7;
      });

      return currentY + 5;
    });
  }

  // Guest summary
  const guests = state.guests || [];
  const totalPlusOnes = guests.reduce((sum, g) => sum + (g.plusOneName ? 1 : 0), 0);

  y = addPdfSection(pdf, en ? "Guest Summary" : "Tổng Kết Khách Mời", y, (pdf, startY) => {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const guestStats = [
      [en ? "Total Invited:" : "Tổng khách mời:", String(guests.length)],
      [en ? "Plus Ones:" : "Người đi cùng:", String(totalPlusOnes)]
    ];

    let currentY = startY;
    guestStats.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Budget summary
  const expenses = state.expenseLog || [];
  const totalSpent = expenses.filter(e => e.paid).reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = state.budget || 0;

  y = addPdfSection(pdf, en ? "Budget Summary" : "Tổng Kết Ngân Sách", y, (pdf, startY) => {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const formatMoney = (n: number) => {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
      return String(n);
    };

    const budgetStats = [
      [en ? "Total Budget:" : "Tổng ngân sách:", `${formatMoney(totalBudget)} VND`],
      [en ? "Total Spent:" : "Đã chi:", `${formatMoney(totalSpent)} VND`],
      [en ? "Remaining:" : "Còn lại:", `${formatMoney(totalBudget - totalSpent)} VND`]
    ];

    let currentY = startY;
    budgetStats.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Vendor summary
  const vendors = state.vendors || [];
  if (vendors.length > 0) {
    y = addPdfSection(pdf, en ? "Vendor Overview" : "Tổng Quan Vendor", y, (pdf, startY) => {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      const categoryCount = vendors.reduce((acc, v) => {
        acc[v.category] = (acc[v.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      let currentY = startY;
      Object.entries(categoryCount).forEach(([cat, count]) => {
        pdf.text(`${cat}:`, 15, currentY);
        pdf.text(String(count), 60, currentY);
        currentY += 7;
      });

      return currentY + 5;
    });
  }

  addPdfFooter(pdf, 1, 1);

  return pdf.output("blob") as Blob;
}

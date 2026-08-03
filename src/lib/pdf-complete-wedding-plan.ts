import type { WeddingState, TimelineEntry, Guest } from "@/types/wedding";
import { createPdf, addPdfHeader, addPdfFooter, addPdfSection, addPdfTable, addWrappedText, type PdfTheme } from "./pdf-generator";

/**
 * Generate Complete Wedding Plan PDF
 * Combines all wedding information into one comprehensive document
 */
export async function generateCompleteWeddingPlanPdf(
  state: WeddingState,
  theme: PdfTheme,
  onProgress?: (message: string) => void
): Promise<Blob> {
  const pdf = createPdf({ theme, lang: state.lang as "vi" | "en" });
  const en = state.lang === "en";

  let currentPage = 1;
  const totalPages = 6; // Estimate for progress tracking

  onProgress?.(en ? "Generating cover page..." : "Đang tạo trang bìa...");

  // ===== PAGE 1: Cover Page =====
  addPdfHeader(
    pdf,
    en ? "Wedding Plan" : "Kế Hoạch Đám Cưới",
    en ? "Complete Planning Guide" : "Hướng Dẫn Lập Hoạch Hoàn Chỉnh"
  );

  let y = 60;

  // Couple names prominently displayed
  if (state.info.groom && state.info.bride) {
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    const primaryRgb = hexToRgb(theme.primary);
    pdf.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);

    const names = `${state.info.groom} & ${state.info.bride}`;
    const pageWidth = pdf.internal.pageSize.getWidth();
    pdf.text(names, pageWidth / 2, y, { align: "center" });

    y += 15;

    // Wedding date
    if (state.info.date) {
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(theme.text);
      pdf.text(state.info.date, pageWidth / 2, y, { align: "center" });
      y += 10;
    }

    // Venue
    if (state.venue) {
      pdf.setFontSize(12);
      pdf.text(state.venue, pageWidth / 2, y, { align: "center" });
      y += 20;
    }
  }

  // Quick stats boxes
  y = addPdfSection(pdf, en ? "Quick Stats" : "Thống Kê Nhanh", y, (pdf, startY) => {
    const guests = state.guests || [];
    const vendors = state.vendors || [];
    const tasks = state.tasks || [];
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    const expenses = state.expenseLog || [];
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const formatMoney = (n: number) => {
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}tr`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
      return String(n);
    };

    const stats = [
      [en ? "Guests:" : "Khách mời:", String(guests.length)],
      [en ? "Vendors:" : "Nhà cung cấp:", String(vendors.length)],
      [en ? "Tasks:" : "Công việc:", `${completedTasks}/${tasks.length}`],
      [en ? "Spent:" : "Đã chi:", `${formatMoney(totalSpent)} VND`]
    ];

    let currentY = startY;
    stats.forEach(([label, value]) => {
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(theme.text);
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  addPdfFooter(pdf, currentPage, totalPages);
  currentPage++;

  // ===== PAGE 2: Wedding Details =====
  onProgress?.(en ? "Adding wedding details..." : "Đang thêm thông tin đám cưới...");
  pdf.addPage();
  addPdfHeader(pdf, en ? "Wedding Details" : "Chi Tiết Đám Cưới");

  y = 35;

  // Wedding Information
  y = addPdfSection(pdf, en ? "Wedding Information" : "Thông Tin Đám Cưới", y, (pdf, startY) => {
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");

    const info: [string, string | number][] = [
      [en ? "Groom:" : "Chú rể:", state.info.groom || "-"],
      [en ? "Bride:" : "Cô dâu:", state.info.bride || "-"],
      [en ? "Wedding Date:" : "Ngày cưới:", state.info.date || "-"],
      [en ? "Venue:" : "Địa điểm:", state.venue || "-"],
      [en ? "Region:" : "Khu vực:", state.region || "-"]
    ];

    let currentY = startY;
    info.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(String(value), 55, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Engagement & Betrothal Dates
  if (state.info.engagementDate || state.info.betrothalDate) {
    y = addPdfSection(pdf, en ? "Important Dates" : "Ngày Quan Trọng", y, (pdf, startY) => {
      const dates: [string, string][] = [];
      if (state.info.engagementDate) {
        dates.push([en ? "Engagement:" : "Đính hôn:", state.info.engagementDate]);
      }
      if (state.info.betrothalDate) {
        dates.push([en ? "Betrothal:" : "Ổn định:", state.info.betrothalDate]);
      }

      let currentY = startY;
      dates.forEach(([label, value]) => {
        pdf.text(label, 15, currentY);
        pdf.text(value, 55, currentY);
        currentY += 7;
      });

      return currentY + 5;
    });
  }

  // Theme & Language
  y = addPdfSection(pdf, en ? "Settings" : "Cài Đặt", y, (pdf, startY) => {
    const settings = [
      [en ? "Theme:" : "Chủ đề:", state.theme || "-"],
      [en ? "Language:" : "Ngôn ngữ:", state.lang === "en" ? "English" : "Tiếng Việt"]
    ];

    let currentY = startY;
    settings.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 55, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  addPdfFooter(pdf, currentPage, totalPages);
  currentPage++;

  // ===== PAGE 3: Timeline =====
  onProgress?.(en ? "Adding timeline..." : "Đang thêm lịch trình...");
  pdf.addPage();
  addPdfHeader(pdf, en ? "Wedding Timeline" : "Lịch Trình Đám Cưới");

  y = 35;

  const timelineEntries = state.timelineEntries || [];

  if (timelineEntries.length > 0) {
    const groupedByCategory = timelineEntries.reduce((acc, entry) => {
      if (!acc[entry.category]) acc[entry.category] = [];
      acc[entry.category].push(entry);
      return acc;
    }, {} as Record<string, TimelineEntry[]>);

    Object.entries(groupedByCategory).forEach(([category, entries]) => {
      y = addPdfSection(pdf, category, y, (pdf, startY) => {
        const headers = [
          en ? "Time" : "Giờ",
          en ? "Activity" : "Hoạt động",
          en ? "Location" : "Địa điểm"
        ];

        const rows = entries.map(e => [
          e.time,
          e.title,
          e.location || "-"
        ]);

        return addPdfTable(pdf, headers, rows, startY, [25, 60, 50]);
      });

      // Check if we need a new page
      if (y > pdf.internal.pageSize.getHeight() - 40) {
        addPdfFooter(pdf, currentPage, totalPages);
        pdf.addPage();
        y = 30;
        currentPage++;
      }
    });
  } else {
    y = addPdfSection(pdf, en ? "No Timeline Entries" : "Chưa Có Lịch Trình", y, (pdf, startY) => {
      pdf.setFontSize(10);
      pdf.setTextColor(theme.textMuted);
      return addWrappedText(
        pdf,
        en ? "Timeline entries will appear here once added." : "Các mục lịch trình sẽ hiển thị ở đây sau khi thêm.",
        15,
        startY,
        180
      );
    });
  }

  addPdfFooter(pdf, currentPage, totalPages);
  currentPage++;

  // ===== PAGE 4: Guest List =====
  onProgress?.(en ? "Adding guest list..." : "Đang thêm danh sách khách...");
  pdf.addPage();
  addPdfHeader(pdf, en ? "Guest List" : "Danh Sách Khách Mời");

  y = 35;

  const guests = state.guests || [];

  // Guest summary
  const sideGuests = guests.filter(g => g.side === "groom").length;
  const brideGuests = guests.filter(g => g.side === "bride").length;
  const totalPlusOnes = guests.reduce((sum, g) => sum + (g.plusOneName ? 1 : 0), 0);

  y = addPdfSection(pdf, en ? "Guest Summary" : "Tổng Kết Khách", y, (pdf, startY) => {
    const stats = [
      [en ? "Total Guests:" : "Tổng khách:", String(guests.length)],
      [en ? "Groom's Side:" : "Bên chú rể:", String(sideGuests)],
      [en ? "Bride's Side:" : "Bên cô dâu:", String(brideGuests)],
      [en ? "Plus Ones:" : "Người đi cùng:", String(totalPlusOnes)]
    ];

    let currentY = startY;
    stats.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Guest list table (first 50 guests)
  if (guests.length > 0) {
    const displayGuests = guests.slice(0, 50);

    y = addPdfSection(pdf, en ? "Guest List" : "Danh Sách", y, (pdf, startY) => {
      const headers = [
        en ? "Name" : "Tên",
        en ? "Side" : "Bên",
        en ? "Table" : "Bàn",
        en ? "RSVP" : "RSVP",
        en ? "Plus One" : "Người đi cùng"
      ];

      const rows = displayGuests.map(g => [
        g.name,
        g.side === "groom" ? (en ? "Groom" : "Chú rể") : (en ? "Bride" : "Cô dâu"),
        g.tableNumber || "-",
        g.rsvpStatus || "-",
        g.plusOneName || "-"
      ]);

      return addPdfTable(pdf, headers, rows, startY, [35, 25, 20, 20, 35]);
    });

    if (guests.length > 50) {
      y = addWrappedText(
        pdf,
        en ? `... and ${guests.length - 50} more guests` : `... và ${guests.length - 50} khách khác`,
        15,
        y,
        180,
        { fontSize: 9, color: theme.textMuted }
      );
    }
  }

  addPdfFooter(pdf, currentPage, totalPages);
  currentPage++;

  // ===== PAGE 5: Budget & Vendors =====
  onProgress?.(en ? "Adding budget and vendors..." : "Đang thêm ngân sách và vendor...");
  pdf.addPage();
  addPdfHeader(pdf, en ? "Budget & Vendors" : "Ngân Sách & Nhà Cung Cấp");

  y = 35;

  // Budget summary
  const expenses = state.expenseLog || [];
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalBudget = state.budget || 0;

  y = addPdfSection(pdf, en ? "Budget Summary" : "Tổng Kết Ngân Sách", y, (pdf, startY) => {
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
      pdf.text(value, 65, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Vendor list
  const vendors = state.vendors || [];
  if (vendors.length > 0) {
    y = addPdfSection(pdf, en ? "Vendor Contacts" : "Liên Hệ Vendor", y, (pdf, startY) => {
      const headers = [
        en ? "Category" : "Danh mục",
        en ? "Name" : "Tên",
        en ? "Phone" : "Điện thoại",
        en ? "Status" : "Trạng thái"
      ];

      const statusLabels: Record<string, string> = {
        new: en ? "New" : "Mới",
        contacted: en ? "Contacted" : "Đã liên hệ",
        quoted: en ? "Quoted" : "Đã báo giá",
        booked: en ? "Booked" : "Đã đặt",
        confirmed: en ? "Confirmed" : "Xác nhận",
        paid: en ? "Paid" : "Đã trả"
      };

      const rows = vendors.map(v => [
        v.category,
        v.name,
        v.phone || "-",
        statusLabels[v.status] || v.status
      ]);

      return addPdfTable(pdf, headers, rows, startY, [30, 45, 30, 30]);
    });
  }

  addPdfFooter(pdf, currentPage, totalPages);
  currentPage++;

  // ===== PAGE 6: Tasks & Notes =====
  onProgress?.(en ? "Adding tasks and notes..." : "Đang thêm công việc và ghi chú...");
  pdf.addPage();
  addPdfHeader(pdf, en ? "Tasks & Notes" : "Công Việc & Ghi Chú");

  y = 35;

  // Tasks
  const tasks = state.tasks || [];
  const pendingTasks = tasks.filter(t => t.status !== "completed");
  const completedTasksCount = tasks.filter(t => t.status === "completed").length;

  y = addPdfSection(pdf, en ? "Task Progress" : "Tiến Độ Công Việc", y, (pdf, startY) => {
    const taskStats = [
      [en ? "Total Tasks:" : "Tổng công việc:", String(tasks.length)],
      [en ? "Completed:" : "Hoàn thành:", String(completedTasksCount)],
      [en ? "Pending:" : "Còn lại:", String(pendingTasks.length)]
    ];

    let currentY = startY;
    taskStats.forEach(([label, value]) => {
      pdf.text(label, 15, currentY);
      pdf.text(value, 60, currentY);
      currentY += 7;
    });

    return currentY + 5;
  });

  // Pending tasks list
  if (pendingTasks.length > 0) {
    y = addPdfSection(pdf, en ? "Pending Tasks" : "Công Việc Còn Lại", y, (pdf, startY) => {
      const headers = [
        en ? "Task" : "Công việc",
        en ? "Assigned To" : "Giao cho",
        en ? "Due" : "Hạn"
      ];

      const rows = pendingTasks.slice(0, 20).map(t => [
        t.title,
        t.assignedTo || "-",
        t.dueDate || "-"
      ]);

      return addPdfTable(pdf, headers, rows, startY, [60, 40, 30]);
    });

    if (pendingTasks.length > 20) {
      y = addWrappedText(
        pdf,
        en ? `... and ${pendingTasks.length - 20} more tasks` : `... và ${pendingTasks.length - 20} công việc khác`,
        15,
        y,
        180,
        { fontSize: 9, color: theme.textMuted }
      );
    }
  }

  // Notes section
  if (state.notes) {
    y = addPdfSection(pdf, en ? "Additional Notes" : "Ghi Chú Thêm", y, (pdf, startY) => {
      return addWrappedText(
        pdf,
        state.notes || (en ? "No additional notes" : "Không có ghi chú thêm"),
        15,
        startY,
        180
      );
    });
  }

  addPdfFooter(pdf, currentPage, currentPage);

  onProgress?.(en ? "Finalizing PDF..." : "Đang hoàn thiện PDF...");

  return pdf.output("blob") as Blob;
}

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

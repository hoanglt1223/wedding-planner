import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Gift,
  Package
} from "lucide-react";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import {
  exportStateAsJson,
  exportGuestsAsCsv,
  exportVendorsAsCsv,
  exportTimelineAsCsv,
  exportBudgetAsCsv,
  exportGiftsAsCsv,
  exportVendorsAsPdf,
  exportTimelineAsPdf,
  exportWeddingOverviewAsPdf,
  exportCompleteWeddingPlanAsPdf,
  downloadPdfBlob,
  downloadFile,
  getTimestamp
} from "@/lib/export-utils";

export function ExportPanel() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang;
  const en = lang === "en";

  const handleExportJson = () => {
    try {
      const json = exportStateAsJson(state);
      downloadFile(json, `wedding-data-${getTimestamp()}.json`, "application/json");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportGuests = () => {
    try {
      const csv = exportGuestsAsCsv(state.guests, lang);
      downloadFile(csv, `guests-${getTimestamp()}.csv`, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportVendors = () => {
    try {
      const csv = exportVendorsAsCsv(state.vendors || [], lang);
      downloadFile(csv, `vendors-${getTimestamp()}.csv`, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportTimeline = () => {
    try {
      const csv = exportTimelineAsCsv(state.timelineEntries || [], lang);
      downloadFile(csv, `timeline-${getTimestamp()}.csv`, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportBudget = () => {
    try {
      const csv = exportBudgetAsCsv(state.expenseLog || [], state.budget, lang);
      downloadFile(csv, `budget-${getTimestamp()}.csv`, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportGifts = () => {
    try {
      const csv = exportGiftsAsCsv(state.gifts || [], lang);
      downloadFile(csv, `gifts-${getTimestamp()}.csv`, "text/csv;charset=utf-8;");
    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const handleExportVendorPdf = async () => {
    try {
      const pdf = await exportVendorsAsPdf(state);
      downloadPdfBlob(pdf, `vendors-${getTimestamp()}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert(en ? "PDF export failed" : "Xuất PDF thất bại");
    }
  };

  const handleExportTimelinePdf = async () => {
    try {
      const pdf = await exportTimelineAsPdf(state);
      downloadPdfBlob(pdf, `timeline-${getTimestamp()}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert(en ? "PDF export failed" : "Xuất PDF thất bại");
    }
  };

  const handleExportOverviewPdf = async () => {
    try {
      const pdf = await exportWeddingOverviewAsPdf(state);
      downloadPdfBlob(pdf, `wedding-overview-${getTimestamp()}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert(en ? "PDF export failed" : "Xuất PDF thất bại");
    }
  };

  const handleExportCompletePlanPdf = async () => {
    try {
      const pdf = await exportCompleteWeddingPlanAsPdf(state, (msg) => {
        console.log("PDF progress:", msg);
      });

      // Generate filename based on couple names
      const groom = state.info.groom?.toLowerCase().replace(/\s+/g, "-") || "groom";
      const bride = state.info.bride?.toLowerCase().replace(/\s+/g, "-") || "bride";
      const date = state.info.date || "wedding";
      const sanitizedDate = date.replace(/\s+/g, "-");
      const filename = `wedding-plan-${groom}-${bride}-${sanitizedDate}.pdf`;

      downloadPdfBlob(pdf, filename);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert(en ? "PDF export failed" : "Xuất PDF thất bại");
    }
  };

  const handleExportAll = () => {
    const timestamp = getTimestamp();

    try {
      // Export JSON
      const json = exportStateAsJson(state);
      downloadFile(json, `wedding-data-${timestamp}.json`, "application/json");

      // Export CSVs
      setTimeout(() => {
        if (state.guests.length > 0) {
          const csv = exportGuestsAsCsv(state.guests, lang);
          downloadFile(csv, `guests-${timestamp}.csv`, "text/csv;charset=utf-8;");
        }
      }, 500);

      setTimeout(() => {
        if (state.vendors && state.vendors.length > 0) {
          const csv = exportVendorsAsCsv(state.vendors, lang);
          downloadFile(csv, `vendors-${timestamp}.csv`, "text/csv;charset=utf-8;");
        }
      }, 1000);

      setTimeout(() => {
        if (state.timelineEntries && state.timelineEntries.length > 0) {
          const csv = exportTimelineAsCsv(state.timelineEntries, lang);
          downloadFile(csv, `timeline-${timestamp}.csv`, "text/csv;charset=utf-8;");
        }
      }, 1500);

      setTimeout(() => {
        if (state.expenseLog && state.expenseLog.length > 0) {
          const csv = exportBudgetAsCsv(state.expenseLog, state.budget, lang);
          downloadFile(csv, `budget-${timestamp}.csv`, "text/csv;charset=utf-8;");
        }
      }, 2000);

      setTimeout(() => {
        if (state.gifts && state.gifts.length > 0) {
          const csv = exportGiftsAsCsv(state.gifts, lang);
          downloadFile(csv, `gifts-${timestamp}.csv`, "text/csv;charset=utf-8;");
        }
      }, 2500);

    } catch (error) {
      console.error("Export failed:", error);
      alert(en ? "Export failed" : "Xuất dữ liệu thất bại");
    }
  };

  const exportCards = [
    {
      title: en ? "Complete Backup" : "Sao lưu toàn bộ",
      description: en ? "All data in JSON format" : "Tất cả dữ liệu dạng JSON",
      icon: FileJson,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: handleExportJson,
      count: 1
    },
    {
      title: en ? "Guest List" : "Danh sách khách",
      description: en ? `${state.guests.length} guests` : `${state.guests.length} khách`,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: handleExportGuests,
      count: state.guests.length
    },
    {
      title: en ? "Vendor List" : "Danh sách nhà cung cấp",
      description: en ? `${state.vendors?.length || 0} vendors` : `${state.vendors?.length || 0} nhà cung cấp`,
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: handleExportVendors,
      count: state.vendors?.length || 0
    },
    {
      title: en ? "Timeline" : "Lịch trình",
      description: en ? `${state.timelineEntries?.length || 0} entries` : `${state.timelineEntries?.length || 0} mục`,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: handleExportTimeline,
      count: state.timelineEntries?.length || 0
    },
    {
      title: en ? "Budget & Expenses" : "Ngân sách & Chi tiêu",
      description: en ? `${state.expenseLog?.length || 0} entries` : `${state.expenseLog?.length || 0} mục`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      action: handleExportBudget,
      count: state.expenseLog?.length || 0
    },
    {
      title: en ? "Gifts & Phong Bi" : "Quà & Phong bì",
      description: en ? `${state.gifts?.length || 0} entries` : `${state.gifts?.length || 0} mục`,
      icon: Gift,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      action: handleExportGifts,
      count: state.gifts?.length || 0
    }
  ];

  const pdfCards = [
    {
      title: en ? "Complete Wedding Plan (PDF)" : "Kế Hoạch Đám Cưới Hoàn Chỉnh (PDF)",
      description: en ? "All-in-one wedding guide (6 pages)" : "Hướng dẫn đám cưới tất cả trong một (6 trang)",
      icon: FileText,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      action: handleExportCompletePlanPdf,
      count: 1,
      featured: true
    },
    {
      title: en ? "Vendor Summary (PDF)" : "Tổng Kết Vendor (PDF)",
      description: en ? "Professional vendor report" : "Báo cáo vendor chuyên nghiệp",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: handleExportVendorPdf,
      count: state.vendors?.length || 0
    },
    {
      title: en ? "Timeline Schedule (PDF)" : "Lịch Trình (PDF)",
      description: en ? "Print-ready timeline" : "Lịch trình sẵn in",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: handleExportTimelinePdf,
      count: state.timelineEntries?.length || 0
    },
    {
      title: en ? "Wedding Overview (PDF)" : "Tổng Quan Đám Cưới (PDF)",
      description: en ? "Complete wedding summary" : "Tóm tắt đám cưới hoàn chỉnh",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: handleExportOverviewPdf,
      count: 1
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">
          {en ? "Export & Backup" : "Xuất dữ liệu & Sao lưu"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {en ? "Export your wedding data for backup or sharing" : "Xuất dữ liệu đám cưới để sao lưu hoặc chia sẻ"}
        </p>
      </div>

      {/* Export All Button */}
      <Card className="border-2 border-dashed">
        <CardContent className="pt-6">
          <Button onClick={handleExportAll} className="w-full" size="lg">
            <Download className="h-5 w-5 mr-2" />
            {en ? "Export All Data" : "Xuất tất cả dữ liệu"}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            {en ? "Downloads JSON backup + all available CSV files" : "Tải xuống bản sao lưu JSON + tất cả file CSV có sẵn"}
          </p>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {exportCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                {card.count > 0 && (
                  <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">
                    {card.count}
                  </span>
                )}
              </div>
              <CardTitle className="text-base mt-2">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={card.action}
                  className="ml-2 shrink-0"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-1" />
                  {en ? "CSV" : "CSV"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PDF Export Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">
          {en ? "PDF Export" : "Xuất PDF"}
        </h3>

        {/* Featured Complete Plan Export */}
        <Card className="mb-4 border-2 border-[var(--theme-primary)] bg-gradient-to-br from-[var(--theme-surface)] to-[var(--theme-surface-muted)] hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="p-3 rounded-lg bg-rose-100">
                <FileText className="h-6 w-6 text-rose-600" />
              </div>
              <span className="text-xs font-bold bg-[var(--theme-primary)] text-white px-3 py-1 rounded-full">
                {en ? "Featured" : "Nổi bật"}
              </span>
            </div>
            <CardTitle className="text-lg mt-2">
              {en ? "Complete Wedding Plan (PDF)" : "Kế Hoạch Đám Cưới Hoàn Chỉnh (PDF)"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {en ? "All-in-one wedding guide with timeline, guests, budget, vendors & tasks" : "Hướng dẫn đám cưới tất cả trong một với lịch trình, khách mời, ngân sách, nhà cung cấp & công việc"}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-white rounded border">6 pages</span>
                <span className="px-2 py-1 bg-white rounded border">{en ? "Timeline" : "Lịch trình"}</span>
                <span className="px-2 py-1 bg-white rounded border">{en ? "Guests" : "Khách mời"}</span>
                <span className="px-2 py-1 bg-white rounded border">{en ? "Budget" : "Ngân sách"}</span>
                <span className="px-2 py-1 bg-white rounded border">{en ? "Vendors" : "Vendor"}</span>
                <span className="px-2 py-1 bg-white rounded border">{en ? "Tasks" : "Công việc"}</span>
              </div>
              <Button
                onClick={handleExportCompletePlanPdf}
                className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)] text-white"
                size="lg"
              >
                <Download className="h-4 w-4 mr-2" />
                {en ? "Download Complete Plan" : "Tải Kế Hoạch Hoàn Chỉnh"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Other PDF Exports */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {pdfCards.filter(card => !card.featured).map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow border-2 border-dashed">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                  {card.count > 0 && (
                    <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">
                      {card.count}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base mt-2">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                  <Button
                    size="sm"
                    onClick={card.action}
                    className="ml-2 shrink-0"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    {en ? "PDF" : "PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium">
                {en ? "Export Tips:" : "Mẹo xuất dữ liệu:"}
              </p>
              <ul className="space-y-1 text-xs">
                <li>• {en ? "JSON format preserves all data for backup" : "Định dạng JSON lưu trữ tất cả dữ liệu để sao lưu"}</li>
                <li>• {en ? "CSV format opens in Excel/Google Sheets" : "Định dạng CSV mở được trong Excel/Google Sheets"}</li>
                <li>• {en ? "Share CSV files with vendors or family members" : "Chia sẻ file CSV với nhà cung cấp hoặc thành viên gia đình"}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

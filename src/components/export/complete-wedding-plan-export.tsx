import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { PdfTheme } from "@/lib/pdf-generator";
import { generateCompleteWeddingPlanPdf } from "@/lib/pdf-complete-wedding-plan";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function CompleteWeddingPlanExport() {
  const { state } = useWeddingStoreContext();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const lang = state.lang;
  const en = lang === "en";

  const getThemeColors = (): PdfTheme => {
    const themeVar = (name: string) => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(`--theme-${name}`)
        .trim();
      return value || "#e11d48";
    };

    return {
      primary: themeVar("primary"),
      surface: themeVar("surface") || "#ffffff",
      surfaceMuted: themeVar("surface-muted") || "#f9fafb",
      border: themeVar("border") || "#e5e7eb",
      text: themeVar("text") || "#111827",
      textMuted: themeVar("text-muted") || "#6b7280"
    };
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setProgress(en ? "Initializing..." : "Đang khởi tạo...");

      const theme = getThemeColors();
      const blob = await generateCompleteWeddingPlanPdf(state, theme, (msg) => {
        setProgress(msg);
      });

      setProgress(en ? "Downloading..." : "Đang tải xuống...");

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename based on couple names
      const groom = state.info.groom?.toLowerCase().replace(/\s+/g, "-") || "groom";
      const bride = state.info.bride?.toLowerCase().replace(/\s+/g, "-") || "bride";
      const date = state.info.date || "wedding";
      const sanitizedDate = date.replace(/\s+/g, "-");
      link.download = `wedding-plan-${groom}-${bride}-${sanitizedDate}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setProgress(en ? "Export complete!" : "Xuất file hoàn thành!");
      setTimeout(() => setProgress(""), 2000);
    } catch (error) {
      console.error("PDF export failed:", error);
      setProgress(en ? "Export failed. Please try again." : "Xuất file thất bại. Vui lòng thử lại.");
      setTimeout(() => setProgress(""), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)] text-white"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {en ? "Exporting..." : "Đang xuất..."}
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            {en ? "Export Complete Wedding Plan" : "Xuất Kế Hoạch Đám Cưới Hoàn Chỉnh"}
          </>
        )}
      </Button>

      {progress && (
        <p className="text-xs text-center text-muted-foreground">
          {progress}
        </p>
      )}

      {!isExporting && (
        <p className="text-xs text-center text-muted-foreground">
          {en
            ? "Includes timeline, guests, budget, vendors, and tasks"
            : "Bao gồm lịch trình, khách mời, ngân sách, nhà cung cấp và công việc"}
        </p>
      )}
    </div>
  );
}

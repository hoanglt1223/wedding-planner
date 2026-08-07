import { useState, useRef } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import type { MenuItem } from "@/types/wedding";
import type { AppTheme } from "@/data/themes";
import { t } from "@/lib/i18n";
import { MenuCardPreview } from "./menu-card-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MenuCardGeneratorProps {
  items: MenuItem[];
  theme: AppTheme;
  lang: "vi" | "en";
  tables: Array<{ id: number; name: string; guestCount: number }>;
}

export function MenuCardGenerator({ items, theme, lang, tables }: MenuCardGeneratorProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cardTitle, setCardTitle] = useState("");
  const [showTableName, setShowTableName] = useState(true);
  const [showDietary, setShowDietary] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const selectedTableData = selectedTable
    ? tables.find((t) => t.id.toString() === selectedTable)
    : null;

  const filteredItems = selectedTableData
    ? items.filter((item) => item.checked)
    : items.filter((item) => item.checked || item.isFavorite);

  async function generatePDF() {
    if (!previewRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      const filename = selectedTableData
        ? `menu-card-${selectedTableData.name}.pdf`
        : "menu-card-all.pdf";

      pdf.save(filename);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateAllPDFs() {
    setIsGenerating(true);

    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      setSelectedTable(table.id.toString());

      // Wait for state update and render
      await new Promise(resolve => setTimeout(resolve, 100));

      if (previewRef.current) {
        try {
          const canvas = await html2canvas(previewRef.current, {
            scale: 2,
            useCORS: true,
            logging: false,
          });

          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = (pdfHeight - imgHeight * ratio) / 2;

          pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(`menu-card-${table.name}.pdf`);

          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to generate PDF for table ${table.name}:`, error);
        }
      }
    }

    setSelectedTable(null);
    setIsGenerating(false);
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">🎨 {t("Tùy chỉnh menu card", lang)}</h3>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <Label htmlFor="cardTitle">{t("Tiêu đề (tùy chọn)", lang)}</Label>
            <Input
              id="cardTitle"
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder={lang === "en" ? "Wedding Menu" : "Thực Đơn Đám Cưới"}
              className="mt-1"
            />
          </div>

          {/* Table Selection */}
          <div>
            <Label htmlFor="tableSelect">{t("Chọn bàn (tùy chọn)", lang)}</Label>
            <select
              id="tableSelect"
              value={selectedTable || ""}
              onChange={(e) => setSelectedTable(e.target.value || null)}
              className="w-full mt-1 border rounded px-3 py-2 text-sm bg-background"
              disabled={isGenerating}
            >
              <option value="">{t("Tất cả bàn", lang)}</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id.toString()}>
                  {table.name} ({table.guestCount} {lang === "en" ? "guests" : "khách"})
                </option>
              ))}
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showTableName}
                onChange={(e) => setShowTableName(e.target.checked)}
                className="rounded"
                disabled={isGenerating}
              />
              {t("Hiển thị tên bàn", lang)}
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showDietary}
                onChange={(e) => setShowDietary(e.target.checked)}
                className="rounded"
                disabled={isGenerating}
              />
              {t("Hiển thị nhãn chế độ ăn", lang)}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={generatePDF}
              disabled={isGenerating || filteredItems.length === 0}
              className="flex-1"
            >
              {isGenerating ? "⏳" : "📄"} {t("Tải PDF", lang)}
            </Button>
            {tables.length > 0 && (
              <Button
                onClick={generateAllPDFs}
                variant="outline"
                disabled={isGenerating}
                className="flex-1"
              >
                📚 {t("Tải tất cả", lang)}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6 bg-gray-50">
        <div className="text-center mb-4">
          <h3 className="font-semibold text-sm">{t("Xem trước", lang)}</h3>
          <p className="text-xs text-gray-600">
            {selectedTableData
              ? `${lang === "en" ? "Table" : "Bàn"}: ${selectedTableData.name}`
              : lang === "en" ? "All tables" : "Tất cả bàn"}
          </p>
        </div>

        <div ref={previewRef}>
          <MenuCardPreview
            items={filteredItems}
            theme={theme}
            lang={lang}
            tableName={selectedTableData?.name}
            showTableName={showTableName}
            showDietary={showDietary}
            title={cardTitle || (lang === "en" ? "Wedding Menu" : "Thực Đơn Đám Cưới")}
          />
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-sm mb-2">💡 {t("Mẹo", lang)}</h4>
        <ul className="text-xs space-y-1 text-gray-700">
          <li>• {lang === "en" ? "Landscape format for better display" : "Định dạng ngang để hiển thị tốt hơn"}</li>
          <li>• {lang === "en" ? "Print on cardstock for professional results" : "In trên giấy cứng để có kết quả chuyên nghiệp"}</li>
          <li>• {lang === "en" ? "Cut to size after printing" : "Cắt theo kích thước sau khi in"}</li>
          <li>• {lang === "en" ? "Laminate for durability" : "Bọc lớp màng để bảo vệ"}</li>
        </ul>
      </Card>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import type { VendorReview, Vendor } from "@/types/wedding";

interface ExportReviewsButtonProps {
  reviews: VendorReview[];
  vendors: Vendor[];
  lang?: string;
}

export function ExportReviewsButton({
  reviews,
  vendors,
  lang = "vi"
}: ExportReviewsButtonProps) {
  const en = lang === "en";

  const handleExport = () => {
    const headers = [
      en ? "Vendor ID" : "Mã NCC",
      en ? "Vendor Name" : "Tên Nhà Cung Cấp",
      en ? "Review Date" : "Ngày Đánh Giá",
      en ? "Overall Rating" : "Đánh Giá Tổng Quan",
      en ? "Quality" : "Chất Lượng",
      en ? "Professionalism" : "Sự Chuyên Nghiệp",
      en ? "Value" : "Đáng Giá Tiền",
      en ? "Communication" : "Giao Tiếp",
      en ? "Notes" : "Ghi Chú"
    ];

    const vendorMap = new Map(vendors.map(v => [v.id, v]));

    const rows = reviews.map(review => {
      return [
        review.vendorId,
        review.vendorName,
        review.reviewDate,
        review.overallRating,
        review.ratings.quality,
        review.ratings.professionalism,
        review.ratings.value,
        review.ratings.communication,
        review.notes.replace(/"/g, '""')
      ];
    });

    // Prevent CSV formula injection by prefixing with tab
    const csvContent = [
      headers.map(h => en ? h : h),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell);
        return /^\s*[=+\-@]/.test(cellStr) ? `\t${cellStr}` : cellStr;
      }))
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vendor-reviews-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={reviews.length === 0}
    >
      📊 {en ? "Export Reviews" : "Xuất Đánh Giá"}
    </Button>
  );
}

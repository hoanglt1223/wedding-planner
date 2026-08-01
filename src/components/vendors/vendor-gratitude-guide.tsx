/**
 * Vendor Gratuity Guide Component
 * Displays tipping etiquette and suggested amounts for different vendor categories
 */

import { TIPPING_GUIDE, getSuggestedTip, getTippingGuideline } from "@/data/vendor-tipping-guide";
import type { Vendor } from "@/types/wedding";

interface VendorGratitudeGuideProps {
  vendors: Vendor[];
  lang: "vi" | "en";
}

export function VendorGratitudeGuide({ vendors, lang }: VendorGratitudeGuideProps) {
  const t = {
    title: lang === "en" ? "💰 Wedding Vendor Tipping Guide" : "💰 Hướng Dẫn Tip Nhà Cung Cấp",
    subtitle: lang === "en"
      ? "Customary tipping guidelines for wedding vendors in Vietnam"
      : "Hướng dẫn tip thông thường cho nhà cung cấp đám cưới tại Việt Nam",
    category: lang === "en" ? "Category" : "Danh mục",
    suggested: lang === "en" ? "Suggested Tip" : "Tip Khuyên Nên",
    notes: lang === "en" ? "Notes" : "Ghi chú",
    calculateTip: lang === "en" ? "Calculate Tip" : "Tính Tip",
    basedOnContract: lang === "en" ? "Based on contract amount" : "Dựa trên số tiền hợp đồng",
    yourVendors: lang === "en" ? "Your Vendors" : "Nhà Cung Cấp Của Bạn",
    noVendors: lang === "en" ? "No vendors added yet" : "Chưa thêm nhà cung cấp",
    totalEstimatedTips: lang === "en" ? "Total Estimated Tips" : "Tổng Tip Dự Kiến",
  };

  // Calculate total estimated tips for current vendors
  const totalEstimatedTips = vendors.reduce((sum, vendor) => {
    const tip = getSuggestedTip(vendor.category, vendor.budget);
    return sum + tip;
  }, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold text-sm">{t.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{t.subtitle}</p>
      </div>

      {/* Tipping Guide Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 text-left font-medium">{t.category}</th>
              <th className="px-3 py-2 text-right font-medium">{t.suggested}</th>
              <th className="px-3 py-2 text-left font-medium">{t.notes}</th>
            </tr>
          </thead>
          <tbody>
            {TIPPING_GUIDE.map((guide, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium capitalize">{guide.vendorCategory}</div>
                  {guide.exceptions.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {lang === "en" ? "Exceptions: " : "Ngoại lệ: "}
                      {guide.exceptions.join(", ")}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  {guide.fixedAmount ? (
                    <div>{(guide.fixedAmount / 1000000).toFixed(1)}M VND</div>
                  ) : (
                    <div>{guide.suggestedPercentage}%</div>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {lang === "vi" ? guide.notesVi : guide.notesEn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current Vendors Tip Estimates */}
      <div className="border rounded-lg p-3 bg-muted/30">
        <div className="font-medium text-sm mb-2">{t.yourVendors}</div>

        {vendors.length === 0 ? (
          <div className="text-xs text-muted-foreground italic">{t.noVendors}</div>
        ) : (
          <div className="space-y-2">
            {vendors.map((vendor) => {
              const guideline = getTippingGuideline(vendor.category);
              const suggestedTip = getSuggestedTip(vendor.category, vendor.budget);

              return (
                <div key={vendor.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {vendor.category} • {(vendor.budget / 1000000).toFixed(1)}M VND
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {suggestedTip > 0 ? (
                        <span>{(suggestedTip / 1000000).toFixed(1)}M VND</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                    {guideline && (
                      <div className="text-xs text-muted-foreground">
                        {guideline.fixedAmount ? (
                          <span>{lang === "en" ? "Fixed" : "Cố định"}</span>
                        ) : (
                          <span>{guideline.suggestedPercentage}%</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="border-t pt-2 mt-2">
              <div className="flex items-center justify-between font-medium">
                <span>{t.totalEstimatedTips}</span>
                <span>{(totalEstimatedTips / 1000000).toFixed(1)}M VND</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* General Tips */}
      <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
        <div className="font-medium text-foreground">
          {lang === "en" ? "💡 Tipping Tips:" : "💡 Mẹo Tip:"}
        </div>
        <ul className="space-y-1 pl-4">
          <li>
            {lang === "en"
              ? "• Tips are optional but appreciated for good service"
              : "• Tip là tùy chọn nhưng rất được trân trọng nếu phục vụ tốt"}
          </li>
          <li>
            {lang === "en"
              ? "• Consider vendor workload and hours worked"
              : "• Cân nhắc khối lượng công việc và giờ làm việc của nhà cung cấp"}
          </li>
          <li>
            {lang === "en"
              ? "• Prepare tip envelopes in advance for wedding day"
              : "• Chuẩn bị phong bì tip trước cho ngày cưới"}
          </li>
          <li>
            {lang === "en"
              ? "• Assign a trusted person to distribute tips on wedding day"
              : "• Giao nhiệm vụ phân phối tip cho người đáng tin cậy vào ngày cưới"}
          </li>
        </ul>
      </div>
    </div>
  );
}

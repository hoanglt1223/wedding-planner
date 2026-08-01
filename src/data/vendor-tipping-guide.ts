/**
 * Vendor Tipping Guide Data
 * Customary tipping percentages and guidance for wedding vendors
 */

export interface TippingGuideline {
  vendorCategory: string;
  suggestedPercentage: number; // Percentage of total contract price
  fixedAmount?: number; // Optional fixed amount for some categories
  notesVi: string;
  notesEn: string;
  exceptions: string[];
}

export const TIPPING_GUIDE: TippingGuideline[] = [
  {
    vendorCategory: "photographer",
    suggestedPercentage: 10,
    notesVi: "Thường cho nhiếp ảnh gia đình và các trợ lý riêng",
    notesEn: "Usually for family photographers and assistants",
    exceptions: ["studio_only", "half_day"],
  },
  {
    vendorCategory: "videographer",
    suggestedPercentage: 10,
    notesVi: "Nếu làm việc tốt hơn mong đợi, có thể tăng lên 15%",
    notesEn: "Can increase to 15% if work exceeds expectations",
    exceptions: ["basic_package"],
  },
  {
    vendorCategory: "dj",
    suggestedPercentage: 15,
    notesVi: "DJ thường làm việc nhiều giờ và tạo không khí",
    notesEn: "DJs work long hours and create atmosphere",
    exceptions: [],
  },
  {
    vendorCategory: "mc",
    suggestedPercentage: 15,
    notesVi: "MC quan trọng cho lễ cưới, đặc biệt ở Việt Nam",
    notesEn: "MC is crucial for wedding ceremony, especially in Vietnam",
    exceptions: [],
  },
  {
    vendorCategory: "makeup_artist",
    suggestedPercentage: 15,
    notesVi: "Cho trang điểm viên và trợ lý",
    notesEn: "For makeup artist and assistants",
    exceptions: ["trial_only"],
  },
  {
    vendorCategory: "catering",
    suggestedPercentage: 15,
    notesVi: "Thường được chia cho đội ngũ phục vụ",
    notesEn: "Usually distributed among serving staff",
    exceptions: ["service_included"],
  },
  {
    vendorCategory: "venue",
    suggestedPercentage: 10,
    notesVi: "Cho nhân viên phục vụ và coordination",
    notesEn: "For serving staff and coordination team",
    exceptions: ["all_inclusive"],
  },
  {
    vendorCategory: "florist",
    suggestedPercentage: 10,
    notesVi: "Nếu làm thêm giờ hoặc thiết kế đặc biệt",
    notesEn: "If overtime or special design work",
    exceptions: ["delivery_only"],
  },
  {
    vendorCategory: "band",
    suggestedPercentage: 15,
    notesVi: "Chia cho tất cả thành viên ban nhạc",
    notesEn: "Divided among all band members",
    exceptions: [],
  },
  {
    vendorCategory: "officiant",
    suggestedPercentage: 0,
    fixedAmount: 500000,
    notesVi: "Cho tổ chức lễ hoặc người dẫn ceremony",
    notesEn: "For ceremony organizer or officiant",
    exceptions: [],
  },
  {
    vendorCategory: "transportation",
    suggestedPercentage: 10,
    notesVi: "Cho tài xế nếu phục vụ tốt",
    notesEn: "For drivers if service is good",
    exceptions: ["self_drive"],
  },
  {
    vendorCategory: "decorator",
    suggestedPercentage: 10,
    notesVi: "Nếu làm việc ngoài giờ hoặc thiết kế custom",
    notesEn: "If overtime or custom design work",
    exceptions: ["standard_package"],
  },
];

// Helper function to get suggested tip amount
export function getSuggestedTip(category: string, contractAmount: number): number {
  const guide = TIPPING_GUIDE.find(g => g.vendorCategory === category);
  if (!guide) return 0;

  if (guide.fixedAmount) {
    return guide.fixedAmount;
  }

  return Math.round(contractAmount * (guide.suggestedPercentage / 100));
}

// Get guideline for a specific category
export function getTippingGuideline(category: string): TippingGuideline | undefined {
  return TIPPING_GUIDE.find(g => g.vendorCategory === category);
}

// Check if tipping is recommended for a category
export function isTippingRecommended(category: string): boolean {
  const guide = TIPPING_GUIDE.find(g => g.vendorCategory === category);
  return guide ? guide.suggestedPercentage > 0 || guide.fixedAmount !== undefined : false;
}

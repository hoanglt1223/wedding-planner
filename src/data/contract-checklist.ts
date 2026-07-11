// Contract checklist data for wedding vendor contracts
// Helps couples verify important terms before signing

export interface ContractCheckItem {
  id: string;
  category: string;
  textVi: string;
  textEn: string;
  vendorTypes: string[];  // Which vendor types this applies to
  priority: "high" | "medium" | "low";
}

export interface ContractCategory {
  id: string;
  labelVi: string;
  labelEn: string;
  descriptionVi: string;
  descriptionEn: string;
}

export const CONTRACT_CATEGORIES: ContractCategory[] = [
  {
    id: "payment",
    labelVi: "💰 Thanh Toán",
    labelEn: "💰 Payment",
    descriptionVi: "Các điều khoản về thanh toán và đặt cọc",
    descriptionEn: "Payment terms and deposit requirements",
  },
  {
    id: "cancellation",
    labelVi: "❌ Hủy Dịch Vụ",
    labelEn: "❌ Cancellation",
    descriptionVi: "Chính sách hủy hợp đồng và hoàn tiền",
    descriptionEn: "Cancellation policy and refund terms",
  },
  {
    id: "overtime",
    labelVi: "⏰ Giờ Gia Thủ",
    labelEn: "⏰ Overtime",
    descriptionVi: "Chi phí tính giờ và gia hạn thời gian",
    descriptionEn: "Overtime charges and time extensions",
  },
  {
    id: "scope",
    labelVi: "📋 Phạm Vi",
    labelEn: "📋 Scope",
    descriptionVi: "Những gì được bao gồm và không bao gồm",
    descriptionEn: "What is included and what is not",
  },
  {
    id: "logistics",
    labelVi: "🚚 Hậu Cần",
    labelEn: "🚚 Logistics",
    descriptionVi: "Thời gian, địa điểm, và các yêu cầu kỹ thuật",
    descriptionEn: "Timing, location, and technical requirements",
  },
  {
    id: "liability",
    labelVi: "⚖️ Trách Nhiệm",
    labelEn: "⚖️ Liability",
    descriptionVi: "Trách nhiệm pháp lý và bảo hiểm",
    descriptionEn: "Legal liability and insurance coverage",
  },
];

export const CONTRACT_ITEMS: ContractCheckItem[] = [
  // PAYMENT ITEMS
  {
    id: "payment-deposit",
    category: "payment",
    textVi: "Số tiền đặt cọc rõ ràng và không hoàn lại được bao nhiêu",
    textEn: "Deposit amount clearly stated and non-refundable portion specified",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "payment-schedule",
    category: "payment",
    textVi: "Lịch thanh toán (bao nhiêu % và khi nào thanh toán)",
    textEn: "Payment schedule (what % and when payments are due)",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "payment-method",
    category: "payment",
    textVi: "Phương thức thanh toán được chấp nhận (tiền mặt, chuyển khoản, thẻ)",
    textEn: "Accepted payment methods (cash, transfer, card)",
    vendorTypes: ["*"],
    priority: "medium",
  },
  {
    id: "payment-late",
    category: "payment",
    textVi: "Phí thanh toán muộn (nếu có)",
    textEn: "Late payment penalties (if any)",
    vendorTypes: ["*"],
    priority: "medium",
  },

  // CANCELLATION ITEMS
  {
    id: "cancel-policy",
    category: "cancellation",
    textVi: "Chính sách hủy hợp đồng và hoàn tiền rõ ràng",
    textEn: "Clear cancellation policy and refund terms",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "cancel-force",
    category: "cancellation",
    textVi: "Chính sách hủy do trường hợp bất khả kháng (thời tiết, thiên tai, dịch bệnh)",
    textEn: "Force majeure cancellation policy (weather, disaster, pandemic)",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "cancel-deadline",
    category: "cancellation",
    textVi: "Hạn chót hủy không mất tiền cọc",
    textEn: "Deadline to cancel without losing deposit",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "cancel-notice",
    category: "cancellation",
    textVi: "Thời gian thông báo hủy tối thiểu (ví dụ: 30 ngày trước)",
    textEn: "Minimum cancellation notice period (e.g., 30 days before)",
    vendorTypes: ["*"],
    priority: "high",
  },

  // OVERTIME ITEMS
  {
    id: "overtime-rate",
    category: "overtime",
    textVi: "Giá tính giờ rõ ràng (bao nhiêu cho mỗi 30 phút/giờ)",
    textEn: "Clear overtime rate (how much per 30 minutes/hour)",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc", "🚗 Xe"],
    priority: "high",
  },
  {
    id: "overtime-max",
    category: "overtime",
    textVi: "Giới hạn thời gian gia hạn tối đa (có thể gia hạn đến mấy giờ)",
    textEn: "Maximum overtime extension limit (how late can service extend)",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc"],
    priority: "medium",
  },
  {
    id: "overtime-notify",
    category: "overtime",
    textVi: "Cách thức thông báo gia hạn (bao lâu trước khi cần gia hạn)",
    textEn: "Overtime notification method (how far in advance to request)",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc"],
    priority: "medium",
  },

  // SCOPE ITEMS
  {
    id: "scope-inclusions",
    category: "scope",
    textVi: "Danh sách chi tiết những gì được bao gồm trong gói",
    textEn: "Detailed list of what is included in the package",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "scope-exclusions",
    category: "scope",
    textVi: "Danh sách những gì KHÔNG được bao gồm (phí thêm)",
    textEn: "List of what is NOT included (extra fees)",
    vendorTypes: ["*"],
    priority: "high",
  },
  {
    id: "scope-raw-files",
    category: "scope",
    textVi: "Có được file gốc (RAW) ảnh/video không, và khi nào",
    textEn: "RAW photo/video files included, and delivery timeline",
    vendorTypes: ["📸 Ảnh/Video"],
    priority: "high",
  },
  {
    id: "scope-edits",
    category: "scope",
    textVi: "Số lượng ảnh chỉnh sửa và số ảnh chụp được bao nhiêu",
    textEn: "Number of edited photos vs total photos taken",
    vendorTypes: ["📸 Ảnh/Video"],
    priority: "high",
  },
  {
    id: "scope-attire",
    category: "scope",
    textVi: "Trang phục và phụ kiện đi kèm (váy, vest, giày, v.v.)",
    textEn: "Included attire and accessories (dress, suit, shoes, etc.)",
    vendorTypes: ["👗 Trang phục", "💄 Makeup"],
    priority: "medium",
  },
  {
    id: "scope-travel",
    category: "scope",
    textVi: "Chi phí di chuyển có bao gồm không (văn phòng đến địa điểm)",
    textEn: "Travel costs included (office to venue distance)",
    vendorTypes: ["📸 Ảnh/Video", "💄 Makeup", "🌸 Trang trí", "💐 Hoa"],
    priority: "high",
  },

  // LOGISTICS ITEMS
  {
    id: "logistics-time",
    category: "logistics",
    textVi: "Thời gian bắt đầu và kết thúc cụ thể (giờ, phút)",
    textEn: "Specific start and end time (hour, minute)",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc", "🚗 Xe"],
    priority: "high",
  },
  {
    id: "logistics-setup",
    category: "logistics",
    textVi: "Thời gian set-up/break-down (bao lâu trước và sau sự kiện)",
    textEn: "Setup and breakdown time (how long before/after event)",
    vendorTypes: ["🌸 Trang trí", "🏛️ Nhà hàng", "💐 Hoa"],
    priority: "high",
  },
  {
    id: "logistics-location",
    category: "logistics",
    textVi: "Địa điểm cụ thể (địa chỉ, phòng, sảnh, v.v.)",
    textEn: "Specific location (address, room, hall, etc.)",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc"],
    priority: "high",
  },
  {
    id: "logistics-parking",
    category: "logistics",
    textVi: "Chỗ đậu xe cho đội ngũ và khách hàng",
    textEn: "Parking availability for team and customers",
    vendorTypes: ["🏛️ Nhà hàng"],
    priority: "medium",
  },
  {
    id: "logistics-meals",
    category: "logistics",
    textVi: "Cơm cho đội ngũ nhân viên (có bao gồm không)",
    textEn: "Staff meals included or not",
    vendorTypes: ["🏛️ Nhà hàng", "📸 Ảnh/Video", "🎵 MC/Nhạc", "🌸 Trang trí"],
    priority: "medium",
  },
  {
    id: "logistics-power",
    category: "logistics",
    textVi: "Nguồn điện và yêu cầu kỹ thuật (âm thanh, ánh sáng, v.v.)",
    textEn: "Power supply and technical requirements (sound, lighting, etc.)",
    vendorTypes: ["🎵 MC/Nhạc", "🌸 Trang trí", "📸 Ảnh/Video"],
    priority: "high",
  },

  // LIABILITY ITEMS
  {
    id: "liability-insurance",
    category: "liability",
    textVi: "Bảo hiểm trách nhiệm công cộng (nếu có tai nạn)",
    textEn: "Public liability insurance (in case of accidents)",
    vendorTypes: ["🏛️ Nhà hàng", "🚗 Xe", "🌸 Trang trí"],
    priority: "high",
  },
  {
    id: "liability-damage",
    category: "liability",
    textVi: "Trách nhiệm nếu làm hỏng tài sản của địa điểm",
    textEn: "Liability for damage to venue property",
    vendorTypes: ["📸 Ảnh/Video", "🎵 MC/Nhạc", "🌸 Trang trí", "🚗 Xe"],
    priority: "high",
  },
  {
    id: "liability-injury",
    category: "liability",
    textVi: "Trách nhiệm nếu có khách hàng bị thương",
    textEn: "Liability if guests are injured",
    vendorTypes: ["🏛️ Nhà hàng", "🚗 Xe", "🌸 Trang trí"],
    priority: "high",
  },
  {
    id: "liability-substitute",
    category: "liability",
    textVi: "Dự phòng nếu nhân viên chính không thể đến (nhân viên thay thế)",
    textEn: "Substitute staff if primary person cannot attend",
    vendorTypes: ["📸 Ảnh/Video", "💄 Makeup", "🎵 MC/Nhạc"],
    priority: "high",
  },
  {
    id: "liability-replacement",
    category: "liability",
    textVi: "Chính sách thay thế nếu dịch vụ không đạt chất lượng",
    textEn: "Replacement policy if service quality is poor",
    vendorTypes: ["*"],
    priority: "medium",
  },
];

// Helper function to get items applicable to a vendor type
export function getItemsForVendor(vendorType: string): ContractCheckItem[] {
  return CONTRACT_ITEMS.filter(item =>
    item.vendorTypes.includes("*") || item.vendorTypes.includes(vendorType)
  );
}

// Helper function to get items by category
export function getItemsByCategory(category: string, vendorType: string): ContractCheckItem[] {
  return CONTRACT_ITEMS.filter(item =>
    item.category === category &&
    (item.vendorTypes.includes("*") || item.vendorTypes.includes(vendorType))
  );
}

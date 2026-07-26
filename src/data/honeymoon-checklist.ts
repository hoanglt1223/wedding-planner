/**
 * Honeymoon packing checklist data
 * Curated essentials for a wedding honeymoon trip
 */

export interface HoneymoonPackingItem {
  id: string;
  category: "documents" | "clothing" | "toiletries" | "electronics" | "essentials";
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  priority: "essential" | "recommended" | "optional";
}

export const honeymoonPackingItems: HoneymoonPackingItem[] = [
  // DOCUMENTS
  {
    id: "passports",
    category: "documents",
    name: "Hộ chiếu",
    nameEn: "Passports",
    description: "Còn hạn ít nhất 6 tháng, kèm bản sao phòng khi",
    descriptionEn: "Valid 6+ months, bring a photocopy as backup",
    priority: "essential",
  },
  {
    id: "visa",
    category: "documents",
    name: "Visa / Giấy thông hành",
    nameEn: "Visa / Entry permit",
    description: "Visa hoặc e-visa nếu điểm đến yêu cầu",
    descriptionEn: "Visa or e-visa if required by destination",
    priority: "essential",
  },
  {
    id: "flight-tickets",
    category: "documents",
    name: "Vé máy bay / đặt phòng",
    nameEn: "Flight & hotel bookings",
    description: "Bản in và bản điện tử xác nhận vé, khách sạn",
    descriptionEn: "Printed and digital confirmations for flights and hotel",
    priority: "essential",
  },
  {
    id: "travel-insurance",
    category: "documents",
    name: "Bảo hiểm du lịch",
    nameEn: "Travel insurance",
    description: "Thẻ/bảo hiểm y tế và du lịch",
    descriptionEn: "Medical and travel insurance card",
    priority: "recommended",
  },
  {
    id: "marriage-certificate",
    category: "documents",
    name: "Giấy chứng nhận kết hôn",
    nameEn: "Marriage certificate",
    description: "Dùng xin ưu đãi tuần trăng mật tại resort",
    descriptionEn: "Useful for honeymoon perks at resorts",
    priority: "recommended",
  },
  {
    id: "id-copies",
    category: "documents",
    name: "Bản sao CCCD / giấy tờ",
    nameEn: "ID copies",
    description: "2-3 bản sao giữ ở hành lý khác nhau",
    descriptionEn: "2-3 copies kept in separate bags",
    priority: "optional",
  },

  // CLOTHING
  {
    id: "swimwear",
    category: "clothing",
    name: "Đồ bơi",
    nameEn: "Swimwear",
    description: "2 bộ để xoay vòng khi đi biển/hồ bơi",
    descriptionEn: "2 sets to rotate for beach/pool days",
    priority: "essential",
  },
  {
    id: "evening-wear",
    category: "clothing",
    name: "Trang phục tối",
    nameEn: "Evening wear",
    description: "Đầm/vest cho bữa tối lãng mạn",
    descriptionEn: "Dress/shirt for romantic dinners",
    priority: "recommended",
  },
  {
    id: "daywear",
    category: "clothing",
    name: "Quần áo ngày thường",
    nameEn: "Daywear",
    description: "Áo thun, quần short/váy nhẹ thoáng mái",
    descriptionEn: "T-shirts, shorts, light dresses for daytime",
    priority: "essential",
  },
  {
    id: "comfortable-shoes",
    category: "clothing",
    name: "Giày đi lại thoải mái",
    nameEn: "Comfortable walking shoes",
    description: "Giày thể thao hoặc sandal đi dạo",
    descriptionEn: "Sneakers or sandals for exploring",
    priority: "essential",
  },
  {
    id: "light-jacket",
    category: "clothing",
    name: "Áo khoác nhẹ",
    nameEn: "Light jacket",
    description: "Cho buổi tối mát hoặc máy lạnh",
    descriptionEn: "For cool evenings or AC rooms",
    priority: "recommended",
  },
  {
    id: "sleepwear",
    category: "clothing",
    name: "Đồ ngủ",
    nameEn: "Sleepwear",
    description: "Đồ ngủ thoải mái",
    descriptionEn: "Comfortable sleepwear",
    priority: "recommended",
  },

  // TOILETRIES
  {
    id: "sunscreen",
    category: "toiletries",
    name: "Kem chống nắng",
    nameEn: "Sunscreen",
    description: "SPF 50+, thoa lại thường xuyên",
    descriptionEn: "SPF 50+, reapply throughout the day",
    priority: "essential",
  },
  {
    id: "personal-care",
    category: "toiletries",
    name: "Đồ dùng cá nhân",
    nameEn: "Personal care items",
    description: "Bàn chải, kem đánh răng, dầu gội, sữa tắm",
    descriptionEn: "Toothbrush, toothpaste, shampoo, body wash",
    priority: "essential",
  },
  {
    id: "medications",
    category: "toiletries",
    name: "Thuốc cá nhân",
    nameEn: "Personal medications",
    description: "Thuốc cần thiết + thuốc cảm, đau bụng, say xe",
    descriptionEn: "Prescription meds + cold, stomach, motion sickness pills",
    priority: "essential",
  },
  {
    id: "after-sun",
    category: "toiletries",
    name: "Dưỡng sau nắng",
    nameEn: "After-sun lotion",
    description: "Gel lô hội làm dịu da cháy nắng",
    descriptionEn: "Aloe gel to soothe sunburn",
    priority: "recommended",
  },
  {
    id: "contacts-glasses",
    category: "toiletries",
    name: "Kính / kính áp tròng",
    nameEn: "Glasses / contact lenses",
    description: "Kính dự phòng + dung dịch kính áp tròng",
    descriptionEn: "Spare glasses + contact lens solution",
    priority: "optional",
  },

  // ELECTRONICS
  {
    id: "phone-charger",
    category: "electronics",
    name: "Sạc điện thoại + cáp",
    nameEn: "Phone charger + cable",
    description: "Sạc nhanh và cáp dự phòng",
    descriptionEn: "Fast charger and spare cable",
    priority: "essential",
  },
  {
    id: "power-adapter",
    category: "electronics",
    name: "Bộ chuyển ổ cắm",
    nameEn: "Power adapter",
    description: "Adapter quốc tế theo chuẩn ổ cắm địa phương",
    descriptionEn: "Universal adapter matching local sockets",
    priority: "recommended",
  },
  {
    id: "power-bank",
    category: "electronics",
    name: "Sạc dự phòng",
    nameEn: "Power bank",
    description: "Cho những ngày đi dạo dài",
    descriptionEn: "For long days of exploring",
    priority: "recommended",
  },
  {
    id: "camera",
    category: "electronics",
    name: "Máy ảnh / Gimbal",
    nameEn: "Camera / Gimbal",
    description: "Ghi lại khoảnh khắc tuần trăng mật",
    descriptionEn: "Capture honeymoon memories",
    priority: "optional",
  },

  // ESSENTIALS
  {
    id: "sunglasses",
    category: "essentials",
    name: "Kính râm",
    nameEn: "Sunglasses",
    description: "Kính râm chống tia UV",
    descriptionEn: "UV-protection sunglasses",
    priority: "essential",
  },
  {
    id: "sun-hat",
    category: "essentials",
    name: "Nón rộng vành",
    nameEn: "Sun hat",
    description: "Che nắng khi ra ngoài",
    descriptionEn: "Sun protection for outings",
    priority: "recommended",
  },
  {
    id: "cash-cards",
    category: "essentials",
    name: "Tiền mặt + thẻ",
    nameEn: "Cash + cards",
    description: "Tiền tệ địa phương + thẻ tín dụng/ghi nợ",
    descriptionEn: "Local currency + credit/debit cards",
    priority: "essential",
  },
  {
    id: "first-aid-kit",
    category: "essentials",
    name: "Bộ sơ cứu nhỏ",
    nameEn: "Mini first-aid kit",
    description: "Băng cá nhân, cồn, bông, thuốc đỏ",
    descriptionEn: "Band-aids, alcohol wipes, antiseptic",
    priority: "recommended",
  },
  {
    id: "reusable-bottle",
    category: "essentials",
    name: "Bình nước tái sử dụng",
    nameEn: "Reusable water bottle",
    description: "Giữ nước và giảm rác nhựa",
    descriptionEn: "Stay hydrated and cut plastic waste",
    priority: "optional",
  },
];

export const honeymoonCategoryInfo = {
  documents: { name: "Giấy tờ", nameEn: "Documents", icon: "📄", color: "bg-blue-50 text-blue-700" },
  clothing: { name: "Quần áo", nameEn: "Clothing", icon: "👕", color: "bg-purple-50 text-purple-700" },
  toiletries: { name: "Đồ dùng cá nhân", nameEn: "Toiletries", icon: "🧴", color: "bg-green-50 text-green-700" },
  electronics: { name: "Điện tử", nameEn: "Electronics", icon: "🔌", color: "bg-orange-50 text-orange-700" },
  essentials: { name: "Thiết yếu", nameEn: "Essentials", icon: "🕶️", color: "bg-pink-50 text-pink-700" },
};

export const honeymoonPriorityInfo = {
  essential: { name: "Bắt buộc", nameEn: "Essential", icon: "⭐", color: "text-red-600" },
  recommended: { name: "Khuyên dùng", nameEn: "Recommended", icon: "✓", color: "text-orange-600" },
  optional: { name: "Tùy chọn", nameEn: "Optional", icon: "○", color: "text-gray-600" },
};

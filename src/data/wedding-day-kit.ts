// Wedding Day Emergency Kit — categorized items to pack for the big day

export interface KitItem {
  id: string;
  textVi: string;
  textEn: string;
  icon: string;
}

export interface KitCategory {
  id: string;
  labelVi: string;
  labelEn: string;
  icon: string;
  items: KitItem[];
}

export const WEDDING_DAY_KIT: KitCategory[] = [
  {
    id: "beauty",
    labelVi: "Làm đẹp",
    labelEn: "Beauty",
    icon: "💄",
    items: [
      { id: "b-1", textVi: "Son môi dặm lại", textEn: "Touch-up lipstick", icon: "💋" },
      { id: "b-2", textVi: "Phấn phủ / giấy thấm dầu", textEn: "Powder / oil blotting sheets", icon: "✨" },
      { id: "b-3", textVi: "Kẹp tóc / ghim tóc dự phòng", textEn: "Extra hairpins / bobby pins", icon: "📎" },
      { id: "b-4", textVi: "Keo xịt tóc", textEn: "Hair spray", icon: "💇" },
      { id: "b-5", textVi: "Nước hoa", textEn: "Perfume", icon: "🌸" },
      { id: "b-6", textVi: "Kính áp tròng dự phòng", textEn: "Backup contact lenses", icon: "👓" },
    ],
  },
  {
    id: "medical",
    labelVi: "Y tế",
    labelEn: "Medical",
    icon: "🩹",
    items: [
      { id: "m-1", textVi: "Băng dán cá nhân (band-aid)", textEn: "Band-aids", icon: "🩹" },
      { id: "m-2", textVi: "Thuốc giảm đau (paracetamol)", textEn: "Pain reliever (paracetamol)", icon: "💊" },
      { id: "m-3", textVi: "Thuốc chống say", textEn: "Motion sickness pills", icon: "🤢" },
      { id: "m-4", textVi: "Kem chống nắng", textEn: "Sunscreen", icon: "☀️" },
      { id: "m-5", textVi: "Xịt chống côn trùng", textEn: "Insect repellent", icon: "🦟" },
    ],
  },
  {
    id: "clothing",
    labelVi: "Trang phục",
    labelEn: "Clothing",
    icon: "👗",
    items: [
      { id: "c-1", textVi: "Kim chỉ cùng màu trang phục", textEn: "Matching thread & needle", icon: "🧵" },
      { id: "c-2", textVi: "Cúc áo dự phòng", textEn: "Spare buttons", icon: "🔘" },
      { id: "c-3", textVi: "Băng keo thời trang (fashion tape)", textEn: "Fashion tape", icon: "📏" },
      { id: "c-4", textVi: "Khăn lau vết bẩn (stain remover wipe)", textEn: "Stain remover wipes", icon: "🧽" },
      { id: "c-5", textVi: "Giày dự phòng thoải mái", textEn: "Comfortable backup shoes", icon: "👟" },
      { id: "c-6", textVi: "Áo lót / nội y dự phòng", textEn: "Backup undergarments", icon: "👙" },
    ],
  },
  {
    id: "documents",
    labelVi: "Giấy tờ",
    labelEn: "Documents",
    icon: "📄",
    items: [
      { id: "d-1", textVi: "CMND / CCCD bản sao", textEn: "ID card copy", icon: "🪪" },
      { id: "d-2", textVi: "Giấy đăng ký kết hôn", textEn: "Marriage certificate", icon: "📜" },
      { id: "d-3", textVi: "Danh sách liên hệ khẩn cấp", textEn: "Emergency contact list", icon: "📞" },
      { id: "d-4", textVi: "Lịch trình ngày cưới (bản in)", textEn: "Wedding day timeline (printed)", icon: "📋" },
      { id: "d-5", textVi: "Sơ đồ bàn tiệc", textEn: "Seating chart printout", icon: "🪑" },
    ],
  },
  {
    id: "tech",
    labelVi: "Công nghệ",
    labelEn: "Tech",
    icon: "📱",
    items: [
      { id: "t-1", textVi: "Sạc dự phòng (power bank)", textEn: "Power bank", icon: "🔋" },
      { id: "t-2", textVi: "Cáp sạc điện thoại", textEn: "Phone charging cable", icon: "🔌" },
      { id: "t-3", textVi: "Loa bluetooth nhỏ (nếu cần)", textEn: "Small bluetooth speaker (if needed)", icon: "🔊" },
      { id: "t-4", textVi: "Pin dự phòng cho máy ảnh", textEn: "Camera backup battery", icon: "📷" },
    ],
  },
  {
    id: "food",
    labelVi: "Ăn uống",
    labelEn: "Food & Drink",
    icon: "🥤",
    items: [
      { id: "f-1", textVi: "Nước suối chai nhỏ", textEn: "Small water bottles", icon: "💧" },
      { id: "f-2", textVi: "Snack nhẹ (bánh, trái cây)", textEn: "Light snacks (crackers, fruit)", icon: "🍎" },
      { id: "f-3", textVi: "Ống hút (bảo vệ son)", textEn: "Straws (to protect lipstick)", icon: "🥤" },
      { id: "f-4", textVi: "Kẹo breath mint", textEn: "Breath mints", icon: "🍬" },
    ],
  },
  {
    id: "misc",
    labelVi: "Khác",
    labelEn: "Misc",
    icon: "📦",
    items: [
      { id: "x-1", textVi: "Túi zip dự phòng", textEn: "Ziplock bags", icon: "🛍️" },
      { id: "x-2", textVi: "Khăn giấy / khăn ướt", textEn: "Tissues / wet wipes", icon: "🧻" },
      { id: "x-3", textVi: "Ô / dù (che mưa hoặc nắng)", textEn: "Umbrella (rain or sun)", icon: "☂️" },
      { id: "x-4", textVi: "Bút bi", textEn: "Pen", icon: "🖊️" },
      { id: "x-5", textVi: "Keo dán đa năng (super glue)", textEn: "Super glue", icon: "🔧" },
    ],
  },
];

/** Get all kit item IDs across all categories */
export function getAllKitItemIds(): string[] {
  return WEDDING_DAY_KIT.flatMap((cat) => cat.items.map((item) => item.id));
}

/** Count total items in the kit */
export function getTotalKitItems(): number {
  return WEDDING_DAY_KIT.reduce((sum, cat) => sum + cat.items.length, 0);
}

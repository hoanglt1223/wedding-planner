export interface ItineraryItem {
  id: string;
  startTime: string; // HH:MM format
  duration: number; // minutes
  activity: string;
  activityEn: string;
  location?: string;
  locationEn?: string;
  responsible?: string[]; // wedding party members or vendor roles
  notes?: string;
  notesEn?: string;
  category: "preparation" | "ceremony" | "reception" | "photos" | "transport" | "other";
  isBuffer?: boolean;
  dependentOn?: string; // id of item this must follow
}

export interface ItineraryTemplate {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  defaultStartTimes: Record<string, string>; // activity -> start time
  items: Omit<ItineraryItem, "id">[];
}

export const WEDDING_TYPES: Record<string, { nameVi: string; nameEn: string; descriptionVi: string; descriptionEn: string }> = {
  intimate: {
    nameVi: "Tiệc Thân Mật",
    nameEn: "Intimate Wedding",
    descriptionVi: "Lễ cưới nhỏ gọn, tối giản với khoảng 20-50 khách",
    descriptionEn: "Small, minimalist wedding with ~20-50 guests",
  },
  standard: {
    nameVi: "Tiệc Chuẩn Mực",
    nameEn: "Standard Wedding",
    descriptionVi: "Lễ cưới truyền thống với khoảng 50-150 khách",
    descriptionEn: "Traditional wedding with ~50-150 guests",
  },
  grand: {
    nameVi: "Tiệc Hoành Tráng",
    nameEn: "Grand Wedding",
    descriptionVi: "Lễ cưới lớn với nhiều hoạt động và 150+ khách",
    descriptionEn: "Large wedding with many activities and 150+ guests",
  },
};

function getStandardCeremonyItems(): Omit<ItineraryItem, "id">[] {
  return [
    {
      startTime: "06:00",
      duration: 60,
      activity: "Chuẩn bị cô dâu",
      activityEn: "Bride preparation",
      location: "Nhà cô dâu",
      locationEn: "Bride's home",
      responsible: ["cô dâu", "các bạn thân"],
      notes: "Trang điểm, làm tóc, mặc áo dài",
      notesEn: "Makeup, hair, Ao Dai dressing",
      category: "preparation",
    },
    {
      startTime: "06:30",
      duration: 45,
      activity: "Chuẩn bị chú rể",
      activityEn: "Groom preparation",
      location: "Nhà chú rể",
      locationEn: "Groom's home",
      responsible: ["chú rể", "best man"],
      notes: "Vệ sinh, mặc vest",
      notesEn: "Grooming, suit dressing",
      category: "preparation",
    },
    {
      startTime: "07:15",
      duration: 30,
      activity: "Hình ảnh cô dâu",
      activityEn: "Bride photoshoot",
      location: "Nhà cô dâu",
      locationEn: "Bride's home",
      responsible: ["cô dâu", "người chụp hình"],
      category: "photos",
    },
    {
      startTime: "07:45",
      duration: 15,
      activity: "Di chuyển đến nhà trai",
      activityEn: "Travel to groom's home",
      location: "Trên đường",
      locationEn: "En route",
      responsible: ["đoàn cô dâu"],
      isBuffer: true,
      category: "transport",
    },
    {
      startTime: "08:00",
      duration: 60,
      activity: "Lễ dạm ngõ (nhà trai)",
      activityEn: "Introduction ceremony (groom's home)",
      location: "Nhà trai",
      locationEn: "Groom's home",
      responsible: ["gia đình hai bên", "bố mẹ"],
      notes: "Hỏi cưới, trao nhẫn",
      notesEn: "Proposal, exchange rings",
      category: "ceremony",
    },
    {
      startTime: "09:00",
      duration: 15,
      activity: "Di chuyển đến nơi tổ chức tiệc",
      activityEn: "Travel to reception venue",
      location: "Trên đường",
      locationEn: "En route",
      responsible: ["đoàn hai bên"],
      isBuffer: true,
      category: "transport",
    },
    {
      startTime: "09:15",
      duration: 45,
      activity: "Lễ gia tiên",
      activityEn: "Ancestor ceremony",
      location: "Nơi tiệc",
      locationEn: "Reception venue",
      responsible: ["gia đình", "officiant"],
      notes: "Thờ cúng tổ tiên, phát biểu",
      notesEn: "Ancestor worship, speeches",
      category: "ceremony",
    },
    {
      startTime: "10:00",
      duration: 60,
      activity: "Lễ ăn hỏi",
      activityEn: "Engagement ceremony",
      location: "Nơi tiệc",
      locationEn: "Reception venue",
      responsible: ["gia đình", "người đại diện"],
      notes: "Trao truyền đơn, trà bánh",
      notesEn: "Gift exchange, tea & cakes",
      category: "ceremony",
    },
    {
      startTime: "11:00",
      duration: 15,
      activity: "Thời gian nghỉ ngơi",
      activityEn: "Break time",
      location: "Phong khách",
      locationEn: "VIP room",
      isBuffer: true,
      category: "other",
    },
    {
      startTime: "11:15",
      duration: 30,
      activity: "Chụp hình kỷ niệm",
      activityEn: "Group photoshoot",
      location: "Sảnh tiệc",
      locationEn: "Reception hall",
      responsible: ["gia đình", "bạn bè", "người chụp hình"],
      category: "photos",
    },
    {
      startTime: "11:45",
      duration: 15,
      activity: "Khách mời bắt đầu đến",
      activityEn: "Guests arrival",
      location: "Sảnh chờ",
      locationEn: "Waiting area",
      isBuffer: true,
      category: "other",
    },
    {
      startTime: "12:00",
      duration: 180,
      activity: "Tiệc cưới",
      activityEn: "Wedding reception",
      location: "Sảnh tiệc",
      locationEn: "Reception hall",
      responsible: ["gia đình hai bên", "nhà hàng"],
      notes: "Ăn uống, phát biểu, cắt bánh, ném hoa",
      notesEn: "Dining, speeches, cake cutting, bouquet toss",
      category: "reception",
    },
    {
      startTime: "15:00",
      duration: 30,
      activity: "Chụp hình với khách",
      activityEn: "Guest photos",
      location: "Sảnh tiệc",
      locationEn: "Reception hall",
      responsible: ["cô dâu chú rể", "người chụp hình"],
      category: "photos",
    },
    {
      startTime: "15:30",
      duration: 60,
      activity: "Lễ về nhà chồng",
      activityEn: "Bride goes to groom's home",
      location: "Nhà chồng",
      locationEn: "Groom's home",
      responsible: ["cô dâu chú rể", "gia đình chồng"],
      notes: "Ngồi ghế, thắp nhang",
      notesEn: "Seat ceremony, incense lighting",
      category: "ceremony",
    },
  ];
}

function getIntimateCeremonyItems(): Omit<ItineraryItem, "id">[] {
  const standard = getStandardCeremonyItems();
  return [
    standard[0], // Bride prep
    standard[1], // Groom prep
    {
      startTime: "07:30",
      duration: 45,
      activity: "Lễ dạm ngõ",
      activityEn: "Introduction ceremony",
      location: "Nhà trai",
      locationEn: "Groom's home",
      responsible: ["gia đình"],
      notes: "Hỏi cưới đơn giản",
      notesEn: "Simple proposal",
      category: "ceremony",
    },
    {
      startTime: "08:30",
      duration: 30,
      activity: "Chụp hình gia đình",
      activityEn: "Family photos",
      location: "Nhà trai",
      locationEn: "Groom's home",
      responsible: ["người chụp hình"],
      category: "photos",
    },
    {
      startTime: "09:30",
      duration: 120,
      activity: "Tiệc thân mật",
      activityEn: "Intimate reception",
      location: "Nhà hàng",
      locationEn: "Restaurant",
      responsible: ["gia đình", "bạn thân"],
      category: "reception",
    },
    {
      startTime: "12:00",
      duration: 30,
      activity: "Về nhà chồng",
      activityEn: "Bride goes to groom's home",
      location: "Nhà chồng",
      locationEn: "Groom's home",
      category: "ceremony",
    },
  ];
}

function getGrandCeremonyItems(): Omit<ItineraryItem, "id">[] {
  const standard = getStandardCeremonyItems();
  return [
    ...standard,
    {
      startTime: "05:30",
      duration: 30,
      activity: "Đội ngũ trang điểm đến",
      activityEn: "Makeup team arrival",
      location: "Nhà cô dâu",
      locationEn: "Bride's home",
      responsible: ["người trang điểm"],
      category: "preparation",
    },
    {
      startTime: "16:30",
      duration: 60,
      activity: "Tiệc tối (nếu có)",
      activityEn: "Evening reception (optional)",
      location: "Sảnh tiệc",
      locationEn: "Reception venue",
      responsible: ["gia đình", "nhà hàng"],
      category: "reception",
    },
    {
      startTime: "17:30",
      duration: 30,
      activity: "Chụp hình buổi tối",
      activityEn: "Evening photoshoot",
      location: "Nhiếp ảnh gia đình",
      locationEn: "Photo studio",
      responsible: ["cô dâu chú rể"],
      category: "photos",
    },
  ];
}

export function getItineraryTemplate(weddingType: string): Omit<ItineraryItem, "id">[] {
  switch (weddingType) {
    case "intimate":
      return getIntimateCeremonyItems();
    case "grand":
      return getGrandCeremonyItems();
    case "standard":
    default:
      return getStandardCeremonyItems();
  }
}

export function generateItineraryItems(
  weddingType: string = "standard",
  customStart?: string
): ItineraryItem[] {
  const template = getItineraryTemplate(weddingType);

  // Calculate time offset if custom start time is provided
  let offsetMinutes = 0;
  if (customStart && template.length > 0) {
    const firstItemStart = template[0].startTime;
    offsetMinutes = calculateTimeOffset(firstItemStart, customStart);
  }

  return template.map((item, index) => {
    let adjustedStartTime = item.startTime;
    if (offsetMinutes !== 0) {
      adjustedStartTime = applyTimeOffset(item.startTime, offsetMinutes);
    }

    return {
      ...item,
      id: `iti-${Date.now()}-${index}`,
      startTime: adjustedStartTime,
    };
  });
}

/**
 * Calculate the offset in minutes between two times
 * @param baseTime - The base time in HH:MM format
 * @param targetTime - The target time in HH:MM format
 * @returns The offset in minutes (positive to move forward, negative to move backward)
 */
function calculateTimeOffset(baseTime: string, targetTime: string): number {
  const [baseHours, baseMinutes] = baseTime.split(":").map(Number);
  const [targetHours, targetMinutes] = targetTime.split(":").map(Number);

  const baseTotalMinutes = baseHours * 60 + baseMinutes;
  const targetTotalMinutes = targetHours * 60 + targetMinutes;

  return targetTotalMinutes - baseTotalMinutes;
}

/**
 * Apply a time offset to a given time
 * @param time - The original time in HH:MM format
 * @param offsetMinutes - The offset in minutes (can be positive or negative)
 * @returns The adjusted time in HH:MM format, wrapped around 24 hours if needed
 */
function applyTimeOffset(time: string, offsetMinutes: number): string {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + offsetMinutes;

  // Handle wrapping (can be negative or past 24 hours)
  const wrappedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const newHours = Math.floor(wrappedMinutes / 60);
  const newMinutes = wrappedMinutes % 60;

  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
}

export function getCategoryColor(category: ItineraryItem["category"]): string {
  const colors = {
    preparation: "#3b82f6",
    ceremony: "#ef4444",
    reception: "#10b981",
    photos: "#f59e0b",
    transport: "#8b5cf6",
    other: "#6b7280",
  };
  return colors[category];
}

export function getCategoryLabel(category: ItineraryItem["category"], lang: string): string {
  const labels: Record<ItineraryItem["category"], { vi: string; en: string }> = {
    preparation: { vi: "👔 Chuẩn bị", en: "👔 Preparation" },
    ceremony: { vi: "💒 Lễ nghi", en: "💒 Ceremony" },
    reception: { vi: "🎉 Tiệc cưới", en: "🎉 Reception" },
    photos: { vi: "📸 Chụp hình", en: "📸 Photos" },
    transport: { vi: "🚗 Di chuyển", en: "🚗 Transport" },
    other: { vi: "📌 Khác", en: "📌 Other" },
  };
  return lang === "en" ? labels[category].en : labels[category].vi;
}

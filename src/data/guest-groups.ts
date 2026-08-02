// Guest group categories for wedding planning

export interface GuestGroup {
  key: string;
  label: string;
  labelEn: string;
  color: string;
  icon: string;
  description?: string;
  descriptionEn?: string;
}

export const guestGroups: GuestGroup[] = [
  {
    key: "family-bride",
    label: "Gia đình Nhà Gái",
    labelEn: "Bride's Family",
    color: "#ec4899", // pink
    icon: "👩‍👧‍👦",
    description: "Họ hàng thân thuộc bên cô dâu",
    descriptionEn: "Close relatives from bride's side",
  },
  {
    key: "family-groom",
    label: "Gia đình Nhà Trai",
    labelEn: "Groom's Family",
    color: "#3b82f6", // blue
    icon: "👨‍👧‍👦",
    description: "Họ hàng thân thuộc bên chú rể",
    descriptionEn: "Close relatives from groom's side",
  },
  {
    key: "friends-bride",
    label: "Bạn bè Nhà Gái",
    labelEn: "Bride's Friends",
    color: "#f472b6", // light pink
    icon: "👭",
    description: "Bạn bè cô dâu",
    descriptionEn: "Bride's friends",
  },
  {
    key: "friends-groom",
    label: "Bạn bè Nhà Trai",
    labelEn: "Groom's Friends",
    color: "#60a5fa", // light blue
    icon: "👬",
    description: "Bạn bè chú rể",
    descriptionEn: "Groom's friends",
  },
  {
    key: "colleagues-bride",
    label: "Đồng nghiệp Nhà Gái",
    labelEn: "Bride's Colleagues",
    color: "#a78bfa", // purple
    icon: "💼",
    description: "Đồng nghiệp công tác cô dâu",
    descriptionEn: "Bride's work colleagues",
  },
  {
    key: "colleagues-groom",
    label: "Đồng nghiệp Nhà Trai",
    labelEn: "Groom's Colleagues",
    color: "#818cf8", // indigo
    icon: "💼",
    description: "Đồng nghiệp công tác chú rể",
    descriptionEn: "Groom's work colleagues",
  },
  {
    key: "vip",
    label: "VIP",
    labelEn: "VIP",
    color: "#eab308", // yellow/gold
    icon: "⭐",
    description: "Khách mời quan trọng, thầy cúng, nhà trái hư̛u",
    descriptionEn: "VIP guests, officiants, special guests",
  },
  {
    key: "service",
    label: "Nhà Cung Cấp",
    labelEn: "Service Providers",
    color: "#64748b", // slate
    icon: "🎪",
    description: "Tiệc cưới, trang trí, quay phim, ảnh",
    descriptionEn: "Catering, decoration, photo, video services",
  },
];

export function getGuestGroupByKey(key: string | undefined): GuestGroup | undefined {
  return guestGroups.find((g) => g.key === key);
}

export function getGuestGroupLabel(key: string | undefined, lang: string = "vi"): string {
  const group = getGuestGroupByKey(key);
  if (!group) return "";
  return lang === "en" ? group.labelEn : group.label;
}

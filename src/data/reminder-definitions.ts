// Static reminder rules for countdown widget
// Triggered based on days remaining before wedding date

export interface ReminderDefinition {
  id: string;
  daysBeforeWedding: number; // show when X or fewer days remain
  messageVi: string;
  messageEn: string;
  icon: string;
  type: "deadline" | "milestone";
}

export const REMINDER_DEFINITIONS: ReminderDefinition[] = [
  {
    id: "r-90",
    daysBeforeWedding: 90,
    messageVi: "3 tháng nữa: Đặt nhà hàng & nhiếp ảnh",
    messageEn: "3 months: Book venue & photographer",
    icon: "🏛️",
    type: "deadline",
  },
  {
    id: "r-60",
    daysBeforeWedding: 60,
    messageVi: "2 tháng nữa: Gửi thiệp mời",
    messageEn: "2 months: Send invitations",
    icon: "💌",
    type: "deadline",
  },
  {
    id: "r-30",
    daysBeforeWedding: 30,
    messageVi: "1 tháng nữa: Xác nhận vendor, chốt danh sách khách",
    messageEn: "1 month: Confirm vendors, finalize guest list",
    icon: "✅",
    type: "deadline",
  },
  {
    id: "r-14",
    daysBeforeWedding: 14,
    messageVi: "2 tuần nữa: Sơ đồ bàn, review lịch trình",
    messageEn: "2 weeks: Seating chart, review timeline",
    icon: "🪑",
    type: "deadline",
  },
  {
    id: "r-7",
    daysBeforeWedding: 7,
    messageVi: "1 tuần nữa: Xác nhận lần cuối, chuẩn bị emergency kit",
    messageEn: "1 week: Final confirmations, prepare emergency kit",
    icon: "🎒",
    type: "deadline",
  },
  {
    id: "r-1",
    daysBeforeWedding: 1,
    messageVi: "Ngày mai cưới! Nghỉ ngơi và tận hưởng nhé 💕",
    messageEn: "Wedding tomorrow! Rest and enjoy 💕",
    icon: "💍",
    type: "deadline",
  },
];

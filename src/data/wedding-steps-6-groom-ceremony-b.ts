import type { Ceremony } from "@/types/wedding";

// Ceremonies 5-8 for Step 6: Cưới Trai
export const GROOM_CEREMONIES_B: Ceremony[] = [
  {
    name: "📜 Lễ Vow (Thề Nguyện)",
    required: 0,
    description: "Cô dâu chú rể trao nhau lời thề nguyện — xu hướng đám cưới hiện đại, lãng mạn & cảm xúc.",
    checklist: [
      { text: "Viết lời thề nguyện (mỗi người 1-2 phút)", cost: 0, categoryKey: "other" },
      { text: "Chuẩn bị giấy/sổ đẹp ghi lời thề", cost: 100000, categoryKey: "other" },
      { text: "Người chứng hôn (MC hoặc bạn thân)", cost: 0, categoryKey: "other" },
      { text: "Setup không gian: cổng hoa, nến, ánh sáng nhẹ", cost: 3000000, categoryKey: "decor" },
      { text: "Nhạc nền acoustic/piano nhẹ nhàng", cost: 1000000, categoryKey: "music" },
      { text: "Khăn tay cho khách (giây phút xúc động)", cost: 200000, categoryKey: "other" },
      { text: "Nhiếp ảnh/quay phim close-up", cost: 0, categoryKey: "photo" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc lời thề", avatar: "👰" },
      { name: "Chú rể", role: "Đọc lời thề", avatar: "🤵" },
      { name: "Người chứng hôn", role: "Điều phối", avatar: "🎤" },
      { name: "Gia đình + bạn thân", role: "Chứng kiến", avatar: "👥" },
    ],
    ritualSteps: [
      "MC/người chứng hôn giới thiệu nghi thức Vow",
      "Chú rể đọc lời thề nguyện trước",
      "Cô dâu đọc lời thề nguyện",
      "Trao nhẫn (nếu chưa trao)",
      "Nụ hôn đầu tiên với tư cách vợ chồng",
      "Khách mời vỗ tay, chúc phúc",
      "Tung confetti / cánh hoa",
    ],
    tips: [
      "Viết lời thề TỪ TRÁI TIM — không cần hoàn hảo",
      "Thống nhất độ dài lời thề 2 người",
      "Nên tổ chức TRƯỚC tiệc hoặc ngoài trời lúc hoàng hôn",
      "Lễ Vow quy mô nhỏ (30-50 người) sẽ cảm xúc hơn",
      "Chi phí thêm khoảng 5-15 triệu tùy setup",
      "Có thể kết hợp ngay trên sân khấu tiệc nếu ngân sách hạn chế",
    ],
  },
  {
    name: "🎵 First Dance",
    required: 0,
    description: "Cô dâu chú rể khiêu vũ bài đầu tiên.",
    checklist: [
      { text: "Chọn bài nhạc ý nghĩa", cost: 0, categoryKey: "other" },
      { text: "Tập nhảy trước 2-4 tuần", cost: 1000000, categoryKey: "other" },
      { text: "Sân khấu đủ rộng + ánh sáng spotlight", cost: 0, categoryKey: "decor" },
    ],
    people: [{ name: "Cô dâu & chú rể", role: "", avatar: "💑" }],
    ritualSteps: [
      "MC giới thiệu",
      "Nhạc nổi lên",
      "Cô dâu chú rể bước ra",
      "Khiêu vũ 2-3 phút",
      "Mời bố mẹ / khách cùng nhảy",
    ],
    tips: [
      "Chọn bài nhạc cả 2 đều thích",
      "Không cần quá phức tạp — đơn giản, ngọt ngào là đẹp",
    ],
  },
  {
    name: "✉️ Thư Cảm Ơn Bố Mẹ",
    required: 0,
    description: "Đọc thư cảm ơn bố mẹ hai bên.",
    checklist: [
      { text: "Viết thư tay cho bố mẹ mình", cost: 0, categoryKey: "other" },
      { text: "Chuẩn bị quà kèm (hoa, khung ảnh...)", cost: 500000, categoryKey: "other" },
    ],
    people: [
      { name: "Cô dâu", role: "Đọc thư", avatar: "👰" },
      { name: "Chú rể", role: "Đọc thư", avatar: "🤵" },
      { name: "Bố mẹ 2 bên", role: "Nhận thư", avatar: "👫" },
    ],
    ritualSteps: [
      "MC mời lên sân khấu",
      "Cô dâu đọc thư cho bố mẹ mình",
      "Chú rể đọc thư cho bố mẹ mình",
      "Trao quà, ôm bố mẹ 😢",
      "Khách mời xúc động",
    ],
    tips: ["Chuẩn bị khăn giấy!", "Khoảnh khắc cảm động nhất tiệc cưới"],
  },
];

import type { Ceremony } from "@/types/wedding";

// Ceremonies 5-8 for Step 6: Cuoi Trai
export const CERS_CUOI_TRAI_B: Ceremony[] = [
  {
    nm: "📜 Lễ Vow (Thề Nguyện)",
    req: 0,
    desc: "Cô dâu chú rể trao nhau lời thề nguyện — xu hướng đám cưới hiện đại, lãng mạn & cảm xúc.",
    cl: [
      { t: "Viết lời thề nguyện (mỗi người 1-2 phút)", c: 0, k: "other" },
      { t: "Chuẩn bị giấy/sổ đẹp ghi lời thề", c: 100000, k: "other" },
      { t: "Người chứng hôn (MC hoặc bạn thân)", c: 0, k: "other" },
      { t: "Setup không gian: cổng hoa, nến, ánh sáng nhẹ", c: 3000000, k: "decor" },
      { t: "Nhạc nền acoustic/piano nhẹ nhàng", c: 1000000, k: "music" },
      { t: "Khăn tay cho khách (giây phút xúc động)", c: 200000, k: "other" },
      { t: "Nhiếp ảnh/quay phim close-up", c: 0, k: "photo" },
    ],
    pp: [
      { n: "Cô dâu", r: "Đọc lời thề", a: "👰" },
      { n: "Chú rể", r: "Đọc lời thề", a: "🤵" },
      { n: "Người chứng hôn", r: "Điều phối", a: "🎤" },
      { n: "Gia đình + bạn thân", r: "Chứng kiến", a: "👥" },
    ],
    ri: [
      "MC/người chứng hôn giới thiệu nghi thức Vow",
      "Chú rể đọc lời thề nguyện trước",
      "Cô dâu đọc lời thề nguyện",
      "Trao nhẫn (nếu chưa trao)",
      "Nụ hôn đầu tiên với tư cách vợ chồng",
      "Khách mời vỗ tay, chúc phúc",
      "Tung confetti / cánh hoa",
    ],
    tp: [
      "Viết lời thề TỪ TRÁI TIM — không cần hoàn hảo",
      "Thống nhất độ dài lời thề 2 người",
      "Nên tổ chức TRƯỚC tiệc hoặc ngoài trời lúc hoàng hôn",
      "Lễ Vow quy mô nhỏ (30-50 người) sẽ cảm xúc hơn",
      "Chi phí thêm khoảng 5-15 triệu tùy setup",
      "Có thể kết hợp ngay trên sân khấu tiệc nếu ngân sách hạn chế",
    ],
  },
  {
    nm: "🎵 First Dance",
    req: 0,
    desc: "Cô dâu chú rể khiêu vũ bài đầu tiên.",
    cl: [
      { t: "Chọn bài nhạc ý nghĩa", c: 0, k: "other" },
      { t: "Tập nhảy trước 2-4 tuần", c: 1000000, k: "other" },
      { t: "Sân khấu đủ rộng + ánh sáng spotlight", c: 0, k: "decor" },
    ],
    pp: [{ n: "Cô dâu & chú rể", r: "", a: "💑" }],
    ri: [
      "MC giới thiệu",
      "Nhạc nổi lên",
      "Cô dâu chú rể bước ra",
      "Khiêu vũ 2-3 phút",
      "Mời bố mẹ / khách cùng nhảy",
    ],
    tp: [
      "Chọn bài nhạc cả 2 đều thích",
      "Không cần quá phức tạp — đơn giản, ngọt ngào là đẹp",
    ],
  },
  {
    nm: "✉️ Thư Cảm Ơn Bố Mẹ",
    req: 0,
    desc: "Đọc thư cảm ơn bố mẹ hai bên.",
    cl: [
      { t: "Viết thư tay cho bố mẹ mình", c: 0, k: "other" },
      { t: "Chuẩn bị quà kèm (hoa, khung ảnh...)", c: 500000, k: "other" },
    ],
    pp: [
      { n: "Cô dâu", r: "Đọc thư", a: "👰" },
      { n: "Chú rể", r: "Đọc thư", a: "🤵" },
      { n: "Bố mẹ 2 bên", r: "Nhận thư", a: "👫" },
    ],
    ri: [
      "MC mời lên sân khấu",
      "Cô dâu đọc thư cho bố mẹ mình",
      "Chú rể đọc thư cho bố mẹ mình",
      "Trao quà, ôm bố mẹ 😢",
      "Khách mời xúc động",
    ],
    tp: ["Chuẩn bị khăn giấy!", "Khoảnh khắc cảm động nhất tiệc cưới"],
  },
];

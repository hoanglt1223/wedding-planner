import type { WeddingStep } from "@/types/wedding";
import { GROOM_CEREMONIES_A } from "./wedding-steps-6-groom-ceremony-a";
import { GROOM_CEREMONIES_B } from "./wedding-steps-6-groom-ceremony-b";

export const STEP_GROOM_CEREMONY: WeddingStep = {
  id: "groom-ceremony",
  tab: "🎊 Nhà Trai",
  title: "Bước 6: Tiệc Nhà Trai",
  formalName: "Tiệc Cưới Nhà Trai (Lễ Thành Hôn / Tiệc Chính)",
  icon: "🎊",
  description: "Tiệc cưới chính thức và long trọng nhất — công bố hôn nhân trước cộng đồng, bạn bè, đồng nghiệp.",
  meaning: "Tiệc nhà trai là đỉnh cao của toàn bộ nghi lễ cưới hỏi Việt Nam — kết tinh mọi tháng ngày chuẩn bị. Đây là lúc hai gia đình chính thức giới thiệu cặp đôi trước cộng đồng rộng lớn nhất: họ hàng, bạn bè, đồng nghiệp, hàng xóm. Bao gồm các nghi thức quan trọng nhất: gia tiên nhà trai (cô dâu chính thức thành thành viên gia đình chồng), trao nhẫn cưới (cam kết vĩnh cửu), cắt bánh (chia sẻ ngọt ngào), first dance (khoảnh khắc lãng mạn). Đánh dấu sự khởi đầu chính thức của cuộc sống vợ chồng trước pháp luật và cộng đồng.",
  notes: [
    "Cần 2-3 người ghi phong bì TIN CẬY — khoản tiền rất lớn, phải có sổ ghi chép rõ ràng",
    "Kịch bản MC chuẩn bị CHI TIẾT từng phút — có bản backup, MC phụ dự phòng",
    "Kiểm tra âm thanh, ánh sáng, nhạc, slideshow, mic TRƯỚC 3 giờ khai tiệc",
    "Luôn có timeline dự phòng — tiệc cưới LUÔN trễ 15-30 phút so với kế hoạch",
    "Cô dâu bước vào nhà chồng phải bước chân PHẢI trước — phong tục may mắn",
    "Phòng tân hôn chuẩn bị sẵn: hoa tươi, nến, quà tặng, ga giường đỏ mới",
    "Giao cho 1 người DUY NHẤT phụ trách nhẫn cưới — tránh sự cố quên nhẫn",
    "Chuẩn bị phòng thay đồ riêng cho cô dâu: gương, đèn, makeup touch-up",
    "Nước uống + snack cho cô dâu chú rể — rất hay quên ăn vì bận tiếp khách",
    "Playlist nhạc 3-4 giờ: nhạc nền nhẹ lúc ăn → nhạc sôi động lúc games → nhạc lãng mạn lúc dance",
    "Backup plan: MC phụ, pin dự phòng cho mic, đèn pin phòng mất điện",
    "Người phụ trách quà: nhận quà, ghi tên, cất giữ an toàn — tránh thất lạc",
    "🎤 Karaoke gợi ý (Bolero cho ông bà, ba mẹ): Ngày Xuân Long Phụng Sum Vầy, Đám Cưới Trên Đường Quê, Tình Nghèo Có Nhau, Ly Rượu Mừng",
    "🎤 Karaoke gợi ý (Nhạc trẻ/Ballad): Cưới Nhau Đi (Bùi Anh Tuấn), Hôm Nay Mình Cưới (Đức Phúc), Beautiful In White, Perfect (Ed Sheeran), A Thousand Years",
    "🎤 Karaoke gợi ý (Sôi động/After party): Bống Bống Bang Bang, See Tình (Hoàng Thùy Linh), Hai Phút Hơn Remix, Em Của Ngày Hôm Qua (Sơn Tùng)",
    "🎤 Karaoke rất phổ biến ở đám cưới miền Tây — nên chuẩn bị dàn loa tốt + micro không dây",
  ],
  timeline: "Ngày cưới",
  aiHint: "Kịch bản MC đám cưới từng phút, menu tiệc 3 mức giá, games vui cho tiệc cưới.",
  ceremonies: [...GROOM_CEREMONIES_A, ...GROOM_CEREMONIES_B],
};

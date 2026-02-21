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
  meaning: "Tiệc nhà trai là đỉnh cao của toàn bộ nghi lễ cưới hỏi Việt Nam. Đây là lúc hai gia đình chính thức giới thiệu cặp đôi trước cộng đồng rộng lớn nhất. Bao gồm các nghi thức quan trọng: gia tiên nhà trai (cô dâu lạy tổ tiên nhà chồng), trao nhẫn cưới, cắt bánh, first dance. Đánh dấu sự khởi đầu chính thức của cuộc sống vợ chồng.",
  notes: [
    "Cần 2-3 người ghi phong bì TIN CẬY — đây là khoản tiền lớn",
    "Kịch bản MC phải chuẩn bị CHI TIẾT từng phút, có bản dự phòng",
    "Kiểm tra âm thanh, ánh sáng, nhạc, slideshow trước 3 giờ",
    "Luôn có timeline dự phòng — tiệc cưới thường trễ 15-30 phút",
    "Cô dâu bước vào nhà chồng phải bước chân PHẢI trước",
    "Phòng tân hôn chuẩn bị sẵn: hoa, nến, quà cho cặp đôi",
    "Giao cho 1 người phụ trách nhẫn cưới — tránh quên!",
  ],
  timeline: "Ngày cưới",
  aiHint: "Kịch bản MC đám cưới từng phút, menu tiệc 3 mức giá, games vui cho tiệc cưới.",
  ceremonies: [...GROOM_CEREMONIES_A, ...GROOM_CEREMONIES_B],
};

import type { WeddingStep } from "@/types/wedding";
import { CERS_CUOI_TRAI_A } from "./wedding-steps-6-cuoitrai-a";
import { CERS_CUOI_TRAI_B } from "./wedding-steps-6-cuoitrai-b";

export const STEP_CUOI_TRAI: WeddingStep = {
  id: "cuoitrai",
  tab: "🎊 Nhà Trai",
  title: "Bước 6: Tiệc Nhà Trai",
  icon: "🎊",
  desc: "Tiệc cưới chính thức.",
  tm: "Ngày cưới",
  aiHint: "Kịch bản MC đám cưới từng phút, menu tiệc 3 mức giá, games vui cho tiệc cưới.",
  cers: [...CERS_CUOI_TRAI_A, ...CERS_CUOI_TRAI_B],
};

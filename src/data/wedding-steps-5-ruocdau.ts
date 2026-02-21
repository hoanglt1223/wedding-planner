import type { WeddingStep } from "@/types/wedding";

export const STEP_RUOC_DAU: WeddingStep = {
  id: "ruocdau",
  tab: "🚗 Rước Dâu",
  title: "Bước 5: Rước Dâu",
  icon: "🚗",
  desc: "Đón cô dâu về nhà chồng.",
  tm: "Sáng ngày cưới",
  aiHint: "Hướng dẫn chi tiết lễ rước dâu, chặn cổng, giờ hoàng đạo, phong bì mở cổng.",
  cers: [
    {
      nm: "🚗 Rước Dâu",
      req: 1,
      desc: "Chú rể đón cô dâu.",
      cl: [
        { t: "Xem giờ hoàng đạo", c: 200000, k: "other" },
        { t: "Xe hoa + đoàn xe SỐ CHẴN", c: 5000000, k: "transport" },
        { t: "Bó hoa cưới", c: 500000, k: "flower" },
        { t: "Phong bì mở cổng", c: 1500000, k: "other" },
        { t: "Cô dâu makeup từ sớm", c: 3000000, k: "makeup" },
        { t: "Kiểm tra nhẫn!", c: 0, k: "other" },
        { t: "Dù đỏ", c: 200000, k: "other" },
        { t: "Nhiếp ảnh", c: 5000000, k: "photo" },
      ],
      pp: [
        { n: "Chú rể", r: "Đón dâu", a: "🤵" },
        { n: "Phù dâu", r: "Chặn cổng", a: "👧" },
        { n: "Phù rể", r: "Hỗ trợ", a: "🤵" },
      ],
      ri: [
        "Đoàn xe xuất phát ĐÚNG GIỜ",
        "Chặn cổng vui nhộn",
        "Trao hoa cho cô dâu",
        "Lạy gia tiên nhà gái",
        "Cô dâu lạy tạ cha mẹ 😢",
        "Lên xe hoa (KHÔNG quay lại)",
        "Đi đường KHÁC lúc đến",
      ],
      tp: ["KHÔNG TRỄ giờ hoàng đạo", "Nhiều phong bì lẻ"],
    },
    {
      nm: "🚪 Chặn Cổng",
      req: 0,
      desc: "Phù dâu thử thách chú rể.",
      cl: [
        { t: "Câu đố về cô dâu", c: 0, k: "other" },
        { t: "Thử thách (hát, nhảy)", c: 0, k: "other" },
        { t: "Không quá 15-20 phút", c: 0, k: "other" },
      ],
      pp: [
        { n: "Phù dâu", r: "", a: "👧" },
        { n: "Chú rể", r: "", a: "🤵" },
      ],
      ri: ["Đố → Thử thách → Phong bì", "Chú rể vượt qua"],
      tp: ["Vui nhộn, không quá khó"],
    },
  ],
};

// Thần Số Học — Wedding Day Number interpretations

export interface WeddingDayMeaning {
  universalDay: number;
  label: string;
  suitability: "excellent" | "good" | "neutral" | "avoid";
  description: string;
  weddingTip: string;
}

export const WEDDING_DAY_MEANINGS: WeddingDayMeaning[] = [
  {
    universalDay: 1, label: "Ngày Khởi Đầu", suitability: "good",
    description: "Năng lượng khởi đầu mới, sáng tạo và độc lập. Phù hợp cho cặp đôi muốn tạo dấu ấn riêng.",
    weddingTip: "Tốt cho cặp đôi mạnh mẽ, độc lập. Tránh nếu cần sự hợp tác từ nhiều gia đình.",
  },
  {
    universalDay: 2, label: "Ngày Kết Đôi", suitability: "excellent",
    description: "Số của sự hợp tác và tình yêu đôi lứa. Năng lượng hài hòa, nhẹ nhàng.",
    weddingTip: "Ngày tuyệt vời cho đám cưới! Số 2 tượng trưng cho sự kết đôi hoàn hảo.",
  },
  {
    universalDay: 3, label: "Ngày Hạnh Phúc", suitability: "good",
    description: "Năng lượng vui vẻ, sáng tạo và lạc quan. Đám cưới sẽ tràn đầy tiếng cười.",
    weddingTip: "Đám cưới rộn ràng, nhiều niềm vui. Phù hợp cho tiệc lớn, nhiều khách.",
  },
  {
    universalDay: 4, label: "Ngày Nền Tảng", suitability: "neutral",
    description: "Năng lượng ổn định và xây dựng. Tốt cho nền tảng nhưng thiếu lãng mạn.",
    weddingTip: "Phù hợp cho cặp đôi thực tế muốn xây dựng cuộc sống vững chắc.",
  },
  {
    universalDay: 5, label: "Ngày Thay Đổi", suitability: "avoid",
    description: "Năng lượng bất ổn và thay đổi. Không lý tưởng cho cam kết lâu dài.",
    weddingTip: "Nên tránh ngày này cho đám cưới. Năng lượng quá bất ổn định.",
  },
  {
    universalDay: 6, label: "Ngày Tình Yêu", suitability: "excellent",
    description: "Số của tình yêu, gia đình và trách nhiệm. Ngày lý tưởng nhất cho đám cưới!",
    weddingTip: "Ngày hoàn hảo nhất! Số 6 là số hôn nhân, gia đình và hạnh phúc.",
  },
  {
    universalDay: 7, label: "Ngày Tâm Linh", suitability: "neutral",
    description: "Năng lượng tâm linh, nội tâm. Phù hợp đám cưới nhỏ, ý nghĩa sâu sắc.",
    weddingTip: "Tốt cho đám cưới intimate, ít khách. Không phù hợp tiệc lớn, ồn ào.",
  },
  {
    universalDay: 8, label: "Ngày Thịnh Vượng", suitability: "good",
    description: "Năng lượng thịnh vượng và thành công vật chất. Đám cưới sang trọng.",
    weddingTip: "Phù hợp đám cưới sang trọng. Mang lại may mắn về tài chính cho đôi vợ chồng.",
  },
  {
    universalDay: 9, label: "Ngày Viên Mãn", suitability: "good",
    description: "Năng lượng hoàn thiện và nhân ái. Kết thúc đẹp đẽ, mở ra chương mới.",
    weddingTip: "Đám cưới ý nghĩa, tràn đầy tình yêu. Đặc biệt tốt cho đám cưới cuối năm.",
  },
  {
    universalDay: 11, label: "Ngày Tâm Linh Cao", suitability: "excellent",
    description: "Số chủ 11 mang năng lượng tâm linh mạnh mẽ và kết nối sâu sắc.",
    weddingTip: "Ngày đặc biệt hiếm! Kết nối tâm hồn sâu sắc giữa hai người.",
  },
  {
    universalDay: 22, label: "Ngày Kiến Tạo", suitability: "excellent",
    description: "Số chủ 22 mang năng lượng xây dựng vĩ đại và tầm nhìn xa.",
    weddingTip: "Ngày cực kỳ đặc biệt! Xây dựng nền tảng gia đình bền vững trăm năm.",
  },
  {
    universalDay: 33, label: "Ngày Yêu Thương", suitability: "excellent",
    description: "Số chủ 33 là số của tình yêu vô điều kiện và sự chữa lành.",
    weddingTip: "Ngày hiếm có nhất! Tình yêu thiêng liêng và sự ban phước từ vũ trụ.",
  },
];

/** Lookup wedding day meaning by Universal Day Number */
export function getWeddingDayMeaning(universalDay: number): WeddingDayMeaning {
  return (
    WEDDING_DAY_MEANINGS.find((m) => m.universalDay === universalDay) ??
    WEDDING_DAY_MEANINGS.find((m) => m.universalDay === (universalDay % 9 || 9)) ??
    WEDDING_DAY_MEANINGS[0]
  );
}

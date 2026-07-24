/**
 * Traditional Anniversary Gift Suggestions
 * Based on Western anniversary gift traditions
 */

export interface AnniversaryGift {
  year: number;
  theme: string;          // Traditional theme (e.g., "Paper", "Silver")
  modernTheme?: string;   // Modern alternative theme
  ideas: string[];        // Gift ideas for this year
  color?: string;         // Associated color for gifts
  flower?: string;        // Associated flower for this year
}

export const ANNIVERSARY_GIFTS: AnniversaryGift[] = [
  {
    year: 1,
    theme: "Giấy",
    modernTheme: "Đồng hồ",
    ideas: [
      "Hình ảnh cưới trong khung",
      "Album ảnh kỷ niệm",
      "Vé cho chuyến đi",
      "Sổ tay làm thủ công",
      "Bản đồ tình yêu"
    ],
    color: "Vàng",
    flower: "Hoa cẩm chướng"
  },
  {
    year: 2,
    theme: "Bông Cotton",
    modernTheme: "Gỗ sồi",
    ideas: [
      "Chăn ga cotton cao cấp",
      "Áo cotton thêu tên",
      "Giỏ picnic cotton",
      "Gối ôm tùy chỉnh",
      "Bộ đồ ngủ cotton"
    ],
    color: "Xanh lá",
    flower: "Hoa linh lan"
  },
  {
    year: 3,
    theme: "Da",
    modernTheme: "Thủy tinh",
    ideas: [
      "Ví da cá nhân",
      "Thắt lưng da",
      "Túi xách da",
      "Giày da",
      "Dây đeo đồng hồ da"
    ],
    color: "Nâu",
    flower: "Hoa rose"
  },
  {
    year: 4,
    theme: "Linh kiện/Hoa quả",
    modernTheme: "Điện gia dụng",
    ideas: [
      "Bộ hoa quả đặt bảng",
      "Trang sức hạt cườm",
      "Máy làm sinh tố",
      "Đèn trang trí",
      "Bình hoa tinh xảo"
    ],
    color: "Xanh dương",
    flower: "Hoa cúc"
  },
  {
    year: 5,
    theme: "Gỗ",
    modernTheme: "Bạc",
    ideas: [
      "Tượng gỗ điêu khắc",
      "Đồng hồ gỗ",
      "Khung ảnh gỗ",
      "Dĩa gỗ",
      "Nhà gỗ hộp di động"
    ],
    color: "Xanh ngọc",
    flower: "Hoa loa kèn"
  },
  {
    year: 6,
    theme: "Sắt",
    modernTheme: "Gỗ mun",
    ideas: [
      "Sắt tiện ích nhà",
      "Tượng sắt",
      "Đèn chùm sắt",
      "Khay trang trí sắt",
      "Dự án DIY sắt"
    ],
    color: "Trắng",
    flower: "Hoa cúc trắng"
  },
  {
    year: 7,
    theme: "Đồng",
    modernTheme: "Len",
    ideas: [
      "Tượng đồng",
      "Chảo đồng",
      "Dây chuyền đồng",
      "Khay đồng",
      "Ấm thưởng đồng"
    ],
    color: "Vàng đồng",
    flower: "Hoa jacaranda"
  },
  {
    year: 8,
    theme: "Bronze",
    modernTheme: "Linens",
    ideas: [
      "Tượng bronze",
      "Huy chương bronze",
      "Khay bronze",
      "Phụ kiện trang trí bronze",
      "Dụng cụ bronze"
    ],
    color: "Đồng",
    flower: "Hoa cẩm tú cầu"
  },
  {
    year: 9,
    theme: "Gốm",
    modernTheme: "Da",
    ideas: [
      "Bát đĩa gốm",
      "Chậu cây gốm",
      "Tượng gốm",
      "Bộ trà gốm",
      "Đèn gốm"
    ],
    color: "Terracotta",
    flower: "Hoa mắt hươu"
  },
  {
    year: 10,
    theme: "Tin",
    modernTheme: "Kim cương",
    ideas: [
      "Dụng cụ nấu tin",
      "Hộp đựng trang sức tin",
      "Khay trang trí tin",
      "Ly uống tin",
      "Bộ thiệp tin"
    ],
    color: "Xanh bạc",
    flower: "Hoa hồng trắng"
  },
  {
    year: 11,
    theme: "Thép",
    modernTheme: "Thời trang",
    ideas: [
      "Dụng cụ nhà bếp thép",
      "Khung thép",
      "Vòng tay thép",
      "Đèn thép",
      "Dự án DIY thép"
    ],
    color: "Xám",
    flower: "Hoa phong lan"
  },
  {
    year: 12,
    theme: "Lụa",
    modernTheme: "Pearl",
    ideas: [
      "Áo lụa",
      "Khăn lụa",
      "Ga gối lụa",
      "Cà vạt lụa",
      "Váy lụa"
    ],
    color: "Hồng",
    flower: "Hoa violet"
  },
  {
    year: 13,
    theme: "Ren",
    modernTheme: "Đá quý",
    ideas: [
      "Váy ren",
      "Khăn trải bàn ren",
   "Gối ren",
      "Áo ren",
      "Phụ kiện ren"
    ],
    color: "Trắng kem",
    flower: "Hoa thủy tiên"
  },
  {
    year: 14,
    theme: "Ngà",
    modernTheme: "Vàng",
    ideas: [
      "Phụ kiện ngà",
      "Trang sức ngà",
      "Tượng ngà",
      "Dụng cụ ngà",
      "Hộp ngà"
    ],
    color: "Kem",
    flower: "Hoa tulip"
  },
  {
    year: 15,
    theme: "Pha lê",
    modernTheme: "Đồng hồ",
    ideas: [
      "Ly pha lê",
      "Bình pha lê",
      "Đèn pha lê",
      "Tượng pha lê",
      "Vô lăng pha lê"
    ],
    color: "Trong suốt",
    flower: "Hoa hồng"
  },
  {
    year: 20,
    theme: "Bạch",
    modernTheme: "Platinum",
    ideas: [
      "Trang sức bạch kim",
      "Đồng hồ bạch kim",
      "Dụng cụ nấu bạch kim",
      "Khay bạch kim",
      "Bộ dao bạch kim"
    ],
    color: "Bạc",
    flower: "Hoa hồng đỏ"
  },
  {
    year: 25,
    theme: "Bạc",
    modernTheme: "Bạc",
    ideas: [
      "Dụng cụ bạc",
      "Khay bạc",
      "Tượng bạc",
      "Tranh bạc",
      "Đồ trang trí bạc"
    ],
    color: "Bạc",
    flower: "Hoa hồng vàng"
  },
  {
    year: 30,
    theme: "Pearl",
    modernTheme: "Kim cương",
    ideas: [
      "Dây chuyền Pearl",
      "Khuyên tai Pearl",
      "Vòng Pearl",
      "Hộp Pearl",
      "Gương Pearl"
    ],
    color: "Trắng ngà",
    flower: "Hoa lan"
  },
  {
    year: 40,
    theme: "Ruby",
    modernTheme: "Ruby",
    ideas: [
      "Trang sức Ruby",
      "Đồng hồ Ruby",
      "Khuy Ruby",
      "Vòng Ruby",
      "Bông tai Ruby"
    ],
    color: "Đỏ",
    flower: "Hoa hồng Ruby"
  },
  {
    year: 50,
    theme: "Vàng",
    modernTheme: "Vàng",
    ideas: [
      "Trang sức vàng",
      "Đồng hồ vàng",
      "Dụng cụ vàng",
      "Tượng vàng",
      "Khay vàng"
    ],
    color: "Vàng",
    flower: "Hoa hồng vàng"
  },
  {
    year: 60,
    theme: "Kim cương",
    modernTheme: "Kim cương",
    ideas: [
      "Trang sức kim cương",
      "Đồng hồ kim cương",
      "Vòng kim cương",
      "Khuyên tai kim cương",
      "Hộp kim cương"
    ],
    color: "Trong suốt",
    flower: "Hoa hồng kim cương"
  }
];

export function getAnniversaryGift(year: number): AnniversaryGift | undefined {
  return ANNIVERSARY_GIFTS.find(gift => gift.year === year);
}

export function getGiftSuggestions(year: number): string[] {
  const gift = getAnniversaryGift(year);
  return gift?.ideas || [];
}
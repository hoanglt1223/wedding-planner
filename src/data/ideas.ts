export interface IdeaItemExt {
  icon: string;
  title: string;
  desc: string;
  status: "done" | "planned" | "future";
}

export const IDEAS: IdeaItemExt[] = [
  {
    icon: "🗓️",
    title: "Countdown timer",
    desc: "Dem nguoc den ngay cuoi, hien thi tren header.",
    status: "done",
  },
  {
    icon: "📊",
    title: "Dashboard chi phi thuc te",
    desc: "Theo doi chi phi thuc vs du toan, nhap tung khoan da chi, bieu do so sanh.",
    status: "done",
  },
  {
    icon: "📜",
    title: "Luu tru vinh vien",
    desc: "Export toan bo data ra JSON, import lai khi can.",
    status: "done",
  },
  {
    icon: "🔗",
    title: "QR Code thiep online",
    desc: "Tao QR code cho moi thiep, khach quet de xem ban do, RSVP, album anh cuoi.",
    status: "planned",
  },
  {
    icon: "📱",
    title: "RSVP truc tuyen",
    desc: "Gui link cho khach xac nhan tham du, tu dem so ban can dat.",
    status: "planned",
  },
  {
    icon: "📋",
    title: "So do ban tiec",
    desc: "Keo tha khach vao tung ban, in so do cho ngoi.",
    status: "planned",
  },
  {
    icon: "🎨",
    title: "Theme mau tuy chinh",
    desc: "Cho phep chon bang mau chu dao: pastel, do truyen thong, xanh navy, hong blush...",
    status: "planned",
  },
  {
    icon: "📸",
    title: "Gallery anh cuoi",
    desc: "Upload & quan ly anh pre-wedding, anh ngay cuoi.",
    status: "future",
  },
  {
    icon: "🔔",
    title: "Nhac nho tu dong",
    desc: "Gui thong bao truoc deadline: book vendor, gui thiep, thu vay...",
    status: "future",
  },
  {
    icon: "💬",
    title: "Chat giua co dau & chu re",
    desc: "Ghi chu, giao viec, cap nhat tien do cho nhau.",
    status: "future",
  },
  {
    icon: "🌍",
    title: "Multi-language",
    desc: "Ho tro tieng Anh cho khach nuoc ngoai / Viet kieu.",
    status: "future",
  },
  {
    icon: "🎬",
    title: "Video timeline",
    desc: "Tao video slideshow tu dong tu anh cuoi + nhac nen.",
    status: "future",
  },
  {
    icon: "👗",
    title: "Mood board trang phuc",
    desc: "Pin anh vay cuoi, vest, phu kien yeu thich de so sanh.",
    status: "future",
  },
  {
    icon: "🗺️",
    title: "Ban do vendor",
    desc: "Map hien thi nha hang, studio, tiem hoa gan ban.",
    status: "future",
  },
];

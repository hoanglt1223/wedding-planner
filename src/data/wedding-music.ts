// Wedding music recommendations and templates for Vietnamese and international weddings

export interface MusicCategory {
  id: string;
  icon: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  typicalDuration: string; // e.g., "3-5 minutes"
  tipsVi: string[];
  tipsEn: string[];
}

export interface SongRecommendation {
  id: string;
  title: string;
  artist: string;
  duration: string; // e.g., "3:45"
  language: "vi" | "en" | "instrumental";
  mood: "romantic" | "upbeat" | "traditional" | "emotional" | "celebratory";
  category: string;
  popular: boolean; // classic/popular choice
  notesVi?: string;
  notesEn?: string;
}

export const MUSIC_CATEGORIES: MusicCategory[] = [
  {
    id: "ceremony-processional",
    icon: "🚶‍♀️",
    nameVi: "Nhập đường - Cô dâu",
    nameEn: "Processional - Bride",
    descriptionVi: "Nhạc khi cô dâu đi vào lễ đường",
    descriptionEn: "Music for bride's entrance",
    typicalDuration: "2-4 phút",
    tipsVi: [
      "Chọn bài nhạc nhẹ nhàng, lãng mạn",
      "Tránh bài quá dài hoặc quá mạnh",
      "Có thể dùng nhạc không lời (instrumental)",
      "Thường chậm hơn nhạc ra về",
    ],
    tipsEn: [
      "Choose gentle, romantic music",
      "Avoid too long or too strong songs",
      "Can use instrumental versions",
      "Usually slower than recessional",
    ],
  },
  {
    id: "ceremony-recessional",
    icon: "🎉",
    nameVi: "Ra về - Cặp đôi",
    nameEn: "Recessional - Couple",
    descriptionVi: "Nhạc vui tươi khi cặp đôi rời lễ đường",
    descriptionEn: "Upbeat music for couple's exit",
    typicalDuration: "1-3 phút",
    tipsVi: [
      "Nhạc vui tươi, phấn khởi",
      "Ngắn gọn hơn nhập đường",
      "Tạo không khí hân hoan",
      "Có thể dùng bài hát yêu thích của cặp đôi",
    ],
    tipsEn: [
      "Upbeat, celebratory music",
      "Shorter than processional",
      "Create joyful atmosphere",
      "Can use couple's favorite song",
    ],
  },
  {
    id: "first-dance",
    icon: "💃",
    nameVi: "Bài hát đầu tiên",
    nameEn: "First Dance",
    descriptionVi: "Bài hát khi cặp đôi khiêu đũa lần đầu",
    descriptionEn: "Song for couple's first dance",
    typicalDuration: "3-5 phút",
    tipsVi: [
      "Bài hát có ý nghĩa đặc biệt với cặp đôi",
      "Chọn nhịp độ khiêu vũ phù hợp",
      "Thông báo DJ/MC để chuẩn bị",
      "Có thể cắt ngắn nếu quá dài",
    ],
    tipsEn: [
      "Song meaningful to the couple",
      "Choose danceable tempo",
      "Inform DJ/MC in advance",
      "Can edit down if too long",
    ],
  },
  {
    id: "party-music",
    icon: "🎊",
    nameVi: "Nhạc tiệc",
    nameEn: "Party Music",
    descriptionVi: "Nhạc sôi động cho tiệc cưới",
    descriptionEn: "Upbeat music for reception party",
    typicalDuration: "Toàn bộ tiệc",
    tipsVi: [
      "Phù hợp mọi độ tuổi khách mời",
      "Kết hợp nhạc Việt Nam và quốc tế",
      "Có cả nhạc slow và dance",
      "Yêu cầu khách yêu cầu bài hát",
    ],
    tipsEn: [
      "Suit all ages of guests",
      "Mix Vietnamese and international",
      "Include both slow and dance music",
      "Take song requests from guests",
    ],
  },
  {
    id: "traditional",
    icon: "🎵",
    nameVi: "Nhạc truyền thống",
    nameEn: "Traditional Music",
    descriptionVi: "Nhạc dân gian và truyền thống Việt Nam",
    descriptionEn: "Vietnamese traditional and folk music",
    typicalDuration: "Lễ gia tiên",
    tipsVi: [
      "Dùng trong lễ gia tiên",
      "Bài hát cổ truyền, nhạc dân gian",
      "Tôn trọng truyền thống",
      "Có thể mời nhóm nhạc trực tiếp",
    ],
    tipsEn: [
      "Use for ancestral ceremony",
      "Traditional songs, folk music",
      "Respect traditions",
      "Can invite live musicians",
    ],
  },
];

export const SONG_RECOMMENDATIONS: SongRecommendation[] = [
  // Processional - Bride Entrance
  {
    id: "bridal-chorus",
    title: "Bridal Chorus",
    artist: "Richard Wagner",
    duration: "3:30",
    language: "instrumental",
    mood: "romantic",
    category: "ceremony-processional",
    popular: true,
    notesVi: "Kinh điển, trang trọng",
    notesEn: "Classic, elegant",
  },
  {
    id: " Canon-in-D",
    title: "Canon in D",
    artist: "Johann Pachelbel",
    duration: "5:00",
    language: "instrumental",
    mood: "romantic",
    category: "ceremony-processional",
    popular: true,
    notesVi: "Nhẹ nhàng, lãng mạn",
    notesEn: "Gentle, romantic",
  },
  {
    id: "ave-maria",
    title: "Ave Maria",
    artist: "Franz Schubert",
    duration: "4:30",
    language: "instrumental",
    mood: "emotional",
    category: "ceremony-processional",
    popular: true,
    notesVi: "Cảm động, thiêng liêng",
    notesEn: "Emotional, sacred",
  },
  {
    id: "a-thousand-years",
    title: "A Thousand Years",
    artist: "Christina Perri",
    duration: "4:45",
    language: "en",
    mood: "romantic",
    category: "ceremony-processional",
    popular: true,
    notesVi: "Hiện đại, lãng mạn",
    notesEn: "Modern, romantic",
  },
  {
    id: "perfect",
    title: "Perfect",
    artist: "Ed Sheeran",
    duration: "4:23",
    language: "en",
    mood: "romantic",
    category: "ceremony-processional",
    popular: true,
    notesVi: "Romantic pop, phổ biến",
    notesEn: "Romantic pop, popular",
  },

  // Recessional - Exit
  {
    id: "wedding-march",
    title: "Wedding March",
    artist: "Felix Mendelssohn",
    duration: "2:30",
    language: "instrumental",
    mood: "celebratory",
    category: "ceremony-recessional",
    popular: true,
    notesVi: "Kinh điển, phấn khởi",
    notesEn: "Classic, celebratory",
  },
  {
    id: "hornpipe",
    title: " Hornpipe",
    artist: "George Handel",
    duration: "3:00",
    language: "instrumental",
    mood: "upbeat",
    category: "ceremony-recessional",
    popular: true,
    notesVi: "Vui tươi, trang trọng",
    notesEn: "Upbeat, elegant",
  },
  {
    id: "happy",
    title: "Happy",
    artist: "Pharrell Williams",
    duration: "3:53",
    language: "en",
    mood: "upbeat",
    category: "ceremony-recessional",
    popular: true,
    notesVi: "Vui tươi, hiện đại",
    notesEn: "Upbeat, modern",
  },
  {
    id: "isnt-she-lovely",
    title: "Isn't She Lovely",
    artist: "Stevie Wonder",
    duration: "6:33",
    language: "en",
    mood: "celebratory",
    category: "ceremony-recessional",
    popular: false,
    notesVi: "R&B vui tươi, có thể cắt ngắn",
    notesEn: "Upbeat R&B, can be shortened",
  },

  // First Dance
  {
    id: "at-last",
    title: "At Last",
    artist: "Etta James",
    duration: "3:02",
    language: "en",
    mood: "romantic",
    category: "first-dance",
    popular: true,
    notesVi: "R&B kinh điển, lãng mạn",
    notesEn: "Classic R&B, romantic",
  },
  {
    id: "thinking-out-loud",
    title: "Thinking Out Loud",
    artist: "Ed Sheeran",
    duration: "4:41",
    language: "en",
    mood: "romantic",
    category: "first-dance",
    popular: true,
    notesVi: "Hiện đại, lãng mạn",
    notesEn: "Modern, romantic",
  },
  {
    id: "all-of-me",
    title: "All of Me",
    artist: "John Legend",
    duration: "4:29",
    language: "en",
    mood: "romantic",
    category: "first-dance",
    popular: true,
    notesVi: "Ballad lãng mạn",
    notesEn: "Romantic ballad",
  },
  {
    id: "make-you-feel-my-love",
    title: "Make You Feel My Love",
    artist: "Adele",
    duration: "3:32",
    language: "en",
    mood: "emotional",
    category: "first-dance",
    popular: true,
    notesVi: "Cảm động, sâu sắc",
    notesEn: "Emotional, deep",
  },
  {
    id: "la Vie-en-rose",
    title: "La Vie En Rose",
    artist: "Edith Piaf",
    duration: "3:07",
    language: "en",
    mood: "romantic",
    category: "first-dance",
    popular: true,
    notesVi: "Kinh điển Pháp, lãng mạn",
    notesEn: "French classic, romantic",
  },
  {
    id: "nhu-yeu-em",
    title: "Như Ý Em",
    artist: "Sơn Tùng M-TP",
    duration: "4:12",
    language: "vi",
    mood: "romantic",
    category: "first-dance",
    popular: true,
    notesVi: "Pop Việt lãng mạn",
    notesEn: "Vietnamese romantic pop",
  },
  {
    id: "em-dep-hom-nay",
    title: "Em Đẹp Hôm Nay",
    artist: "Sơn Tùng M-TP",
    duration: "4:08",
    language: "vi",
    mood: "upbeat",
    category: "first-dance",
    popular: true,
    notesVi: "Pop Việt vui tươi",
    notesEn: "Vietnamese upbeat pop",
  },

  // Party Music
  {
    id: "uptown-funk",
    title: "Uptown Funk",
    artist: "Mark Ronson ft. Bruno Mars",
    duration: "4:30",
    language: "en",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "Dance hit, sôi động",
    notesEn: "Dance hit, energetic",
  },
  {
    id: "celebration",
    title: "Celebration",
    artist: "Kool & The Gang",
    duration: "3:30",
    language: "en",
    mood: "celebratory",
    category: "party-music",
    popular: true,
    notesVi: "Disco kinh điển",
    notesEn: "Classic disco",
  },
  {
    id: "can-t-stop-the-feeling",
    title: "Can't Stop the Feeling!",
    artist: "Justin Timberlake",
    duration: "3:56",
    language: "en",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "Pop dance, vui tươi",
    notesEn: "Pop dance, upbeat",
  },
  {
    id: "shape-of-you",
    title: "Shape of You",
    artist: "Ed Sheeran",
    duration: "3:53",
    language: "en",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "Pop hit phổ biến",
    notesEn: "Popular pop hit",
  },
  {
    id: "hay-ra-cung-yeu",
    title: "Hãy Ra Cùng Yêu",
    artist: "Bích Phương",
    duration: "3:45",
    language: "vi",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "V-pop vui tươi",
    notesEn: "Upbeat V-pop",
  },
  {
    id: "con-mua-ngang-qua",
    title: "Con Mưa Ngang Qua",
    artist: "Sơn Tùng M-TP",
    duration: "4:23",
    language: "vi",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "V-pop phổ biến",
    notesEn: "Popular V-pop",
  },
  {
    id: "em-cua-ngay-hom-qua",
    title: "Em Của Ngày Hôm Qua",
    artist: "Sơn Tùng M-TP",
    duration: "4:15",
    language: "vi",
    mood: "romantic",
    category: "party-music",
    popular: true,
    notesVi: "V-pop lãng mạn, phổ biến",
    notesEn: "Romantic V-pop, popular",
  },
  {
    id: "baby",
    title: "Baby",
    artist: "Justin Bieber",
    duration: "3:36",
    language: "en",
    mood: "upbeat",
    category: "party-music",
    popular: true,
    notesVi: "Pop dance phổ biến",
    notesEn: "Popular dance pop",
  },

  // Traditional Vietnamese
  {
    id: "xuân-nhạc",
    title: "Xuân Nhạc",
    artist: "Traditional",
    duration: "4:00",
    language: "instrumental",
    mood: "traditional",
    category: "traditional",
    popular: true,
    notesVi: "Nhạc truyền thống lễ hội",
    notesEn: "Traditional festival music",
  },
  {
    id: "nha-nam",
    title: "Nhạ Nam",
    artist: "Traditional",
    duration: "5:00",
    language: "instrumental",
    mood: "traditional",
    category: "traditional",
    popular: true,
    notesVi: "Nhạc cung đình Huế",
    notesEn: "Hue court music",
  },
  {
    id: "quan-ho-bac",
    title: "Quan Họ Bắc Ninh",
    artist: "Traditional Folk",
    duration: "3:30",
    language: "vi",
    mood: "traditional",
    category: "traditional",
    popular: true,
    notesVi: "Dân gian Bắc Ninh",
    notesEn: "Bac Ninh folk music",
  },
  {
    id: "ca-tru",
    title: "Ca Trù",
    artist: "Traditional",
    duration: "4:30",
    language: "vi",
    mood: "traditional",
    category: "traditional",
    popular: false,
    notesVi: "Nghệ thuật truyền thống",
    notesEn: "Traditional art form",
  },
  {
    id: "chao-co",
    title: "Chèo Cổ",
    artist: "Traditional",
    duration: "3:45",
    language: "vi",
    mood: "traditional",
    category: "traditional",
    popular: true,
    notesVi: "Nhạc chèo truyền thống",
    notesEn: "Traditional Cheo music",
  },
];

export function getMusicCategory(id: string): MusicCategory | undefined {
  return MUSIC_CATEGORIES.find((cat) => cat.id === id);
}

export function getSongsByCategory(categoryId: string): SongRecommendation[] {
  return SONG_RECOMMENDATIONS.filter((song) => song.category === categoryId);
}

export function getPopularSongs(limit: number = 10): SongRecommendation[] {
  return SONG_RECOMMENDATIONS.filter((song) => song.popular).slice(0, limit);
}

export function getSongsByLanguage(language: "vi" | "en" | "instrumental"): SongRecommendation[] {
  return SONG_RECOMMENDATIONS.filter((song) => song.language === language);
}

export function getSongsByMood(mood: string): SongRecommendation[] {
  return SONG_RECOMMENDATIONS.filter((song) => song.mood === mood);
}

// DJ/Band selection tips
export const DJ_BAND_TIPS = {
  vi: [
    "Chọn DJ/band có kinh nghiệm cưới hỏi",
    "Yêu cầu danh sách nhạc và có thể chỉnh sửa",
    "Đề nghị bài hát yêu thích trước",
    "Chuẩn bị nhạc dự phòng (backup)",
    "Thông báo thời gian setup và soundcheck",
    "Kiểm tra âm thanh và âm lượng trước tiệc",
  ],
  en: [
    "Choose DJ/band with wedding experience",
    "Request song list and allow customization",
    "Suggest favorite songs in advance",
    "Prepare backup music",
    "Inform setup time and soundcheck schedule",
    "Check sound and volume before reception",
  ],
};

// Regional music considerations
export const REGIONAL_MUSIC_NOTES = {
  north: {
    vi: "Miền Bắc: Ưu tiên nhạc truyền thống, quan họ, chèo. Kết hợp nhạc hiện đại nhẹ nhàng.",
    en: "Northern: Prefer traditional music, quan ho, cheo. Combine with gentle modern music.",
  },
  central: {
    vi: "Miền Trung: Nhạc cung đình Huế, bài hát địa phương. Kết hợp nhạc nhẹ nhàng, lãng mạn.",
    en: "Central: Hue court music, local songs. Combine with gentle, romantic music.",
  },
  south: {
    vi: "Miền Nam: V-pop sôi động, nhạc remix. Kết hợp nhạc quốc tế hiện đại.",
    en: "Southern: Upbeat V-pop, remix music. Combine with modern international music.",
  },
};

import type { WebsiteSettings } from "@/types/wedding";

interface Props {
  sections: WebsiteSettings["sections"];
  onChange: (key: keyof WebsiteSettings["sections"], value: boolean) => void;
  lang: string;
}

const SECTION_LABELS: Record<keyof WebsiteSettings["sections"], { vi: string; en: string; desc: { vi: string; en: string } }> = {
  story: {
    vi: "Câu chuyện",
    en: "Our Story",
    desc: { vi: "Hiện câu chuyện tình yêu của đôi bạn", en: "Show your love story" },
  },
  timeline: {
    vi: "Lịch trình",
    en: "Timeline",
    desc: { vi: "Lịch trình các sự kiện trong ngày cưới", en: "Wedding day schedule" },
  },
  gallery: {
    vi: "Bộ sưu tập ảnh",
    en: "Photo Gallery",
    desc: { vi: "Hình ảnh của đôi bạn", en: "Your couple photos" },
  },
  venue: {
    vi: "Địa điểm & Bản đồ",
    en: "Venue & Map",
    desc: { vi: "Địa chỉ và bản đồ địa điểm tổ chức", en: "Wedding venue location" },
  },
  rsvp: {
    vi: "Xác nhận tham dự",
    en: "RSVP",
    desc: { vi: "Phần kêu gọi xác nhận tham dự", en: "RSVP call-to-action section" },
  },
};

export function WebsiteSectionToggles({ sections, onChange, lang }: Props) {
  return (
    <div className="space-y-3">
      {(Object.keys(SECTION_LABELS) as Array<keyof WebsiteSettings["sections"]>).map((key) => {
        const meta = SECTION_LABELS[key];
        const label = lang === "en" ? meta.en : meta.vi;
        const desc = lang === "en" ? meta.desc.en : meta.desc.vi;
        return (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={sections[key] ?? false}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded accent-current flex-shrink-0"
            />
            <div>
              <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">{label}</span>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}

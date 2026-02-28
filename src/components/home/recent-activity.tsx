import type { WeddingState } from "@/types/wedding";

interface RecentActivityProps {
  state: WeddingState;
  lang?: string;
}

interface ActivityItem {
  icon: string;
  text: string;
}

export function RecentActivity({ state, lang = "vi" }: RecentActivityProps) {
  const en = lang === "en";
  const items: ActivityItem[] = [];

  if (state.info.date) {
    const d = new Date(state.info.date).toLocaleDateString(en ? "en-US" : "vi-VN");
    items.push({ icon: "📅", text: en ? `Wedding date: ${d}` : `Ngày cưới: ${d}` });
  }

  const guestCount = state.guests?.length ?? 0;
  if (guestCount > 0) {
    items.push({ icon: "👥", text: en ? `${guestCount} guests added` : `${guestCount} khách mời` });
  }

  if (state.budget > 0) {
    const fmt = new Intl.NumberFormat(en ? "en-US" : "vi-VN").format(state.budget);
    items.push({ icon: "💰", text: en ? `Budget: ${fmt} VND` : `Ngân sách: ${fmt} VND` });
  }

  const giftCount = state.gifts?.length ?? 0;
  if (giftCount > 0) {
    items.push({ icon: "🎁", text: en ? `${giftCount} gifts logged` : `${giftCount} phong bì/quà` });
  }

  const timelineCount = state.timelineEntries?.length ?? 0;
  if (timelineCount > 0) {
    items.push({ icon: "⏱️", text: en ? `${timelineCount} timeline events` : `${timelineCount} sự kiện` });
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        {en ? "Start planning to see your progress here!" : "Bắt đầu lên kế hoạch để xem tiến độ!"}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--theme-primary)" }}>
        {en ? "Summary" : "Tóm tắt"}
      </h3>
      <div className="space-y-2">
        {items.slice(0, 5).map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 p-2 rounded-lg text-sm"
            style={{ backgroundColor: "var(--theme-surface)" }}
          >
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

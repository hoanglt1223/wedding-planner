import type { SongItem } from "@/types/wedding";

interface SongSummaryBarProps {
  songs: SongItem[];
  lang: string;
}

export function SongSummaryBar({ songs, lang }: SongSummaryBarProps) {
  const en = lang === "en";
  const total = songs.length;
  const mustPlay = songs.filter((s) => s.priority === "must-play").length;
  const confirmed = songs.filter((s) => s.confirmed).length;
  const doNotPlay = songs.filter((s) => s.priority === "do-not-play").length;

  const stats = [
    { label: en ? "Total" : "Tổng", value: total, color: "text-foreground" },
    { label: en ? "Must play" : "Phải phát", value: mustPlay, color: "text-green-600" },
    { label: en ? "Confirmed" : "Đã xác nhận", value: confirmed, color: "text-blue-600" },
    { label: en ? "Do not play" : "Không phát", value: doNotPlay, color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="text-center p-2 rounded-lg border bg-muted/30"
        >
          <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
          <div className="text-[10px] text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

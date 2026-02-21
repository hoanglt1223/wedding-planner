import type { TimelineEntry } from "@/types/wedding";

interface StepTimelineDetailProps {
  entries: TimelineEntry[];
  partyTime: "noon" | "afternoon";
}

function offsetTime(time: string, partyTime: "noon" | "afternoon"): string {
  if (partyTime === "noon") return time;
  const [h, m] = time.split(":").map(Number);
  const newH = (h + 5) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function StepTimelineDetail({ entries, partyTime }: StepTimelineDetailProps) {
  if (!entries.length) return null;

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
      <h2 className="text-sm font-bold text-red-800 mb-2">
        🕐 Lịch Trình Chi Tiết
        <span className="ml-1.5 text-[0.65rem] font-normal text-gray-400">
          ({partyTime === "noon" ? "Buổi trưa" : "Buổi chiều"})
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-14">Giờ</th>
              <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold">Hoạt động</th>
              <th className="text-left py-1.5 pr-2 text-gray-500 font-semibold w-20">Phụ trách</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-1.5 pr-2 font-mono font-semibold text-red-700 align-top whitespace-nowrap">
                  {offsetTime(entry.time, partyTime)}
                </td>
                <td className="py-1.5 pr-2 text-gray-700 align-top">
                  {entry.activity}
                  {entry.note && (
                    <span className="block text-[0.6rem] text-gray-400 mt-0.5">{entry.note}</span>
                  )}
                </td>
                <td className="py-1.5 text-gray-500 align-top whitespace-nowrap">
                  {entry.responsible}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { fetchSharedData, type SharedData } from "@/lib/share";
import { SharedProgress } from "@/components/shared/shared-progress";

interface Props {
  shareId: string;
}

export function SharedPreviewPage({ shareId }: Props) {
  const [data, setData] = useState<SharedData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "expired">("loading");

  useEffect(() => {
    fetchSharedData(shareId).then((d) => {
      if (d) { setData(d); setStatus("ok"); }
      else setStatus("expired");
    });
  }, [shareId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-amber-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💍</div>
          <p className="text-sm text-[#8a7060]">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === "expired" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 via-white to-amber-50 px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">⏰</div>
          <h2 className="text-lg font-bold text-[#2c1810] mb-2">Link Đã Hết Hạn</h2>
          <p className="text-sm text-[#8a7060] mb-4">
            Link chia sẻ chỉ có hiệu lực trong 10 phút. Hãy yêu cầu người gửi tạo link mới.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white bg-[#c0392b] rounded-full hover:bg-[#a93226] transition-colors"
          >
            Tạo Kế Hoạch Của Bạn
          </a>
        </div>
      </div>
    );
  }

  const weddingDate = data.info.date
    ? new Date(data.info.date + "T00:00:00").toLocaleDateString("vi-VN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-amber-50 px-4 py-8">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-2">💒</div>
          <h1 className="text-xl font-bold text-[#2c1810]">
            {data.info.bride || "Cô dâu"} & {data.info.groom || "Chú rể"}
          </h1>
          {weddingDate && <p className="text-sm text-[#8a7060] mt-1">{weddingDate}</p>}
        </div>

        {/* Progress */}
        <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4">
          <SharedProgress data={data} />
        </div>

        {/* Guest count */}
        {data.guests.length > 0 && (
          <div className="rounded-xl border border-[#e8ddd0] bg-white/80 p-4 text-center">
            <p className="text-2xl font-bold text-[#c0392b]">{data.guests.length}</p>
            <p className="text-xs text-[#8a7060]">khách mời</p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white bg-[#c0392b] rounded-full hover:bg-[#a93226] transition-colors"
          >
            💍 Tạo Kế Hoạch Đám Cưới
          </a>
          <p className="text-xs text-[#8a7060] mt-2">Miễn phí 100% · Không cần đăng ký</p>
        </div>
      </div>
    </div>
  );
}

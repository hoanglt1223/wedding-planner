import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcPersonalYear } from "@/lib/numerology";
import { getNumerologyProfile } from "@/data/numerology-profiles";
import { ToggleBtn } from "./toggle-btn";

interface TabYearlyForecastProps {
  info: CoupleInfo;
  fullNames: { bride: string; groom: string };
}

const YEAR_THEMES: Record<number, { theme: string; love: string; career: string; advice: string }> = {
  1: { theme: "Khởi Đầu Mới", love: "Năm tốt để bắt đầu mối quan hệ mới hoặc làm mới tình yêu.", career: "Cơ hội thăng tiến, dự án mới.", advice: "Hãy mạnh dạn và tự tin." },
  2: { theme: "Hợp Tác & Kiên Nhẫn", love: "Năm của sự gắn kết và thấu hiểu sâu sắc.", career: "Hợp tác, làm việc nhóm hiệu quả.", advice: "Kiên nhẫn sẽ được đền đáp." },
  3: { theme: "Sáng Tạo & Niềm Vui", love: "Năm tràn đầy niềm vui và lãng mạn.", career: "Sáng tạo nở rộ, giao tiếp tốt.", advice: "Hãy thể hiện bản thân." },
  4: { theme: "Xây Dựng Nền Tảng", love: "Củng cố mối quan hệ, xây dựng cam kết.", career: "Làm việc chăm chỉ, đặt nền móng.", advice: "Tập trung vào mục tiêu dài hạn." },
  5: { theme: "Thay Đổi & Tự Do", love: "Năm bất ngờ, có thể có thay đổi lớn.", career: "Cơ hội mới xuất hiện bất ngờ.", advice: "Đón nhận thay đổi với tâm thế mở." },
  6: { theme: "Gia Đình & Trách Nhiệm", love: "Năm lý tưởng để kết hôn hoặc có con!", career: "Ổn định, tập trung chăm sóc.", advice: "Đặt gia đình lên hàng đầu." },
  7: { theme: "Nội Tâm & Tâm Linh", love: "Thời gian suy ngẫm về mối quan hệ.", career: "Học hỏi, nghiên cứu, phát triển bản thân.", advice: "Lắng nghe trực giác." },
  8: { theme: "Thành Công & Quyền Lực", love: "Mối quan hệ được hưởng lợi từ sự ổn định tài chính.", career: "Năm đỉnh cao sự nghiệp.", advice: "Cân bằng vật chất và tinh thần." },
  9: { theme: "Hoàn Thành & Buông Bỏ", love: "Kết thúc chu kỳ, chuẩn bị cho khởi đầu mới.", career: "Hoàn tất dự án, chuẩn bị giai đoạn mới.", advice: "Hãy biết buông bỏ những gì không còn phục vụ bạn." },
  11: { theme: "Trực Giác & Giác Ngộ", love: "Kết nối tâm hồn ở mức độ sâu nhất.", career: "Truyền cảm hứng cho người khác.", advice: "Tin vào trực giác của bạn." },
  22: { theme: "Kiến Tạo Vĩ Đại", love: "Xây dựng mối quan hệ có ý nghĩa lâu dài.", career: "Biến tầm nhìn lớn thành hiện thực.", advice: "Nghĩ lớn và hành động." },
  33: { theme: "Yêu Thương Vô Điều Kiện", love: "Tình yêu thiêng liêng và chữa lành.", career: "Phục vụ cộng đồng.", advice: "Cho đi tình yêu không điều kiện." },
};

function getYearTheme(num: number) {
  return YEAR_THEMES[num] ?? YEAR_THEMES[num > 9 ? (num % 9 || 9) : num] ?? YEAR_THEMES[1];
}

export function TabYearlyForecast({ info, fullNames }: TabYearlyForecastProps) {
  const [active, setActive] = useState<"bride" | "groom">("bride");
  const currentYear = new Date().getFullYear();
  const birthDate = active === "bride" ? info.brideBirthDate : info.groomBirthDate;
  const name = active === "bride" ? (fullNames.bride || info.bride || "Cô dâu") : (fullNames.groom || info.groom || "Chú rể");

  const personalYear = useMemo(() => calcPersonalYear(birthDate, currentYear), [birthDate, currentYear]);
  const numProfile = useMemo(() => getNumerologyProfile(personalYear), [personalYear]);
  const theme = useMemo(() => getYearTheme(personalYear), [personalYear]);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <ToggleBtn active={active === "bride"} onClick={() => setActive("bride")}
          label={fullNames.bride || info.bride || "Cô dâu"} />
        <ToggleBtn active={active === "groom"} onClick={() => setActive("groom")}
          label={fullNames.groom || info.groom || "Chú rể"} />
      </div>

      {/* Year number card */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 text-center">
        <p className="text-xs text-muted-foreground">Năm Cá Nhân {currentYear} của {name}</p>
        <div className="text-5xl font-bold text-primary mt-1">{personalYear}</div>
        <div className="text-base font-semibold mt-1">{numProfile.emoji} {theme.theme}</div>
      </div>

      {/* Theme cards */}
      <div className="space-y-2">
        <Card emoji="💕" title="Tình duyên" text={theme.love} />
        <Card emoji="💼" title="Sự nghiệp" text={theme.career} />
        <Card emoji="💡" title="Lời khuyên" text={theme.advice} />
      </div>

      {/* Wedding year note */}
      {personalYear === 6 && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-sm font-bold text-green-800">🎉 Năm cá nhân số 6 — Năm hôn nhân lý tưởng!</p>
          <p className="text-xs text-green-700 mt-1">
            Năm nay mang năng lượng gia đình và tình yêu mạnh mẽ. Đây là thời điểm tuyệt vời để tổ chức đám cưới.
          </p>
        </div>
      )}
    </div>
  );
}

function Card({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
      <h4 className="text-sm font-bold">{emoji} {title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}

import { useState, useMemo } from "react";
import type { CoupleInfo } from "@/types/wedding";
import { calcPersonalYear, calcPersonalMonth } from "@/lib/numerology";
import { getNumerologyProfile } from "@/data/numerology-profiles";
import { MONTH_THEMES } from "@/data/numerology-meanings";
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

const MONTH_NAMES = ["", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

function getYearTheme(num: number) {
  return YEAR_THEMES[num] ?? YEAR_THEMES[num > 9 ? (num % 9 || 9) : num] ?? YEAR_THEMES[1];
}

function getMonthTheme(num: number) {
  return MONTH_THEMES[num] ?? MONTH_THEMES[num > 9 ? (num % 9 || 9) : num] ?? MONTH_THEMES[1];
}

export function TabYearlyForecast({ info, fullNames }: TabYearlyForecastProps) {
  const [active, setActive] = useState<"bride" | "groom">("bride");
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const birthDate = active === "bride" ? info.brideBirthDate : info.groomBirthDate;
  const name = active === "bride" ? (fullNames.bride || info.bride || "Cô dâu") : (fullNames.groom || info.groom || "Chú rể");

  const personalYear = useMemo(() => calcPersonalYear(birthDate, currentYear), [birthDate, currentYear]);
  const personalMonth = useMemo(() => calcPersonalMonth(birthDate, currentYear, currentMonth), [birthDate, currentYear, currentMonth]);
  const numProfile = useMemo(() => getNumerologyProfile(personalYear), [personalYear]);
  const yearTheme = useMemo(() => getYearTheme(personalYear), [personalYear]);
  const monthTheme = useMemo(() => getMonthTheme(personalMonth), [personalMonth]);

  // All 12 months overview
  const monthsOverview = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const pm = calcPersonalMonth(birthDate, currentYear, m);
      const mt = getMonthTheme(pm);
      return { month: m, number: pm, theme: mt.theme };
    });
  }, [birthDate, currentYear]);

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
        <div className="text-base font-semibold mt-1">{numProfile.emoji} {yearTheme.theme}</div>
      </div>

      {/* Year theme cards */}
      <div className="space-y-2">
        <ThemeCard emoji="💕" title="Tình duyên" text={yearTheme.love} />
        <ThemeCard emoji="💼" title="Sự nghiệp" text={yearTheme.career} />
        <ThemeCard emoji="💡" title="Lời khuyên" text={yearTheme.advice} />
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

      {/* Divider */}
      <div className="flex items-center gap-2 text-muted-foreground/40 pt-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs">🗓️ Tháng {currentMonth}/{currentYear}</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Current Month card */}
      <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-primary/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">{MONTH_NAMES[currentMonth]} — Tháng Cá Nhân của {name}</p>
        <div className="text-4xl font-bold text-primary mt-1">{personalMonth}</div>
        <div className="text-sm font-semibold mt-1">{monthTheme.theme}</div>
        <p className="text-xs text-muted-foreground mt-1">{monthTheme.energy}</p>
      </div>

      {/* Month detail cards */}
      <div className="space-y-2">
        <ThemeCard emoji="💕" title="Tình duyên tháng này" text={monthTheme.love} />
        <ThemeCard emoji="💼" title="Sự nghiệp tháng này" text={monthTheme.career} />
        <ThemeCard emoji="💡" title="Lời khuyên" text={monthTheme.advice} />
      </div>

      {/* Do / Don't */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-1.5">
          <h4 className="text-sm font-bold text-green-700">✅ Nên làm</h4>
          {monthTheme.doList.map((item) => (
            <p key={item} className="text-xs text-green-700">• {item}</p>
          ))}
        </div>
        <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3 space-y-1.5">
          <h4 className="text-sm font-bold text-red-600">❌ Tránh</h4>
          {monthTheme.dontList.map((item) => (
            <p key={item} className="text-xs text-red-600">• {item}</p>
          ))}
        </div>
      </div>

      {/* 12-month overview */}
      <div className="flex items-center gap-2 text-muted-foreground/40 pt-1">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs">📊 Tổng quan 12 tháng</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {monthsOverview.map(({ month, number, theme }) => (
          <div
            key={month}
            className={`bg-[var(--theme-surface)] rounded-lg border p-2 text-center transition-colors ${
              month === currentMonth ? "border-primary ring-1 ring-primary/30" : "border-[var(--theme-border)]"
            }`}
          >
            <div className="text-[10px] text-muted-foreground">T{month}</div>
            <div className={`text-lg font-bold ${month === currentMonth ? "text-primary" : "text-foreground"}`}>{number}</div>
            <div className="text-[9px] text-muted-foreground leading-tight truncate">{theme}</div>
          </div>
        ))}
      </div>

      {/* Wedding month note */}
      {personalMonth === 6 && (
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-sm font-bold text-green-800">💒 Tháng cá nhân số 6 — Tháng hôn nhân lý tưởng!</p>
          <p className="text-xs text-green-700 mt-1">
            Tháng này mang năng lượng gia đình và yêu thương cực mạnh. Rất phù hợp cho lễ cưới hoặc cầu hôn.
          </p>
        </div>
      )}
    </div>
  );
}

function ThemeCard({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-3">
      <h4 className="text-sm font-bold">{emoji} {title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{text}</p>
    </div>
  );
}

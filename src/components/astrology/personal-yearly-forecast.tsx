import type { YearlyForecast } from "@/data/astrology-yearly-forecast";
import { FORECAST_YEAR } from "@/data/astrology-yearly-forecast";

interface Props {
  forecast: YearlyForecast;
}

export function YearlyForecastSection({ forecast }: Props) {
  return (
    <div className="bg-[var(--theme-surface)] rounded-xl shadow-sm border border-[var(--theme-border)] p-4 space-y-3">
      <h3 className="text-sm font-bold">📅 Vận Mệnh Năm {FORECAST_YEAR}</h3>
      <p className="text-xs text-muted-foreground">{forecast.overview}</p>
      <div className="space-y-2">
        <RatingRow label="💕 Tình duyên" rating={forecast.love.rating} desc={forecast.love.description} />
        <RatingRow label="💼 Sự nghiệp" rating={forecast.career.rating} desc={forecast.career.description} />
        <RatingRow label="💰 Tài lộc" rating={forecast.wealth.rating} desc={forecast.wealth.description} />
        <RatingRow label="🏥 Sức khỏe" rating={forecast.health.rating} desc={forecast.health.description} />
      </div>
    </div>
  );
}

function RatingRow({ label, rating, desc }: { label: string; rating: number; desc: string }) {
  return (
    <div className="text-xs">
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-medium">{label}</span>
        <span className="text-amber-500 tracking-wide">
          {"★".repeat(rating)}
          <span className="text-muted-foreground/40">{"☆".repeat(5 - rating)}</span>
        </span>
      </div>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  );
}

import { WeatherDashboard } from "@/components/weather/weather-dashboard";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function WeatherPage() {
  const { state } = useWeddingStoreContext();

  return (
    <WeatherDashboard
      weddingDate={state.info.date}
      engagementDate={state.info.engagementDate}
      betrothalDate={state.info.betrothalDate}
      lang={state.lang === "en" ? "en" : "vi"}
    />
  );
}

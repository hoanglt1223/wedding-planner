import { useWeddingStore } from "@/hooks/use-wedding-store";
import { EmergencyAssistantDashboard } from "@/components/emergency-assistant/emergency-assistant-dashboard";

export function EmergencyAssistantPage() {
  const { state } = useWeddingStore();

  return (
    <EmergencyAssistantDashboard
      lang={state.lang || "vi"}
      currentWeather="sunny"
    />
  );
}
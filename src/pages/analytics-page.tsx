import { WeddingAnalyticsDashboard } from "@/components/analytics/wedding-analytics-dashboard";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function AnalyticsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const lang = state.lang;

  return (
    <WeddingAnalyticsDashboard state={state} lang={lang} />
  );
}

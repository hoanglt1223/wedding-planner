/**
 * Speeches & Vows Page
 * Wedding speech, vow, and toast management page
 */

import { SpeechListPage } from "@/components/speeches/speech-list-page";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export function SpeechesPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  return (
    <div className="space-y-4 py-2">
      <SpeechListPage />
    </div>
  );
}

export default SpeechesPage;

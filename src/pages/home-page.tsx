import { t } from "@/lib/i18n";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { CountdownWidget } from "@/components/countdown/countdown-widget";
import { ProgressRing } from "@/components/home/progress-ring";
import { QuickActions } from "@/components/home/quick-actions";
import { DailyTip } from "@/components/home/daily-tip";
import { RecentActivity } from "@/components/home/recent-activity";
import { BadgeDisplay } from "@/components/progress/badge-display";
import { SectionProgress } from "@/components/progress/section-progress";

export function HomePage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const progress = store.getProgress();
  const lang = state.lang;

  return (
    <div className="space-y-4 py-2">
      <CountdownWidget
        weddingDate={state.info.date}
        progress={progress}
        dismissedReminders={state.dismissedReminders || []}
        onDismiss={store.dismissReminder}
        lang={lang}
      />

      {/* Progress ring + summary */}
      <div className="flex items-center gap-4 justify-center">
        <ProgressRing percentage={progress.pct} />
        <div>
          <p className="text-lg font-bold">{progress.done}/{progress.total}</p>
          <p className="text-sm text-muted-foreground">{t("hoàn thành", lang)}</p>
        </div>
      </div>

      <QuickActions lang={lang} />
      <SectionProgress state={state} lang={lang} />
      <BadgeDisplay state={state} progressPct={progress.pct} lang={lang} />
      <DailyTip lang={lang} />
      <RecentActivity state={state} lang={lang} />
    </div>
  );
}

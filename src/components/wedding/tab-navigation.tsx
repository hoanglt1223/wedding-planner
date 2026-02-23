import { getWeddingSteps } from "@/data/resolve-data";
import { EXTRA_TABS } from "@/data/backgrounds";
import { ScrollableTabBar } from "@/components/layout/scrollable-tab-bar";
import { isStepEnabled } from "@/hooks/use-wedding-store";
import { t } from "@/lib/i18n";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  lang?: string;
  enabledSteps?: Record<string, boolean>;
}

export function TabNavigation({ activeTab, onTabChange, lang = "vi", enabledSteps = {} }: TabNavigationProps) {
  const tabs = [
    ...getWeddingSteps(lang)
      .filter((s) => isStepEnabled(enabledSteps, s.id))
      .map((s) => ({ label: s.tab })),
    ...EXTRA_TABS.map((label) => ({ label: t(label, lang) })),
  ];

  return (
    <ScrollableTabBar
      tabs={tabs}
      activeIndex={activeTab}
      onTabChange={onTabChange}
      variant="pill"
    />
  );
}

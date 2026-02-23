import { getWeddingSteps } from "@/data/resolve-data";
import { EXTRA_TABS } from "@/data/backgrounds";
import { ScrollableTabBar } from "@/components/layout/scrollable-tab-bar";
import { t } from "@/lib/i18n";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  lang?: string;
}

export function TabNavigation({ activeTab, onTabChange, lang = "vi" }: TabNavigationProps) {
  const tabs = [
    ...getWeddingSteps(lang).map((s) => ({ label: s.tab })),
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

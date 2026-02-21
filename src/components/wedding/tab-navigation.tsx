import { WEDDING_STEPS } from "@/data/wedding-steps";
import { EXTRA_TABS } from "@/data/backgrounds";
import { ScrollableTabBar } from "@/components/layout/scrollable-tab-bar";

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    ...WEDDING_STEPS.map((s) => ({ label: s.tab })),
    ...EXTRA_TABS.map((label) => ({ label })),
  ];

  return (
    <ScrollableTabBar
      tabs={tabs}
      activeIndex={activeTab}
      onTabChange={onTabChange}
      variant="box"
    />
  );
}

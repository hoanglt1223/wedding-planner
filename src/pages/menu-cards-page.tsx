/**
 * Menu Cards Page
 * Generate printable menu cards for wedding reception
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { MenuCardGenerator } from "@/components/menu/menu-card-generator";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

export default function MenuCardsPage() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const theme = THEMES.find((t) => t.id === (state.themeId || DEFAULT_THEME_ID)) || THEMES[0];
  const lang = (state.lang === "en" ? "en" : "vi") as "vi" | "en";

  const menuItems = state.menuItems ?? [];
  const seatingTables = state.seatingTables ?? [];

  const tables = seatingTables.map((table) => ({
    id: table.id,
    name: table.name,
    guestCount: table.guestIds?.length || 0,
  }));

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-base">🃏 Thực Đơn Menu Card</h2>
        <p className="text-xs text-muted-foreground">
          Tạo và in menu card cho từng bàn tiệc cưới
        </p>
      </div>

      {/* Main Generator */}
      <MenuCardGenerator
        items={menuItems}
        theme={theme}
        lang={lang}
        tables={tables}
      />
    </div>
  );
}
/**
 * Menu Dietary Page
 * Shows guests with dietary restrictions and compatible menu items
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { DietaryMatching } from "@/components/menu/dietary-matching";

export default function MenuDietaryPage() {
  const store = useWeddingStoreContext();
  const { state } = store;

  const guests = state.guests ?? [];
  const menuItems = state.menuItems ?? [];

  return (
    <div className="p-3 space-y-4">
      {/* Header */}
      <div>
        <h2 className="font-semibold text-base">🥗 Khách Hạn Chế Ăn Uống</h2>
        <p className="text-xs text-muted-foreground">
          Phối hợp thực đơn phù hợp với các khách có hạn chế ăn uống
        </p>
      </div>

      {/* Dietary matching */}
      <DietaryMatching guests={guests} menuItems={menuItems} />

      {/* Info card */}
      <div className="rounded-lg border bg-muted/50 p-3 text-xs space-y-1">
        <p className="font-medium">💡 Mẹo:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Hạn chế được lấy từ thông tin RSVP của khách</li>
          <li>Chay: Không thịt động vật</li>
          <li>Chay trường: Không sản phẩm động vật</li>
          <li>Halal: Theo quy chuẩn Hồi giáo</li>
          <li>Không gluten: Tránh lúa mì, lúa mì</li>
          <li>Không hạt: Tránh hạt cây</li>
        </ul>
      </div>
    </div>
  );
}

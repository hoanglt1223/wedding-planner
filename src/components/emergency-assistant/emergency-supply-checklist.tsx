import { Check, Package, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface EmergencySupply {
  id: string;
  name: string;
  category: "medical" | "clothing" | "documents" | "misc";
  quantity: number;
  packed?: boolean;
  notes?: string;
}

interface EmergencySupplyChecklistProps {
  supplies: EmergencySupply[];
  lang?: string;
  onUpdateSupply?: (supplyId: string, packed: boolean) => void;
}

const t = {
  vi: {
    emergencyKit: "Bộ Đồ Khẩn Cấp",
    category: "Danh Mục",
    quantity: "Số Lượng",
    packed: "Đã Đóng Gói",
    notPacked: "Chưa Đóng Gói",
    markAsPacked: "Đánh Đã Đóng Gói",
    unpack: "Bỏ Đóng Gói",
    medical: "Y Tế",
    clothing: "Quần Áo",
    documents: "Tài Liệu",
    misc: "Khác",
    totalItems: "Tổng Số Mục",
    packedCount: "Đã Đóng Gói",
    remainingCount: "Còn Lại",
    allSet: "Đủ Đồ Rồi!",
    needToPack: "Cần Đóng Gói Thêm",
    notes: "Ghi Chú",
  },
  en: {
    emergencyKit: "Emergency Kit",
    category: "Category",
    quantity: "Quantity",
    packed: "Packed",
    notPacked: "Not Packed",
    markAsPacked: "Mark as Packed",
    unpack: "Unpack",
    medical: "Medical",
    clothing: "Clothing",
    documents: "Documents",
    misc: "Miscellaneous",
    totalItems: "Total Items",
    packedCount: "Packed",
    remainingCount: "Remaining",
    allSet: "All Set!",
    needToPack: "Need to Pack",
    notes: "Notes",
  },
};

export function EmergencySupplyChecklist({
  supplies,
  lang = "vi",
  onUpdateSupply
}: EmergencySupplyChecklistProps) {
  const labels = t[lang as keyof typeof t] || t.vi;
  const [localSupplies, setLocalSupplies] = useState(supplies);

  const handleTogglePacked = (supplyId: string) => {
    const updatedSupplies = localSupplies.map(supply =>
      supply.id === supplyId ? { ...supply, packed: !supply.packed } : supply
    );
    setLocalSupplies(updatedSupplies);
    onUpdateSupply?.(supplyId, !localSupplies.find(s => s.id === supplyId)?.packed);
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap = {
      medical: labels.medical,
      clothing: labels.clothing,
      documents: labels.documents,
      misc: labels.misc,
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "clothing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "documents": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  // Group supplies by category
  const groupedSupplies = localSupplies.reduce((acc, supply) => {
    if (!acc[supply.category]) {
      acc[supply.category] = [];
    }
    acc[supply.category].push(supply);
    return acc;
  }, {} as Record<string, EmergencySupply[]>);

  const packedCount = localSupplies.filter(s => s.packed).length;
  const totalCount = localSupplies.length;
  const isAllPacked = packedCount === totalCount && totalCount > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold">{labels.emergencyKit}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isAllPacked ? (
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
              <Check size={16} />
              {labels.allSet}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm">
              <AlertTriangle size={16} />
              {labels.needToPack}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {labels.packedCount}: {packedCount}/{totalCount}
          </span>
        </div>
      </div>

      {localSupplies.length === 0 ? (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">
            {labels.totalItems}: 0
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedSupplies).map(([category, categorySupplies]) => (
            <div key={category} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm capitalize">
                  {getCategoryLabel(category)}
                </h4>
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(category)}`}>
                  {categorySupplies.filter(s => s.packed).length}/{categorySupplies.length}
                </span>
              </div>

              <div className="space-y-2">
                {categorySupplies.map(supply => (
                  <div
                    key={supply.id}
                    className="flex items-start justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <input
                          type="checkbox"
                          checked={supply.packed || false}
                          onChange={() => handleTogglePacked(supply.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className={`text-sm ${supply.packed ? "line-through text-gray-400" : ""}`}>
                          {supply.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 ml-6">
                        <span>{labels.quantity}: {supply.quantity}</span>
                        {supply.notes && (
                          <span>{labels.notes}: {supply.notes}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
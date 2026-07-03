import { GIFT_CATEGORIES, RECIPIENT_TYPES, STATUS_LABELS } from "@/data/guest-gift-data";
import type { GuestGift } from "@/types/wedding";
import { Button } from "@/components/ui/button";

interface GuestGiftExportProps {
  gifts: GuestGift[];
  lang?: string;
}

export function GuestGiftExport({ gifts, lang = "vi" }: GuestGiftExportProps) {
  const en = lang === "en";

  const handleExport = () => {
    const headers = [
      en ? "Gift Name" : "Tên Quà Tặng",
      en ? "Category" : "Danh Mục",
      en ? "Description" : "Mô Tả",
      en ? "Cost Per Unit" : "Giá Một Vị",
      en ? "Total Quantity" : "Số Lượng",
      en ? "Distributed" : "Đã Phát",
      en ? "Remaining" : "Còn Lại",
      en ? "Total Cost" : "Tổng Chi Phí",
      en ? "Recipient Type" : "Loại Người Nhận",
      en ? "Assigned Guests Count" : "Số Khách Gán",
      en ? "Status" : "Trạng Thái",
      en ? "Notes" : "Ghi Chú",
    ];

    const rows = gifts.map((gift) => {
      const cat = GIFT_CATEGORIES[gift.category];
      const recipient = RECIPIENT_TYPES[gift.recipientType as keyof typeof RECIPIENT_TYPES];
      const status = STATUS_LABELS[gift.status];

      return [
        gift.giftName,
        en ? cat.labelEn : cat.labelVi,
        gift.description,
        gift.costPerUnit.toString(),
        gift.totalQuantity.toString(),
        gift.distributedQuantity.toString(),
        (gift.totalQuantity - gift.distributedQuantity).toString(),
        (gift.costPerUnit * gift.totalQuantity).toString(),
        en ? recipient.labelEn : recipient.labelVi,
        gift.assignedGuestIds.length.toString(),
        en ? status.labelEn : status.labelVi,
        gift.notes,
      ].map((v) => `"${v.replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `guest-gifts-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={gifts.length === 0}>
      📄 {en ? "Export CSV" : "Xuất CSV"}
    </Button>
  );
}

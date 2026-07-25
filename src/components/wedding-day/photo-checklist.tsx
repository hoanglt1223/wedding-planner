/**
 * Photo Checklist
 * Quick checklist for must-have wedding photos
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, Check } from "lucide-react";

interface PhotoChecklistProps {
  lang: string;
}

interface PhotoItem {
  id: string;
  titleVi: string;
  titleEn: string;
  checked: boolean;
}

export function PhotoChecklist({ lang }: PhotoChecklistProps) {
  const [photoItems, setPhotoItems] = useState<PhotoItem[]>([
    { id: "bride-prep", titleVi: "Cô dâu chuẩn bị", titleEn: "Bride prep", checked: false },
    { id: "groom-prep", titleVi: "Chú rể chuẩn bị", titleEn: "Groom prep", checked: false },
    { id: "first-look", titleVi: "Lần gặp đầu tiên", titleEn: "First look", checked: false },
    { id: "ceremony", titleVi: "Lễ cưới", titleEn: "Ceremony", checked: false },
    { id: "family-portraits", titleVi: "Chụp gia đình", titleEn: "Family portraits", checked: false },
    { id: "wedding-party", titleVi: "Đôi bạn cưới", titleEn: "Wedding party", checked: false },
    { id: "rings", titleVi: "Nhẫn cưới", titleEn: "Rings detail", checked: false },
    { id: "cake-cutting", titleVi: "Cắt bánh", titleEn: "Cake cutting", checked: false },
    { id: "first-dance", titleVi: " điệu nhảy đầu tiên", titleEn: "First dance", checked: false },
    { id: "bouquet-toss", titleVi: "Ném hoa", titleEn: "Bouquet toss", checked: false },
  ]);

  const title = lang === "en" ? "Photo Checklist" : "Danh Sách Chụp Ảnh";
  const checkedCount = photoItems.filter(item => item.checked).length;
  const totalCount = photoItems.length;
  const clearText = lang === "en" ? "Clear All" : "Xóa Tất Cả";

  const toggleItem = (id: string) => {
    setPhotoItems(items =>
      items.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const clearAll = () => {
    setPhotoItems(items => items.map(item => ({ ...item, checked: false })));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {checkedCount}/{totalCount}
            </span>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              {clearText}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {photoItems.map(item => (
            <div
              key={item.id}
              className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
              onClick={() => toggleItem(item.id)}
            >
              <Checkbox
                id={item.id}
                checked={item.checked}
                onChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className={`flex-1 cursor-pointer ${
                  item.checked ? "line-through text-muted-foreground" : ""
                }`}
              >
                {lang === "en" ? item.titleEn : item.titleVi}
              </label>
              {item.checked && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

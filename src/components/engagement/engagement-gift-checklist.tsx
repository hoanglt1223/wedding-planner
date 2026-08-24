/**
 * Engagement Gift Checklist Component
 * Manages traditional Vietnamese engagement ceremony gifts
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Package, TrendingUp } from "lucide-react";
import { useState } from "react";

interface EngagementGiftItem {
  id: number;
  name: string;
  nameEn: string;
  category: "betel" | "areca" | "tea" | "wine" | "fruit" | "cake" | "jewelry" | "other";
  quantity: number;
  estimatedCost: number;
  prepared: boolean;
  notes: string;
}

interface EngagementGiftChecklistProps {
  items: EngagementGiftItem[];
  onToggleItem: (id: number) => void;
  lang: "vi" | "en";
}

const CATEGORY_COLORS: Record<string, string> = {
  betel: "bg-red-100 text-red-800",
  areca: "bg-amber-100 text-amber-800",
  tea: "bg-green-100 text-green-800",
  wine: "bg-purple-100 text-purple-800",
  fruit: "bg-orange-100 text-orange-800",
  cake: "bg-pink-100 text-pink-800",
  jewelry: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

export function EngagementGiftChecklist({ items, onToggleItem, lang }: EngagementGiftChecklistProps) {
  const en = lang === "en";

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    nameEn: "",
    category: "other" as const,
    quantity: 1,
    estimatedCost: 0,
  });

  const preparedItems = items.filter(item => item.prepared);
  const totalBudget = items.reduce((sum, item) => sum + item.estimatedCost, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="w-5 h-5" />
              {en ? "Engagement Gifts" : "Quà Lễ Đính Hôn"}
            </CardTitle>
            <Badge variant="outline">
              {preparedItems.length} / {items.length} {en ? "prepared" : "đã chuẩn bị"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {en ? "Total estimated cost:" : "Tổng chi phí ước tính:"}
              </p>
              <p className="text-xl font-bold">
                {totalBudget.toLocaleString()}₫
              </p>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {en ? "Prepared items:" : "Đã chuẩn bị:"}
              </p>
              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[var(--theme-primary)]"
                  style={{ width: `${items.length > 0 ? (preparedItems.length / items.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map(item => (
          <Card key={item.id} className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.prepared}
                  onChange={() => onToggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`font-medium ${item.prepared ? "line-through text-muted-foreground" : ""}`}>
                        {en ? item.nameEn : item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {en ? "Quantity:" : "Số lượng:"} {item.quantity}
                      </p>
                    </div>
                    <Badge className={CATEGORY_COLORS[item.category]}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {item.estimatedCost.toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Gift Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-[var(--theme-surface)] border border-dashed hover:bg-[var(--theme-surface-hover)]"
          variant="outline"
        >
          <Package className="w-4 h-4 mr-2" />
          {en ? "Add Custom Gift" : "Thêm quà tùy chỉnh"}
        </Button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <Card className="bg-[var(--theme-surface)] border-[var(--theme-border)]">
          <CardHeader>
            <CardTitle className="text-lg">
              {en ? "Add Custom Gift" : "Thêm quà tùy chỉnh"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{en ? "Name (Vietnamese)" : "Tên (Tiếng Việt)"}</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={en ? "e.g., Trầu cau" : "ví dụ: Trầu cau"}
                />
              </div>
              <div>
                <Label>{en ? "Name (English)" : "Tên (Tiếng Anh)"}</Label>
                <Input
                  value={newItem.nameEn}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nameEn: e.target.value }))}
                  placeholder={en ? "e.g., Betel leaves" : "ví dụ: Betel leaves"}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>{en ? "Category" : "Danh mục"}</Label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as any }))}
                  className="w-full h-10 rounded-md border border-input bg-background px-3"
                >
                  <option value="betel">{en ? "Betel" : "Trầu"}</option>
                  <option value="areca">{en ? "Areca" : "Cau"}</option>
                  <option value="tea">{en ? "Tea" : "Trà"}</option>
                  <option value="wine">{en ? "Wine" : "Rượu"}</option>
                  <option value="fruit">{en ? "Fruit" : "Hoa quả"}</option>
                  <option value="cake">{en ? "Cake" : "Bánh"}</option>
                  <option value="jewelry">{en ? "Jewelry" : "Trang sức"}</option>
                  <option value="other">{en ? "Other" : "Khác"}</option>
                </select>
              </div>
              <div>
                <Label>{en ? "Quantity" : "Số lượng"}</Label>
                <Input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  min="1"
                />
              </div>
              <div>
                <Label>{en ? "Cost (₫)" : "Chi phí (₫)"}</Label>
                <Input
                  type="number"
                  value={newItem.estimatedCost}
                  onChange={(e) => setNewItem(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-dark)]">
                {en ? "Add Gift" : "Thêm quà"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                {en ? "Cancel" : "Hủy"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { WELCOME_BAG_CATEGORIES, WELCOME_BAG_TEMPLATES } from "@/data/welcome-bag-items";
import type { WelcomeBagItem, WelcomeBagDistribution, Guest } from "@/types/wedding";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomeBagPanelProps {
  items: WelcomeBagItem[];
  distributions: WelcomeBagDistribution[];
  guests: Guest[];
  onAddItem: (item: Omit<WelcomeBagItem, "id">) => void;
  onRemoveItem: (id: number) => void;
  onUpdateItem: (id: number, updates: Partial<WelcomeBagItem>) => void;
  onToggleItemChecked: (id: number) => void;
  onAddDistribution: (distribution: Omit<WelcomeBagDistribution, "id">) => void;
  onRemoveDistribution: (id: number) => void;
  onUpdateDistribution: (id: number, updates: Partial<WelcomeBagDistribution>) => void;
  lang?: string;
}

export function WelcomeBagPanel({
  items,
  distributions,
  guests,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onToggleItemChecked,
  onAddDistribution,
  onRemoveDistribution,
  onUpdateDistribution,
  lang = "vi",
}: WelcomeBagPanelProps) {
  const en = lang === "en";
  const [activeTab, setActiveTab] = useState<"items" | "distribute">("items");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDistributeForm, setShowDistributeForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Calculate totals
  const totalBagsNeeded = guests.length;
  const totalCost = items.reduce((sum, item) => sum + (item.estimatedCost * item.totalQuantity), 0);
  const checkedCount = items.filter((i) => i.checked).length;
  const distributedCount = distributions.length;

  // Filter items by category
  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((i) => i.category === selectedCategory);

  // Add from template
  const handleAddFromTemplate = (templateId: string) => {
    const template = WELCOME_BAG_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    onAddItem({
      name: en ? template.nameEn : template.nameVi,
      category: template.category,
      description: en ? template.descriptionEn : template.descriptionVi,
      quantityPerBag: template.quantityPerBag,
      estimatedCost: template.estimatedCost,
      totalQuantity: template.quantityPerBag * totalBagsNeeded,
      notes: "",
      checked: false,
      custom: false,
    });
  };

  // Add custom item
  const handleAddCustom = (data: {
    name: string;
    category: string;
    description: string;
    quantityPerBag: number;
    estimatedCost: number;
    notes: string;
  }) => {
    onAddItem({
      ...data,
      category: data.category as any,
      totalQuantity: data.quantityPerBag * totalBagsNeeded,
      checked: false,
      custom: true,
    });
    setShowAddForm(false);
  };

  // Update quantity and recalculate total
  const handleUpdateQuantity = (id: number, quantityPerBag: number) => {
    onUpdateItem(id, {
      quantityPerBag,
      totalQuantity: quantityPerBag * totalBagsNeeded,
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{items.length}</div>
            <div className="text-xs text-muted-foreground">{en ? "Items" : "Mục"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{checkedCount}/{items.length}</div>
            <div className="text-xs text-muted-foreground">{en ? "Ready" : "Đã chuẩn bị"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{distributedCount}/{totalBagsNeeded}</div>
            <div className="text-xs text-muted-foreground">{en ? "Distributed" : "Đã phát"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{(totalCost / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground">{en ? "Total Cost" : "Tổng chi phí"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">
            {en ? "📦 Items" : "📦 Danh sách"}
          </TabsTrigger>
          <TabsTrigger value="distribute">
            {en ? "🎁 Distribute" : "🎁 Phát túi"}
          </TabsTrigger>
        </TabsList>

        {/* Items Tab */}
        <TabsContent value="items" className="space-y-4">
          {/* Category Filter & Add Button */}
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="all">{en ? "All Categories" : "Tất cả"}</option>
              {WELCOME_BAG_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {en ? cat.labelEn : cat.labelVi}
                </option>
              ))}
            </Select>
            <Button
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
              className="ml-auto"
            >
              {showAddForm ? (en ? "Cancel" : "Hủy") : (en ? "+ Add Item" : "+ Thêm")}
            </Button>
          </div>

          {/* Add Custom Item Form */}
          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{en ? "Add Custom Item" : "Thêm mục tùy chỉnh"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Input
                    placeholder={en ? "Item name" : "Tên mục"}
                    id="wb-custom-name"
                  />
                  <Select defaultValue="essentials">
                    {WELCOME_BAG_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {en ? cat.labelEn : cat.labelVi}
                      </option>
                    ))}
                  </Select>
                  <Textarea
                    placeholder={en ? "Description" : "Mô tả"}
                    id="wb-custom-desc"
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      placeholder={en ? "Qty per bag" : "Số lượng/túi"}
                      id="wb-custom-qty"
                      min={0}
                      defaultValue={1}
                    />
                    <Input
                      type="number"
                      placeholder={en ? "Cost each (VND)" : "Giá mỗi cái (VND)"}
                      id="wb-custom-cost"
                      min={0}
                      defaultValue={0}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const name = (document.getElementById("wb-custom-name") as HTMLInputElement)?.value || "";
                      const category = (document.getElementById("wb-custom-category") as HTMLInputElement)?.value || "essentials";
                      const desc = (document.getElementById("wb-custom-desc") as HTMLTextAreaElement)?.value || "";
                      const qty = parseInt((document.getElementById("wb-custom-qty") as HTMLInputElement)?.value || "1");
                      const cost = parseInt((document.getElementById("wb-custom-cost") as HTMLInputElement)?.value || "0");
                      if (name) handleAddCustom({ name, category, description: desc, quantityPerBag: qty, estimatedCost: cost, notes: "" });
                    }}
                  >
                    {en ? "Add Item" : "Thêm"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Templates */}
          {items.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{en ? "Quick Start" : "Bắt đầu nhanh"}</CardTitle>
                <CardDescription className="text-xs">
                  {en ? "Add from templates or create custom items" : "Thêm từ mẫu hoặc tạo mục tùy chỉnh"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {WELCOME_BAG_TEMPLATES.slice(0, 6).map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      size="sm"
                      className="h-auto py-2 px-3 flex flex-col items-start gap-1"
                      onClick={() => handleAddFromTemplate(template.id)}
                    >
                      <span className="text-lg">{template.icon}</span>
                      <span className="text-xs text-left">{en ? template.nameEn : template.nameVi}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          <div className="space-y-2">
            {filteredItems.map((item) => (
              <Card key={item.id} className={item.checked ? "opacity-60" : ""}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={item.checked}
                      onChange={() => onToggleItemChecked(item.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {WELCOME_BAG_CATEGORIES.find((c) => c.id === item.category)?.icon} {en ? WELCOME_BAG_CATEGORIES.find((c) => c.id === item.category)?.labelEn : WELCOME_BAG_CATEGORIES.find((c) => c.id === item.category)?.labelVi}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{en ? "Per bag:" : "Mỗi túi:"} {item.quantityPerBag}</span>
                        <span>{en ? "Total:" : "Tổng:"} {item.totalQuantity}</span>
                        <span>{en ? "Cost:" : "Giá:"} {(item.estimatedCost * item.totalQuantity).toLocaleString()} VND</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredItems.length === 0 && items.length > 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {en ? "No items in this category" : "Không có mục nào trong danh mục này"}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Distribute Tab */}
        <TabsContent value="distribute" className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowDistributeForm(!showDistributeForm)}
              className="ml-auto"
            >
              {en ? "+ Record Distribution" : "+ Ghi nhận phát túi"}
            </Button>
          </div>

          {/* Distribution Form */}
          {showDistributeForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{en ? "Record Distribution" : "Ghi nhận phát túi"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Select id="wb-dist-guest">
                    <option value="">{en ? "General distribution" : "Phát chung"}</option>
                    {guests.map((guest) => (
                      <option key={guest.id} value={guest.id.toString()}>
                        {guest.name} ({guest.side})
                      </option>
                    ))}
                  </Select>
                  <Input
                    placeholder={en ? "Guest name" : "Tên khách"}
                    id="wb-dist-name"
                  />
                  <Select defaultValue="pending" id="wb-dist-status">
                    <option value="pending">{en ? "Pending" : "Chưa phát"}</option>
                    <option value="in-progress">{en ? "In Progress" : "Đang phát"}</option>
                    <option value="complete">{en ? "Complete" : "Đã phát xong"}</option>
                  </Select>
                  <Input
                    type="date"
                    id="wb-dist-date"
                  />
                  <Input
                    placeholder={en ? "Distributed by" : "Người phát"}
                    id="wb-dist-by"
                  />
                  <Textarea
                    placeholder={en ? "Notes" : "Ghi chú"}
                    id="wb-dist-notes"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      const guestId = (document.getElementById("wb-dist-guest") as HTMLInputElement)?.value;
                      const guestName = (document.getElementById("wb-dist-name") as HTMLInputElement)?.value || (en ? "Guest" : "Khách");
                      const status = (document.getElementById("wb-dist-status") as HTMLInputElement)?.value || "pending";
                      const date = (document.getElementById("wb-dist-date") as HTMLInputElement)?.value || new Date().toISOString().split("T")[0];
                      const by = (document.getElementById("wb-dist-by") as HTMLInputElement)?.value || "";
                      const notes = (document.getElementById("wb-dist-notes") as HTMLTextAreaElement)?.value || "";
                      onAddDistribution({
                        guestId: guestId ? parseInt(guestId) : undefined,
                        guestName,
                        bagStatus: status as any,
                        distributedDate: date,
                        distributedBy: by,
                        notes,
                      });
                      setShowDistributeForm(false);
                    }}
                  >
                    {en ? "Save" : "Lưu"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Distribution List */}
          <div className="space-y-2">
            {distributions.map((dist) => (
              <Card key={dist.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{dist.guestName}</span>
                        <Badge variant={dist.bagStatus === "complete" ? "default" : "secondary"} className="text-xs">
                          {dist.bagStatus === "complete" ? (en ? "✓ Done" : "✓ Xong") : dist.bagStatus === "in-progress" ? (en ? "⟳ In Progress" : "⟳ Đang phát") : (en ? "○ Pending" : "○ Chưa")}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {dist.distributedDate} {dist.distributedBy && `• ${en ? "by" : "bởi"} ${dist.distributedBy}`}
                      </div>
                      {dist.notes && (
                        <p className="text-xs text-muted-foreground mt-1">{dist.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveDistribution(dist.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {distributions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {en ? "No distributions recorded yet" : "Chưa ghi nhận phát túi nào"}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

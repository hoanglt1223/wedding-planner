import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { MenuItem, MenuCourseType, DietaryType } from "@/types/wedding";
import { t } from "@/lib/i18n";

interface MenuEntryFormProps {
  item?: MenuItem | null;
  onSave: (data: Omit<MenuItem, "id">) => void;
  onCancel: () => void;
  lang: "vi" | "en";
}

const COURSE_OPTIONS: Array<{ value: MenuCourseType; labelVi: string; labelEn: string }> = [
  { value: "appetizer", labelVi: "Khai vị", labelEn: "Appetizer" },
  { value: "soup", labelVi: "Súp", labelEn: "Soup" },
  { value: "main", labelVi: "Món chính", labelEn: "Main Course" },
  { value: "side", labelVi: "Món phụ", labelEn: "Side Dish" },
  { value: "dessert", labelVi: "Tráng miệng", labelEn: "Dessert" },
  { value: "drink", labelVi: "Đồ uống", labelEn: "Drinks" },
  { value: "other", labelVi: "Khác", labelEn: "Other" },
];

const DIETARY_OPTIONS: Array<{ value: DietaryType; labelVi: string; labelEn: string; icon: string }> = [
  { value: "vegetarian", labelVi: "Chay", labelEn: "Vegetarian", icon: "🥬" },
  { value: "vegan", labelVi: "Thuần chay", labelEn: "Vegan", icon: "🌱" },
  { value: "halal", labelVi: "Halal", labelEn: "Halal", icon: "🕌" },
  { value: "gluten-free", labelVi: "Không gluten", labelEn: "Gluten-free", icon: "🌾" },
  { value: "nut-free", labelVi: "Không hạt", labelEn: "Nut-free", icon: "🥜" },
];

export function MenuEntryForm({ item, onSave, onCancel, lang }: MenuEntryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    courseType: "main" as MenuCourseType,
    dietary: [] as DietaryType[],
    description: "",
    costPerServing: 0,
    serves: 10,
    vendorName: "",
    notes: "",
    order: 0,
    isFavorite: false,
    checked: false,
    custom: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        courseType: item.courseType,
        dietary: item.dietary,
        description: item.description,
        costPerServing: item.costPerServing,
        serves: item.serves,
        vendorName: item.vendorName || "",
        notes: item.notes,
        order: item.order,
        isFavorite: item.isFavorite,
        checked: item.checked,
        custom: item.custom,
      });
    }
  }, [item]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = lang === "en" ? "Name is required" : "Tên món là bắt buộc";
    }
    if (formData.costPerServing < 0) {
      newErrors.costPerServing = lang === "en" ? "Invalid cost" : "Giá không hợp lệ";
    }
    if (formData.serves <= 0) {
      newErrors.serves = lang === "en" ? "Must serve at least 1 person" : "Phải phục vụ ít nhất 1 người";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave(formData);
  }

  function handleDietaryToggle(value: DietaryType) {
    setFormData((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(value)
        ? prev.dietary.filter((d) => d !== value)
        : [...prev.dietary, value],
    }));
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">
            {t("Tên món", lang)} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={lang === "en" ? "Enter dish name" : "Nhập tên món"}
            className="mt-1"
          />
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="courseType">
            {t("Loại món", lang)} <span className="text-destructive">*</span>
          </Label>
          <select
            id="courseType"
            value={formData.courseType}
            onChange={(e) => setFormData({ ...formData, courseType: e.target.value as MenuCourseType })}
            className="w-full mt-1 border rounded px-3 py-2 text-sm bg-background"
          >
            {COURSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {lang === "vi" ? option.labelVi : option.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>{t("Chỉ số ăn uống", lang)}</Label>
          <div className="flex flex-wrap gap-2 mt-1">
            {DIETARY_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-1 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.dietary.includes(option.value)}
                  onChange={() => handleDietaryToggle(option.value)}
                  className="rounded"
                />
                <span>{option.icon} {lang === "vi" ? option.labelVi : option.labelEn}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description">{t("Mô tả", lang)}</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={lang === "en" ? "Describe the dish..." : "Mô tả món ăn..."}
            rows={2}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="costPerServing">
              {t("Giá/phần (VND)", lang)} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="costPerServing"
              type="number"
              value={formData.costPerServing}
              onChange={(e) => setFormData({ ...formData, costPerServing: Number(e.target.value) })}
              placeholder="0"
              className="mt-1"
            />
            {errors.costPerServing && <p className="text-destructive text-xs mt-1">{errors.costPerServing}</p>}
          </div>
          <div>
            <Label htmlFor="serves">
              {t("Serves (người)", lang)} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="serves"
              type="number"
              value={formData.serves}
              onChange={(e) => setFormData({ ...formData, serves: Number(e.target.value) })}
              placeholder="10"
              className="mt-1"
            />
            {errors.serves && <p className="text-destructive text-xs mt-1">{errors.serves}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="vendorName">{t("Nhà cung cấp (tùy chọn)", lang)}</Label>
          <Input
            id="vendorName"
            value={formData.vendorName}
            onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
            placeholder={lang === "en" ? "Vendor name..." : "Tên nhà cung cấp..."}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="notes">{t("Ghi chú", lang)}</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder={lang === "en" ? "Additional notes..." : "Ghi chú thêm..."}
            rows={2}
            className="mt-1"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            {item ? t("Cập nhật", lang) : t("Thêm món", lang)}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("Hủy", lang)}
          </Button>
        </div>
      </form>
    </Card>
  );
}
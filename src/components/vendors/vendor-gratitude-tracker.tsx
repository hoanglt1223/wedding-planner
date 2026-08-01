/**
 * Vendor Gratitude Tracker Component
 * Main component for managing vendor tips and gratuities
 */

import { useState } from "react";
import { t } from "@/lib/i18n";
import { TIPPING_GUIDE, getSuggestedTip } from "@/data/vendor-tipping-guide";
import type { Vendor, VendorGratitude, VendorGratitudeStatus } from "@/types/wedding";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface VendorGratitudeTrackerProps {
  vendors: Vendor[];
  gratitudeList: VendorGratitude[];
  onAdd: (gratitude: Omit<VendorGratitude, "id" | "createdAt">) => void;
  onUpdate: (id: number, updates: Partial<VendorGratitude>) => void;
  onRemove: (id: number) => void;
  lang: "vi" | "en";
}

export function VendorGratitudeTracker({
  vendors,
  gratitudeList,
  onAdd,
  onUpdate,
  onRemove,
  lang,
}: VendorGratitudeTrackerProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<VendorGratitude>>({});

  const labels = {
    title: t("💰 Vendor Tip Tracker", lang),
    subtitle: t("Track tips and gratuities for wedding vendors", lang),
    addTip: t("Add Tip", lang),
    edit: t("Edit", lang),
    delete: t("Delete", lang),
    save: t("Save", lang),
    cancel: t("Cancel", lang),
    vendor: t("Vendor", lang),
    amount: t("Amount (VND)", lang),
    status: t("Status", lang),
    plannedDate: t("Planned Date", lang),
    givenDate: t("Given Date", lang),
    notes: t("Notes", lang),
    noTips: t("No tips tracked yet", lang),
    totalTips: t("Total Tips Given", lang),
    totalPlanned: t("Total Tips Planned", lang),
    suggestedTip: t("Suggested", lang),
    statusPlanned: t("Planned", lang),
    statusGiven: t("Given", lang),
    statusPending: t("Pending", lang),
    deleteConfirm: lang === "en" ? "Delete this tip?" : "Xóa tip này?",
  };

  // Combine vendors with their gratitude records
  const vendorWithGratitude = vendors.map((vendor) => {
    const gratitude = gratitudeList.find((g) => g.vendorId === vendor.id);
    const suggestedTip = getSuggestedTip(vendor.category, vendor.budget);
    return {
      ...vendor,
      gratitude,
      suggestedTip,
    };
  });

  // Calculate totals
  const totalGiven = gratitudeList
    .filter((g) => g.status === "given")
    .reduce((sum, g) => sum + g.amount, 0);

  const totalPlanned = gratitudeList
    .filter((g) => g.status === "planned")
    .reduce((sum, g) => sum + g.amount, 0);

  function handleAdd() {
    setShowAddForm(true);
    setFormData({ status: "planned" as VendorGratitudeStatus });
  }

  function handleEdit(vendorId: number) {
    const existing = gratitudeList.find((g) => g.vendorId === vendorId);
    if (existing) {
      setEditingId(existing.id);
      setFormData(existing);
    } else {
      setShowAddForm(true);
      setFormData({
        vendorId,
        status: "planned" as VendorGratitudeStatus,
        amount: getSuggestedTip(
          vendors.find((v) => v.id === vendorId)?.category || "",
          vendors.find((v) => v.id === vendorId)?.budget || 0
        ),
      });
    }
  }

  function handleSave() {
    if (!formData.vendorId || !formData.amount) return;

    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData as Omit<VendorGratitude, "id" | "createdAt">);
      setShowAddForm(false);
    }
    setFormData({});
  }

  function handleCancel() {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({});
  }

  function handleDelete(id: number) {
    if (window.confirm(labels.deleteConfirm)) {
      onRemove(id);
    }
  }

  function getStatusIcon(status: VendorGratitudeStatus) {
    switch (status) {
      case "given":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "planned":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">{labels.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{labels.subtitle}</p>
        </div>
        <Button size="sm" onClick={handleAdd} className="text-xs">
          <Plus className="w-3 h-3 mr-1" />
          {labels.addTip}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-2">
        <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-950/20">
          <div className="text-xs text-muted-foreground">{labels.totalTips}</div>
          <div className="font-semibold text-lg">{(totalGiven / 1000000).toFixed(1)}M VND</div>
        </div>
        <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20">
          <div className="text-xs text-muted-foreground">{labels.totalPlanned}</div>
          <div className="font-semibold text-lg">{(totalPlanned / 1000000).toFixed(1)}M VND</div>
        </div>
      </div>

      {/* Vendor List with Tips */}
      {vendorWithGratitude.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm italic">
          {labels.noTips}
        </div>
      ) : (
        <div className="space-y-2">
          {vendorWithGratitude.map((vendor) => {
            const isEditing = editingId === vendor.gratitude?.id;
            const isAdding = showAddForm && formData.vendorId === vendor.id;

            return (
              <div key={vendor.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{vendor.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {vendor.category} • {(vendor.budget / 1000000).toFixed(1)}M VND
                    </div>
                  </div>

                  {!isEditing && !isAdding && (
                    <div className="flex items-center gap-1">
                      {vendor.gratitude && (
                        <div className="flex items-center gap-1 mr-2">
                          {getStatusIcon(vendor.gratitude.status)}
                          <span className="text-xs font-medium">
                            {(vendor.gratitude.amount / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(vendor.id)} className="h-7 w-7 p-0">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      {vendor.gratitude && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(vendor.gratitude!.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit/Add Form */}
                {(isEditing || isAdding) && (
                  <div className="space-y-2 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">{labels.amount}</label>
                        <input
                          type="number"
                          value={formData.amount || vendor.suggestedTip || ""}
                          onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                          className="w-full border rounded px-2 py-1 text-sm"
                          placeholder={vendor.suggestedTip ? `${labels.suggestedTip}: ${(vendor.suggestedTip / 1000000).toFixed(1)}M` : ""}
                        />
                        {vendor.suggestedTip && !formData.amount && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {labels.suggestedTip}: {(vendor.suggestedTip / 1000000).toFixed(1)}M VND
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground">{labels.status}</label>
                        <select
                          value={formData.status || "planned"}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as VendorGratitudeStatus })}
                          className="w-full border rounded px-2 py-1 text-sm bg-background"
                        >
                          <option value="planned">{labels.statusPlanned}</option>
                          <option value="given">{labels.statusGiven}</option>
                          <option value="pending">{labels.statusPending}</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">{labels.plannedDate}</label>
                        <input
                          type="date"
                          value={formData.plannedDate || ""}
                          onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground">{labels.givenDate}</label>
                        <input
                          type="date"
                          value={formData.givenDate || ""}
                          onChange={(e) => setFormData({ ...formData, givenDate: e.target.value })}
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground">{labels.notes}</label>
                      <input
                        type="text"
                        value={formData.notes || ""}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full border rounded px-2 py-1 text-sm"
                        placeholder={lang === "en" ? "Optional notes about this tip" : "Ghi chú về tip này (tùy chọn)"}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button size="sm" onClick={handleSave} className="text-xs flex-1">
                        {labels.save}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancel} className="text-xs flex-1">
                        {labels.cancel}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Display gratitude details if exists and not editing */}
                {vendor.gratitude && !isEditing && !isAdding && (
                  <div className="text-xs space-y-1 pt-2 border-t">
                    {vendor.gratitude.plannedDate && (
                      <div className="text-muted-foreground">
                        {labels.plannedDate}: {new Date(vendor.gratitude.plannedDate).toLocaleDateString()}
                      </div>
                    )}
                    {vendor.gratitude.givenDate && (
                      <div className="text-muted-foreground">
                        {labels.givenDate}: {new Date(vendor.gratitude.givenDate).toLocaleDateString()}
                      </div>
                    )}
                    {vendor.gratitude.notes && (
                      <div className="text-muted-foreground italic">"{vendor.gratitude.notes}"</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

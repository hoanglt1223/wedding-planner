import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Vendor, VendorCommunication, VendorCommunicationType } from "@/types/wedding";
import { t } from "@/lib/i18n";

const COMM_TYPES: { id: VendorCommunicationType; icon: string; labelVi: string; labelEn: string }[] = [
  { id: "email", icon: "📧", labelVi: "Email", labelEn: "Email" },
  { id: "call", icon: "📞", labelVi: "Cuộc gọi", labelEn: "Call" },
  { id: "meeting", icon: "🤝", labelVi: "Họp mặt", labelEn: "Meeting" },
  { id: "text", icon: "💬", labelVi: "Tin nhắn", labelEn: "Text" },
  { id: "other", icon: "📝", labelVi: "Khác", labelEn: "Other" },
];

function getCommTypeConfig(type: VendorCommunicationType) {
  return COMM_TYPES.find((c) => c.id === type) ?? COMM_TYPES[4];
}

interface VendorCommunicationLogProps {
  vendors: Vendor[];
  communications: VendorCommunication[];
  onAdd: (communication: Omit<VendorCommunication, "id">) => void;
  onUpdate: (id: number, updates: Partial<VendorCommunication>) => void;
  onRemove: (id: number) => void;
  lang?: string;
}

export function VendorCommunicationLog({
  vendors,
  communications,
  onAdd,
  onUpdate,
  onRemove,
  lang = "vi",
}: VendorCommunicationLogProps) {
  const en = lang === "en";
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterVendor, setFilterVendor] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<VendorCommunicationType | null>(null);
  const [filterFollowUp, setFilterFollowUp] = useState<boolean | null>(null);

  // Add form state
  const [addVendorId, setAddVendorId] = useState<number | null>(null);
  const [addType, setAddType] = useState<VendorCommunicationType>("email");
  const [addSubject, setAddSubject] = useState("");
  const [addContent, setAddContent] = useState("");
  const [addDate, setAddDate] = useState(new Date().toISOString().split("T")[0]);
  const [addFollowUpDate, setAddFollowUpDate] = useState("");
  const [addCompleted, setAddCompleted] = useState(false);

  // Edit form state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editFollowUpDate, setEditFollowUpDate] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  function resetAddForm() {
    setAddVendorId(null);
    setAddType("email");
    setAddSubject("");
    setAddContent("");
    setAddDate(new Date().toISOString().split("T")[0]);
    setAddFollowUpDate("");
    setAddCompleted(false);
  }

  function handleAdd() {
    if (!addVendorId || !addSubject.trim()) return;
    onAdd({
      vendorId: addVendorId,
      type: addType,
      subject: addSubject.trim(),
      content: addContent.trim(),
      date: addDate,
      followUpDate: addFollowUpDate || undefined,
      completed: addCompleted,
    });
    resetAddForm();
    setShowAddForm(false);
  }

  function startEdit(comm: VendorCommunication) {
    setEditingId(comm.id);
    setEditSubject(comm.subject);
    setEditContent(comm.content);
    setEditFollowUpDate(comm.followUpDate || "");
    setEditCompleted(comm.completed);
  }

  function saveEdit() {
    if (!editingId) return;
    onUpdate(editingId, {
      subject: editSubject.trim(),
      content: editContent.trim(),
      followUpDate: editFollowUpDate || undefined,
      completed: editCompleted,
    });
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditSubject("");
    setEditContent("");
    setEditFollowUpDate("");
    setEditCompleted(false);
  }

  // Filter communications
  const filteredComms = communications
    .filter((c) => {
      if (filterVendor && c.vendorId !== filterVendor) return false;
      if (filterType && c.type !== filterType) return false;
      if (filterFollowUp !== null) {
        const hasFollowUp = c.followUpDate && !c.completed;
        if (filterFollowUp && !hasFollowUp) return false;
        if (!filterFollowUp && hasFollowUp) return false;
      }
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Get vendor name
  function getVendorName(vendorId: number) {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? `${vendor.category} — ${vendor.name}` : t("Không tìm thấy", lang);
  }

  // Check if follow-up is overdue
  function isOverdue(followUpDate?: string, completed?: boolean) {
    if (!followUpDate || completed) return false;
    return new Date(followUpDate) < new Date();
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">{t("Nhật ký liên lạc", lang)}</h3>
          <p className="text-sm text-gray-500">{t("Theo dõi email, cuộc gọi, cuộc họp với nhà cung cấp", lang)}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="sm">
          {showAddForm ? t("Đóng", lang) : `+ ${t("Thêm mới", lang)}`}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">{t("Nhà cung cấp", lang)}</label>
              <select
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={addVendorId ?? ""}
                onChange={(e) => setAddVendorId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">{t("Chọn nhà cung cấp...", lang)}</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.category} — {v.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("Loại liên lạc", lang)}</label>
              <select
                className="w-full mt-1 p-2 border rounded-md text-sm"
                value={addType}
                onChange={(e) => setAddType(e.target.value as VendorCommunicationType)}
              >
                {COMM_TYPES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {en ? c.labelEn : c.labelVi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t("Ngày", lang)}</label>
              <Input
                type="date"
                className="mt-1"
                value={addDate}
                onChange={(e) => setAddDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("Ngày theo dõi (tùy chọn)", lang)}</label>
              <Input
                type="date"
                className="mt-1"
                value={addFollowUpDate}
                onChange={(e) => setAddFollowUpDate(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">{t("Chủ đề", lang)}</label>
              <Input
                placeholder={t("Tiêu đề email/cuộc gọi...", lang)}
                className="mt-1"
                value={addSubject}
                onChange={(e) => setAddSubject(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">{t("Nội dung", lang)}</label>
              <Textarea
                placeholder={t("Chi tiết về cuộc trò chuyện...", lang)}
                className="mt-1 min-rows-3"
                value={addContent}
                onChange={(e) => setAddContent(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addCompleted"
                checked={addCompleted}
                onChange={(e) => setAddCompleted(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="addCompleted" className="text-sm">{t("Đã hoàn thành", lang)}</label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
              {t("Hủy", lang)}
            </Button>
            <Button size="sm" onClick={handleAdd}>
              {t("Lưu", lang)}
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <select
          className="px-3 py-1.5 border rounded-md text-sm"
          value={filterVendor ?? ""}
          onChange={(e) => setFilterVendor(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">{t("Tất cả nhà cung cấp", lang)}</option>
          {vendors.map((v) => (
            <option key={v.id} value={v.id}>
              {v.category} — {v.name}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-1.5 border rounded-md text-sm"
          value={filterType ?? ""}
          onChange={(e) => setFilterType(e.target.value ? (e.target.value as VendorCommunicationType) : null)}
        >
          <option value="">{t("Tất cả loại", lang)}</option>
          {COMM_TYPES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {en ? c.labelEn : c.labelVi}
            </option>
          ))}
        </select>
        <select
          className="px-3 py-1.5 border rounded-md text-sm"
          value={filterFollowUp === null ? "" : filterFollowUp ? "true" : "false"}
          onChange={(e) => {
            const val = e.target.value;
            setFilterFollowUp(val === "" ? null : val === "true");
          }}
        >
          <option value="">{t("Tất cả trạng thái", lang)}</option>
          <option value="true">{t("Cần theo dõi", lang)}</option>
          <option value="false">{t("Không cần theo dõi", lang)}</option>
        </select>
        {(filterVendor || filterType || filterFollowUp !== null) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterVendor(null);
              setFilterType(null);
              setFilterFollowUp(null);
            }}
          >
            {t("Xóa bộ lọc", lang)}
          </Button>
        )}
      </div>

      {/* Communications List */}
      <div className="space-y-3">
        {filteredComms.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            {communications.length === 0
              ? t("Chưa có lần liên lạc nào. Thêm lần liên lạc đầu tiên của bạn!", lang)
              : t("Không tìm thấy lần liên lạc nào phù hợp với bộ lọc.", lang)}
          </Card>
        ) : (
          filteredComms.map((comm) => {
            const typeConfig = getCommTypeConfig(comm.type);
            const vendorName = getVendorName(comm.vendorId);
            const overdue = isOverdue(comm.followUpDate, comm.completed);

            return (
              <Card key={comm.id} className="p-4">
                {editingId === comm.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{vendorName}</span>
                      <Badge variant="outline">{typeConfig.icon} {en ? typeConfig.labelEn : typeConfig.labelVi}</Badge>
                    </div>
                    <Input
                      placeholder={t("Chủ đề...", lang)}
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                    />
                    <Textarea
                      placeholder={t("Nội dung...", lang)}
                      className="min-rows-3"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-gray-500">{t("Ngày theo dõi", lang)}</label>
                        <Input
                          type="date"
                          value={editFollowUpDate}
                          onChange={(e) => setEditFollowUpDate(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          id={`editCompleted-${comm.id}`}
                          checked={editCompleted}
                          onChange={(e) => setEditCompleted(e.target.checked)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={`editCompleted-${comm.id}`} className="text-sm">{t("Đã hoàn thành", lang)}</label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={cancelEdit}>
                        {t("Hủy", lang)}
                      </Button>
                      <Button size="sm" onClick={saveEdit}>
                        {t("Lưu", lang)}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline">{typeConfig.icon} {en ? typeConfig.labelEn : typeConfig.labelVi}</Badge>
                          <span className="text-sm font-medium">{comm.subject}</span>
                          {comm.followUpDate && !comm.completed && (
                            <Badge className={overdue ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}>
                              {overdue ? "⚠️ " : ""}{t("Theo dõi: ", lang)}{comm.followUpDate}
                            </Badge>
                          )}
                          {comm.completed && (
                            <Badge className="bg-green-100 text-green-700">✓ {t("Đã xong", lang)}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{vendorName} • {comm.date}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(comm)}>
                          {t("Sửa", lang)}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onRemove(comm.id)}
                        >
                          {t("Xóa", lang)}
                        </Button>
                      </div>
                    </div>
                    {comm.content && (
                      <>
                        <Separator />
                        <p className="text-sm whitespace-pre-wrap">{comm.content}</p>
                      </>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
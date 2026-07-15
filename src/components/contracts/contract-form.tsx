import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatMoney } from "@/lib/format";
import type { WeddingContract, ContractStatus, PaymentMilestone } from "@/types/contracts";

interface ContractFormProps {
  contract?: WeddingContract | null;
  onSave: (data: Omit<WeddingContract, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  lang?: string;
}

export function ContractForm({ contract, vendors = [], onSave, onCancel, lang = "vi" }: ContractFormProps) {
  const en = lang === "en";
  const isEdit = contract && contract.id > 0;

  // Form state
  const [vendorName, setVendorName] = useState(contract?.vendorName || "");
  const [vendorCategory, setVendorCategory] = useState(contract?.vendorCategory || "");
  const [status, setStatus] = useState<ContractStatus>(contract?.status || "draft");
  const [totalAmount, setTotalAmount] = useState(contract?.totalAmount || 0);
  const [startDate, setStartDate] = useState(contract?.startDate || "");
  const [endDate, setEndDate] = useState(contract?.endDate || "");
  const [notes, setNotes] = useState(contract?.notes || "");
  const [contractUrl, setContractUrl] = useState(contract?.contractUrl || "");
  const [signedDate, setSignedDate] = useState(contract?.signedDate || "");
  const [cancellationDeadline, setCancellationDeadline] = useState(contract?.cancellationDeadline || "");
  const [cancellationFee, setCancellationFee] = useState(contract?.cancellationFee || 0);

  // Payment milestones state
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>(
    contract?.paymentMilestones || []
  );

  // Add new payment milestone
  const addPaymentMilestone = () => {
    const newMilestone: PaymentMilestone = {
      id: Date.now(),
      title: en ? "Payment" : "Thanh toán",
      amount: 0,
      dueDate: "",
      status: "pending",
    };
    setPaymentMilestones([...paymentMilestones, newMilestone]);
  };

  // Update payment milestone
  const updatePaymentMilestone = (id: number, field: keyof PaymentMilestone, value: any) => {
    setPaymentMilestones(
      paymentMilestones.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      )
    );
  };

  // Remove payment milestone
  const removePaymentMilestone = (id: number) => {
    setPaymentMilestones(paymentMilestones.filter((m) => m.id !== id));
  };

  // Calculate total paid
  const totalPaid = paymentMilestones
    .filter((m) => m.status === "paid")
    .reduce((sum, m) => sum + m.amount, 0);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contractData: Omit<WeddingContract, "id" | "createdAt" | "updatedAt"> = {
      vendorId: undefined,
      vendorName,
      vendorCategory,
      contractType: contract?.contractType || "service",
      status,
      totalAmount,
      startDate,
      endDate,
      paymentMilestones,
      depositPaid: totalPaid,
      totalPaid,
      requirementIds: [],
      customRequirements: [],
      signedDate: signedDate || undefined,
      cancellationDeadline: cancellationDeadline || undefined,
      cancellationFee: cancellationFee || undefined,
      notes: notes || undefined,
      contractUrl: contractUrl || undefined,
      documents: [],
      reminderSent: false,
    };

    onSave(contractData);
  };

  // Vendor category options
  const categoryOptions = [
    { value: "venue", labelVi: "Địa điểm", labelEn: "Venue" },
    { value: "photography", labelVi: "Chụp ảnh", labelEn: "Photography" },
    { value: "videography", labelVi: "Quay phim", labelEn: "Videography" },
    { value: "makeup", labelVi: "Trang điểm", labelEn: "Makeup" },
    { value: "flowers", labelVi: "Hoa", labelEn: "Flowers" },
    { value: "catering", labelVi: "Ẩm thực", labelEn: "Catering" },
    { value: "mc", labelVi: "MC", labelEn: "MC" },
    { value: "jewelry", labelVi: "Nhẫn/trang sức", labelEn: "Jewelry" },
    { value: "attire", labelVi: "Váy cưới", labelEn: "Wedding Dress" },
    { value: "transportation", labelVi: "Vận chuyển", labelEn: "Transportation" },
    { value: "cake", labelVi: "Bánh cưới", labelEn: "Wedding Cake" },
    { value: "other", labelVi: "Khác", labelEn: "Other" },
  ];

  // Status options
  const statusOptions: Array<{ value: ContractStatus; labelVi: string; labelEn: string }> = [
    { value: "draft", labelVi: "Nháp", labelEn: "Draft" },
    { value: "sent", labelVi: "Đã gửi", labelEn: "Sent" },
    { value: "negotiating", labelVi: "Đang thương lượng", labelEn: "Negotiating" },
    { value: "signed", labelVi: "Đã ký", labelEn: "Signed" },
    { value: "completed", labelVi: "Hoàn thành", labelEn: "Completed" },
    { value: "cancelled", labelVi: "Đã hủy", labelEn: "Cancelled" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-4">
          {isEdit ? en ? "Cập nhật hợp đồng" : "Cập nhật hợp đồng" : en ? "Thêm hợp đồng mới" : "Thêm hợp đồng mới"}
        </h3>

        {/* Vendor Information */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="vendorName">{en ? "Tên nhà cung cấp" : "Tên nhà cung cấp"} *</Label>
              <Input
                id="vendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder={en ? "Nhà hàng ABC" : "Nhà hàng ABC"}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="vendorCategory">{en ? "Danh mục" : "Danh mục"} *</Label>
              <select
                id="vendorCategory"
                value={vendorCategory}
                onChange={(e) => setVendorCategory(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm bg-background mt-1"
                required
              >
                <option value="">{en ? "Chọn danh mục" : "Chọn danh mục"}</option>
                {categoryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {en ? opt.labelEn : opt.labelVi}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="status">{en ? "Trạng thái" : "Trạng thái"}</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ContractStatus)}
                className="w-full border rounded px-3 py-2 text-sm bg-background mt-1"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {en ? opt.labelEn : opt.labelVi}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="totalAmount">{en ? "Tổng giá trị (VND)" : "Tổng giá trị (VND)"}</Label>
              <Input
                id="totalAmount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(Number(e.target.value))}
                placeholder="50000000"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="startDate">{en ? "Ngày bắt đầu" : "Ngày bắt đầu"}</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">{en ? "Ngày kết thúc" : "Ngày kết thúc"}</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">{en ? "Ghi chú" : "Ghi chú"}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={en ? "Additional notes..." : "Ghi chú thêm..."}
              rows={2}
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Payment Milestones */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">{en ? "Thanh toán" : "Thanh toán"}</h3>
          <Button type="button" size="sm" variant="outline" onClick={addPaymentMilestone}>
            + {en ? "Thêm mốc" : "Thêm mốc"}
          </Button>
        </div>

        <div className="space-y-2 mb-3">
          {paymentMilestones.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">
              {en ? "Chưa có mốc thanh toán" : "Chưa có mốc thanh toán"}
            </p>
          ) : (
            paymentMilestones.map((milestone) => (
              <div key={milestone.id} className="border rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Input
                    value={milestone.title}
                    onChange={(e) => updatePaymentMilestone(milestone.id, "title", e.target.value)}
                    placeholder={en ? "Payment" : "Thanh toán"}
                    className="flex-1 mr-2"
                  />
                  <button
                    type="button"
                    onClick={() => removePaymentMilestone(milestone.id)}
                    className="text-red-600 text-sm"
                  >
                    🗑️
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="number"
                      value={milestone.amount}
                      onChange={(e) => updatePaymentMilestone(milestone.id, "amount", Number(e.target.value))}
                      placeholder={en ? "Amount" : "Số tiền"}
                    />
                  </div>
                  <div>
                    <Input
                      type="date"
                      value={milestone.dueDate}
                      onChange={(e) => updatePaymentMilestone(milestone.id, "dueDate", e.target.value)}
                    />
                  </div>
                  <div>
                    <select
                      value={milestone.status}
                      onChange={(e) => updatePaymentMilestone(milestone.id, "status", e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm bg-background"
                    >
                      <option value="pending">{en ? "Pending" : "Chờ"}</option>
                      <option value="paid">{en ? "Paid" : "Đã trả"}</option>
                      <option value="overdue">{en ? "Overdue" : "Quá hạn"}</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          {en ? "Total paid: " : "Tổng đã trả: "}
          <span className="font-semibold text-green-600">{formatMoney(totalPaid, lang)}₫</span>
          {totalAmount > 0 && (
            <span className="ml-2">
              ({en ? "of " : "trên "}
              {formatMoney(totalAmount, lang)}₫)
            </span>
          )}
        </div>
      </Card>

      {/* Additional Options */}
      <Card className="p-4">
        <h3 className="font-semibold text-sm mb-3">{en ? "Tùy chọn" : "Tùy chọn"}</h3>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="signedDate">{en ? "Ngày ký" : "Ngày ký"}</Label>
              <Input
                id="signedDate"
                type="date"
                value={signedDate}
                onChange={(e) => setSignedDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cancellationDeadline">{en ? "Hạn chốt hủy" : "Hạn chốt hủy"}</Label>
              <Input
                id="cancellationDeadline"
                type="date"
                value={cancellationDeadline}
                onChange={(e) => setCancellationDeadline(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cancellationFee">{en ? "Phí hủy (VND)" : "Phí hủy (VND)"}</Label>
            <Input
              id="cancellationFee"
              type="number"
              value={cancellationFee}
              onChange={(e) => setCancellationFee(Number(e.target.value))}
              placeholder="0"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contractUrl">{en ? "Link hợp đồng" : "Link hợp đồng"}</Label>
            <Input
              id="contractUrl"
              value={contractUrl}
              onChange={(e) => setContractUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {isEdit ? en ? "Cập nhật" : "Cập nhật" : en ? "Thêm" : "Thêm"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          {en ? "Hủy" : "Hủy"}
        </Button>
      </div>
    </form>
  );
}

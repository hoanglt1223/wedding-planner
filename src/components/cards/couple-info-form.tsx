import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CoupleInfo } from "@/types/wedding";

interface CoupleInfoFormProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string) => void;
}

export function CoupleInfoForm({ info, onUpdateInfo }: CoupleInfoFormProps) {
  return (
    <div className="space-y-2">
      {/* Row 1: Bride & Groom */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs font-semibold">Cô dâu</Label>
          <Input
            value={info.bride}
            onChange={(e) => onUpdateInfo("bride", e.target.value)}
            className="mt-0.5"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Chú rể</Label>
          <Input
            value={info.groom}
            onChange={(e) => onUpdateInfo("groom", e.target.value)}
            className="mt-0.5"
          />
        </div>
      </div>

      {/* Row 2: Families */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs font-semibold">Họ nhà gái</Label>
          <Input
            value={info.bf}
            onChange={(e) => onUpdateInfo("bf", e.target.value)}
            className="mt-0.5"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Họ nhà trai</Label>
          <Input
            value={info.gf}
            onChange={(e) => onUpdateInfo("gf", e.target.value)}
            className="mt-0.5"
          />
        </div>
      </div>

      {/* Row 3: Dates */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Label className="text-xs font-semibold">Ngày dạm ngõ</Label>
          <Input
            type="date"
            value={info.dDN}
            onChange={(e) => onUpdateInfo("dDN", e.target.value)}
            className="mt-0.5"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Ngày hỏi</Label>
          <Input
            type="date"
            value={info.dDH}
            onChange={(e) => onUpdateInfo("dDH", e.target.value)}
            className="mt-0.5"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Ngày cưới</Label>
          <Input
            type="date"
            value={info.date}
            onChange={(e) => onUpdateInfo("date", e.target.value)}
            className="mt-0.5"
          />
        </div>
      </div>
    </div>
  );
}

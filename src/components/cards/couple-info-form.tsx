import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
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
            value={info.brideFamilyName}
            onChange={(e) => onUpdateInfo("brideFamilyName", e.target.value)}
            className="mt-0.5"
          />
        </div>
        <div className="flex-1">
          <Label className="text-xs font-semibold">Họ nhà trai</Label>
          <Input
            value={info.groomFamilyName}
            onChange={(e) => onUpdateInfo("groomFamilyName", e.target.value)}
            className="mt-0.5"
          />
        </div>
      </div>

      {/* Row 3: Dates */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div>
          <Label className="text-xs font-semibold">Ngày dạm ngõ</Label>
          <DateInput
            value={info.engagementDate}
            onChange={(v) => onUpdateInfo("engagementDate", v)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-0.5"
          />
        </div>
        <div>
          <Label className="text-xs font-semibold">Ngày hỏi</Label>
          <DateInput
            value={info.betrothalDate}
            onChange={(v) => onUpdateInfo("betrothalDate", v)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-0.5"
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Label className="text-xs font-semibold">Ngày cưới</Label>
          <DateInput
            value={info.date}
            onChange={(v) => onUpdateInfo("date", v)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm mt-0.5"
          />
        </div>
      </div>
    </div>
  );
}

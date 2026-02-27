import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

interface TimelineHeaderProps {
  lang: string;
  entryCount: number;
  onAdd: () => void;
  onGenerate: () => void;
}

export function TimelineHeader({ lang, entryCount, onAdd, onGenerate }: TimelineHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {t("Lịch trình ngày cưới", lang)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {entryCount} {lang === "en" ? "entries" : "mục"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onGenerate}
            className="text-xs"
          >
            {t("Tạo từ mẫu", lang)}
          </Button>
          <Button size="sm" onClick={onAdd} className="text-xs">
            + {t("Thêm mục", lang)}
          </Button>
        </div>
      </div>
    </div>
  );
}

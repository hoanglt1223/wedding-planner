import { useState } from "react";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n";
import type { RsvpSettings } from "@/types/wedding";

interface RsvpSettingsFormProps {
  settings: RsvpSettings;
  onChange: (partial: Partial<RsvpSettings>) => void;
  lang: string;
}

export function RsvpSettingsForm({ settings, onChange, lang }: RsvpSettingsFormProps) {
  const [open, setOpen] = useState(!settings.venue);

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-left"
        onClick={() => setOpen(!open)}
      >
        <span>⚙️ {t("Cài đặt RSVP", lang)}</span>
        <span className="text-xs text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-100 pt-2">
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">{t("Lời chào", lang)}</label>
            <textarea
              className="w-full rounded border border-gray-200 p-2 text-sm resize-none"
              rows={2}
              value={settings.welcomeMessage}
              onChange={(e) => onChange({ welcomeMessage: e.target.value })}
              placeholder={lang === "en" ? "We joyfully invite you..." : "Trân trọng kính mời..."}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">{t("Địa điểm tiệc", lang)}</label>
              <Input className="h-8 text-sm" value={settings.venue} onChange={(e) => onChange({ venue: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">{t("Địa chỉ", lang)}</label>
              <Input className="h-8 text-sm" value={settings.venueAddress} onChange={(e) => onChange({ venueAddress: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">{t("Link bản đồ", lang)}</label>
            <Input className="h-8 text-sm" value={settings.venueMapLink} onChange={(e) => onChange({ venueMapLink: e.target.value })} placeholder="https://maps.google.com/..." />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-0.5">{t("Câu chuyện đôi mình", lang)}</label>
            <textarea
              className="w-full rounded border border-gray-200 p-2 text-sm resize-none"
              rows={2}
              value={settings.coupleStory}
              onChange={(e) => onChange({ coupleStory: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

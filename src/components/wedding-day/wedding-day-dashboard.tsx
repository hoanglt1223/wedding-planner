/**
 * Wedding Day Dashboard
 * Mobile-first "Mission Control" for the wedding day combining critical day-of features
 */

import { useWeddingStoreContext } from "@/contexts/wedding-store-context";
import { LiveCountdown } from "./live-countdown";
import { QuickVendorDial } from "./quick-vendor-dial";
import { EmergencyContacts } from "./emergency-contacts";
import { WeatherSummary } from "./weather-summary";
import { PhotoChecklist } from "./photo-checklist";
import { TransportationStatus } from "./transportation-status";
import { TimelineAtAGlance } from "./timeline-at-a-glance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface WidgetConfig {
  id: string;
  titleVi: string;
  titleEn: string;
  enabled: boolean;
}

export function WeddingDayDashboard() {
  const { state } = useWeddingStoreContext();
  const lang = state.lang;

  const [widgets, setWidgets] = useState<WidgetConfig[]>([
    { id: "countdown", titleVi: "Đếm Ngược", titleEn: "Countdown", enabled: true },
    { id: "vendors", titleVi: "Nhà Cung Cấp", titleEn: "Vendors", enabled: true },
    { id: "timeline", titleVi: "Lịch Trình", titleEn: "Timeline", enabled: true },
    { id: "emergency", titleVi: "Khẩn Cấp", titleEn: "Emergency", enabled: true },
    { id: "weather", titleVi: "Thời Tiết", titleEn: "Weather", enabled: true },
    { id: "photos", titleVi: "Chụp Ảnh", titleEn: "Photos", enabled: true },
    { id: "transport", titleVi: "Vận Chuyển", titleEn: "Transport", enabled: true },
  ]);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(w =>
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const enabledWidgets = widgets.filter(w => w.enabled);

  return (
    <div className="space-y-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {lang === "en" ? "Wedding Day Dashboard" : "Trung Tâm Ngày Cưới"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {state.info.date && (
              lang === "en"
                ? `Your wedding day: ${new Date(state.info.date).toLocaleDateString()}`
                : `Ngày cưới của bạn: ${new Date(state.info.date).toLocaleDateString()}`
            )}
          </p>
        </div>
      </div>

      {/* Widget Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {lang === "en" ? "Show Widgets" : "Hiển Thị Widget"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {widgets.map(widget => (
            <div key={widget.id} className="flex items-center space-x-2">
              <Checkbox
                id={`widget-${widget.id}`}
                checked={widget.enabled}
                onCheckedChange={() => toggleWidget(widget.id)}
              />
              <label
                htmlFor={`widget-${widget.id}`}
                className="text-sm font-medium cursor-pointer"
              >
                {lang === "en" ? widget.titleEn : widget.titleVi}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Live Countdown */}
      {enabledWidgets.some(w => w.id === "countdown") && (
        <LiveCountdown
          weddingDate={state.info.date}
          lang={lang}
        />
      )}

      {/* Quick Vendor Dial */}
      {enabledWidgets.some(w => w.id === "vendors") && (
        <QuickVendorDial
          vendors={state.vendors}
          contacts={state.contacts}
          lang={lang}
        />
      )}

      {/* Timeline at a Glance */}
      {enabledWidgets.some(w => w.id === "timeline") && (
        <TimelineAtAGlance
          itineraryItems={state.itineraryItems}
          lang={lang}
        />
      )}

      {/* Emergency Contacts */}
      {enabledWidgets.some(w => w.id === "emergency") && (
        <EmergencyContacts
          contacts={state.contacts}
          weddingParty={state.weddingParty}
          lang={lang}
        />
      )}

      {/* Weather Summary */}
      {enabledWidgets.some(w => w.id === "weather") && (
        <WeatherSummary
          weddingDate={state.info.date}
          venueCity={state.info.venueCity}
          lang={lang}
        />
      )}

      {/* Photo Checklist */}
      {enabledWidgets.some(w => w.id === "photos") && (
        <PhotoChecklist
          lang={lang}
        />
      )}

      {/* Transportation Status */}
      {enabledWidgets.some(w => w.id === "transport") && (
        <TransportationStatus
          lang={lang}
        />
      )}
    </div>
  );
}

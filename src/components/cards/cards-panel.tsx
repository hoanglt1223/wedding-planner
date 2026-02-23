import type { CoupleInfo, PhotoItem } from "@/types/wedding";
import { BACKGROUNDS } from "@/data/backgrounds";
import { CoupleInfoForm } from "./couple-info-form";
import { BackgroundGrid } from "./background-grid";
import { InvitationGrid } from "./invitation-grid";
import { RsvpSection } from "./rsvp-section";
import { PhotoBoard } from "./photo-board";
import { getLocale } from "@/lib/format";
import { t } from "@/lib/i18n";

function fmDs(d: string, lang: string) {
  return d
    ? new Date(d + "T00:00:00").toLocaleDateString(getLocale(lang), {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    : "__.__.____";
}

function fmD(d: string, lang: string) {
  return d
    ? new Date(d + "T00:00:00").toLocaleDateString(getLocale(lang), {
        weekday: "long", day: "2-digit", month: "2-digit", year: "numeric",
      })
    : "...";
}

function getInviteMsg(eventName: string, lang: string) {
  if (lang === "en") {
    if (eventName === "Tiệc Cưới") return "We cordially invite you to our wedding celebration";
    if (eventName === "Đám Hỏi") return "We cordially invite you to our betrothal ceremony";
    return "We cordially invite you to the ceremony";
  }
  if (eventName === "Tiệc Cưới") return "Trân trọng kính mời quý khách đến chung vui";
  if (eventName === "Đám Hỏi") return "Kính mời quý khách đến dự lễ đính hôn";
  return "Kính mời quý khách đến dự buổi lễ";
}

interface CardsPanelProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string) => void;
  photos: PhotoItem[];
  onAddPhoto: (photo: Omit<PhotoItem, "id">) => void;
  onRemovePhoto: (id: number) => void;
  lang?: string;
}

export function CardsPanel({ info, onUpdateInfo, photos, onAddPhoto, onRemovePhoto, lang = "vi" }: CardsPanelProps) {
  const events = [
    { n: "Dạm Ngõ", d: info.engagementDate },
    { n: "Đám Hỏi", d: info.betrothalDate },
    { n: "Tiệc Cưới", d: info.date },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header + couple form */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-1 text-lg font-bold">{t("🖼️ Background & 💌 Thiệp Mời", lang)}</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          {lang === "en" ? "10 templates per event — 2025 trends: minimalist, pastel, gold foil" : "10 mẫu cho mỗi lễ — xu hướng 2025: minimalist, pastel, ép kim, font thanh mảnh"}
        </p>
        <CoupleInfoForm info={info} onUpdateInfo={onUpdateInfo} />
      </div>

      {/* Events */}
      {events.map((ev) => (
        <div key={ev.n} className="space-y-3">
          {/* Background cards */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-base font-bold">🖼️ Background — {t(ev.n, lang)}</h2>
            <BackgroundGrid
              eventName={t(ev.n, lang)}
              date={fmDs(ev.d, lang)}
              groom={info.groom}
              bride={info.bride}
              groomFamily={info.groomFamilyName}
              brideFamily={info.brideFamilyName}
              backgrounds={BACKGROUNDS}
            />
          </div>

          {/* Invitation cards */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-base font-bold">{lang === "en" ? "💌 Invitation" : "💌 Thiệp"} — {t(ev.n, lang)}</h2>
            <InvitationGrid
              eventName={t(ev.n, lang)}
              dateFull={fmD(ev.d, lang)}
              groom={info.groom}
              bride={info.bride}
              groomFamily={info.groomFamilyName}
              brideFamily={info.brideFamilyName}
              invitationMessage={getInviteMsg(ev.n, lang)}
              backgrounds={BACKGROUNDS}
            />
          </div>
        </div>
      ))}

      {/* RSVP Section */}
      <RsvpSection info={info} lang={lang} />

      {/* Photo/Mood Board */}
      <PhotoBoard photos={photos} onAddPhoto={onAddPhoto} onRemovePhoto={onRemovePhoto} />
    </div>
  );
}

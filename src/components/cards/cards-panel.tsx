import type { CoupleInfo, PhotoItem } from "@/types/wedding";
import { BACKGROUNDS } from "@/data/backgrounds";
import { CoupleInfoForm } from "./couple-info-form";
import { BackgroundGrid } from "./background-grid";
import { InvitationGrid } from "./invitation-grid";
import { RsvpSection } from "./rsvp-section";
import { PhotoBoard } from "./photo-board";

const fmDs = (d: string) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "__.__.____";

const fmD = (d: string) =>
  d
    ? new Date(d + "T00:00:00").toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "...";

const getInviteMsg = (eventName: string) => {
  if (eventName === "Tiệc Cưới") return "Trân trọng kính mời quý khách đến chung vui";
  if (eventName === "Đám Hỏi") return "Kính mời quý khách đến dự lễ đính hôn";
  return "Kính mời quý khách đến dự buổi lễ";
};

interface CardsPanelProps {
  info: CoupleInfo;
  onUpdateInfo: (field: string, value: string) => void;
  photos: PhotoItem[];
  onAddPhoto: (photo: Omit<PhotoItem, "id">) => void;
  onRemovePhoto: (id: number) => void;
}

export function CardsPanel({ info, onUpdateInfo, photos, onAddPhoto, onRemovePhoto }: CardsPanelProps) {
  const events = [
    { n: "Dạm Ngõ", d: info.engagementDate },
    { n: "Đám Hỏi", d: info.betrothalDate },
    { n: "Tiệc Cưới", d: info.date },
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header + couple form */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-1 text-lg font-bold">🖼️ Background &amp; 💌 Thiệp Mời</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          10 mẫu cho mỗi lễ — xu hướng 2025: minimalist, pastel, ép kim, font thanh mảnh
        </p>
        <CoupleInfoForm info={info} onUpdateInfo={onUpdateInfo} />
      </div>

      {/* Events */}
      {events.map((ev) => (
        <div key={ev.n} className="space-y-3">
          {/* Background cards */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-base font-bold">🖼️ Background — {ev.n}</h2>
            <BackgroundGrid
              eventName={ev.n}
              date={fmDs(ev.d)}
              groom={info.groom}
              bride={info.bride}
              groomFamily={info.groomFamilyName}
              brideFamily={info.brideFamilyName}
              backgrounds={BACKGROUNDS}
            />
          </div>

          {/* Invitation cards */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h2 className="mb-3 text-base font-bold">💌 Thiệp — {ev.n}</h2>
            <InvitationGrid
              eventName={ev.n}
              dateFull={fmD(ev.d)}
              groom={info.groom}
              bride={info.bride}
              groomFamily={info.groomFamilyName}
              brideFamily={info.brideFamilyName}
              invitationMessage={getInviteMsg(ev.n)}
              backgrounds={BACKGROUNDS}
            />
          </div>
        </div>
      ))}

      {/* RSVP Section */}
      <RsvpSection info={info} />

      {/* Photo/Mood Board */}
      <PhotoBoard photos={photos} onAddPhoto={onAddPhoto} onRemovePhoto={onRemovePhoto} />
    </div>
  );
}

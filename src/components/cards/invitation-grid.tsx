import { useState } from "react";
import type { BackgroundStyle } from "@/types/wedding";

interface InvitationGridProps {
  eventName: string;
  dateFull: string;
  groom: string;
  bride: string;
  groomFamily: string;
  brideFamily: string;
  invitationMessage: string;
  backgrounds: BackgroundStyle[];
}

export function InvitationGrid({
  eventName,
  dateFull,
  groom,
  bride,
  groomFamily,
  brideFamily,
  invitationMessage,
  backgrounds,
}: InvitationGridProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? backgrounds : backgrounds.slice(0, 4);
  const qrText = encodeURIComponent(`${eventName}\n${groom} & ${bride}\n${dateFull}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${qrText}`;

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {visible.map((bg, i) => (
          <div
            key={i}
            className="rounded-lg p-3 text-center"
            style={{
              background: bg.background,
              fontFamily: bg.fontFamily,
              minHeight: "180px",
              border: `2px solid ${bg.accentColor}22`,
            }}
          >
            <div
              className="text-2xs uppercase tracking-[4px] opacity-70"
              style={{ color: bg.accentColor }}
            >
              ✦ THIỆP MỜI ✦
            </div>
            <div
              className="my-1.5 text-2xs opacity-60"
              style={{ color: bg.textColor }}
            >
              {groomFamily} &amp; {brideFamily}
            </div>
            <div
              className="my-1 text-xs opacity-75"
              style={{ color: bg.textColor }}
            >
              {invitationMessage}
            </div>
            <div
              className="my-2 text-[1.4rem] font-bold leading-tight"
              style={{ color: bg.textColor }}
            >
              {groom}{" "}
              <span className="text-base font-normal opacity-40">&</span>{" "}
              {bride}
            </div>
            <div
              className="mx-auto my-1.5 h-px w-10 opacity-50"
              style={{ background: bg.accentColor }}
            />
            <div className="my-1 text-xs" style={{ color: bg.accentColor }}>
              📅 {dateFull}
            </div>
            <div
              className="mt-2 text-2xs leading-relaxed opacity-45"
              style={{ color: bg.textColor }}
            >
              Sự hiện diện của quý khách
              <br />
              là niềm vinh hạnh cho gia đình
            </div>
            <div className="mt-2 flex justify-center">
              <img
                src={qrUrl}
                alt="QR"
                width={40}
                height={40}
                className="rounded opacity-70"
                loading="lazy"
                onError={(e) => { (e.target as HTMLElement).style.display = "none"; }}
              />
            </div>
          </div>
        ))}
      </div>
      {backgrounds.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full py-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? "Thu gọn ↑" : `Xem thêm ${backgrounds.length - 4} mẫu nữa ↓`}
        </button>
      )}
    </div>
  );
}

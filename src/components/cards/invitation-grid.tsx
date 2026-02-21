import type { BackgroundStyle } from "@/types/wedding";

interface InvitationGridProps {
  dateFull: string;
  groom: string;
  bride: string;
  groomFamily: string;
  brideFamily: string;
  invitationMessage: string;
  backgrounds: BackgroundStyle[];
}

export function InvitationGrid({
  dateFull,
  groom,
  bride,
  groomFamily,
  brideFamily,
  invitationMessage,
  backgrounds,
}: InvitationGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
      {backgrounds.map((bg, i) => (
        <div
          key={i}
          className="rounded-lg p-3 text-center"
          style={{
            background: bg.bg,
            fontFamily: bg.f,
            minHeight: "180px",
            border: `2px solid ${bg.sub}22`,
          }}
        >
          <div
            className="text-[0.55rem] uppercase tracking-[4px] opacity-70"
            style={{ color: bg.sub }}
          >
            ✦ THIỆP MỜI ✦
          </div>
          <div
            className="my-1.5 text-[0.65rem] opacity-60"
            style={{ color: bg.t }}
          >
            {groomFamily} &amp; {brideFamily}
          </div>
          <div
            className="my-1 text-[0.7rem] opacity-75"
            style={{ color: bg.t }}
          >
            {invitationMessage}
          </div>
          <div
            className="my-2 text-[1.4rem] font-bold leading-tight"
            style={{ color: bg.t }}
          >
            {groom}{" "}
            <span className="text-base font-normal opacity-40">&</span>{" "}
            {bride}
          </div>
          <div
            className="mx-auto my-1.5 h-px w-10 opacity-50"
            style={{ background: bg.sub }}
          />
          <div className="my-1 text-[0.72rem]" style={{ color: bg.sub }}>
            📅 {dateFull}
          </div>
          <div
            className="mt-2 text-[0.58rem] leading-relaxed opacity-45"
            style={{ color: bg.t }}
          >
            Sự hiện diện của quý khách
            <br />
            là niềm vinh hạnh cho gia đình
          </div>
        </div>
      ))}
    </div>
  );
}

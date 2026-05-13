import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { fetchRsvpInvitation, submitRsvpResponse, type RsvpEventData } from "@/lib/rsvp-api";
import { THEMES } from "@/data/themes";
import { t } from "@/lib/i18n";
import { RsvpHero } from "@/components/rsvp/rsvp-hero";
import { RsvpEventDetails } from "@/components/rsvp/rsvp-event-details";
import { RsvpCoupleStory } from "@/components/rsvp/rsvp-couple-story";
import { RsvpForm } from "@/components/rsvp/rsvp-form";
import { RsvpThankYou } from "@/components/rsvp/rsvp-thank-you";

type PageStatus = "loading" | "error" | "form" | "submitted" | "already-responded";

export function RsvpLandingPage() {
  const { token } = useParams({ strict: false }) as { token: string };
  const [status, setStatus] = useState<PageStatus>("loading");
  const [data, setData] = useState<RsvpEventData | null>(null);
  const [response, setResponse] = useState<{ status: string; plusOnes: number; dietary: string; message: string } | null>(null);

  useEffect(() => {
    fetchRsvpInvitation(token).then((d) => {
      if (!d) { setStatus("error"); return; }
      setData(d);
      if (d.status !== "pending") {
        setResponse({ status: d.status, plusOnes: d.plusOnes, dietary: d.dietary || "", message: d.message || "" });
        setStatus("already-responded");
      } else {
        setStatus("form");
      }
    });
  }, [token]);

  const lang = data?.lang || "vi";
  const theme = THEMES.find((th) => th.id === data?.themeId) || THEMES[0];

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (formData: { status: "accepted" | "declined"; plusOnes: number; dietary: string; message: string }) => {
    setSubmitError("");
    try {
      const result = await submitRsvpResponse(token, formData.status, formData.plusOnes, formData.dietary, formData.message);
      if (result.ok) {
        setResponse(formData);
        setStatus("submitted");
      } else if (result.error === "already_responded") {
        setStatus("already-responded");
      } else {
        setSubmitError(lang === "en" ? "Failed to submit. Please try again." : "Gửi thất bại. Vui lòng thử lại.");
      }
    } catch {
      setSubmitError(lang === "en" ? "Network error. Please try again." : "Lỗi mạng. Vui lòng thử lại.");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(to bottom, ${theme.primaryLight}, white)` }}>
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💍</div>
          <p className="text-sm text-[#8a7060]">{t("Đang tải...", lang)}</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(to bottom, ${theme.primaryLight}, white)` }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">😔</div>
          <h2 className="text-lg font-bold text-[#2c1810] mb-2">{t("Không tìm thấy lời mời", lang)}</h2>
          <p className="text-sm text-[#8a7060] mb-4">{t("Link không hợp lệ hoặc đã hết hạn", lang)}</p>
          <a href="/" className="inline-flex items-center justify-center h-10 px-6 text-sm font-semibold text-white rounded-full" style={{ backgroundColor: theme.accent }}>
            {lang === "en" ? "Create Your Wedding Plan" : "Tạo Kế Hoạch Đám Cưới"}
          </a>
        </div>
      </div>
    );
  }

  const ev = data!.event;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FDF8F3" }}>
      <div className="max-w-lg mx-auto">
        <RsvpHero bride={ev.bride} groom={ev.groom} date={ev.date} welcomeMessage={ev.welcomeMessage} primaryLight={theme.primaryLight} lang={lang} />
        <div className="px-4 pb-8 space-y-4 -mt-4">
          <RsvpEventDetails venue={ev.venue} venueAddress={ev.venueAddress} venueMapLink={ev.venueMapLink} lang={lang} />
          <RsvpCoupleStory story={ev.coupleStory} lang={lang} />
          {(status === "form") && (
            <>
              <RsvpForm guestName={data!.guestName} onSubmit={handleSubmit} lang={lang} />
              {submitError && <p className="text-xs text-red-600 text-center">{submitError}</p>}
            </>
          )}
          {(status === "submitted" || status === "already-responded") && response && (
            <RsvpThankYou
              guestName={data!.guestName}
              status={response.status}
              plusOnes={response.plusOnes}
              dietary={response.dietary || null}
              message={response.message || null}
              lang={lang}
            />
          )}
        </div>
      </div>
    </div>
  );
}

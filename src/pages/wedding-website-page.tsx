import { useEffect, useState } from "react";
import { fetchPublicWedding, type PublicWeddingData } from "@/lib/website-api";
import { THEMES } from "@/data/themes";
import { WebsiteHero } from "@/components/website/website-hero";
import { WebsiteStory } from "@/components/website/website-story";
import { WebsiteTimeline } from "@/components/website/website-timeline";
import { WebsiteGallery } from "@/components/website/website-gallery";
import { WebsiteVenue } from "@/components/website/website-venue";
import { WebsiteRsvpCta } from "@/components/website/website-rsvp-cta";

type Status = "loading" | "not-found" | "error" | "ready";

interface Props {
  slug: string;
}

export default function WeddingWebsitePage({ slug }: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<PublicWeddingData | null>(null);

  useEffect(() => {
    fetchPublicWedding(slug).then((d) => {
      if (!d) { setStatus("not-found"); return; }
      setData(d);
      setStatus("ready");
    }).catch(() => setStatus("error"));
  }, [slug]);

  const theme = THEMES.find((t) => t.id === data?.theme) ?? THEMES[0];
  const lang = data?.lang ?? "vi";
  const ws = data?.websiteSettings;

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom, ${theme.primaryLight}, white)` }}>
        <div className="text-center">
          <div className="text-4xl mb-3 animate-pulse">💍</div>
          <p className="text-sm text-gray-500">{lang === "en" ? "Loading..." : "Đang tải..."}</p>
        </div>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: `linear-gradient(to bottom, ${theme.primaryLight}, white)` }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">💍</div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {lang === "en" ? "Wedding not found" : "Không tìm thấy trang cưới"}
          </h2>
          <p className="text-sm text-gray-500">
            {lang === "en" ? "This wedding website is not available." : "Trang này không tồn tại hoặc chưa được bật."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">
          {lang === "en" ? "Something went wrong. Please try again." : "Đã xảy ra lỗi. Vui lòng thử lại."}
        </p>
      </div>
    );
  }

  const { couple, rsvpSettings, timelineEntries, photos } = data;
  const sections = ws?.sections ?? { story: true, timeline: true, gallery: true, venue: true, rsvp: true };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      <div className="max-w-2xl mx-auto">
        <WebsiteHero
          bride={couple.bride}
          groom={couple.groom}
          date={couple.date}
          customMessage={ws?.customMessage}
          heroImage={ws?.heroImage}
          primaryLight={theme.primaryLight}
          primary={theme.primary}
          lang={lang}
        />

        {sections.story && (
          <WebsiteStory
            story={ws?.storyText || rsvpSettings.coupleStory || ""}
            lang={lang}
            primary={theme.primary}
          />
        )}

        {sections.timeline && (
          <WebsiteTimeline entries={timelineEntries} lang={lang} primary={theme.primary} />
        )}

        {sections.gallery && (
          <WebsiteGallery photos={photos} lang={lang} primary={theme.primary} />
        )}

        {sections.venue && (
          <WebsiteVenue
            venue={rsvpSettings.venue}
            venueAddress={rsvpSettings.venueAddress}
            venueMapLink={rsvpSettings.venueMapLink}
            lang={lang}
            primary={theme.primary}
          />
        )}

        {sections.rsvp && (
          <WebsiteRsvpCta
            venue={rsvpSettings.venue}
            date={couple.date}
            lang={lang}
            primary={theme.primary}
            primaryLight={theme.primaryLight}
          />
        )}
      </div>
    </div>
  );
}

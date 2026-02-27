import { useState } from "react";

interface Photo {
  url: string;
  tag: string;
}

interface Props {
  photos: Photo[];
  lang: string;
  primary: string;
}

export function WebsiteGallery({ photos, lang, primary }: Props) {
  const [enlarged, setEnlarged] = useState<string | null>(null);

  if (!photos?.length) return null;

  return (
    <section className="px-6 py-12 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: primary }}>
        {lang === "en" ? "Our Photos" : "Bộ Sưu Tập Ảnh"}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setEnlarged(photo.url)}
            className="aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ focusRingColor: primary } as React.CSSProperties}
            aria-label={photo.tag || `Photo ${i + 1}`}
          >
            <img
              src={photo.url}
              alt={photo.tag || `Photo ${i + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {enlarged && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setEnlarged(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={enlarged}
            alt="Enlarged photo"
            className="max-w-full max-h-full rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold leading-none"
            onClick={() => setEnlarged(null)}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
    </section>
  );
}

interface Props {
  story: string;
  lang: string;
  primary: string;
}

export function WebsiteStory({ story, lang, primary }: Props) {
  if (!story?.trim()) return null;

  return (
    <section className="px-6 py-12 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-6" style={{ color: primary }}>
        {lang === "en" ? "Our Story" : "Câu Chuyện Của Chúng Tôi"}
      </h2>
      <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap italic">
        {story}
      </p>
    </section>
  );
}

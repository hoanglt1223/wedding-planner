import { useState } from "react";
import { WebsiteSlugInput } from "./website-slug-input";
import { WebsiteSectionToggles } from "./website-section-toggles";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

export default function WebsiteSettingsPanel() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const [copied, setCopied] = useState(false);
  const ws = state.websiteSettings;
  const lang = state.lang;

  const websiteUrl = `${window.location.origin}/w/${ws.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(websiteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {lang === "en" ? "Wedding Website" : "🌐 Website Cưới"}
        </h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="h-4 w-4 rounded accent-current"
            checked={ws.enabled}
            onChange={(e) => store.setWebsiteSettings({ enabled: e.target.checked })}
          />
          <span className="text-sm font-medium text-gray-700">
            {ws.enabled ? (lang === "en" ? "Online" : "Bật website") : (lang === "en" ? "Offline" : "Tắt website")}
          </span>
        </label>
      </div>

      {/* Slug & URL */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-gray-700">
          {lang === "en" ? "Website URL" : "Đường dẫn"}
        </p>
        <WebsiteSlugInput
          bride={state.info.bride}
          groom={state.info.groom}
          value={ws.slug}
          onChange={(slug) => store.setWebsiteSettings({ slug })}
          lang={lang}
        />
        {ws.slug && ws.enabled && (
          <div className="flex gap-2 pt-1">
            <a href={`/w/${ws.slug}`} target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-white">
              {lang === "en" ? "Preview" : "Xem trước"}
            </a>
            <button onClick={handleCopy}
              className="text-xs px-3 py-1.5 border rounded-lg text-gray-700 hover:bg-white">
              {copied ? (lang === "en" ? "Copied!" : "Đã sao chép!") : (lang === "en" ? "Copy Link" : "Sao chép")}
            </button>
          </div>
        )}
      </div>

      {/* Hero image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {lang === "en" ? "Hero Image URL" : "Ảnh bìa (URL)"}
        </label>
        <input
          type="url"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1"
          placeholder="https://..."
          value={ws.heroImage ?? ""}
          onChange={(e) => store.setWebsiteSettings({ heroImage: e.target.value })}
        />
      </div>

      {/* Custom message */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {lang === "en" ? "Welcome Message" : "Lời chào mừng"}
        </label>
        <textarea
          rows={2}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none"
          placeholder={lang === "en" ? "A warm welcome to our guests..." : "Lời chào mừng của đôi bạn..."}
          value={ws.customMessage ?? ""}
          onChange={(e) => store.setWebsiteSettings({ customMessage: e.target.value })}
        />
      </div>

      {/* Story text */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          {lang === "en" ? "Our Story" : "Câu chuyện"}
        </label>
        <textarea
          rows={4}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none"
          placeholder={lang === "en" ? "How did you meet?..." : "Câu chuyện tình yêu của đôi bạn..."}
          value={ws.storyText ?? ""}
          onChange={(e) => store.setWebsiteSettings({ storyText: e.target.value })}
        />
      </div>

      {/* Section toggles */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">
          {lang === "en" ? "Show Sections" : "Hiển thị phần"}
        </p>
        <WebsiteSectionToggles
          sections={ws.sections}
          onChange={(key, value) =>
            store.setWebsiteSettings({ sections: { ...ws.sections, [key]: value } })
          }
          lang={lang}
        />
      </div>
    </div>
  );
}

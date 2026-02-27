import { useState, useEffect } from "react";
import { generateSlug, validateSlug } from "@/lib/slug-utils";

interface Props {
  bride: string;
  groom: string;
  value: string;
  onChange: (slug: string) => void;
  lang: string;
}

export function WebsiteSlugInput({ bride, groom, value, onChange, lang }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  // Auto-generate slug when names are available and no slug set yet
  useEffect(() => {
    if (!value && bride && groom) {
      onChange(generateSlug(bride, groom));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bride, groom]);

  // Keep draft in sync with external value when not editing
  useEffect(() => {
    if (!editing) setDraft(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const baseUrl = `${window.location.origin}${window.location.pathname}#/w/`;

  const handleAutoGenerate = () => {
    const gen = generateSlug(bride, groom);
    setDraft(gen);
    onChange(gen);
    setError("");
  };

  const handleSave = () => {
    if (!validateSlug(draft)) {
      setError(lang === "en"
        ? "Invalid: use lowercase letters, digits, hyphens (min 3 chars)"
        : "Không hợp lệ: chỉ dùng chữ thường, số, dấu gạch ngang (tối thiểu 3 ký tự)");
      return;
    }
    onChange(draft);
    setEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
    setError("");
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-mono break-all">
        {baseUrl}<span className="font-semibold text-gray-800">{value || "..."}</span>
      </p>

      {editing ? (
        <div className="space-y-1.5">
          <input
            type="text"
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setError(""); }}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
            placeholder="ten-chu-re-ten-co-dau"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave}
              className="px-3 py-1 text-xs font-semibold text-white rounded-lg bg-gray-800">
              {lang === "en" ? "Save" : "Lưu"}
            </button>
            <button onClick={handleAutoGenerate}
              className="px-3 py-1 text-xs font-medium text-gray-600 border rounded-lg hover:bg-gray-50">
              {lang === "en" ? "Auto-generate" : "Tự động tạo"}
            </button>
            <button onClick={handleCancel}
              className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">
              {lang === "en" ? "Cancel" : "Hủy"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => { setDraft(value); setEditing(true); }}
          className="text-xs text-blue-600 hover:underline"
        >
          {lang === "en" ? "Edit URL" : "Chỉnh sửa đường dẫn"}
        </button>
      )}
    </div>
  );
}

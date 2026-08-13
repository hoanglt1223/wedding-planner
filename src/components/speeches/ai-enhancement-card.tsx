import { useState } from "react";
import { getModeLabel, getToneLabel, type SpeechEnhancementMode } from "@/lib/speech-ai-prompts";

interface SpeechEntry {
  id: number;
  title: string;
  content: string;
  category: string;
  speaker: string;
  notes: string;
}

interface SpeechEnhancementOptions {
  mode: SpeechEnhancementMode;
  targetLanguage?: "vi" | "en";
  tone?: "formal" | "casual" | "romantic" | "humorous";
}

interface AiEnhancementCardProps {
  speech: SpeechEntry;
  lang: "vi" | "en";
  onApplyEnhancement: (enhancedText: string) => void;
  onClose: () => void;
}

export function AiEnhancementCard({ speech, lang, onApplyEnhancement, onClose }: AiEnhancementCardProps) {
  const [mode, setMode] = useState<SpeechEnhancementMode>("improve-grammar");
  const [tone, setTone] = useState<"formal" | "casual" | "romantic" | "humorous">("formal");
  const [targetLanguage, setTargetLanguage] = useState<"vi" | "en">("vi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  async function handleEnhance() {
    setLoading(true);
    setError(null);
    setResult(null);

    const options: SpeechEnhancementOptions = { mode };
    if (mode === "adjust-tone") options.tone = tone;
    if (mode === "translate") options.targetLanguage = targetLanguage;

    try {
      const res = await fetch(`/api/ai?action=speech-enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ speech, options, lang }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "enhancement_failed");
      }

      const data = await res.json();
      setResult(data.text || "");
      setShowComparison(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "unknown_error");
    } finally {
      setLoading(false);
    }
  }

  function handleApply() {
    if (result) {
      onApplyEnhancement(result);
      onClose();
    }
  }

  const isVi = lang === "vi";

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
          ✨ AI Enhancement
        </h3>
        <button
          onClick={onClose}
          className="text-sm text-purple-700 dark:text-purple-300 hover:underline"
        >
          {isVi ? "Đóng" : "Close"}
        </button>
      </div>

      {!showComparison ? (
        <>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1 block">
                {isVi ? "Chế độ cải thiện:" : "Enhancement mode:"}
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as SpeechEnhancementMode)}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md bg-white dark:bg-purple-900/20 text-purple-900 dark:text-purple-100"
              >
                <option value="improve-grammar">{isVi ? "Sửa ngữ pháp" : "Improve grammar"}</option>
                <option value="enhance-vocabulary">{isVi ? "Làm từ phong phú" : "Enhance vocabulary"}</option>
                <option value="adjust-tone">{isVi ? "Điều chỉnh giọng điệu" : "Adjust tone"}</option>
                <option value="translate">{isVi ? "Dịch ngôn ngữ" : "Translate"}</option>
                <option value="expand">{isVi ? "Mở rộng nội dung" : "Expand content"}</option>
              </select>
            </div>

            {mode === "adjust-tone" && (
              <div>
                <label className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1 block">
                  {isVi ? "Giọng điệu:" : "Tone:"}
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as typeof tone)}
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md bg-white dark:bg-purple-900/20 text-purple-900 dark:text-purple-100"
                >
                  <option value="formal">{getToneLabel("formal", lang)}</option>
                  <option value="casual">{getToneLabel("casual", lang)}</option>
                  <option value="romantic">{getToneLabel("romantic", lang)}</option>
                  <option value="humorous">{getToneLabel("humorous", lang)}</option>
                </select>
              </div>
            )}

            {mode === "translate" && (
              <div>
                <label className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1 block">
                  {isVi ? "Ngôn ngữ đích:" : "Target language:"}
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as typeof targetLanguage)}
                  className="w-full px-3 py-2 border border-purple-300 dark:border-purple-600 rounded-md bg-white dark:bg-purple-900/20 text-purple-900 dark:text-purple-100"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleEnhance}
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isVi ? "Đang cải thiện..." : "Enhancing...") : (isVi ? "Cải thiện" : "Enhance")}
          </button>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-3 py-2 rounded-md text-sm">
              {error === "enhancement_failed"
                ? (isVi ? "Không thể cải thiện văn bản. Vui lòng thử lại." : "Failed to enhance text. Please try again.")
                : error}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1 block">
                {isVi ? "Gốc:" : "Original:"}
              </label>
              <div className="bg-white dark:bg-purple-900/10 p-3 rounded border border-purple-200 dark:border-purple-700 text-sm whitespace-pre-wrap">
                {speech.content}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1 block">
                {isVi ? "Đã cải thiện:" : "Enhanced:"}
              </label>
              <div className="bg-white dark:bg-purple-900/10 p-3 rounded border border-purple-200 dark:border-purple-700 text-sm whitespace-pre-wrap">
                {result}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors"
            >
              {isVi ? "Áp dụng" : "Apply"}
            </button>
            <button
              onClick={() => {
                setShowComparison(false);
                setResult(null);
              }}
              className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-md transition-colors"
            >
              {isVi ? "Thử lại" : "Try again"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

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
  onApplyEnhancement: (enhancedText: string) =( void;
  onClose: () =( void;
}

export function AiEnhancementCard({ speech, lang, onApplyEnhancement, onClose }: AiEnhancementCardProps) {
  const [mode, setMode] = useState<SpeechEnhancementMode(("improve-grammar");
  const [tone, setTone] = useState<"formal" | "casual" | "romantic" | "humorous"(("formal");
  const [targetLanguage, setTargetLanguage] = useState<"vi" | "en"(("vi");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null((null);
  const [result, setResult] = useState<string | null((null);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"(
      <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"(
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between"(
          <div(
            <h3 className="font-semibold text-base"(
              ✨ {isVi ? "AI Cải Thiện Lời Thề & Diễn Văn" : "AI Speech Enhancement"}
            </h3(
            <p className="text-xs text-muted-foreground"(
              {isVi ? "Sử dụng AI để cải thiện bài phát biểu của bạn" : "Enhance your speech with AI"}
            </p(
          </div(
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl"(
            ×
          </button(
        </div(

        <div className="p-4 space-y-4"(
          {/* Original content preview */}
          {!showComparison && (
            <div className="bg-muted/50 rounded p-3 text-sm max-h-40 overflow-y-auto"(
              <div className="font-medium text-xs mb-1"(
                {isVi ? "📝 Bài gốc:" : "📝 Original:"}
              </div(
              <p className="whitespace-pre-wrap text-muted-foreground"({speech.content}</p(
            </div(
          )}

          {/* Enhancement options */}
          {!showComparison && (
            <div className="space-y-3"(
              {/* Mode selection */}
              <div(
                <label className="text-sm font-medium mb-2 block"(
                  {isVi ? "Chế độ cải thiện:" : "Enhancement mode:"}
                </label(
                <div className="grid grid-cols-2 gap-2"(
                  {(["improve-grammar", "enhance-emotion", "adjust-tone", "shorten", "lengthen", "translate"] as SpeechEnhancementMode[]).map((m) =( (
                    <button
                      key={m}
                      onClick={() =( setMode(m)}
                      className={`p-2 rounded text-sm text-left transition-colors ${
                        mode === m
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    (
                      {getModeLabel(m, lang)}
                    </button(
                  ))}
                </div(
              </div(

              {/* Tone selection (only for adjust-tone) */}
              {mode === "adjust-tone" && (
                <div(
                  <label className="text-sm font-medium mb-2 block"(
                    {isVi ? "Văn phong:" : "Tone:"}
                  </label(
                  <div className="flex gap-2 flex-wrap"(
                    {(["formal", "casual", "romantic", "humorous"] as const).map((t) =( (
                      <button
                        key={t}
                        onClick={() =( setTone(t)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          tone === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      (
                        {getToneLabel(t, lang)}
                      </button(
                    ))}
                  </div(
                </div(
              )}

              {/* Language selection (only for translate) */}
              {mode === "translate" && (
                <div(
                  <label className="text-sm font-medium mb-2 block"(
                    {isVi ? "Dịch sang:" : "Translate to:"}
                  </label(
                  <div className="flex gap-2"(
                    <button
                      onClick={() =( setTargetLanguage("vi")}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        targetLanguage === "vi"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    (
                      {isVi ? "Tiếng Việt" : "Vietnamese"}
                    </button(
                    <button
                      onClick={() =( setTargetLanguage("en")}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        targetLanguage === "en"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    (
                      English
                    </button(
                  </div(
                </div(
              )}
            </div(
          )}

          {/* Result display */}
          {showComparison && result && (
            <div className="space-y-3"(
              <div className="bg-muted/50 rounded p-3 text-sm max-h-60 overflow-y-auto"(
                <div className="font-medium text-xs mb-1"(
                  {isVi ? "📝 Bài gốc:" : "📝 Original:"}
                </div(
                <p className="whitespace-pre-wrap text-muted-foreground"({speech.content}</p(
              </div(

              <div className="bg-primary/5 rounded p-3 text-sm max-h-60 overflow-y-auto border border-primary/20"(
                <div className="font-medium text-xs mb-1 text-primary"(
                  {isVi ? "✨ Bài đã cải thiện:" : "✨ Enhanced:"}
                </div(
                <p className="whitespace-pre-wrap"({result}</p(
              </div(
            </div(
          )}

          {/* Error display */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded"(
              {error === "rate_limited" && (
                isVi
                  ? "Bạn đã hết lượt cải thiện hôm nay. Vui lòng thử lại vào ngày mai."
                  : "You've reached the enhancement limit for today. Please try again tomorrow."
              )}
              {error === "enhancement_failed" && (
                isVi
                  ? "Không thể cải thiện bài phát biểu. Vui lòng thử lại."
                  : "Failed to enhance speech. Please try again."
              )}
              {!["rate_limited", "enhancement_failed"].includes(error) && (
                isVi ? "Có lỗi xảy ra. Vui lòng thử lại." : "An error occurred. Please try again."
              )}
            </div(
          )}

          {/* Action buttons */}
          {!showComparison ? (
            <button
              onClick={handleEnhance}
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            (
              {loading
                ? isVi
                  ? "⏳ Đang cải thiện..."
                  : "⏳ Enhancing..."
                : isVi
                  ? "✨ Cải thiện với AI"
                  : "✨ Enhance with AI"
              }
            </button(
          ) : (
            <div className="flex gap-2"(
              <button
                onClick={() =( setShowComparison(false)}
                className="flex-1 py-2.5 border border-border rounded hover:bg-muted transition-colors text-sm font-medium"
              (
                {isVi ? "← Thử lại" : "← Try again"}
              </button(
              <button
                onClick={handleApply}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm font-medium"
              (
                {isVi ? "✓ Áp dụng" : "✓ Apply"}
              </button(
            </div(
          )}
        </div(
      </div(
    </div(
  );
}

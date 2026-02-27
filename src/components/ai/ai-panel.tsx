import { useState } from "react";
import { getAiPrompts } from "@/data/resolve-data";
import { renderMarkdown } from "@/lib/markdown";
import { AiPromptButtons } from "./ai-prompt-buttons";
import { t } from "@/lib/i18n";
import { getLocale, getCurrencySymbol } from "@/lib/format";

interface AiPanelProps {
  aiResponse: string;
  budget: number;
  onSetAiResponse: (response: string) => void;
  lang?: string;
}

async function callAI(prompt: string, budget: number, lang: string): Promise<string> {
  const res = await fetch("/api/ai?action=chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      budget: budget.toLocaleString(getLocale(lang)) + getCurrencySymbol(lang),
      lang,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.choices?.[0]?.message?.content || (lang === "en" ? "No response." : "Không phản hồi.");
}

export function AiPanel({ aiResponse, budget, onSetAiResponse, lang = "vi" }: AiPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");

  const prompts = getAiPrompts(lang);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await callAI(prompt, budget, lang);
      onSetAiResponse(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : (lang === "en" ? "Unknown error" : "Lỗi không xác định"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setCustomPrompt(prompt);
    handleSend(prompt);
  };

  const handleClear = () => {
    onSetAiResponse("");
    setError("");
    setCustomPrompt("");
  };

  return (
    <div className="space-y-4 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          {t("🤖 AI Hỗ Trợ", lang)} (Z.AI) — {prompts.length} Prompts
        </h2>

        {/* Model info */}
        <div className="text-xs text-muted-foreground/60">
          Model: glm-5 | API key configured server-side (Z_AI_KEY)
        </div>

        {/* Quick prompts */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            {t("⚡ Gợi Ý Nhanh", lang)} ({prompts.length})
          </h3>
          <AiPromptButtons prompts={prompts} onSelect={handlePromptSelect} />
        </div>

        {/* Custom prompt */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-foreground">{t("✍️ Hỏi Tùy Chỉnh", lang)}</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={t("Nhập câu hỏi...", lang)}
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleSend(customPrompt)}
              disabled={isLoading}
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
            >
              {isLoading ? t("⏳ Đang xử lý...", lang) : t("🚀 Gửi", lang)}
            </button>
            <button
              onClick={handleClear}
              className="rounded-lg border border-border bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted/80"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            ❌ {error}
          </div>
        )}

        {/* Response */}
        {aiResponse && (
          <div className="rounded-lg border border-border bg-card p-4 text-sm text-foreground">
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

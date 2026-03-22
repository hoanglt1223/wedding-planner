import { useRef, useState } from "react";
import { getAiPrompts } from "@/data/resolve-data";
import { renderMarkdown } from "@/lib/markdown";
import { AiPromptButtons } from "./ai-prompt-buttons";
import { t } from "@/lib/i18n";
import { getLocale, getCurrencySymbol } from "@/lib/format";
import { useWeddingStoreContext } from "@/contexts/wedding-store-context";

const MAX_TOKENS_OPTIONS = [256, 512, 1024, 2048, 4000] as const;

async function streamAI(
  prompt: string,
  budget: number,
  lang: string,
  maxTokens: number,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch("/api/ai?action=chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      budget: budget.toLocaleString(getLocale(lang)) + getCurrencySymbol(lang),
      lang,
      stream: true,
      max_tokens: maxTokens,
    }),
    signal,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error || `API ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No stream body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    // Keep the last potentially incomplete line in the buffer
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const json = JSON.parse(payload) as { choices?: { delta?: { content?: string } }[] };
        const content = json.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch {
        // skip malformed chunks
      }
    }
  }
}

export function AiPanel() {
  const store = useWeddingStoreContext();
  const { state } = store;
  const aiResponse = state.aiResponse;
  const budget = state.budget;
  const onSetAiResponse = store.setAiResponse;
  const lang = state.lang;
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");
  const [maxTokens, setMaxTokens] = useState(1024);
  const abortRef = useRef<AbortController | null>(null);

  const prompts = getAiPrompts(lang);

  const handleSend = async (prompt: string) => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    onSetAiResponse("");

    const controller = new AbortController();
    abortRef.current = controller;
    let accumulated = "";

    try {
      await streamAI(prompt, budget, lang, maxTokens, (chunk) => {
        accumulated += chunk;
        onSetAiResponse(accumulated);
      }, controller.signal);
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        // User cancelled — keep partial response
      } else {
        setError(e instanceof Error ? e.message : (lang === "en" ? "Unknown error" : "Lỗi không xác định"));
      }
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  const handleAbort = () => {
    abortRef.current?.abort();
  };

  const handlePromptSelect = (prompt: string) => {
    setCustomPrompt(prompt);
    handleSend(prompt);
  };

  const handleClear = () => {
    handleAbort();
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
          Model: glm-4.7-flash | API key configured server-side (Z_AI_KEY)
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

          {/* Max tokens selector */}
          <div className="mt-2 flex items-center gap-2">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              {t("Độ dài tối đa", lang)}:
            </label>
            <select
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground"
            >
              {MAX_TOKENS_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v} tokens
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2 flex gap-2">
            {isLoading ? (
              <button
                onClick={handleAbort}
                className="rounded-lg bg-destructive px-4 py-1.5 text-sm font-semibold text-white hover:bg-destructive/80"
              >
                {t("⏹ Dừng", lang)}
              </button>
            ) : (
              <button
                onClick={() => handleSend(customPrompt)}
                disabled={!customPrompt.trim()}
                className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
              >
                {t("🚀 Gửi", lang)}
              </button>
            )}
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

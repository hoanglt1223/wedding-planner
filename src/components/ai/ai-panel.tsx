import { useState } from "react";
import { AI_PROMPTS } from "@/data/ai-prompts";
import { renderMarkdown } from "@/lib/markdown";
import { AiPromptButtons } from "./ai-prompt-buttons";

interface AiPanelProps {
  aiResponse: string;
  budget: number;
  onSetAiResponse: (response: string) => void;
}

async function callAI(prompt: string, budget: number): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      budget: budget.toLocaleString("vi-VN") + "đ",
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.choices?.[0]?.message?.content || "Không phản hồi.";
}

export function AiPanel({ aiResponse, budget, onSetAiResponse }: AiPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [error, setError] = useState("");

  const handleSend = async (prompt: string) => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await callAI(prompt, budget);
      onSetAiResponse(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định");
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
          🤖 AI Hỗ Trợ (Z.AI) — {AI_PROMPTS.length} Prompts
        </h2>

        {/* Model info */}
        <div className="text-[0.7rem] text-muted-foreground/60">
          Model: glm-5 | API key configured server-side (Z_AI_KEY)
        </div>

        {/* Quick prompts */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            ⚡ {AI_PROMPTS.length} Gợi Ý Nhanh
          </h3>
          <AiPromptButtons prompts={AI_PROMPTS} onSelect={handlePromptSelect} />
        </div>

        {/* Custom prompt */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-foreground">✍️ Hỏi Tùy Chỉnh</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Nhập câu hỏi..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-ring"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleSend(customPrompt)}
              disabled={isLoading}
              className="rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-50"
            >
              {isLoading ? "⏳ Đang xử lý..." : "🚀 Gửi"}
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

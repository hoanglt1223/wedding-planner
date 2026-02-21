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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        <h2 className="text-xl font-bold text-white">
          🤖 AI Hỗ Trợ (Z.AI) — {AI_PROMPTS.length} Prompts
        </h2>

        {/* Model info */}
        <div className="text-[0.7rem] text-white/40">
          Model: glm-5.0 | API key configured server-side (Z_AI_KEY)
        </div>

        {/* Quick prompts */}
        <div>
          <h3 className="mb-2 text-sm font-semibold text-white/80">
            ⚡ {AI_PROMPTS.length} Gợi Ý Nhanh
          </h3>
          <AiPromptButtons prompts={AI_PROMPTS} onSelect={handlePromptSelect} />
        </div>

        {/* Custom prompt */}
        <div>
          <h3 className="mb-1 text-sm font-semibold text-white/80">✍️ Hỏi Tùy Chỉnh</h3>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Nhập câu hỏi..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/30"
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
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10"
            >
              🗑️
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-900/40 p-3 text-sm text-red-300">
            ❌ {error}
          </div>
        )}

        {/* Response */}
        {aiResponse && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/85">
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(aiResponse) }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

import type { AiPrompt } from "@/types/wedding";

interface AiPromptButtonsProps {
  prompts: AiPrompt[];
  onSelect: (prompt: string) => void;
}

export function AiPromptButtons({ prompts, onSelect }: AiPromptButtonsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {prompts.map((p, i) => (
        <button
          key={i}
          onClick={() => onSelect(p.prompt)}
          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

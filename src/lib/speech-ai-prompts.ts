import type { SpeechEntry } from "../types/wedding";

export type SpeechEnhancementMode =
  | "improve-grammar"
  | "enhance-emotion"
  | "adjust-tone"
  | "shorten"
  | "lengthen"
  | "translate";

export interface SpeechEnhancementOptions {
  mode: SpeechEnhancementMode;
  targetLanguage?: "vi" | "en";
  tone?: "formal" | "casual" | "romantic" | "humorous";
}

const MODE_DESCRIPTIONS: Record<SpeechEnhancementMode, { vi: string; en: string }> = {
  "improve-grammar": {
    vi: "Sửa ngữ pháp và diễn đạt để mạch lạc hơn",
    en: "Fix grammar and improve clarity",
  },
  "enhance-emotion": {
    vi: "Nhấn mạnh cảm xúc và sự chân thành",
    en: "Enhance emotion and sincerity",
  },
  "adjust-tone": {
    vi: "Điều chỉnh văn phong (trang trọng/thân mật)",
    en: "Adjust tone (formal/casual)",
  },
  shorten: {
    vi: "Cô đọng nội dung, ngắn gọn hơn",
    en: "Make it more concise and brief",
  },
  lengthen: {
    vi: "Mở rộng và chi tiết hóa hơn",
    en: "Expand and add more detail",
  },
  translate: {
    vi: "Dịch sang ngôn ngữ khác",
    en: "Translate to another language",
  },
};

function getSystemPrompt(lang: "vi" | "en"): string {
  if (lang === "vi") {
    return `Bạn là một chuyên gia giúp viết và cải thiện lời thề và bài phát biểu cho đám cưới.
Phong cách: ấm áp, chân thành, trang trọng nhưng không quá cứng nhắc.
Ưu tiên: Giữ nguyên ý chính của người viết, chỉ cải thiện cách diễn đạt.
Tránh: Thay đổi hoàn toàn nội dung hoặc thêm ý không có trong bản gốc.`;
  }
  return `You are an expert speechwriter specializing in wedding vows and speeches.
Style: Warm, sincere, formal but approachable.
Priority: Preserve the writer's original intent and meaning.
Avoid: Completely rewriting or adding ideas not present in the original.`;
}

function getUserPrompt(
  originalSpeech: SpeechEntry,
  options: SpeechEnhancementOptions,
  lang: "vi" | "en"
): string {
  const isVi = lang === "vi";
  const { mode, targetLanguage, tone } = options;

  let prompt = "";

  // Speech context
  const categoryLabels: Record<string, string> = {
    vow: isVi ? "Lời thề" : "Wedding vows",
    toast: isVi ? "Bài nâng ly" : "Toast speech",
    reading: isVi ? "Bài đọc" : "Reading",
    prayer: isVi ? "Lời cầu nguyện" : "Prayer",
    other: isVi ? "Khác" : "Other",
  };
  const categoryLabel = categoryLabels[originalSpeech.category] || (isVi ? "Khác" : "Other");

  prompt += isVi
    ? `【BÀI GỐC】
Loại: ${categoryLabel}
Người phát biểu: ${originalSpeech.speaker}
Tiêu đề: ${originalSpeech.title}

Nội dung:
${originalSpeech.content}

${originalSpeech.notes ? `Ghi chú: ${originalSpeech.notes}` : ""}`
    : `【ORIGINAL SPEECH】
Type: ${categoryLabel}
Speaker: ${originalSpeech.speaker}
Title: ${originalSpeech.title}

Content:
${originalSpeech.content}

${originalSpeech.notes ? `Notes: ${originalSpeech.notes}` : ""}`;

  // Enhancement request
  const modeDesc = MODE_DESCRIPTIONS[mode][lang];
  prompt += isVi ? `\n\n【YÊU CẦU】\n${modeDesc}` : `\n\n【REQUEST】\n${modeDesc}`;

  // Additional options
  if (mode === "adjust-tone" && tone) {
    const toneLabels = {
      formal: isVi ? "trang trọng, trang nhã" : "formal and elegant",
      casual: isVi ? "thân mật, gần gũi" : "casual and approachable",
      romantic: isVi ? "lãng mạn, cảm xúc" : "romantic and emotional",
      humorous: isVi ? "hài hước, nhẹ nhàng" : "humorous and light",
    };
    prompt += isVi ? `\nVăn phong mục tiêu: ${toneLabels[tone]}` : `\nTarget tone: ${toneLabels[tone]}`;
  }

  if (mode === "translate" && targetLanguage) {
    const langLabel = targetLanguage === "vi" ? "Tiếng Việt" : "English";
    prompt += isVi ? `\nDịch sang: ${langLabel}` : `\nTranslate to: ${langLabel}`;
  }

  // Instructions
  prompt += isVi
    ? `\n\n【HƯỚNG DẪN】
- Trả về BẢN CẢI TIẾN hoàn chỉnh, có thể đọc ngay
- Giữ nguyên cấu trúc và các ý chính
- Chỉ cải thiện từ ngữ, ngữ pháp, cảm xúc theo yêu cầu
- KHÓNG thêm phần giải thích hay phân tích`
    : `\n\n【GUIDELINES】
- Return the FULL ENHANCED VERSION ready to read
- Preserve structure and main ideas
- Only improve wording, grammar, emotion per request
- DO NOT include explanations or analysis`;

  return prompt;
}

export function buildSpeechEnhancementPrompt(
  originalSpeech: SpeechEntry,
  options: SpeechEnhancementOptions,
  lang: "vi" | "en" = "vi"
): { systemPrompt: string; userPrompt: string } {
  return {
    systemPrompt: getSystemPrompt(lang),
    userPrompt: getUserPrompt(originalSpeech, options, lang),
  };
}

export function getModeLabel(mode: SpeechEnhancementMode, lang: "vi" | "en"): string {
  const labels: Record<SpeechEnhancementMode, { vi: string; en: string }> = {
    "improve-grammar": { vi: "🔤 Sửa ngữ pháp", en: "🔤 Fix grammar" },
    "enhance-emotion": { vi: "❤️ Tăng cảm xúc", en: "❤️ Enhance emotion" },
    "adjust-tone": { vi: "🎭 Điều chỉnh văn phong", en: "🎭 Adjust tone" },
    shorten: { vi: "✂️ Cô đọng", en: "✂️ Make concise" },
    lengthen: { vi: "📝 Mở rộng", en: "📝 Expand" },
    translate: { vi: "🌐 Dịch thuật", en: "🌐 Translate" },
  };
  return labels[mode][lang];
}

export function getToneLabel(tone: string, lang: "vi" | "en"): string {
  const labels: Record<string, { vi: string; en: string }> = {
    formal: { vi: "Trang trọng", en: "Formal" },
    casual: { vi: "Thân mật", en: "Casual" },
    romantic: { vi: "Lãng mạn", en: "Romantic" },
    humorous: { vi: "Hài hước", en: "Humorous" },
  };
  return labels[tone]?.[lang] || tone;
}

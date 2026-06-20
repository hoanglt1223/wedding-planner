import { useState } from "react";
import { t } from "@/lib/i18n";
import type { SpeechCategory } from "@/types/wedding";

interface VowBuilderProps {
  lang: string;
  onSave: (data: { title: string; content: string; category: SpeechCategory; speaker: string }) => void;
  onClose: () => void;
}

type VowStyle = "traditional" | "romantic" | "humorous" | "poetic";

interface PromptAnswer {
  moment: string;
  quality: string;
  promise: string;
  nickname: string;
}

const STYLE_TEMPLATES: Record<VowStyle, { labelVi: string; labelEn: string; icon: string }> = {
  traditional: { labelVi: "Truyền thống", labelEn: "Traditional", icon: "📜" },
  romantic: { labelVi: "Lãng mạn", labelEn: "Romantic", icon: "💕" },
  humorous: { labelVi: "Hài hước", labelEn: "Humorous", icon: "😄" },
  poetic: { labelVi: "Thơ mộng", labelEn: "Poetic", icon: "🌸" },
};

const PROMPTS = {
  moment: {
    vi: "Khoảnh khắc bạn biết người này là 'người ấy' là khi nào?",
    en: "When was the moment you knew this person was 'the one'?",
  },
  quality: {
    vi: "Bạn yêu nhất điều gì ở người ấy? (tính cách, thói quen, nụ cười...)",
    en: "What do you love most about them? (personality, habit, smile...)",
  },
  promise: {
    vi: "Bạn muốn hứa điều gì trong cuộc sống hôn nhân?",
    en: "What promise do you want to make for your married life?",
  },
  nickname: {
    vi: "Bạn thường gọi người ấy bằng biệt danh gì?",
    en: "What nickname do you usually call them?",
  },
};

function generateVowDraft(style: VowStyle, answers: PromptAnswer, lang: string): string {
  const en = lang === "en";
  const { moment, quality, promise, nickname } = answers;

  const templates: Record<VowStyle, string> = {
    traditional: en
      ? `My dearest ${nickname || "love"},

From the moment ${moment || "I first met you"}, my life changed forever. I knew in my heart that you were the one I wanted to spend every day with.

What I love most about you is ${quality || "everything about you"}. Your kindness, your strength, and the way you make every ordinary day feel special.

Today, before our family and friends, I make this promise: ${promise || "to love you, honor you, and stand by your side through all of life's joys and challenges"}.

I promise to be your partner, your confidant, and your greatest supporter. In good times and in bad, in health and in sickness, I will love you unconditionally.

With all my heart, I am yours, and you are mine. Forever.`
      : `Gửi người thương ${nickname || "của anh/em"},

Từ khoảnh khắc ${moment || "lần đầu gặp em/anh"}, cuộc đời anh/em đã thay đổi hoàn toàn. Anh/em biết trong tim rằng em/anh chính là người mà anh/em muốn dành trọn mỗi ngày.

Điều anh/em yêu nhất ở em/anh là ${quality || "tất cả về em/anh"}. Sự dịu dàng, sức mạnh, và cách em/anh biến mỗi ngày bình thường trở nên đặc biệt.

Hôm nay, trước mặt gia đình và bạn bè, anh/em xin hứa: ${promise || "yêu thương em/anh, trân trọng em/anh, và luôn bên cạnh em/anh qua mọi niềm vui và thử thách của cuộc sống"}.

Anh/em hứa sẽ là người bạn đời, người tâm sự, và người ủng hộ em/anh nhất. Dù lúc vui hay lúc buồn, dù khỏe mạnh hay ốm đau, anh/em sẽ yêu em/anh vô điều kiện.

Với cả trái tim, anh/em thuộc về em/anh, và em/anh thuộc về anh/em. Mãi mãi.`,

    romantic: en
      ? `My darling ${nickname || "love"},

They say love is not about finding the perfect person, but about seeing an imperfect person perfectly. And you, my love, are perfectly imperfect in every way.

I remember ${moment || "the first time our eyes met"} — my heart whispered, "there you are, I've been looking for you."

You are ${quality || "the most beautiful soul I've ever known"}. Every day with you feels like a page from a love story I never want to end.

Today, I give you my heart, my soul, and my promise: ${promise || "to love you more with each passing day, to be your safe harbor in any storm, and to fill our home with laughter and warmth"}.

You are my today and all of my tomorrows. I love you beyond words, beyond time, beyond everything.`
      : `Người thương yêu ${nickname || "của anh/em"},

Người ta nói tình yêu không phải là tìm người hoàn hảo, mà là nhìn thấy sự không hoàn hảo một cách hoàn hảo. Và em/anh, người yêu ơi, hoàn hảo theo cách không hoàn hảo nhất.

Anh/em nhớ ${moment || "lần đầu tiên ánh mắt chúng ta gặp nhau"} — trái tim anh/em thì thầm, "em/anh đây rồi, anh/em đã tìm kiếm em/anh."

Em/anh là ${quality || "tâm hồn đẹp nhất mà anh/em từng biết"}. Mỗi ngày bên em/anh giống như một trang từ câu chuyện tình yêu mà anh/em không bao giờ muốn kết thúc.

Hôm nay, anh/em trao em/anh trái tim, tâm hồn, và lời hứa: ${promise || "yêu em/anh nhiều hơn mỗi ngày, là bến đỗ an toàn trong mọi bão tố, và lấp đầy ngôi nhà bằng tiếng cười và sự ấm áp"}.

Em/anh là hôm nay và tất cả ngày mai của anh/em. Anh/em yêu em/anh vượt ngoài lời nói, vượt ngoài thời gian, vượt ngoài tất cả.`,

    humorous: en
      ? `Hey ${nickname || "you"},

So... we actually went through with this! 😄

I knew you were special ${moment || "when you laughed at my terrible jokes and still decided to stick around"}. Most people would have run, but not you — that's either love or questionable judgment, and I'm going with love.

I love that you are ${quality || "the only person who can make me laugh until I cry"}. I love that you steal the blankets at 3 AM and somehow make it adorable. I love that you pretend to listen when I talk about my hobbies.

My promises to you:
• I promise to ${promise || "always let you have the last slice of pizza... most of the time"}
• I promise to laugh at your jokes, even the bad ones
• I promise to be the big spoon when you need it and the little spoon when I need it
• I promise to love you even when you're hangry

You're my favorite person. Let's do this forever thing. 🎉`
      : `Này ${nickname || "bạn ơi"},

Vậy là chúng ta thực sự làm điều này rồi! 😄

Anh/em biết em/anh đặc biệt ${moment || "khi em/anh cười những trò đùa dở tệ của anh/em và vẫn quyết định ở lại"}.大多数人都 sẽ chạy, nhưng em/anh thì không — đó là tình yêu hoặc sự phán đoán đáng ngờ, và anh/em chọn tình yêu.

Anh/em yêu ${quality || "em/anh là người duy nhất có thể làm anh/em cười đến phát khóc"}. Anh/em yêu em/anh ăn cắp chăn lúc 3 giờ sáng và somehow vẫn dễ thương. Anh/em yêu em/anh giả vờ lắng nghe khi anh/em nói về sở thích.

Lời hứa của anh/em:
• Anh/em hứa ${promise || "luôn nhường em/anh miếng pizza cuối cùng... hầu hết thời gian"}
• Anh/em hứa cười những trò đùa của em/anh, kể cả dở
• Anh/em hứa ôm em/anh khi em/anh cần
• Anh/em hứa yêu em/anh cả khi em/anh đói bụng

Em/anh là người yêu thích nhất của anh/em. Cùng nhau làm điều mãi mãi này nhé. 🎉`,

    poetic: en
      ? `My ${nickname || "love"}, my light,

If I could count the stars that shine each night,
I would count them all — and still, they wouldn't match
the brightness you bring to my life.

I knew ${moment || "the moment I saw you"} that the universe
had written our names in the same constellation.

You are ${quality || "the gentle rain that makes my garden bloom"}.
You are the quiet dawn after the longest night.
You are the verse I never knew my heart was writing.

I vow to ${promise || "be the wind beneath your wings, the shelter in your storm, the echo that answers when you call love"}.

Let us write our story — not in ink,
but in whispered promises and shared sunsets,
in morning coffee and midnight laughter,
in a love that grows deeper with every breath.

Today, I give you all that I am,
and all that I will ever be.`
      : `Người ${nickname || "thương"} của anh/em, ánh sáng của anh/em,

Nếu anh/em đếm được những ngôi sao sáng mỗi đêm,
Anh/em sẽ đếm hết — và vẫn không đủ
để sánh với ánh sáng em/anh mang đến cuộc đời anh/em.

Anh/em biết ${moment || "khoảnh khắc nhìn thấy em/anh"} rằng vũ trụ
đã viết tên chúng ta cùng một chòm sao.

Em/anh là ${quality || "cơn mưa nhẹ làm khu vườn anh/em nở hoa"}.
Em/anh là bình minh lặng lẽ sau đêm dài nhất.
Em/anh là câu thơ mà trái tim anh/em chẳng biết mình đang viết.

Anh/em xin hứa ${promise || "là gió dưới cánh em/anh, là nơi trú ẩn trong bão, là tiếng vọng đáp lại khi em/anh gọi tình yêu"}.

Hãy cùng viết câu chuyện — không bằng mực,
mà bằng lời thì thầm và hoàng hôn chia sẻ,
bằng cà phê sáng và tiếng cười khuya,
bằng tình yêu lớn sâu hơn với mỗi hơi thở.

Hôm nay, anh/em trao em/anh tất cả những gì anh/em là,
và tất cả những gì anh/em sẽ trở thành.`,
  };

  return templates[style];
}

export function VowBuilder({ lang, onSave, onClose }: VowBuilderProps) {
  const en = lang === "en";
  const [step, setStep] = useState<"prompts" | "style" | "preview">("prompts");
  const [answers, setAnswers] = useState<PromptAnswer>({
    moment: "",
    quality: "",
    promise: "",
    nickname: "",
  });
  const [style, setStyle] = useState<VowStyle>("romantic");
  const [draft, setDraft] = useState("");
  const [speaker, setSpeaker] = useState(en ? "Groom" : "Chú rể");

  function handleGenerate() {
    const generated = generateVowDraft(style, answers, lang);
    setDraft(generated);
    setStep("preview");
  }

  function handleSave() {
    onSave({
      title: en ? `Vows — ${speaker}` : `Lời thề — ${speaker}`,
      content: draft,
      category: "vow",
      speaker,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-xl"
        style={{ backgroundColor: "var(--theme-surface)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b" style={{ backgroundColor: "var(--theme-surface)", borderColor: "var(--theme-border)" }}>
          <div>
            <h3 className="font-semibold text-base">
              {en ? "✨ Vow Builder" : "✨ Trợ Thủ Viết Lời Thề"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {en ? "Step-by-step guided vow writing" : "Viết lời thề từng bước"}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg">
            ✕
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-4 pt-3">
          {(["prompts", "style", "preview"] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  step === s
                    ? "text-white"
                    : i < ["prompts", "style", "preview"].indexOf(step)
                      ? "text-white"
                      : "bg-muted text-muted-foreground"
                }`}
                style={
                  step === s || i < ["prompts", "style", "preview"].indexOf(step)
                    ? { backgroundColor: "var(--theme-primary)" }
                    : undefined
                }
              >
                {i + 1}
              </div>
              <span className="text-xs hidden sm:inline">
                {en
                  ? ["Prompts", "Style", "Preview"][i]
                  : ["Gợi ý", "Phong cách", "Xem trước"][i]}
              </span>
              {i < 2 && <div className="w-6 h-px bg-muted-foreground/30" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Step 1: Prompts */}
          {step === "prompts" && (
            <>
              <p className="text-sm text-muted-foreground">
                {en
                  ? "Answer these questions to help shape your vows. All fields are optional — skip any you don't need."
                  : "Trả lời những câu hỏi này để tạo lời thề. Tất cả đều tùy chọn — bỏ qua nếu không cần."}
              </p>

              {/* Speaker selector */}
              <div>
                <label className="text-xs font-medium block mb-1">
                  {en ? "Who is writing?" : "Ai đang viết?"}
                </label>
                <div className="flex gap-2">
                  {(en ? ["Groom", "Bride", "Partner 1", "Partner 2"] : ["Chú rể", "Cô dâu", "Bạn đời 1", "Bạn đời 2"]).map((name) => (
                    <button
                      key={name}
                      onClick={() => setSpeaker(name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        speaker === name
                          ? "text-white"
                          : "bg-background text-muted-foreground hover:border-primary"
                      }`}
                      style={speaker === name ? { backgroundColor: "var(--theme-primary)" } : undefined}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {Object.entries(PROMPTS).map(([key, prompt]) => (
                <div key={key}>
                  <label className="text-xs font-medium block mb-1">
                    {en ? prompt.en : prompt.vi}
                  </label>
                  <textarea
                    value={answers[key as keyof PromptAnswer]}
                    onChange={(e) => setAnswers((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border rounded-lg p-2.5 text-sm bg-background resize-none"
                    rows={2}
                    placeholder={en ? "Write here..." : "Viết ở đây..."}
                  />
                </div>
              ))}

              {/* Tips */}
              <div
                className="rounded-lg p-3 text-xs space-y-1"
                style={{ backgroundColor: "var(--theme-note-bg)", color: "var(--theme-note-text)" }}
              >
                <p className="font-medium">💡 {en ? "Tips" : "Mẹo"}:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>{en ? "Be specific — share a real memory" : "Cụ thể — chia sẻ kỷ niệm thật"}</li>
                  <li>{en ? "Speak from the heart, not from Google" : "Nói từ trái tim, không phải từ Google"}</li>
                  <li>{en ? "Keep it 1-2 minutes when spoken aloud" : "Giữ trong 1-2 phút khi đọc to"}</li>
                  <li>{en ? "It's OK to be emotional!" : "Được phép xúc động!"}</li>
                </ul>
              </div>

              <button
                onClick={() => setStep("style")}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: "var(--theme-primary)" }}
              >
                {en ? "Next: Choose Style →" : "Tiếp: Chọn phong cách →"}
              </button>
            </>
          )}

          {/* Step 2: Style */}
          {step === "style" && (
            <>
              <p className="text-sm text-muted-foreground">
                {en
                  ? "Choose a style for your vow draft. You can edit freely after."
                  : "Chọn phong cách cho bản nháp lời thề. Bạn có thể chỉnh sửa tự do sau."}
              </p>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STYLE_TEMPLATES).map(([key, tmpl]) => (
                  <button
                    key={key}
                    onClick={() => setStyle(key as VowStyle)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-colors ${
                      style === key ? "border-current" : "border-transparent hover:border-muted-foreground/20"
                    }`}
                    style={
                      style === key
                        ? { backgroundColor: "var(--theme-primary-light)", color: "var(--theme-primary)" }
                        : { backgroundColor: "var(--theme-surface-muted)" }
                    }
                  >
                    <span className="text-2xl">{tmpl.icon}</span>
                    <span className="text-xs font-medium">
                      {en ? tmpl.labelEn : tmpl.labelVi}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("prompts")}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "var(--theme-border)" }}
                >
                  ← {en ? "Back" : "Quay lại"}
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  {en ? "✨ Generate Draft" : "✨ Tạo bản nháp"}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Preview / Edit */}
          {step === "preview" && (
            <>
              <p className="text-sm text-muted-foreground">
                {en
                  ? "Edit the draft below until it feels right. Then save it to your speeches."
                  : "Chỉnh sửa bản nháp bên dưới cho đến khi thấy đúng. Sau đó lưu vào danh sách bài phát biểu."}
              </p>

              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full min-h-[280px] border rounded-lg p-3 text-sm bg-background resize-y leading-relaxed"
              />

              <div className="text-right text-xs text-muted-foreground">
                {draft.split(/\s+/).filter(Boolean).length} {en ? "words" : "từ"} · ~{Math.ceil(draft.split(/\s+/).filter(Boolean).length / 130)} {en ? "min spoken" : "phút đọc"}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("style")}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: "var(--theme-border)" }}
                >
                  ← {en ? "Back" : "Quay lại"}
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  💾 {en ? "Save to Speeches" : "Lưu vào lời thề"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

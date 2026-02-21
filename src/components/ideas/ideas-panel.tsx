import { IDEAS } from "@/data/ideas";

export function IdeasPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-900 p-4">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-xl font-bold text-white">
          💡 Ý Tưởng Cải Thiện &amp; Tính Năng Tương Lai
        </h2>

        <div className="space-y-2">
          {IDEAS.map((idea, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="font-semibold text-white">
                {idea.icon} {idea.title}
              </span>
              <span className="ml-2 text-sm text-white/65"> — {idea.desc}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-white/5 p-4">
          <h2 className="mb-1 text-base font-bold text-white">🚀 Muốn tính năng nào?</h2>
          <p className="text-sm text-white/65">
            Hãy dùng tab <b className="text-white/85">🤖 AI</b> để hỏi chi tiết về bất kỳ ý tưởng nào ở trên, hoặc yêu cầu tôi code thêm!
          </p>
        </div>
      </div>
    </div>
  );
}

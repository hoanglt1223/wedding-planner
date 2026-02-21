import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  progressPct: number;
  done: number;
  total: number;
}

export function Header({ progressPct, done, total }: HeaderProps) {
  return (
    <header className="text-center px-3 py-5 pb-4 bg-gradient-to-br from-[#8b1a2b] to-[#c0392b] text-white rounded-b-2xl mb-3">
      <h1 className="text-[clamp(1.3rem,4vw,1.9rem)] font-bold">
        Ke Hoach Dam Cuoi Viet Nam
      </h1>
      <p className="opacity-80 text-[0.82rem] mt-0.5">
        Ultimate Edition — Day du &amp; Chi tiet nhat
      </p>
      <div className="mt-2 mb-0.5">
        <Progress value={progressPct} className="h-[7px] bg-white/20" />
      </div>
      <div className="text-[0.72rem] opacity-75 text-right">
        {progressPct}% ({done}/{total})
      </div>
    </header>
  );
}

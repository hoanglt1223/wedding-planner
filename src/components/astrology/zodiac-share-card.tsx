import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getZodiac, getSoundElement, ELEMENT_LABEL,
  type CompatType,
} from "@/lib/astrology";
import { THEMES, DEFAULT_THEME_ID } from "@/data/themes";

interface Props {
  brideYear: number;
  groomYear: number;
  brideName: string;
  groomName: string;
  score: number;
  relationType: CompatType;
}

const REL_COLORS: Record<CompatType, string> = {
  generating: "#16a34a",
  neutral: "#2563eb",
  overcoming: "#dc2626",
};
const REL_LABELS: Record<CompatType, string> = {
  generating: "Tương Sinh",
  neutral: "Bình Hòa",
  overcoming: "Tương Khắc",
};

export function ZodiacShareButton(props: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const canvas = drawCard(props);
      const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/png"));
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tuvi-${props.brideName || "co-dau"}-${props.groomName || "chu-re"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={loading}
      variant="outline"
      className="w-full mt-2"
    >
      {loading ? "Đang tạo..." : "📸 Lưu Hình Tử Vi"}
    </Button>
  );
}

function drawCard({ brideYear, groomYear, brideName, groomName, score, relationType }: Props): HTMLCanvasElement {
  const W = 1200, H = 630, S = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(S, S);

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#fdf6f0");
  grad.addColorStop(1, "#fce4ec");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Decorative border
  ctx.strokeStyle = "#e8ddd0";
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  const brideZ = getZodiac(brideYear);
  const groomZ = getZodiac(groomYear);
  const brideSE = getSoundElement(brideYear);
  const groomSE = getSoundElement(groomYear);

  // Left column - Bride
  drawPerson(ctx, 100, brideName || "Cô dâu", brideYear, brideZ, brideSE);
  // Right column - Groom
  drawPerson(ctx, W - 100, groomName || "Chú rể", groomYear, groomZ, groomSE);

  // Center - Score
  const cx = W / 2, cy = 200;

  // Score circle
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = REL_COLORS[relationType];
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.font = "bold 56px 'Playfair Display', serif";
  ctx.fillStyle = REL_COLORS[relationType];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${score}`, cx, cy - 8);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#8a7060";
  ctx.fillText("điểm", cx, cy + 30);

  // Relationship label
  ctx.font = "bold 28px 'Playfair Display', serif";
  ctx.fillStyle = REL_COLORS[relationType];
  ctx.fillText(REL_LABELS[relationType], cx, cy + 100);

  // Element matchup
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#5a3e2e";
  const elText = `${brideSE.emoji} ${ELEMENT_LABEL[brideSE.element]}  ×  ${groomSE.emoji} ${ELEMENT_LABEL[groomSE.element]}`;
  ctx.fillText(elText, cx, cy + 140);

  // Title
  ctx.font = "bold 24px 'Playfair Display', serif";
  ctx.fillStyle = "#2c1810";
  ctx.fillText("Tử Vi Hợp Tuổi", cx, 50);

  // Bottom branding
  const brandTheme = THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0];
  ctx.fillStyle = brandTheme.accent;
  ctx.fillRect(0, H - 50, W, 50);
  ctx.font = "bold 16px sans-serif";
  ctx.fillStyle = "#fff";
  ctx.fillText("💍 Wedding Planner — Kế Hoạch Đám Cưới Việt Nam", cx, H - 22);

  return canvas;
}

function drawPerson(
  ctx: CanvasRenderingContext2D, x: number,
  name: string, year: number,
  z: ReturnType<typeof getZodiac>,
  se: ReturnType<typeof getSoundElement>,
) {
  ctx.textAlign = "center";

  // Zodiac emoji
  ctx.font = "72px serif";
  ctx.fillText(z.emoji, x, 160);

  // Name
  ctx.font = "bold 26px 'Playfair Display', serif";
  ctx.fillStyle = "#2c1810";
  ctx.fillText(name, x, 220);

  // Year
  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#8a7060";
  ctx.fillText(`${year}`, x, 255);

  // Zodiac name
  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#5a3e2e";
  ctx.fillText(`${z.name} (${z.chi})`, x, 290);

  // Element
  ctx.font = "bold 20px sans-serif";
  ctx.fillStyle = (THEMES.find((t) => t.id === DEFAULT_THEME_ID) || THEMES[0]).accent;
  ctx.fillText(`${se.emoji} ${ELEMENT_LABEL[se.element]}`, x, 325);

  // Sound element name
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "#8a7060";
  ctx.fillText(se.name, x, 355);
}

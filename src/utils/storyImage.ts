import { TCIScale } from "@/types/assessment";
import { CharacterProfile } from "@/utils/character";
import { SimulationData } from "@/utils/crisisSimulation";

/** 논리 좌표계는 360x640, 실제 출력은 3배(1080x1920, 인스타 스토리 규격)다. */
const WIDTH = 360;
const HEIGHT = 640;
const SCALE = 3;
const PAD = 32;

const COLORS = {
  cream: "#FBF7F0",
  ink: "#16161D",
  coral: "#E5484D",
  line: "#EADFD0",
};

const CHIP_COLORS: Record<TCIScale, { bg: string; fg: string }> = {
  NS: { bg: "#FFEBD2", fg: "#9A4A05" },
  HA: { bg: "#FFE4E4", fg: "#B4232A" },
  RD: { bg: "#FFF0C7", fg: "#7A5200" },
  PS: { bg: "#DFF0FF", fg: "#1D5FA8" },
  SD: { bg: "#FFE4E4", fg: "#B4232A" },
  CO: { bg: "#E2F7EC", fg: "#137A4A" },
  ST: { bg: "#ECE6FF", fg: "#5B3FB3" },
};

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * 페이지가 이미 요청해둔 폰트가 로드될 때까지 기다린다. `document.fonts.load()`는
 * 폰트 shorthand 문자열을 브라우저가 직접 파싱해야 해서(특히 next/font가 생성하는
 * 긴 폴백 스택과 함께 쓰면) 일부 모바일 브라우저·인앱 브라우저(카카오톡 등)에서
 * SyntaxError로 죽는 경우가 있었다. 인자가 필요 없는 `fonts.ready`만 쓰고, API 자체가
 * 없거나 응답이 없어도(최대 1.5초) 카드 생성 자체는 항상 진행되도록 한다.
 */
async function waitForFonts(): Promise<void> {
  try {
    const fonts = document.fonts;
    if (fonts?.ready) {
      await Promise.race([fonts.ready, new Promise((resolve) => setTimeout(resolve, 1500))]);
    }
  } catch {
    // 폰트 API 미지원/실패 — 시스템 폴백 폰트로 계속 그린다.
  }
}

/** 일부 브라우저는 canvas.toBlob이 없거나 null을 돌려줄 수 있어 dataURL로 폴백한다. */
async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  if (typeof canvas.toBlob === "function") {
    const blob = await new Promise<Blob | null>((resolve) => {
      try {
        canvas.toBlob((result) => resolve(result), "image/png");
      } catch {
        resolve(null);
      }
    });
    if (blob) return blob;
  }
  const response = await fetch(canvas.toDataURL("image/png"));
  return response.blob();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    // 한 단어가 한 줄보다 길면 글자 단위로 자른다.
    while (ctx.measureText(current).width > maxWidth && current.length > 1) {
      let cut = current.length - 1;
      while (cut > 1 && ctx.measureText(current.slice(0, cut)).width > maxWidth) cut -= 1;
      lines.push(current.slice(0, cut));
      current = current.slice(cut);
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function renderStoryCard(
  character: CharacterProfile,
  simulation: SimulationData
): Promise<Blob> {
  const family = getComputedStyle(document.body).fontFamily;
  const bars = [...simulation.bubbles].sort((a, b) => b.db - a.db);
  const quote = `“${simulation.loudest.viral}”`;
  const chipTexts = character.chips.map((chip) => `${chip.name} ${chip.scale} ${chip.label}`);

  await waitForFonts();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = HEIGHT * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas is not supported");
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "middle";

  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 로고
  ctx.strokeStyle = COLORS.coral;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(PAD + 14, PAD + 14, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(PAD + 13, PAD + 13, 4.2, 0, Math.PI * 2);
  ctx.moveTo(PAD + 16.3, PAD + 16.3);
  ctx.lineTo(PAD + 19.5, PAD + 19.5);
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 18px ${family}`;
  ctx.textAlign = "left";
  ctx.fillText("TCI-Lens", PAD + 36, PAD + 14);

  // 캐릭터 이름
  ctx.fillStyle = COLORS.coral;
  ctx.font = `700 12px ${family}`;
  ctx.fillText("나의 기질 캐릭터", PAD, 122);
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 38px ${family}`;
  ctx.fillText(character.adjective, PAD, 160);
  ctx.fillText(character.type, PAD, 206);

  // 칩
  ctx.font = `700 12px ${family}`;
  let chipX = PAD;
  let chipY = 236;
  character.chips.forEach((chip, index) => {
    const width = ctx.measureText(chipTexts[index]).width + 24;
    if (chipX + width > WIDTH - PAD) {
      chipX = PAD;
      chipY += 36;
    }
    ctx.fillStyle = CHIP_COLORS[chip.scale].bg;
    roundedRect(ctx, chipX, chipY, width, 28, 14);
    ctx.fill();
    ctx.fillStyle = CHIP_COLORS[chip.scale].fg;
    ctx.fillText(chipTexts[index], chipX + 12, chipY + 14.5);
    chipX += width + 8;
  });

  // dB 막대
  const barWidth = WIDTH - PAD * 2;
  ctx.fillStyle = "rgba(22,22,29,0.5)";
  ctx.font = `700 12px ${family}`;
  ctx.fillText("내 머릿속 데시벨", PAD, 372);
  bars.forEach((bar, index) => {
    const top = 396 + index * 44;
    ctx.fillStyle = COLORS.ink;
    ctx.font = `700 12px ${family}`;
    ctx.textAlign = "left";
    ctx.fillText(bar.label, PAD, top);
    ctx.textAlign = "right";
    ctx.fillText(`${bar.db}dB`, WIDTH - PAD, top);
    ctx.fillStyle = COLORS.line;
    roundedRect(ctx, PAD, top + 12, barWidth, 10, 5);
    ctx.fill();
    ctx.fillStyle = COLORS.coral;
    roundedRect(ctx, PAD, top + 12, Math.max(10, (barWidth * bar.db) / 100), 10, 5);
    ctx.fill();
  });

  // 공유 문구 박스
  ctx.textAlign = "left";
  ctx.font = `700 15px ${family}`;
  const quoteLines = wrapText(ctx, quote, barWidth - 32);
  const boxHeight = 32 + quoteLines.length * 22;
  const boxTop = 590 - boxHeight;
  ctx.fillStyle = COLORS.ink;
  roundedRect(ctx, PAD, boxTop, barWidth, boxHeight, 16);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  quoteLines.forEach((line, index) => {
    ctx.fillText(line, PAD + 16, boxTop + 16 + 11 + index * 22);
  });

  // 푸터
  ctx.fillStyle = "rgba(22,22,29,0.4)";
  ctx.font = `700 12px ${family}`;
  ctx.textAlign = "center";
  ctx.fillText("TCI-Lens · 나도 검사해보기", WIDTH / 2, 616);

  return canvasToBlob(canvas);
}

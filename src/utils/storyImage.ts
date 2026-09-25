import { ScaleResult, TCIScale } from "@/types/assessment";
import { CharacterProfile } from "@/utils/character";
import { SimulationData } from "@/utils/crisisSimulation";
import { buildOverallSummary, OverallSummary } from "@/utils/scoring";

/** 논리 좌표계는 폭 360 고정, 실제 출력은 3배(가로 1080px)다. 세로는 종합 평가
 *  문단 길이에 따라 달라지므로 렌더링 시점에 콘텐츠 높이를 계산해 정한다. */
const WIDTH = 360;
const SCALE = 3;
const PAD = 32;
const CONTENT_W = WIDTH - PAD * 2;

const COLORS = {
  cream: "#FBF7F0",
  ink: "#16161D",
  ink70: "rgba(22,22,29,0.72)",
  ink50: "rgba(22,22,29,0.5)",
  ink40: "rgba(22,22,29,0.4)",
  ink05: "rgba(22,22,29,0.05)",
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

/**
 * 카드 전체를 그리고 최종 콘텐츠 높이(y 하단 + 여백)를 반환한다. 실제 저장용
 * 캔버스를 만들기 전, 크기가 정해지지 않은 스크래치 캔버스에도 그대로 한 번
 * 돌려서 필요한 높이를 먼저 계산한다(measureText는 캔버스 크기와 무관하다).
 */
function paintCard(
  ctx: CanvasRenderingContext2D,
  family: string,
  character: CharacterProfile,
  summary: OverallSummary,
  simulation: SimulationData
): number {
  const bars = [...simulation.bubbles].sort((a, b) => b.db - a.db);
  const quote = `“${simulation.loudest.viral}”`;
  const chipTexts = character.chips.map((chip) => `${chip.name} ${chip.scale} ${chip.label}`);

  ctx.textBaseline = "middle";
  let y = PAD;

  // 로고
  ctx.strokeStyle = COLORS.coral;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(PAD + 14, y + 14, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(PAD + 13, y + 13, 4.2, 0, Math.PI * 2);
  ctx.moveTo(PAD + 16.3, y + 16.3);
  ctx.lineTo(PAD + 19.5, y + 19.5);
  ctx.stroke();
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 18px ${family}`;
  ctx.textAlign = "left";
  ctx.fillText("TCI-Lens", PAD + 36, y + 14);
  y += 28 + 40;

  // 캐릭터 이름
  ctx.fillStyle = COLORS.coral;
  ctx.font = `700 12px ${family}`;
  ctx.fillText("나의 기질 캐릭터", PAD, y);
  y += 12 + 26;
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 34px ${family}`;
  ctx.fillText(character.adjective, PAD, y);
  y += 34 + 10;
  ctx.fillText(character.type, PAD, y);
  y += 34 + 28;

  // 기질 칩
  ctx.font = `700 12px ${family}`;
  let chipX = PAD;
  let chipRowY = y;
  character.chips.forEach((chip, index) => {
    const width = ctx.measureText(chipTexts[index]).width + 24;
    if (chipX + width > WIDTH - PAD) {
      chipX = PAD;
      chipRowY += 36;
    }
    ctx.fillStyle = CHIP_COLORS[chip.scale].bg;
    roundedRect(ctx, chipX, chipRowY, width, 28, 14);
    ctx.fill();
    ctx.fillStyle = CHIP_COLORS[chip.scale].fg;
    ctx.fillText(chipTexts[index], chipX + 12, chipRowY + 14.5);
    chipX += width + 8;
  });
  y = chipRowY + 28 + 36;

  // 종합 평가
  ctx.textAlign = "left";
  ctx.fillStyle = COLORS.ink;
  ctx.font = `900 17px ${family}`;
  ctx.fillText("종합 평가", PAD, y);
  y += 17 + 26;

  const statW = (CONTENT_W - 12) / 2;
  const statH = 58;
  ctx.fillStyle = CHIP_COLORS.HA.bg;
  roundedRect(ctx, PAD, y, statW, statH, 16);
  ctx.fill();
  ctx.fillStyle = COLORS.ink05;
  roundedRect(ctx, PAD + statW + 12, y, statW, statH, 16);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.ink50;
  ctx.font = `700 11px ${family}`;
  ctx.fillText("기질 영역 평균", PAD + statW / 2, y + 17);
  ctx.fillText("성격 영역 평균", PAD + statW + 12 + statW / 2, y + 17);
  ctx.font = `900 20px ${family}`;
  ctx.fillStyle = COLORS.coral;
  ctx.fillText(`${summary.temperamentAvg}%`, PAD + statW / 2, y + 39);
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(`${summary.characterAvg}%`, PAD + statW + 12 + statW / 2, y + 39);
  ctx.textAlign = "left";
  y += statH + 28;

  const sections: { label: string; text: string }[] = [
    { label: `개요 · ${summary.characterName}`, text: summary.overviewParagraph },
    { label: "강점과 보완점", text: summary.strengthGrowthParagraph },
    { label: "종합 코멘트", text: summary.closingParagraph },
  ];
  sections.forEach((section) => {
    ctx.font = `700 11px ${family}`;
    ctx.fillStyle = COLORS.ink50;
    ctx.fillText(section.label, PAD, y);
    y += 11 + 18;

    ctx.font = `500 13px ${family}`;
    ctx.fillStyle = COLORS.ink70;
    const lines = wrapText(ctx, section.text, CONTENT_W);
    lines.forEach((line) => {
      ctx.fillText(line, PAD, y);
      y += 20;
    });
    y += 18;
  });
  y += 6;

  // dB 막대
  ctx.fillStyle = COLORS.ink50;
  ctx.font = `700 12px ${family}`;
  ctx.fillText("내 머릿속 데시벨", PAD, y);
  y += 12 + 24;
  bars.forEach((bar) => {
    ctx.fillStyle = COLORS.ink;
    ctx.font = `700 12px ${family}`;
    ctx.textAlign = "left";
    ctx.fillText(bar.label, PAD, y);
    ctx.textAlign = "right";
    ctx.fillText(`${bar.db}dB`, WIDTH - PAD, y);
    ctx.fillStyle = COLORS.line;
    roundedRect(ctx, PAD, y + 12, CONTENT_W, 10, 5);
    ctx.fill();
    ctx.fillStyle = COLORS.coral;
    roundedRect(ctx, PAD, y + 12, Math.max(10, (CONTENT_W * bar.db) / 100), 10, 5);
    ctx.fill();
    y += 44;
  });
  y += 6;

  // 공유 문구 박스
  ctx.textAlign = "left";
  ctx.font = `700 15px ${family}`;
  const quoteLines = wrapText(ctx, quote, CONTENT_W - 32);
  const boxHeight = 32 + quoteLines.length * 22;
  ctx.fillStyle = COLORS.ink;
  roundedRect(ctx, PAD, y, CONTENT_W, boxHeight, 16);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  quoteLines.forEach((line, index) => {
    ctx.fillText(line, PAD + 16, y + 16 + 11 + index * 22);
  });
  y += boxHeight + 32;

  // 푸터
  ctx.fillStyle = COLORS.ink40;
  ctx.font = `700 12px ${family}`;
  ctx.textAlign = "center";
  ctx.fillText("TCI-Lens · 나도 검사해보기", WIDTH / 2, y);
  y += 12;

  return y + PAD;
}

export async function renderStoryCard(
  character: CharacterProfile,
  simulation: SimulationData,
  results: Record<TCIScale, ScaleResult>
): Promise<Blob> {
  const family = getComputedStyle(document.body).fontFamily;
  const summary = buildOverallSummary(results);

  await waitForFonts();

  // 1차: 그려지지 않는 스크래치 캔버스로 전체 콘텐츠 높이를 계산한다
  // (measureText는 캔버스 크기와 무관하게 동작한다).
  const scratch = document.createElement("canvas");
  const scratchCtx = scratch.getContext("2d");
  if (!scratchCtx) throw new Error("canvas is not supported");
  const contentHeight = paintCard(scratchCtx, family, character, summary, simulation);

  // 2차: 계산된 높이로 실제 캔버스를 만들어 그린다.
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH * SCALE;
  canvas.height = contentHeight * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas is not supported");
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = COLORS.cream;
  ctx.fillRect(0, 0, WIDTH, contentHeight);

  paintCard(ctx, family, character, summary, simulation);

  return canvasToBlob(canvas);
}

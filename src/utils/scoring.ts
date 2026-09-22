import { TCI_QUESTIONS } from "@/constants/questions";
import { SCALE_INTERPRETATIONS } from "@/constants/interpretations";
import { SCALE_META, SCALE_ORDER } from "@/constants/scales";
import { ScaleResult, ScoreLevel, TCIScale } from "@/types/assessment";
import { characterName, deriveCharacter } from "@/utils/character";

const MIN_ITEM_SCORE = 1;
const MAX_ITEM_SCORE = 5;

export function resolveItemScore(rawValue: number, isReverse: boolean): number {
  return isReverse ? MAX_ITEM_SCORE + MIN_ITEM_SCORE - rawValue : rawValue;
}

export function levelFromPercentage(percentage: number): ScoreLevel {
  if (percentage <= 30) return "LOW";
  if (percentage >= 70) return "HIGH";
  return "MID";
}

export interface OverallSummary {
  temperamentAvg: number;
  characterAvg: number;
  characterName: string;
  characterMaturity: "성숙" | "발전중" | "보통";
  highest: ScaleResult;
  lowest: ScaleResult;
  overviewParagraph: string;
  strengthGrowthParagraph: string;
  closingParagraph: string;
}

const TEMPERAMENT_SCALES: TCIScale[] = ["NS", "HA", "RD", "PS"];
const CHARACTER_SCALES: TCIScale[] = ["SD", "CO", "ST"];

export function buildOverallSummary(results: Record<TCIScale, ScaleResult>): OverallSummary {
  const average = (scales: TCIScale[]) =>
    Math.round(scales.reduce((sum, scale) => sum + results[scale].percentage, 0) / scales.length);

  const temperamentAvg = average(TEMPERAMENT_SCALES);
  const characterAvg = average(CHARACTER_SCALES);

  const sorted = SCALE_ORDER.map((scale) => results[scale]).sort(
    (a, b) => b.percentage - a.percentage
  );
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const character = deriveCharacter(results);
  const name = characterName(character);

  const characterMaturity: OverallSummary["characterMaturity"] =
    characterAvg >= 58 ? "성숙" : characterAvg <= 42 ? "발전중" : "보통";
  const maturityPhrase =
    characterMaturity === "성숙"
      ? "성숙한 성격"
      : characterMaturity === "발전중"
      ? "성장 중인 성격"
      : "보통 수준의 성격";

  // --- 1. 개요: 기질 유형 + 성격 성숙도 + 평균 수치를 한 문단으로 ---
  const overviewParagraph = `"${name}" 기질에 "${maturityPhrase}"이 더해진 모습입니다. 기질 영역 평균 ${temperamentAvg}%, 성격 영역 평균 ${characterAvg}%로, ${
    Math.abs(temperamentAvg - characterAvg) < 10
      ? "두 영역이 비교적 균형을 이루고 있습니다."
      : temperamentAvg > characterAvg
      ? "타고난 기질적 반응이 후천적 조절보다 더 강하게 드러나는 편입니다."
      : "타고난 반응보다 후천적으로 다져진 성격적 조절이 더 두드러지는 편입니다."
  }`;

  // --- 2. 강점과 보완점을 한 문단으로 ---
  const strengthGrowthParagraph = `가장 두드러진 강점은 ${highest.scaleName}(${highest.percentage}%)로 "${highest.summary}" 특징이 뚜렷하며, 상대적으로 낮게 나타난 ${lowest.scaleName}(${lowest.percentage}%)은 "${lowest.summary}" 경향이 비교적 약한 편입니다.`;

  // --- 3. 종합 코멘트: 실용적 제안 한 줄 ---
  const closingParagraph = character.tip;

  return {
    temperamentAvg,
    characterAvg,
    characterName: name,
    characterMaturity,
    highest,
    lowest,
    overviewParagraph,
    strengthGrowthParagraph,
    closingParagraph,
  };
}

export function calculateScaleResults(
  answers: Record<number, number>
): Record<TCIScale, ScaleResult> {
  const results = {} as Record<TCIScale, ScaleResult>;

  for (const scale of SCALE_ORDER) {
    const scaleQuestions = TCI_QUESTIONS.filter((q) => q.scale === scale);
    const minScore = scaleQuestions.length * MIN_ITEM_SCORE;
    const maxScore = scaleQuestions.length * MAX_ITEM_SCORE;

    const rawScore = scaleQuestions.reduce((sum, question) => {
      const answered = answers[question.id] ?? MIN_ITEM_SCORE;
      return sum + resolveItemScore(answered, question.isReverse);
    }, 0);

    const percentage =
      maxScore === minScore
        ? 0
        : Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100);
    const level = levelFromPercentage(percentage);
    const meta = SCALE_META[scale];
    const text = SCALE_INTERPRETATIONS[scale][level];

    results[scale] = {
      scale,
      scaleName: meta.name,
      dimension: meta.dimension,
      rawScore,
      maxScore,
      percentage,
      level,
      summary: text.summary,
      description: text.description,
    };
  }

  return results;
}

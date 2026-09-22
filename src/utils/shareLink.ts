import { TCI_QUESTIONS } from "@/constants/questions";

const ORDERED_IDS = [...TCI_QUESTIONS].map((question) => question.id).sort((a, b) => a - b);

/** 응답 전체를 "문항 순서대로 1~5 숫자 나열" 문자열로 압축한다. 미응답이 있으면 null. */
export function encodeAnswers(answers: Record<number, number>): string | null {
  const digits: string[] = [];
  for (const id of ORDERED_IDS) {
    const value = answers[id];
    if (!Number.isInteger(value) || value < 1 || value > 5) return null;
    digits.push(String(value));
  }
  return digits.join("");
}

export function decodeAnswers(code: string): Record<number, number> | null {
  if (code.length !== ORDERED_IDS.length || !/^[1-5]+$/.test(code)) return null;
  const answers: Record<number, number> = {};
  ORDERED_IDS.forEach((id, index) => {
    answers[id] = Number(code[index]);
  });
  return answers;
}

export function buildShareUrl(answers: Record<number, number>, origin: string): string | null {
  const code = encodeAnswers(answers);
  return code ? `${origin}/result?a=${code}` : null;
}

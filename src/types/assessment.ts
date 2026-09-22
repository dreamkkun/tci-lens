export type DimensionType = "TEMPERAMENT" | "CHARACTER";

export type TCIScale =
  | "NS" // Novelty Seeking (자극추구)
  | "HA" // Harm Avoidance (위험회피)
  | "RD" // Reward Dependence (사회적민감성)
  | "PS" // Persistence (인내력)
  | "SD" // Self-Directedness (자율성)
  | "CO" // Cooperativeness (연대감)
  | "ST"; // Self-Transcendence (자기초월)

export type ScoreLevel = "LOW" | "MID" | "HIGH";

export interface Question {
  id: number;
  scale: TCIScale;
  text: string;
  isReverse: boolean;
}

export interface ScaleResult {
  scale: TCIScale;
  scaleName: string;
  dimension: DimensionType;
  rawScore: number;
  maxScore: number;
  percentage: number; // 0 ~ 100
  level: ScoreLevel;
  summary: string;
  description: string;
}

export interface AssessmentState {
  answers: Record<number, number>; // { [questionId]: 1~5 }
  currentQuestionIndex: number;
  isCompleted: boolean;
  autoAdvance: boolean;
  setAnswer: (questionId: number, value: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  resetAssessment: () => void;
  calculateResults: () => Record<TCIScale, ScaleResult>;
}

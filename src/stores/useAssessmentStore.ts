import { create } from "zustand";
import { TCI_QUESTIONS } from "@/constants/questions";
import { calculateScaleResults } from "@/utils/scoring";
import { AssessmentState } from "@/types/assessment";

const STORAGE_KEY = "tci-lens-answers";

function loadStoredAnswers(): Record<number, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persistAnswers(answers: Record<number, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  } catch {
    // ignore write failures (e.g. private browsing)
  }
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  answers: {},
  currentQuestionIndex: 0,
  isCompleted: false,
  autoAdvance: true,

  setAnswer: (questionId, value) => {
    const nextAnswers = { ...get().answers, [questionId]: value };
    persistAnswers(nextAnswers);
    set({ answers: nextAnswers });
  },

  nextQuestion: () => {
    const { currentQuestionIndex } = get();
    const isLast = currentQuestionIndex >= TCI_QUESTIONS.length - 1;
    if (isLast) {
      set({ isCompleted: true });
      return;
    }
    set({ currentQuestionIndex: currentQuestionIndex + 1 });
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex === 0) return;
    set({ currentQuestionIndex: currentQuestionIndex - 1, isCompleted: false });
  },

  resetAssessment: () => {
    persistAnswers({});
    set({ answers: {}, currentQuestionIndex: 0, isCompleted: false });
  },

  calculateResults: () => {
    return calculateScaleResults(get().answers);
  },
}));

export function hasStoredProgress(): boolean {
  const stored = loadStoredAnswers();
  return Object.keys(stored).length > 0;
}

export function hydrateStoredAnswers() {
  const stored = loadStoredAnswers();
  if (Object.keys(stored).length > 0) {
    useAssessmentStore.setState({ answers: stored });
  }
}

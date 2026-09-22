"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TCI_QUESTIONS } from "@/constants/questions";
import { useAssessmentStore } from "@/stores/useAssessmentStore";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/test/ProgressBar";
import { QuestionCard } from "@/components/test/QuestionCard";
import { NavigationButtons } from "@/components/test/NavigationButtons";

const AUTO_ADVANCE_DELAY_MS = 300;

export default function TestPage() {
  const router = useRouter();
  const answers = useAssessmentStore((state) => state.answers);
  const currentQuestionIndex = useAssessmentStore((state) => state.currentQuestionIndex);
  const setAnswer = useAssessmentStore((state) => state.setAnswer);
  const nextQuestion = useAssessmentStore((state) => state.nextQuestion);
  const prevQuestion = useAssessmentStore((state) => state.prevQuestion);

  const [autoAdvance, setAutoAdvance] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const totalQuestions = TCI_QUESTIONS.length;
  const currentQuestion = TCI_QUESTIONS[currentQuestionIndex];
  const isFirst = currentQuestionIndex === 0;
  const isLast = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = TCI_QUESTIONS.every((q) => answers[q.id] !== undefined);
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;
  const canGoNext = isLast ? allAnswered : hasAnsweredCurrent;

  const handleSelect = (value: number) => {
    setAnswer(currentQuestion.id, value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (autoAdvance && !isLast) {
      timeoutRef.current = setTimeout(() => {
        nextQuestion();
      }, AUTO_ADVANCE_DELAY_MS);
    }
  };

  const handleNext = () => {
    if (isLast) {
      if (!allAnswered) return;
      setIsSubmitting(true);
      router.push("/result");
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    nextQuestion();
  };

  const handlePrev = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    prevQuestion();
  };

  if (isSubmitting) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral-soft border-t-coral" />
          <p className="text-sm font-bold text-ink/70">
            응답을 분석해서 결과를 만들고 있어요.
            <br />
            잠시만 기다려주세요…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-4">
        <ProgressBar current={currentQuestionIndex + 1} total={totalQuestions} />

        <Card key={currentQuestion.id} className="space-y-2">
          <QuestionCard
            question={currentQuestion}
            selectedValue={answers[currentQuestion.id]}
            onSelect={handleSelect}
          />
        </Card>

        <NavigationButtons
          isFirst={isFirst}
          isLast={isLast}
          canGoNext={canGoNext}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <label className="flex items-center justify-center gap-2 pt-2 text-xs text-ink/40">
          <input
            type="checkbox"
            checked={autoAdvance}
            onChange={(e) => setAutoAdvance(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-line accent-coral"
          />
          응답 선택 시 자동으로 다음 문항 이동
        </label>
      </div>
    </main>
  );
}

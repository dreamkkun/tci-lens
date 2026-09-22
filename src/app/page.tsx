"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TCI_QUESTIONS } from "@/constants/questions";
import {
  hasStoredProgress,
  hydrateStoredAnswers,
  useAssessmentStore,
} from "@/stores/useAssessmentStore";

export default function IntroPage() {
  const router = useRouter();
  const resetAssessment = useAssessmentStore((state) => state.resetAssessment);
  const [showResumeModal, setShowResumeModal] = useState(false);

  const handleStart = () => {
    if (hasStoredProgress()) {
      setShowResumeModal(true);
      return;
    }
    router.push("/test");
  };

  const startFresh = () => {
    resetAssessment();
    setShowResumeModal(false);
    router.push("/test");
  };

  const resumePrevious = () => {
    hydrateStoredAnswers();
    setShowResumeModal(false);
    router.push("/test");
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl space-y-6">
        <Card className="space-y-6 text-center">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-coral-soft px-3 py-1 text-xs font-bold text-coral">
              <Sparkles className="h-3.5 w-3.5" /> TCI-Lens
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-ink">
              나의 기질·성격 프로파일 분석
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              표준 TCI 모델을 기반으로 7개 척도(기질 4축, 성격 3축)를 측정하고
              레이더 차트와 백분위 프로파일로 결과를 보여드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-2xl bg-cream p-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <p className="text-sm text-ink/70">
                총 <strong>{TCI_QUESTIONS.length}문항</strong>, 약 <strong>5~7분</strong> 소요
              </p>
            </div>
            <div className="flex items-start gap-2 rounded-2xl bg-cream p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
              <p className="text-sm text-ink/70">
                정답은 없습니다. 평소 자신의 모습에 가깝게 <strong>솔직하게</strong> 응답해주세요.
              </p>
            </div>
          </div>

          <Button className="w-full" onClick={handleStart}>
            검사 시작하기
          </Button>
        </Card>
      </div>

      {showResumeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-ink/40 px-4">
          <Card className="w-full max-w-sm space-y-4">
            <h2 className="text-lg font-black text-ink">이전 응답이 남아있어요</h2>
            <p className="text-sm text-ink/60">
              진행 중이던 검사 응답을 이어서 진행할까요, 아니면 새로 시작할까요?
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={startFresh}>
                새로 시작
              </Button>
              <Button className="flex-1" onClick={resumePrevious}>
                이어하기
              </Button>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

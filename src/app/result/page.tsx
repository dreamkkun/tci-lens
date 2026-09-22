"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, RotateCcw } from "lucide-react";
import { TCI_QUESTIONS } from "@/constants/questions";
import { useAssessmentStore } from "@/stores/useAssessmentStore";
import { deriveCharacter } from "@/utils/character";
import {
  buildCrisisExtras,
  buildScenarioSimulation,
  defaultScenarioIndex,
  pickSimulationTraits,
} from "@/utils/crisisSimulation";
import { decodeAnswers } from "@/utils/shareLink";
import { Button } from "@/components/ui/Button";
import { ResultHeader } from "@/components/result/ResultHeader";
import { CharacterHero } from "@/components/result/CharacterHero";
import { TemperamentMap } from "@/components/result/TemperamentMap";
import { CrisisSimulationSection } from "@/components/result/CrisisSimulationSection";
import { ChemistrySection } from "@/components/result/ChemistrySection";
import { PrescriptionSection } from "@/components/result/PrescriptionSection";
import { StickyActions } from "@/components/result/StickyActions";
import { ScoreBarChart } from "@/components/result/ScoreBarChart";
import { ScoreBreakdown } from "@/components/result/ScoreBreakdown";
import { OverallSummary } from "@/components/result/OverallSummary";

export default function ResultPage() {
  const router = useRouter();
  const answers = useAssessmentStore((state) => state.answers);
  const calculateResults = useAssessmentStore((state) => state.calculateResults);
  const resetAssessment = useAssessmentStore((state) => state.resetAssessment);

  const [ready, setReady] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [scenarioIndex, setScenarioIndex] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // 공유 링크(?a=...)로 들어오면 링크에 담긴 응답으로 결과를 복원한다. (localStorage에는 저장하지 않는다)
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("a");
    const shared = code ? decodeAnswers(code) : null;
    if (shared) {
      useAssessmentStore.setState({ answers: shared });
      setIsShared(true);
    }
    setReady(true);
  }, []);

  const allAnswered = TCI_QUESTIONS.every((q) => answers[q.id] !== undefined);

  useEffect(() => {
    if (ready && !allAnswered) router.replace("/test");
  }, [ready, allAnswered, router]);

  const results = useMemo(() => calculateResults(), [answers, calculateResults]);
  const character = useMemo(() => deriveCharacter(results), [results]);
  const activeScenario = scenarioIndex ?? defaultScenarioIndex(results);
  const simulation = useMemo(
    () => buildScenarioSimulation(results, activeScenario),
    [results, activeScenario]
  );
  const extras = useMemo(() => buildCrisisExtras(results), [results]);
  const simulatedNames = useMemo(
    () => pickSimulationTraits(results).map((trait) => results[trait].scaleName),
    [results]
  );

  if (!ready || !allAnswered) return null;

  const handleRetry = () => {
    resetAssessment();
    router.push("/test");
  };

  return (
    <main className="relative min-h-screen bg-cream pb-44">
      <div className="mx-auto w-full max-w-[430px] space-y-9 px-5 pt-4">
        <ResultHeader badge={isShared ? "공유된 결과" : "내 결과"} />
        <CharacterHero character={character} />
        <TemperamentMap results={results} simulatedNames={simulatedNames} />
        <CrisisSimulationSection
          simulation={simulation}
          scenarioIndex={activeScenario}
          onSelectScenario={setScenarioIndex}
        />
        <ChemistrySection
          loudestLabel={extras.loudestLabel}
          good={extras.chemistry.good}
          caution={extras.chemistry.caution}
        />
        <PrescriptionSection data={extras.prescription} />

        <details
          open={detailOpen}
          onToggle={(event) => setDetailOpen(event.currentTarget.open)}
          className="group rounded-3xl border border-line bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between p-5 text-[15px] font-black [&::-webkit-details-marker]:hidden">
            <span>
              척도별 상세 분석 더보기
              <span className="mt-0.5 block text-xs font-medium text-ink/50">
                가로 막대 · 척도별 카드 · 종합 평가
              </span>
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          {detailOpen && (
            <div className="space-y-4 px-4 pb-5">
              <ScoreBarChart results={results} />
              <ScoreBreakdown results={results} />
              <OverallSummary results={results} />
            </div>
          )}
        </details>

        <div className="flex justify-center">
          <Button variant="secondary" onClick={handleRetry}>
            <RotateCcw className="h-4 w-4" />
            다시 검사하기
          </Button>
        </div>
      </div>

      <StickyActions answers={answers} character={character} simulation={simulation} />
    </main>
  );
}

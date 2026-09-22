import { SCALE_ORDER } from "@/constants/scales";
import { ScaleResult, TCIScale } from "@/types/assessment";
import { TraitExplanation } from "@/components/result/TraitExplanation";

interface ScoreBreakdownProps {
  results: Record<TCIScale, ScaleResult>;
}

export function ScoreBreakdown({ results }: ScoreBreakdownProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-black">척도별 상세 결과</h3>
      <div className="space-y-3">
        {SCALE_ORDER.map((scale) => (
          <TraitExplanation key={scale} result={results[scale]} />
        ))}
      </div>
    </div>
  );
}

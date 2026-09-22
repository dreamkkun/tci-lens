import { Card } from "@/components/ui/Card";
import { buildOverallSummary } from "@/utils/scoring";
import { ScaleResult, TCIScale } from "@/types/assessment";

interface OverallSummaryProps {
  results: Record<TCIScale, ScaleResult>;
}

interface SectionProps {
  label: string;
  text: string;
}

function Section({ label, text }: SectionProps) {
  return (
    <div className="space-y-1.5">
      <span className="inline-block rounded-md bg-cream px-2 py-0.5 text-xs font-bold text-ink/60">
        {label}
      </span>
      <p className="text-sm leading-relaxed text-ink/70">{text}</p>
    </div>
  );
}

export function OverallSummary({ results }: OverallSummaryProps) {
  const summary = buildOverallSummary(results);

  return (
    <Card className="space-y-5">
      <div>
        <h3 className="text-lg font-black">종합 평가</h3>
        <p className="mt-1 text-xs text-ink/50">7개 척도의 응답 패턴을 바탕으로 한 분석입니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-coral-soft p-3 text-center">
          <p className="text-xs text-ink/60">기질 영역 평균</p>
          <p className="text-xl font-black text-coral">{summary.temperamentAvg}%</p>
        </div>
        <div className="rounded-2xl bg-ink/5 p-3 text-center">
          <p className="text-xs text-ink/60">성격 영역 평균</p>
          <p className="text-xl font-black text-ink">{summary.characterAvg}%</p>
        </div>
      </div>

      <div className="space-y-3">
        <Section label={`개요 · ${summary.characterName}`} text={summary.overviewParagraph} />
        <Section label="강점과 보완점" text={summary.strengthGrowthParagraph} />
        <Section label="종합 코멘트" text={summary.closingParagraph} />
      </div>
    </Card>
  );
}

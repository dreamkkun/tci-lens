import { Card } from "@/components/ui/Card";
import { ScaleResult, ScoreLevel } from "@/types/assessment";

const LEVEL_BADGE: Record<ScoreLevel, string> = {
  HIGH: "bg-coral-soft text-coral",
  MID: "bg-honey-soft text-honey-ink",
  LOW: "bg-ink/5 text-ink/50",
};

const LEVEL_LABEL: Record<ScoreLevel, string> = {
  HIGH: "High",
  MID: "Mid",
  LOW: "Low",
};

interface TraitExplanationProps {
  result: ScaleResult;
}

export function TraitExplanation({ result }: TraitExplanationProps) {
  const dimensionLabel = result.dimension === "TEMPERAMENT" ? "기질" : "성격";
  const barColor = result.dimension === "TEMPERAMENT" ? "bg-temperament" : "bg-character";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-medium text-ink/40">
            {dimensionLabel} · {result.scale}
          </span>
          <h4 className="text-base font-black">{result.scaleName}</h4>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${LEVEL_BADGE[result.level]}`}
        >
          {LEVEL_LABEL[result.level]}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
          <div
            className={`h-2 rounded-full ${barColor}`}
            style={{ width: `${result.percentage}%` }}
          />
        </div>
        <span className="w-12 text-right text-sm font-black">{result.percentage}%</span>
      </div>

      <p className="mt-3 text-sm font-bold">{result.summary}</p>
      <p className="mt-1 text-sm leading-relaxed text-ink/60">{result.description}</p>
    </Card>
  );
}

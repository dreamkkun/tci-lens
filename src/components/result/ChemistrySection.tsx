import { Frown, Smile, Star } from "lucide-react";
import { SectionTitle } from "@/components/result/SectionTitle";
import { ChemistryCard } from "@/utils/crisisSimulation";

const TONE = {
  good: {
    card: "border-mint-line bg-mint-soft",
    badge: "text-mint-ink",
    avatar: "bg-[#6EE7A8]",
    Icon: Smile,
  },
  caution: {
    card: "border-coral-line bg-coral-soft",
    badge: "text-coral",
    avatar: "bg-[#FF8A8A]",
    Icon: Frown,
  },
} as const;

function MatchCard({ card }: { card: ChemistryCard }) {
  const tone = TONE[card.tone];
  const Icon = tone.Icon;

  return (
    <article className={`rounded-3xl border-2 p-5 shadow-sm ${tone.card}`}>
      <div className="flex items-center gap-3.5">
        <span
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone.avatar}`}
        >
          <Icon className="h-8 w-8 text-ink" strokeWidth={2.2} />
        </span>
        <div>
          <p className={`text-[11px] font-bold ${tone.badge}`}>{card.badge}</p>
          <h3 className="text-xl font-black leading-tight tracking-tight">{card.title}</h3>
          <p className="mt-0.5 text-xs font-medium text-ink/60">{card.tag}</p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`h-4 w-4 ${n <= card.stars ? "fill-[#F5B301] text-[#F5B301]" : "text-ink/25"}`}
          />
        ))}
        <span className="ml-1.5 text-xs font-bold text-ink/60">{card.stars}/5</span>
      </div>

      {card.sections.map((section) => (
        <div key={section.heading} className="mt-4">
          <p className="text-sm font-black">{section.heading}</p>
          <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-ink/75">
            {section.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      ))}
    </article>
  );
}

interface ChemistrySectionProps {
  loudestLabel: string;
  good: ChemistryCard;
  caution: ChemistryCard;
}

export function ChemistrySection({ loudestLabel, good, caution }: ChemistrySectionProps) {
  return (
    <section className="space-y-3">
      <SectionTitle
        title="내 성향 맞춤 케미 매칭"
        subtitle={`${loudestLabel}가 가장 큰 목소리를 내는 성향 기준입니다.`}
      />
      <MatchCard card={good} />
      <MatchCard card={caution} />
    </section>
  );
}

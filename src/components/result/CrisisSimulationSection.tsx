"use client";

import { AlertTriangle, ShieldCheck, Users, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/result/SectionTitle";
import {
  SCENARIO_TAB_LABELS,
  SimBubble,
  SimulationData,
  TemperamentTrait,
} from "@/utils/crisisSimulation";

interface TraitStyle {
  icon: LucideIcon;
  avatar: string;
  bubble: string;
  label: string;
}

const TRAIT_STYLE: Record<TemperamentTrait, TraitStyle> = {
  NS: {
    icon: Zap,
    avatar: "bg-[#F97316] text-white",
    bubble: "bg-peach-soft border-peach-line",
    label: "text-[#C2570C]",
  },
  HA: {
    icon: AlertTriangle,
    avatar: "border-2 border-coral bg-white text-coral",
    bubble: "bg-coral-soft border-coral-line",
    label: "text-coral",
  },
  RD: {
    icon: Users,
    avatar: "border-2 border-honey-line bg-white text-[#B7791F]",
    bubble: "bg-honey-soft border-honey-line",
    label: "text-honey-ink",
  },
  PS: {
    icon: ShieldCheck,
    avatar: "border-2 border-[#93C5FD] bg-white text-[#2563EB]",
    bubble: "bg-[#E3F0FF] border-[#A9CDF5]",
    label: "text-[#1D5FA8]",
  },
};

function Bubble({ bubble }: { bubble: SimBubble }) {
  const style = TRAIT_STYLE[bubble.scale];
  const Icon = style.icon;
  const isRight = bubble.side === "right";

  return (
    <div className={`flex items-start gap-2.5 ${isRight ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.avatar}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <div className={`flex max-w-[78%] flex-col ${isRight ? "items-end" : "items-start"}`}>
        <p className={`text-[11px] font-bold ${style.label}`}>
          {bubble.label} · {bubble.db}dB
        </p>
        <p
          className={`mt-1 rounded-2xl border px-3.5 py-2.5 text-[14px] font-medium leading-relaxed ${
            style.bubble
          } ${isRight ? "rounded-tr-md" : "rounded-tl-md"}`}
        >
          {bubble.thought}
        </p>
      </div>
    </div>
  );
}

interface CrisisSimulationSectionProps {
  simulation: SimulationData;
  scenarioIndex: number;
  onSelectScenario: (index: number) => void;
}

export function CrisisSimulationSection({
  simulation,
  scenarioIndex,
  onSelectScenario,
}: CrisisSimulationSectionProps) {
  const { loudest } = simulation;

  return (
    <section className="space-y-3">
      <SectionTitle
        title="내 머릿속 위기 상황 시뮬레이션"
        subtitle="위기가 닥치면 기질들이 동시에 떠들기 시작합니다."
      />

      <div className="grid grid-cols-2 gap-2">
        {SCENARIO_TAB_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => onSelectScenario(index)}
            className={`rounded-full px-2 py-2.5 text-center text-[13px] font-bold transition-colors ${
              index === scenarioIndex
                ? "bg-ink text-white"
                : "border border-line bg-white text-ink hover:bg-cream"
            }`}
          >
            상황 {index + 1} · {label}
          </button>
        ))}
      </div>

      <Card className="p-4">
        <span className="inline-block rounded-full bg-honey-soft px-3 py-1 text-xs font-bold text-honey-ink">
          {simulation.title}
        </span>
        <p className="mt-3 text-[15px] font-bold leading-snug">{simulation.scene}</p>
        <div className="mt-5 space-y-4">
          {simulation.bubbles.map((bubble) => (
            <Bubble key={bubble.scale} bubble={bubble} />
          ))}
        </div>
      </Card>

      <div className="flex items-center gap-3 rounded-2xl border border-honey-line bg-honey-soft p-4">
        <svg viewBox="0 0 24 24" className="h-9 w-9 shrink-0" aria-hidden>
          <rect x="3" y="12" width="4.5" height="9" rx="1.2" fill="#E5484D" />
          <rect x="9.75" y="4" width="4.5" height="17" rx="1.2" fill="#E5484D" />
          <rect x="16.5" y="9" width="4.5" height="12" rx="1.2" fill="#E5484D" />
        </svg>
        <p className="text-[15px] font-black leading-snug">
          지금 당신의 뇌 속에서는{" "}
          <span className="text-coral">
            {loudest.label}가 {loudest.db}dB로
          </span>{" "}
          가장 크게 고함치는 중!
        </p>
      </div>

      <p className="px-1 text-sm leading-relaxed text-ink/70">“{loudest.verdict}”</p>
    </section>
  );
}
